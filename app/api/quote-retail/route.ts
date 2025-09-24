/**
 * QUOTE RETAIL API ROUTE
 * 
 * This is the FRONTEND API route that provides customer-facing quotes with margin calculations.
 * It handles:
 * - Calling the wholesale pricing API to get raw pricing data
 * - Applying margin calculations (10% overhead + 45% margin)
 * - Error handling and user-friendly error messages
 * - Returning final sale prices to the frontend
 * 
 * This route is called by the frontend components and returns processed pricing
 * with margins applied. Wholesale prices are never exposed to the client.
 */

import { type NextRequest, NextResponse } from "next/server"

interface PriceItem {
  name: string
  priceType: "nonRecurring" | "recurring"
  recurringChargePeriod?: "month" | "year"
  price: {
    taxRate: number
    dutyFreeAmount: {
      unit: "GBP"
      value: number
    }
    taxIncludedAmount: {
      unit: "GBP"
      value: number
    }
  }
}

interface SecurityPricing {
  monthly: number
}

interface ExternalQuoteResponse {
  btPricing: {
    etherway: PriceItem[]
    etherflow: PriceItem[]
    etherflowCircuit2?: PriceItem[]
  }
  securityPricing?: {
    listPrice: SecurityPricing
    threatPrevention: SecurityPricing
    casb: SecurityPricing
    dlp: SecurityPricing
    rbi: SecurityPricing
    managedServices: SecurityPricing
  }
}

interface ProcessedPriceItem {
  name: string
  priceType: "nonRecurring" | "recurring"
  recurringChargePeriod?: "month" | "year"
  price: {
    taxRate: number
    dutyFreeAmount: {
      unit: "GBP"
      value: number
    }
    taxIncludedAmount: {
      unit: "GBP"
      value: number
    }
  }
  pricingBreakdown: {
    wholesale: number
    overhead: number
    finalSalePrice: number
  }
}

interface ProcessedQuoteResponse {
  btPricing: {
    etherway: ProcessedPriceItem[]
    etherflow: ProcessedPriceItem[]
    etherflowCircuit2?: ProcessedPriceItem[]
  }
  securityPricing?: {
    listPrice: SecurityPricing
    threatPrevention: SecurityPricing
    casb: SecurityPricing
    dlp: SecurityPricing
    rbi: SecurityPricing
    managedServices: SecurityPricing
  }
}

function applyMarginCalculations(wholesalePrice: number) {
  // Add 10% overhead
  const overheadAmount = wholesalePrice * 1.1
  // Apply 45% margin: final price = overhead / (1 - 0.45)
  const finalSalePrice = overheadAmount / 0.55

  return {
    wholesale: wholesalePrice,
    overhead: overheadAmount,
    finalSalePrice: finalSalePrice,
  }
}

function processPriceItems(items: PriceItem[]): ProcessedPriceItem[] {
  return items.map((item) => {
    const wholesalePrice = item.price.taxIncludedAmount.value
    const pricingBreakdown = applyMarginCalculations(wholesalePrice)

    console.log(
      `[v0] Processing ${item.name}: Wholesale £${wholesalePrice} -> Final £${pricingBreakdown.finalSalePrice}`,
    )

    return {
      ...item,
      // Update the displayed price to be the final sale price
      price: {
        ...item.price,
        taxIncludedAmount: {
          ...item.price.taxIncludedAmount,
          value: pricingBreakdown.finalSalePrice,
        },
        dutyFreeAmount: {
          ...item.price.dutyFreeAmount,
          value: pricingBreakdown.finalSalePrice / (1 + item.price.taxRate),
        },
      },
      pricingBreakdown,
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json()

    console.log("[v0] Server-side quote processing started")

    // Call the original backend API on port 3001
    const response = await fetch("http://localhost:3001/api/quote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.log("[v0] External API error:", errorText)

      let userFriendlyMessage =
        "We're having trouble generating your quote right now. Please try again in a few moments."

      try {
        const errorData = JSON.parse(errorText)
        if (errorData.message) {
          if (errorData.message.includes("pricing information")) {
            userFriendlyMessage =
              "We couldn't find pricing for your selected configuration. Please try different options or contact support."
          } else if (errorData.message.includes("address") || errorData.message.includes("location")) {
            userFriendlyMessage =
              "There's an issue with the selected address. Please try selecting a different address."
          } else if (errorData.message.includes("configuration") || errorData.message.includes("bandwidth")) {
            userFriendlyMessage =
              "There's an issue with your network configuration. Please review your selections and try again."
          }
        }
      } catch {
        // Use default message if error parsing fails
      }

      return NextResponse.json({ error: userFriendlyMessage }, { status: response.status })
    }

    const externalQuote: ExternalQuoteResponse[] = await response.json()
    const quoteData = externalQuote[0] // API returns array, take first item

    console.log("[v0] Received wholesale pricing from external API")

    const processedQuote: ProcessedQuoteResponse = {
      btPricing: {
        etherway: processPriceItems(quoteData.btPricing.etherway),
        etherflow: processPriceItems(quoteData.btPricing.etherflow),
        ...(quoteData.btPricing.etherflowCircuit2 && {
          etherflowCircuit2: processPriceItems(quoteData.btPricing.etherflowCircuit2),
        }),
      },
      ...(quoteData.securityPricing && {
        securityPricing: quoteData.securityPricing,
      }),
    }

    console.log("[v0] Applied margin calculations server-side")

    return NextResponse.json([processedQuote])
  } catch (error) {
    console.error("[v0] Server-side quote processing error:", error)

    return NextResponse.json({ error: "Internal server error while processing quote" }, { status: 500 })
  }
}

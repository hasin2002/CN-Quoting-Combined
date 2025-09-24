"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Download, Mail, Edit, ArrowLeft, Copy } from "lucide-react"
import type { QuoteResponse, PriceItem, FormStep } from "@/types/quote"
import { toast } from "@/hooks/use-toast"

interface QuoteResultsProps {
  quoteResponse: QuoteResponse
  onStartOver: () => void
  onEditQuote?: () => void
  onNavigateToStep?: (step: FormStep) => void
  quoteId?: string | null
}

export function QuoteResults({
  quoteResponse,
  onStartOver,
  onEditQuote,
  onNavigateToStep,
  quoteId,
}: QuoteResultsProps) {
  const [selectedTerm, setSelectedTerm] = useState("1")

  const responseData = Array.isArray(quoteResponse) ? quoteResponse[0] : quoteResponse

  const copyQuoteId = async () => {
    if (quoteId) {
      try {
        await navigator.clipboard.writeText(quoteId)
        toast({
          title: "Quote ID Copied",
          description: "Quote ID has been copied to your clipboard",
        })
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Copy Failed",
          description: "Unable to copy quote ID to clipboard",
        })
      }
    }
  }

  if (!responseData || !responseData.btPricing) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-bold text-foreground">Loading Quote...</h1>
          <p className="text-muted-foreground">Please wait while we prepare your quote</p>
        </div>
      </div>
    )
  }

  // Extract contract terms from pricing data
  const getAvailableTerms = () => {
    const terms = new Set<string>()
    if (responseData.btPricing.etherway) {
      responseData.btPricing.etherway.forEach((item: any) => {
        if (item.name.includes("Year")) {
          const match = item.name.match(/(\d+)\s+Year/)
          if (match) terms.add(match[1])
        }
      })
    }
    return Array.from(terms).sort((a, b) => Number.parseInt(a) - Number.parseInt(b))
  }

  const availableTerms = getAvailableTerms()

  const calculatePricing = (items: PriceItem[] | undefined, termYears: string) => {
    if (!items || !Array.isArray(items)) {
      return {
        nonRecurring: 0,
        monthlyRecurring: 0,
        yearlyRecurring: 0,
      }
    }

    console.log("[v0] calculatePricing items:", items)
    console.log("[v0] termYears:", termYears)

    const connection = items.find(
      (item) =>
        item.priceType === "nonRecurring" &&
        (item.name.includes(`${termYears} Year connection`) ||
          (termYears === "1" && item.name.includes("1 Year connection"))),
    )
    const rental = items.find(
      (item) =>
        item.priceType === "recurring" &&
        (item.name.includes(`${termYears} Year rental`) || (termYears === "1" && item.name.includes("1 Year rental"))),
    )

    console.log("[v0] connection item:", connection)
    console.log("[v0] rental item:", rental)

    const finalConnectionPrice = connection?.price?.taxIncludedAmount?.value || 0
    const finalRentalPrice = rental?.price?.taxIncludedAmount?.value || 0

    console.log("[v0] Final connection price:", finalConnectionPrice)
    console.log("[v0] Final rental price:", finalRentalPrice)
    console.log("[v0] rental recurringChargePeriod:", rental?.recurringChargePeriod)

    return {
      nonRecurring: finalConnectionPrice,
      monthlyRecurring: rental
        ? rental.recurringChargePeriod === "year"
          ? finalRentalPrice / 12 // Always divide by 12 since API returns yearly amounts
          : finalRentalPrice
        : 0,
      yearlyRecurring: finalRentalPrice,
    }
  }

  const etherwayPricing = calculatePricing(responseData.btPricing.etherway, selectedTerm)
  const etherflowPricing = calculatePricing(responseData.btPricing.etherflow, selectedTerm)
  const etherflowCircuit2Pricing = responseData.btPricing.etherflowCircuit2
    ? calculatePricing(responseData.btPricing.etherflowCircuit2, selectedTerm)
    : null

  const securityPricing = responseData.securityPricing

  // Calculate totals
  const totalNonRecurring =
    etherwayPricing.nonRecurring + etherflowPricing.nonRecurring + (etherflowCircuit2Pricing?.nonRecurring || 0)

  const getSecurityMonthlyPrice = (securityService: any) => {
    if (!securityService?.monthly) return 0
    console.log("[v0] securityService:", securityService)
    return securityService.monthly || 0
  }

  const totalMonthlyRecurring =
    etherwayPricing.monthlyRecurring +
    etherflowPricing.monthlyRecurring +
    (etherflowCircuit2Pricing?.monthlyRecurring || 0) +
    (securityPricing
      ? getSecurityMonthlyPrice(securityPricing.listPrice) +
        getSecurityMonthlyPrice(securityPricing.threatPrevention) +
        getSecurityMonthlyPrice(securityPricing.casb) +
        getSecurityMonthlyPrice(securityPricing.dlp) +
        getSecurityMonthlyPrice(securityPricing.rbi) +
        getSecurityMonthlyPrice(securityPricing.managedServices)
      : 0)

  const contractTotal = totalNonRecurring + totalMonthlyRecurring * Number.parseInt(selectedTerm) * 12

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 2,
    }).format(amount)
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl font-bold text-foreground">Your Quote is Ready</h1>
        </div>
        <p className="text-muted-foreground">Here's your personalized network services quote with pricing breakdown</p>

        {quoteId && (
          <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-muted/50 rounded-lg border">
            <span className="text-sm text-muted-foreground font-medium">Quote ID:</span>
            <code className="text-sm font-mono font-semibold bg-background text-foreground px-2 py-1 rounded border">
              {quoteId}
            </code>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyQuoteId}
              className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground hover:bg-muted"
              title="Copy Quote ID"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        )}

        {onNavigateToStep && (
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onNavigateToStep("address")} className="text-xs">
              <ArrowLeft className="h-3 w-3 mr-1" />
              Change Address
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigateToStep("service-type")} className="text-xs">
              <ArrowLeft className="h-3 w-3 mr-1" />
              Change Service
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigateToStep("network-config")} className="text-xs">
              <ArrowLeft className="h-3 w-3 mr-1" />
              Change Config
            </Button>
            <Button variant="outline" size="sm" onClick={() => onNavigateToStep("security")} className="text-xs">
              <ArrowLeft className="h-3 w-3 mr-1" />
              Change Security
            </Button>
          </div>
        )}
      </div>

      {/* Contract Term Selector */}
      {availableTerms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Contract Term</CardTitle>
            <CardDescription>Select your preferred contract length to see pricing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex rounded-lg border border-input bg-background p-1 w-full">
              {["1", "3", "5"].map((term) => (
                <button
                  key={term}
                  onClick={() => setSelectedTerm(term)}
                  className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all ${
                    selectedTerm === term
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  {term} Year{Number.parseInt(term) > 1 ? "s" : ""}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className={`grid gap-6 ${securityPricing ? "lg:grid-cols-2" : "lg:grid-cols-1"}`}>
        {/* Network Services Pricing */}
        <Card>
          <CardHeader>
            <CardTitle>Network Services</CardTitle>
            <CardDescription>Etherway and Etherflow pricing breakdown</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Etherway */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Etherway</span>
                <Badge variant="secondary">Primary Circuit</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Connection:</span>
                  <p className="font-medium">{formatCurrency(etherwayPricing.nonRecurring)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly:</span>
                  <p className="font-medium">{formatCurrency(etherwayPricing.monthlyRecurring)}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Etherflow */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Etherflow</span>
                <Badge variant="secondary">Data Service</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Connection:</span>
                  <p className="font-medium">{formatCurrency(etherflowPricing.nonRecurring)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Monthly:</span>
                  <p className="font-medium">{formatCurrency(etherflowPricing.monthlyRecurring)}</p>
                </div>
              </div>
            </div>

            {/* Etherflow Circuit 2 (if dual service) */}
            {etherflowCircuit2Pricing && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Etherflow Circuit 2</span>
                    <Badge variant="secondary">Secondary Circuit</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Connection:</span>
                      <p className="font-medium">{formatCurrency(etherflowCircuit2Pricing.nonRecurring)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Monthly:</span>
                      <p className="font-medium">{formatCurrency(etherflowCircuit2Pricing.monthlyRecurring)}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Security Services Pricing */}
        {securityPricing && (
          <Card>
            <CardHeader>
              <CardTitle>Security Services</CardTitle>
              <CardDescription>Additional security features pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {securityPricing &&
                Object.entries(securityPricing).map(([key, pricing]: [string, any]) => {
                  if (!pricing?.monthly) {
                    return null
                  }

                  const monthlyPrice = getSecurityMonthlyPrice(pricing)

                  return (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium capitalize">
                          {key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                        </span>
                        <Badge variant="outline">Security</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Monthly:</span>
                          <p className="font-medium">{formatCurrency(monthlyPrice)}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Contract Total:</span>
                          <p className="font-medium">
                            {formatCurrency(monthlyPrice * Number.parseInt(selectedTerm) * 12)}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Total Pricing Summary */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-xl">Pricing Summary</CardTitle>
          <CardDescription>Total costs for your {selectedTerm}-year contract</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-1 px-2">
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-1">One-time Setup</p>
              <p className="text-xl md:text-2xl font-bold text-primary">{formatCurrency(totalNonRecurring)}</p>
            </div>
            <div className="text-center hidden md:block" style={{ minWidth: "20px" }}>
              <div className="text-lg font-bold text-muted-foreground">+</div>
            </div>
            {totalMonthlyRecurring > 0 && (
              <div className="text-center flex-1">
                <p className="text-sm text-muted-foreground mb-1">Monthly Recurring</p>
                <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">
                  {formatCurrency(totalMonthlyRecurring)}
                </p>
              </div>
            )}
            <div className="text-center hidden md:block" style={{ minWidth: "20px" }}>
              <div className="text-lg font-bold text-muted-foreground">=</div>
            </div>
            <div className="text-center flex-1">
              <p className="text-sm text-muted-foreground mb-1">Total Contract Value</p>
              <p className="text-xl md:text-2xl lg:text-3xl font-bold text-primary">{formatCurrency(contractTotal)}</p>
              <div className="text-xs text-muted-foreground mt-2 space-y-1 max-w-full">
                <p className="font-medium">Contract Breakdown:</p>
                <div className="space-y-0.5">
                  {totalNonRecurring > 0 && <p className="truncate">{formatCurrency(totalNonRecurring)} setup</p>}
                  {totalMonthlyRecurring > 0 && (
                    <p className="truncate">
                      {formatCurrency(totalMonthlyRecurring)}/mo × {Number.parseInt(selectedTerm) * 12}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button size="lg" className="px-8">
          <Mail className="h-4 w-4 mr-2" />
          Email Quote
        </Button>
        <Button variant="outline" size="lg" className="px-8 bg-transparent">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
        {onEditQuote && (
          <Button variant="outline" size="lg" onClick={onEditQuote}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Quote
          </Button>
        )}
        <Button variant="outline" size="lg" onClick={onStartOver}>
          Start New Quote
        </Button>
      </div>
    </div>
  )
}

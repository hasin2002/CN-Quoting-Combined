import { TBtQuoteResponse } from "src/app/lib/schemas/quoting/bt-quote-api-schema";
import { QuoteItemProduct } from "src/app/lib/types/quoting-types";
import { TProductPrice } from "src/app/lib/schemas/quoting/bt-quote-api-schema";
import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import { TQuoteResponse } from "src/app/lib/schemas/quoting/quote-response-schema";

function hasQuoteItem(product: any): product is QuoteItemProduct {
  return (
    product &&
    Array.isArray(product.quoteItem) &&
    product.quoteItem.length > 0 &&
    "action" in product.quoteItem[0]
  );
}

function filterOutOptionB(pricingArray: TProductPrice[] | undefined): TProductPrice[] {
  if (!pricingArray) return [];
  return pricingArray.filter(item => !item.name?.includes("Option B"));
}

export const extractQuotePricingInfo = (
  quoteResponses: TBtQuoteResponse[]
): TQuoteResponse => {
  const firstQuote = quoteResponses[0];
  const etherwayPricing =
    firstQuote.quoteItem?.[0]?.product?.product?.[0]?.productPrice;
  const etherflowPricing =
    firstQuote.quoteItem?.[0]?.product?.product?.[1]?.productPrice;

  if (!etherwayPricing?.length && !etherflowPricing?.length) {
    throw new CustomError({
      message: "No pricing information found in quote response",
      source: "extractQuotePricingInfo",
    });
  }

  const pricingInfo: {
    etherway: TProductPrice[];
    etherflow: TProductPrice[];
    etherflowCircuit2?: TProductPrice[];
  } = {
    etherway: [],
    etherflow: [],
  };

  quoteResponses.map((quote, i) => {
    // Initial validation for scenario 2
    if (
      i === 0 &&
      !quote.quoteItem?.[0]?.product.product[0].productPrice &&
      !quote.quoteItem?.[0]?.product.product[1].productPrice
    ) {
      throw new CustomError({
        message: "missing either etherway or etherflow pricing info",
        source: "extractQuotePricingInfo",
      });
    }

    // Scenario 2 - second quote (etherflowCircuit2)
    if (hasQuoteItem(quote.quoteItem?.[0]?.product) && i === 1) {
      const etherflowPricingCircuit2Original =
        quote.quoteItem?.[0]?.product.quoteItem[0].product[1].productPrice;
      pricingInfo.etherflowCircuit2 = filterOutOptionB(etherflowPricingCircuit2Original);
    }
    // Scenario 3 - single quote
    else if (hasQuoteItem(quote.quoteItem?.[0]?.product) && i === 0) {
      const etherwayOriginal =
        quote.quoteItem?.[0]?.product.quoteItem[0].product[0].productPrice;
      const etherflowOriginal =
        quote.quoteItem?.[0]?.product.quoteItem[0].product[1].productPrice;

      pricingInfo.etherway = filterOutOptionB(etherwayOriginal);
      pricingInfo.etherflow = filterOutOptionB(etherflowOriginal);
    }
    // Scenario 1 and 2.1
    else if (
      i === 0 &&
      quote.quoteItem?.[0]?.product.product[0].productPrice &&
      quote.quoteItem?.[0]?.product.product[1].productPrice
    ) {
      const ewOriginal = quote.quoteItem[0].product.product[0].productPrice;
      const efOriginal = quote.quoteItem[0].product.product[1].productPrice;

      pricingInfo.etherway = filterOutOptionB(ewOriginal);
      pricingInfo.etherflow = filterOutOptionB(efOriginal);
    }
  });

  return [{ btPricing: pricingInfo }];
};

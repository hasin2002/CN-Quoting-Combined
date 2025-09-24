/**
 * QUOTE TYPES
 * 
 * This file consolidates all quote-related types from the backend schemas.
 * The backend schemas in src/app/lib/schemas/ are the source of truth.
 * This file re-exports and extends them for frontend use.
 */

// Re-export backend schemas as the source of truth
export {
  QuoteRequestBodySchema,
  BtQuoteParamsSchema,
  SecurityQuoteParamsSchema,
  QuoteLocationIdentifierSchema,
  BandwidthSchema,
  CircuitInterfaceSchema,
  IpAddressBlockSchema,
  IpBackboneSchema,
  DualInternetConfigSchema,
  type TBandwidth,
} from "../src/app/lib/schemas/quoting/quote-request-body-schema";

export {
  QuoteResponse as QuoteResponseSchema,
  type TQuoteResponse,
  type TSecurityPricingEntryResponse,
  type TSecurityPricingResponse,
} from "../src/app/lib/schemas/quoting/quote-response-schema";

export {
  type TQuoteResponse as BackendQuoteResponse,
} from "../src/app/lib/schemas/quoting/quote-response-schema";

// Frontend-specific types that extend backend schemas
export interface Address {
  id?: string
  postcode: string
  fullAddress: string
}

export interface FormData {
  // Address data
  selectedAddress: Address | null

  // Service configuration
  serviceType: "single" | "dual" | ""
  preferredIpBackbone: "BT" | "Colt" | "Lumen" | "PCCW" | "Cogent" | "Don't mind" | ""
  etherwayBandwidth: "1 Gbit/s" | "10 Gbit/s" | ""
  circuitInterface: "1000BASE-T" | "1000BASE-LX" | "1000BASE-SX" | "10GBASE-LR" | "10GBASE-SR" | ""
  etherflowBandwidth: string
  dualInternetConfig: "Active / Active" | "Active / Passive" | ""
  circuitTwoBandwidth: string
  numberOfIpAddresses: string

  // Security options
  includeSecurityOptions: boolean | undefined
  secureIpDelivery: boolean
  ztnaRequired: boolean
  noOfZtnaUsers: number
  threatPreventionRequired: boolean
  casbRequired: boolean
  dlpRequired: boolean
  rbiRequired: boolean

  firstName?: string
  lastName?: string
  email?: string
  companyName?: string
  mobile?: string
}

// Frontend-specific quote response interface (matches backend but with frontend naming)
export interface QuoteResponse {
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

export interface PriceItem {
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
  // Frontend-specific: pricing breakdown for margin calculations
  pricingBreakdown?: {
    wholesale: number
    overhead: number
    finalSalePrice: number
  }
}

export interface SecurityPricing {
  monthly: number
}

export interface ContractPricing {
  monthly: number
  contractTotal: number
}

export type FormStep = "address" | "service-type" | "network-config" | "security" | "user-info" | "quote"
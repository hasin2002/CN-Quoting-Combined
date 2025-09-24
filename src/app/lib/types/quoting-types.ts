import { z } from "zod";
import {
  EtherflowConnectedService,
  EtherflowInternetService,
  EtherwayService,
  NadKeySite,
  PostcodeSite,
} from "src/app/lib/schemas/quoting/bt-quote-api-schema";
import {
  BandwidthSchema,
  BtQuoteParamsSchema,
  CircuitInterfaceSchema,
  IpAddressBlockSchema,
  QuoteLocationIdentifierSchema,
  QuoteRequestBodySchema,
  SecurityQuoteParamsSchema,
  DualInternetConfigSchema,
  IpBackboneSchema,
  DiverseIpBackboneSchema,
} from "../schemas/quoting/quote-request-body-schema";


export type TBandwidth = z.infer<typeof BandwidthSchema>;

export type TDualInternetConfig = z.infer<typeof DualInternetConfigSchema>;

export type TPreferredIpBackbone = z.infer<typeof IpBackboneSchema>;

export type TDiverseIpBackbone = z.infer<typeof DiverseIpBackboneSchema>;

export type TQuoteRequestBody = z.infer<typeof QuoteRequestBodySchema>;

export type TIpAddressBlock = z.infer<typeof IpAddressBlockSchema>;

export type TResilience = "Standard" | "Diverse Plus (RAO2)";

export type TEtherwayInfo = z.infer<typeof EtherwayService>;

export type TEtherflowInfoInternetService = z.infer<
  typeof EtherflowInternetService
>;

export type TEtherflowInfoConnectedService = z.infer<
  typeof EtherflowConnectedService
>;

export type TSubProductInfoWholesaleEthernetInternet = [
  TEtherwayInfo,
  TEtherflowInfoInternetService,
];

export type TSubProductInfoWholesaleEthernetEline = [
  TEtherwayInfo,
  TEtherflowInfoConnectedService,
];

export type TQuoteAddressInfo =
  | z.infer<typeof PostcodeSite>
  | z.infer<typeof NadKeySite>;

export type TInterfaceBandwidth = "1 Gbit/s" | "10 Gbit/s";

export type TCircuitInterface = z.infer<typeof CircuitInterfaceSchema>;

export type QuoteItemProduct = {
  quoteItem: Array<{
    action: "add";
    "@baseType": "QuoteItem";
    "@type": "BtwQuoteItem";
    // Add other properties as needed
    [key: string]: any;
  }>;
};

export type TQuoteLocationIdentifier = z.infer<
  typeof QuoteLocationIdentifierSchema
>;

export type TBtQuoteParams = z.infer<typeof BtQuoteParamsSchema>;

export type TSecurityQuoteParams = z.infer<typeof SecurityQuoteParamsSchema>;



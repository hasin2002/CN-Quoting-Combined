import { z } from "zod";

export const interfaceOptions = [
  "1000BASE-T",
  "1000BASE-LX",
  "1000BASE-SX",
  "10GBASE-LR",
  "10GBASE-SR",
] as const;

export const CircuitInterfaceSchema = z.enum(interfaceOptions);

export const bandwidthOptions = [
  "10 Mbit/s",
  "20 Mbit/s",
  "30 Mbit/s",
  "40 Mbit/s",
  "50 Mbit/s",
  "60 Mbit/s",
  "70 Mbit/s",
  "80 Mbit/s",
  "90 Mbit/s",
  "100 Mbit/s",
  "200 Mbit/s",
  "300 Mbit/s",
  "400 Mbit/s",
  "500 Mbit/s",
  "1 Gbit/s",
  "1.5 Gbit/s",
  "2 Gbit/s",
  "2.5 Gbit/s",
  "3 Gbit/s",
  "3.5 Gbit/s",
  "4 Gbit/s",
  "4.5 Gbit/s",
  "5 Gbit/s",
  "5.5 Gbit/s",
  "6 Gbit/s",
  "6.5 Gbit/s",
  "7 Gbit/s",
  "7.5 Gbit/s",
  "8 Gbit/s",
  "8.5 Gbit/s",
  "9 Gbit/s",
  "9.5 Gbit/s",
  "10 Gbit/s",
] as const;

export const BandwidthSchema = z.enum(bandwidthOptions);

export const ipAddressBlockOptions = [
  "Block /29 (8 LAN IP Addresses)",
  "Block /28 (16 LAN IP Addresses)",
  "Block /27 (32 LAN IP Addresses)",
  "Block /26 (64 LAN IP Addresses)",
  "Block /25 (128 LAN IP Addresses)",
  "Block /24 (256 LAN IP Addresses)",
  "Block /23 (512 LAN IP Addresses)",
  "Block /22 (1024 LAN IP Addresses)",
  "Block /21 (2048 LAN IP Addresses)",
] as const;

export const IpAddressBlockSchema = z.enum(ipAddressBlockOptions);

export const ipBackBoneOptions = [
  "BT",
  "Colt",
  "Lumen",
  "PCCW",
  "Cogent",
  "Any",
] as const;

export const IpBackboneSchema = z.enum(ipBackBoneOptions);

export const diverseIpBackBoneOptions = [
  "Colt",
  "Lumen",
  "PCCW",
  "Cogent +++",
] as const;

export const DiverseIpBackboneSchema = z.enum(diverseIpBackBoneOptions);

export const dualInternetConfigOptions = [
  "Active / Active",
  "Active / Passive",
] as const;

export const DualInternetConfigSchema = z.enum(dualInternetConfigOptions);

// either id or postcode is used to determine where to deliver the connectivity solution being quoted
export const QuoteLocationIdentifierSchema = z.object({
  id: z.string().optional(),
  postcode: z.string(),
});

export const BtQuoteParamsSchema = z.object({
  serviceType: z.enum(["single", "dual"]),
  circuitInterface: CircuitInterfaceSchema,
  circuitBandwidth: BandwidthSchema,
  circuitTwoBandwidth: BandwidthSchema.optional(),
  numberOfIpAddresses: IpAddressBlockSchema.optional(),
  preferredIpBackbone: IpBackboneSchema.optional(),
  dualInternetConfig: DualInternetConfigSchema.optional(),
  preferredDivereseIpBackbone: DiverseIpBackboneSchema.optional(),
});

export const SecurityQuoteParamsSchema = z
  .object({
    secureIpDelivery: z.boolean().optional(),
    ztnaRequired: z.boolean().optional(),
    noOfZtnaUsers: z.number().optional(),
    threatPreventionRequired: z.boolean().optional(),
    casbRequired: z.boolean().optional(),
    dlpRequired: z.boolean().optional(),
    rbiRequired: z.boolean().optional(),
  })
  .optional();

export const QuoteRequestBodySchema = z.object({
  locationIdentifier: QuoteLocationIdentifierSchema,
  btQuoteParams: BtQuoteParamsSchema,
  securityQuoteParams: SecurityQuoteParamsSchema,
});

export type TBandwidth = z.infer<typeof BandwidthSchema>;

import { makeApi, Zodios, type ZodiosOptions } from "@zodios/core";
import { z } from "zod";

const Product = z
  .object({
    "@baseType": z.literal("Product").optional(),
    "@type": z.string(),
    productSpecification: z.object({ id: z.string() }).passthrough(),
  })
  .passthrough();
const Site = z
  .object({
    "@baseType": z.literal("Place").optional(),
    "@type": z.string(),
    role: z.literal("QuoteSiteLocation").optional(),
    informational: z.string().max(1000).optional(),
    warnings: z.string().max(1000).optional(),
    errors: z.string().max(1000).optional(),
  })
  .passthrough();
export const PostcodeSite = Site.and(
  z
    .object({
      "@type": z.literal("PostcodeSite").optional(),
      postcode: z
        .string()
        .regex(
          /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) {0,1}[0-9][A-Za-z]{2})/
        ),
    })
    .passthrough()
);
export const NadKeySite = Site.and(
  z
    .object({
      "@type": z.literal("NadKeySite").optional(),
      nadKey: z.string(),
      postcode: z
        .string()
        .regex(
          /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])))) {0,1}[0-9][A-Za-z]{2})/
        )
        .optional(),
    })
    .passthrough()
);
const UPRNSite = Site.and(
  z
    .object({ "@type": z.literal("UPRNSite").optional(), uprn: z.string() })
    .passthrough()
);
const DataCentreSite = Site.and(
  z
    .object({
      "@type": z.literal("DataCentreSite").optional(),
      dataCentreCode: z.string(),
    })
    .passthrough()
);
const ExchangeConnectSite = Site.and(
  z
    .object({
      "@type": z.literal("ExchangeConnectSite").optional(),
      exchangeConnectCode: z.string(),
    })
    .passthrough()
);
const AccessLineIdSite = Site.and(
  z
    .object({
      "@type": z.literal("AccessLineIdSite").optional(),
      accessLineId: z.string(),
    })
    .passthrough()
);
const DirectoryNumberSite = Site.and(
  z
    .object({
      "@type": z.literal("DirectoryNumberSite").optional(),
      directoryNumber: z.string(),
    })
    .passthrough()
);
const CoordinateSite = Site.and(
  z
    .object({
      "@type": z.literal("CoordinateSite").optional(),
      easting: z.number().int(),
      northing: z.number().int(),
      type: z.enum(["BritishNationalGrid", "IrishGrid"]),
    })
    .passthrough()
);
const Money = z
  .object({ unit: z.literal("GBP"), value: z.number() })
  .passthrough();
const Price = z
  .object({
    taxRate: z.number(),
    dutyFreeAmount: Money,
    taxIncludedAmount: Money,
  })
  .passthrough();
export const ProductPrice = z
  .object({
    name: z.string().max(50),
    priceType: z.enum(["nonRecurring", "recurring"]),
    recurringChargePeriod: z.enum(["month", "year"]),
    price: Price,
  })
  .partial()
  .passthrough();
const Service = z
  .object({
    "@baseType": z.literal("Product").optional(),
    "@type": z.string(),
    productSpecification: z.object({ id: z.string() }).passthrough(),
    productPrice: z.array(ProductPrice).optional(),
    informational: z.string().max(1000).optional(),
    warnings: z.string().max(1000).optional(),
    errors: z.string().max(1000).optional(),
  })
  .passthrough();
const ServingExchange = z
  .object({ code: z.string(), name: z.string() })
  .passthrough();
const Distance = z
  .object({ unit: z.enum(["Metre", "Kilometre"]), value: z.number() })
  .partial()
  .passthrough();
const EthernetSwitch = z
  .object({
    code: z.string(),
    name: z.string(),
    exchangeDistance: Distance,
    siteDistance: Distance,
  })
  .passthrough();
const EtherwayInformation = z
  .object({
    accessProvider: z.enum(["Openreach", "KCOM"]),
    openreachOnNet: z.enum(["Yes", "No"]).optional(),
    indicativeECCs: z
      .object({
        circuitDeliveryCategory: z.string(),
        tariff: z.string(),
        indicativeExtraECCs: z.string(),
        fibrePresent: z.string(),
        tNodeCapacity: z.string(),
      })
      .partial()
      .passthrough()
      .optional(),
    servingExchange: ServingExchange,
    ethernetSwitch: z.array(EthernetSwitch),
  })
  .passthrough();
const Cpe = z
  .object({
    "@baseType": z.literal("Product").optional(),
    "@type": z.string(),
    productSpecification: z.object({ id: z.string() }).passthrough(),
    productPrice: z.array(ProductPrice).optional(),
  })
  .passthrough();
const EtherwayRouterCpe = Cpe.and(
  z
    .object({
      "@type": z.literal("EtherwayRouterCpe").optional(),
      productSpecification: z
        .object({ id: z.literal("EtherwayRouterCpe") })
        .partial()
        .passthrough()
        .optional(),
      bundle: z.enum([
        "Router",
        "Router, Maintenance",
        "Router, Maintenance, Configuration",
        "Router, Maintenance, Configuration, Installation",
      ]),
      bandwidth: z.enum([
        "10 Mbit/s",
        "50 Mbit/s (upgrade available to 100 Mbit/s)",
        "100 Mbit/s",
        "1 Gbit/s",
        "1 Gbit/s (upgrade available to 2 Gbit/s)",
        "2 Gbit/s",
      ]),
    })
    .passthrough()
);
const EtherwayFirewallCpe = Cpe.and(
  z
    .object({
      "@type": z.literal("EtherwayFirewallCpe").optional(),
      productSpecification: z
        .object({ id: z.literal("EtherwayFirewallCpe") })
        .partial()
        .passthrough()
        .optional(),
      bundle: z.enum([
        "Firewall",
        "Firewall, Maintenance",
        "Firewall, Maintenance, Configuration, Installation",
        "Firewall, Maintenance, Configuration, Installation, Managed CPE",
      ]),
      bandwidth: z.enum([
        "10 Mbit/s, 10 Users",
        "10 Mbit/s, 50 Users",
        "10 Mbit/s, 250 Users",
        "10 Mbit/s, 500 Users",
        "50 Mbit/s, 25 Users",
        "50 Mbit/s, 100 Users",
        "50 Mbit/s, 300 Users",
        "100 Mbit/s, 10 Users",
        "100 Mbit/s, 100 Users",
        "100 Mbit/s, 300 Users",
        "1 Gbit/s, 50 Users",
        "1 Gbit/s, 500 Users",
        "2 Gbit/s, 600 Users",
      ]),
    })
    .passthrough()
);
const EtherwayFibreService = Service.and(
  z
    .object({
      "@type": z.literal("EtherwayFibreService").optional(),
      productSpecification: z
        .object({ id: z.literal("EtherwayFibreService") })
        .partial()
        .passthrough()
        .optional(),
      bandwidth: z.enum(["100 Mbit/s", "1 Gbit/s", "10 Gbit/s"]),
      resilience: z.enum(["Standard", "Diverse (RAO2)", "Diverse Plus (RAO2)"]),
      productInformation: EtherwayInformation.optional(),
      product: z
        .array(z.union([EtherwayRouterCpe, EtherwayFirewallCpe]))
        .max(2)
        .optional(),
    })
    .passthrough()
);
const EtherwayGEAService = Service.and(
  z
    .object({
      "@type": z.literal("EtherwayGEAService").optional(),
      productSpecification: z
        .object({ id: z.literal("EtherwayGEAService") })
        .partial()
        .passthrough()
        .optional(),
      bandwidth: z.enum([
        "SOGEA 0.5:0.5 Mbit/s",
        "SOGEA 40:10 Mbit/s",
        "SOGEA 80:20 Mbit/s",
        "FTTP 0.5:0.5 Mbit/s",
        "FTTP 40:10 Mbit/s",
        "FTTP 80:20 Mbit/s",
        "FTTP 115:20 Mbit/s",
        "FTTP 160:30 Mbit/s",
        "FTTP 220:20 Mbit/s",
        "FTTP 220:30 Mbit/s",
        "FTTP 330:30 Mbit/s",
        "FTTP 330:50 Mbit/s",
        "FTTP 500:165 Mbit/s",
        "FTTP 500:500 Mbit/s",
        "FTTP 550:75 Mbit/s",
        "FTTP 550:550 Mbit/s",
        "FTTP 1000:115 Mbit/s",
        "FTTP 1000:220 Mbit/s",
        "FTTP 1000:1000 Mbit/s",
        "FTTP 1100:1100 Mbit/s",
        "FoD 0.5:0.5 Mbit/s",
        "FoD 115:20 Mbit/s",
        "FoD 160:30 Mbit/s",
        "FoD 220:20 Mbit/s",
        "FoD 220:30 Mbit/s",
        "FoD 330:30 Mbit/s",
        "FoD 330:50 Mbit/s",
        "FoD 500:165 Mbit/s",
        "FoD 500:500 Mbit/s",
        "FoD 550:75 Mbit/s",
        "FoD 550:550 Mbit/s",
        "FoD 1000:115 Mbit/s",
        "FoD 1000:220 Mbit/s",
        "FoD 1000:1000 Mbit/s",
        "FoD 1100:1100 Mbit/s",
      ]),
      productInformation: EtherwayInformation.and(
        z
          .object({
            geaBandwidth: z
              .object({ down: z.string(), up: z.string() })
              .passthrough(),
          })
          .passthrough()
      ).optional(),
    })
    .passthrough()
);
const EtherwayExchangeConnectService = Service.and(
  z
    .object({
      "@type": z.literal("EtherwayExchangeConnectService").optional(),
      bandwidth: z.enum(["1 Gbit/s", "10 Gbit/s", "100 Gbit/s"]),
      productInformation: EtherwayInformation.optional(),
    })
    .passthrough()
);
const EtherwayRadioService = Service.and(
  z
    .object({
      "@type": z.literal("EtherwayRadioService").optional(),
      bandwidth: z.literal("100 Mbit/s"),
      productInformation: EtherwayInformation.optional(),
    })
    .passthrough()
);
const EtherwayDataCentreService = Service.and(
  z
    .object({
      "@type": z.literal("EtherwayDataCentreService").optional(),
      bandwidth: z.enum(["1 Gbit/s", "10 Gbit/s", "100 Gbit/s"]),
      productInformation: EtherwayInformation.optional(),
    })
    .passthrough()
);
const EtherwayOSAService = Service.and(
  z
    .object({
      "@type": z.literal("EtherwayOSAService").optional(),
      bandwidth: z.enum([
        "10 Gbit/s 1U",
        "10 Gbit/s 7U",
        "10 Gbit/s Additional Port",
      ]),
      resilience: z.enum(["Standard", "Diverse (RAO2)", "Diverse Plus (RAO2)"]),
      productInformation: EtherwayInformation.optional(),
    })
    .passthrough()
);
export const EtherwayService = z.union([
  EtherwayFibreService,
  EtherwayGEAService,
  EtherwayExchangeConnectService,
  EtherwayRadioService,
  EtherwayDataCentreService,
  EtherwayOSAService,
]);
export const EtherflowConnectedService = Service.and(
  z
    .object({
      "@type": z.literal("EtherflowConnectedService").optional(),
      bandwidth: z.enum([
        "0.2 Mbit/s",
        "0.4 Mbit/s",
        "0.6 Mbit/s",
        "0.8 Mbit/s",
        "1 Mbit/s",
        "2 Mbit/s",
        "3 Mbit/s",
        "4 Mbit/s",
        "5 Mbit/s",
        "6 Mbit/s",
        "7 Mbit/s",
        "8 Mbit/s",
        "9 Mbit/s",
        "10 Mbit/s",
        "15 Mbit/s",
        "20 Mbit/s",
        "25 Mbit/s",
        "30 Mbit/s",
        "35 Mbit/s",
        "40 Mbit/s",
        "45 Mbit/s",
        "50 Mbit/s",
        "60 Mbit/s",
        "70 Mbit/s",
        "80 Mbit/s",
        "90 Mbit/s",
        "100 Mbit/s",
        "150 Mbit/s",
        "200 Mbit/s",
        "250 Mbit/s",
        "300 Mbit/s",
        "350 Mbit/s",
        "400 Mbit/s",
        "450 Mbit/s",
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
      ]),
      cos: z.enum([
        "Premium CoS",
        "Standard CoS",
        "Default CoS (Standard)",
        "Multi CoS 5% (Premium)",
        "Multi CoS 10% (Premium)",
        "Multi CoS 25% (Premium)",
        "Multi CoS 50% (Premium)",
        "Multi CoS 100% (Premium)",
      ]),
    })
    .passthrough()
);
export const WholesaleEthernetElineProduct = Product.and(
  z
    .object({
      "@type": z.literal("WholesaleEthernetEline").optional(),
      productSpecification: z
        .object({ id: z.literal("WholesaleEthernetEline") })
        .partial()
        .passthrough()
        .optional(),
      existingAend: z.boolean().optional().default(false),
      place: z
        .array(
          z.union([
            PostcodeSite,
            NadKeySite,
            UPRNSite,
            DataCentreSite,
            ExchangeConnectSite,
            AccessLineIdSite,
            DirectoryNumberSite,
            CoordinateSite,
          ])
        )
        .min(1)
        .max(1),
      product: z
        .array(
          z.union([
            EtherwayFibreService,
            EtherwayGEAService,
            EtherwayExchangeConnectService,
            EtherwayRadioService,
            EtherwayDataCentreService,
            EtherwayOSAService,
          ])
        )
        .min(1)
        .max(1),
      quoteItem: z
        .array(
          z
            .object({
              action: z.literal("add"),
              "@baseType": z.literal("QuoteItem"),
              "@type": z.literal("BtwQuoteItem"),
              place: z
                .array(
                  z.union([
                    PostcodeSite,
                    NadKeySite,
                    UPRNSite,
                    DataCentreSite,
                    ExchangeConnectSite,
                    AccessLineIdSite,
                    DirectoryNumberSite,
                    CoordinateSite,
                  ])
                )
                .min(1)
                .max(1),
              product: z
                .array(z.union([EtherwayService, EtherflowConnectedService]))
                .min(2)
                .max(2),
            })
            .partial()
            .passthrough()
        )
        .min(1)
        .max(100),
    })
    .passthrough()
);
const EtherflowDynamicService = Service.and(
  z
    .object({
      "@type": z.literal("EtherflowDynamicService").optional(),
      bandwidth: z.enum([
        "0.2 Mbit/s",
        "0.4 Mbit/s",
        "0.6 Mbit/s",
        "0.8 Mbit/s",
        "1 Mbit/s",
        "2 Mbit/s",
        "3 Mbit/s",
        "4 Mbit/s",
        "5 Mbit/s",
        "6 Mbit/s",
        "7 Mbit/s",
        "8 Mbit/s",
        "9 Mbit/s",
        "10 Mbit/s",
        "15 Mbit/s",
        "20 Mbit/s",
        "25 Mbit/s",
        "30 Mbit/s",
        "35 Mbit/s",
        "40 Mbit/s",
        "45 Mbit/s",
        "50 Mbit/s",
        "55 Mbit/s",
        "60 Mbit/s",
        "65 Mbit/s",
        "70 Mbit/s",
        "75 Mbit/s",
        "80 Mbit/s",
        "85 Mbit/s",
        "90 Mbit/s",
        "95 Mbit/s",
        "100 Mbit/s",
        "125 Mbit/s",
        "150 Mbit/s",
        "175 Mbit/s",
        "200 Mbit/s",
        "250 Mbit/s",
        "300 Mbit/s",
        "350 Mbit/s",
        "400 Mbit/s",
        "450 Mbit/s",
        "500 Mbit/s",
        "600 Mbit/s",
        "700 Mbit/s",
        "800 Mbit/s",
        "900 Mbit/s",
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
      ]),
      cos: z.enum([
        "Default CoS (Standard)",
        "Multi CoS 5% (Premium)",
        "Multi CoS 10% (Premium)",
        "Multi CoS 25% (Premium)",
        "Multi CoS 50% (Premium)",
        "Multi CoS 100% (Premium)",
      ]),
    })
    .passthrough()
);
const WholesaleEthernetElanProduct = Product.and(
  z
    .object({
      "@type": z.literal("WholesaleEthernetElan").optional(),
      productSpecification: z
        .object({ id: z.literal("WholesaleEthernetElan") })
        .partial()
        .passthrough()
        .optional(),
      place: z
        .array(
          z.union([
            PostcodeSite,
            NadKeySite,
            UPRNSite,
            DataCentreSite,
            ExchangeConnectSite,
            AccessLineIdSite,
            DirectoryNumberSite,
            CoordinateSite,
          ])
        )
        .min(1)
        .max(1),
      product: z
        .array(z.union([EtherwayService, EtherflowDynamicService]))
        .min(2)
        .max(2),
    })
    .passthrough()
);
export const EtherflowInternetService = Service.and(
  z
    .object({
      "@type": z.literal("EtherflowInternetService").optional(),
      bandwidth: z.enum([
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
      ]),
      cos: z.enum([
        "Premium CoS",
        "Standard CoS",
        "Default CoS (Standard)",
        "Multi CoS 5% (Premium)",
        "Multi CoS 10% (Premium)",
        "Multi CoS 25% (Premium)",
        "Multi CoS 50% (Premium)",
        "Multi CoS 100% (Premium)",
      ]),
      ipAddressBlock: z.enum([
        "Block /29 (8 LAN IP Addresses)",
        "Block /28 (16 LAN IP Addresses)",
        "Block /27 (32 LAN IP Addresses)",
        "Block /26 (64 LAN IP Addresses)",
        "Block /25 (128 LAN IP Addresses)",
        "Block /24 (256 LAN IP Addresses)",
        "Block /23 (512 LAN IP Addresses)",
        "Block /22 (1024 LAN IP Addresses)",
        "Block /21 (2048 LAN IP Addresses)",
      ]),
    })
    .passthrough()
);
const WholesaleEthernetInternetProduct = Product.and(
  z
    .object({
      "@type": z.literal("WholesaleEthernetInternet").optional(),
      productSpecification: z
        .object({ id: z.literal("WholesaleEthernetInternet") })
        .partial()
        .passthrough()
        .optional(),
      place: z
        .array(
          z.union([
            PostcodeSite,
            NadKeySite,
            UPRNSite,
            DataCentreSite,
            ExchangeConnectSite,
            AccessLineIdSite,
            DirectoryNumberSite,
            CoordinateSite,
          ])
        )
        .min(1)
        .max(1),
      product: z
        .array(z.union([EtherwayService, EtherflowInternetService]))
        .min(2)
        .max(2),
    })
    .passthrough()
);
const OpticalCoreNodeSite = Site.and(
  z
    .object({
      "@type": z.literal("OpticalCoreNodeSite").optional(),
      opticalCoreNodeCode: z.string(),
    })
    .passthrough()
);
const NetworkNode = z
  .object({ code: z.string(), name: z.string(), postcode: z.string() })
  .partial()
  .passthrough();
const DataCentre = z
  .object({ code: z.string(), name: z.string(), postcode: z.string() })
  .partial()
  .passthrough();
const WholesaleOpticalService = Service.and(
  z
    .object({
      "@type": z.literal("WholesaleOpticalService").optional(),
      bandwidth: z.enum([
        "1 x 10 Gbit/s",
        "2 x 10 Gbit/s",
        "3 x 10 Gbit/s",
        "4 x 10 Gbit/s",
        "5 x 10 Gbit/s",
        "6 x 10 Gbit/s",
        "7 x 10 Gbit/s",
        "8 x 10 Gbit/s",
        "9 x 10 Gbit/s",
        "10 x 10 Gbit/s",
        "1 x 40 Gbit/s",
        "1 x 100 Gbit/s",
        "1 x 400 Gbit/s",
      ]),
      resilience: z.enum(["Standard", "Diverse (RAO2)", "Diverse Plus (RAO2)"]),
      forceOSA: z.boolean().optional().default(false),
      productInformation: z
        .object({
          serviceType: z.string(),
          mainLinkDistance: Distance,
          aEnd: z
            .object({
              servingExchange: ServingExchange,
              coreNode: NetworkNode,
              dataCentre: DataCentre,
              mainLinkDistance: Distance,
            })
            .partial()
            .passthrough(),
          bEnd: z
            .object({
              servingExchange: ServingExchange,
              coreNode: NetworkNode,
              dataCentre: DataCentre,
              mainLinkDistance: Distance,
            })
            .partial()
            .passthrough(),
        })
        .partial()
        .passthrough()
        .optional(),
    })
    .passthrough()
);
const WholesaleOpticalProduct = Product.and(
  z
    .object({
      "@type": z.literal("WholesaleOptical").optional(),
      productSpecification: z
        .object({ id: z.literal("WholesaleOptical") })
        .partial()
        .passthrough()
        .optional(),
      place: z
        .array(
          z.union([
            PostcodeSite,
            NadKeySite,
            UPRNSite,
            DataCentreSite,
            OpticalCoreNodeSite,
          ])
        )
        .min(2)
        .max(2),
      product: z.array(WholesaleOpticalService).min(1).max(1),
    })
    .passthrough()
);
export const BtQuoteResponse = z
  .object({
    "@baseType": z.literal("Quote").optional(),
    "@type": z.literal("BtwQuote").optional(),
    id: z.string().max(50),
    href: z.string().max(150),
    externalId: z.string().max(100).optional(),
    category: z.string().max(50).optional(),
    description: z.string().max(50).optional(),
    quoteDate: z.string().datetime({ offset: true }).optional(),
    effectiveQuoteCompletionDate: z.string().optional(),
    expectedFulfillmentStartDate: z.string().optional(),
    version: z.string().max(50).optional(),
    state: z.literal("approved").optional(),
    validFor: z
      .object({ startDateTime: z.string(), endDateTime: z.string() })
      .partial()
      .passthrough()
      .optional(),
    informational: z.string().max(1000).optional(),
    warnings: z.string().max(1000).optional(),
    errors: z.string().max(1000).optional(),
    quoteItem: z
      .array(
        z
          .object({
            "@baseType": z.literal("QuoteItem"),
            "@type": z.literal("BtwQuoteItem"),
            action: z.literal("add"),
            state: z.literal("approved"),
            customerReference: z.string().max(100).optional(),
            product: z.union([
              WholesaleEthernetElineProduct,
              WholesaleEthernetElanProduct,
              WholesaleEthernetInternetProduct,
              WholesaleOpticalProduct,
            ]),
          })
          .passthrough()
      )
      .min(1)
      .max(100)
      .optional(),
  })
  .passthrough();
const GatewayError = z
  .object({ code: z.number().int(), message: z.string() })
  .passthrough();
const ApplicationError = z
  .object({
    code: z.number().int(),
    reason: z.string(),
    message: z.string().optional(),
    status: z.string().optional(),
    errors: z.array(z.object({}).partial().passthrough()).optional(),
  })
  .passthrough();
const QuoteRequest = z
  .object({
    externalId: z.string().max(100).optional(),
    expectedFulfillmentStartDate: z.string().optional(),
    quoteItem: z
      .array(
        z
          .object({
            action: z.literal("add"),
            customerReference: z.string().max(100).optional(),
            product: z.union([
              WholesaleEthernetElineProduct,
              WholesaleEthernetElanProduct,
              WholesaleEthernetInternetProduct,
              WholesaleOpticalProduct,
            ]),
          })
          .passthrough()
      )
      .min(1)
      .max(100),
  })
  .passthrough();
const NetworkResponse = z.union([NetworkNode, DataCentre]);

export const schemas = {
  Product,
  Site,
  PostcodeSite,
  NadKeySite,
  UPRNSite,
  DataCentreSite,
  ExchangeConnectSite,
  AccessLineIdSite,
  DirectoryNumberSite,
  CoordinateSite,
  Money,
  Price,
  ProductPrice,
  Service,
  ServingExchange,
  Distance,
  EthernetSwitch,
  EtherwayInformation,
  Cpe,
  EtherwayRouterCpe,
  EtherwayFirewallCpe,
  EtherwayFibreService,
  EtherwayGEAService,
  EtherwayExchangeConnectService,
  EtherwayRadioService,
  EtherwayDataCentreService,
  EtherwayOSAService,
  EtherwayService,
  EtherflowConnectedService,
  WholesaleEthernetElineProduct,
  EtherflowDynamicService,
  WholesaleEthernetElanProduct,
  EtherflowInternetService,
  WholesaleEthernetInternetProduct,
  OpticalCoreNodeSite,
  NetworkNode,
  DataCentre,
  WholesaleOpticalService,
  WholesaleOpticalProduct,
  BtQuoteResponse,
  GatewayError,
  ApplicationError,
  QuoteRequest,
  NetworkResponse,
};

const endpoints = makeApi([
  {
    method: "get",
    path: "/bt-wholesale/tmf-api/resourceInventoryManagement/v4/quoteNetworkResource",
    alias: "getNetworkLocations",
    description: `&lt;p&gt;The /quoteNetworkResource HTTP GET operation can be used to retrieve a list of pricing tool related network locations that can be used as lookup values for different site type values.&lt;/p&gt;
&lt;p&gt;The category query parameter must be provided and the API makes use of various query parameters listed below to facilitate searching, sorting and specifying top level fields to return.&lt;/p&gt;`,
    requestFormat: "json",
    parameters: [
      {
        name: "APIGW-Tracking-Header",
        type: "Header",
        schema: z.string().regex(/^[\w.~:@-]{1,255}$/),
      },
      {
        name: "Authorization",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "category",
        type: "Query",
        schema: z.enum([
          "Wholesale Ethernet Data Centre",
          "Wholesale Ethernet Exchange Connect",
          "Wholesale Optical Data Centre",
          "Wholesale Optical Node",
        ]),
      },
      {
        name: "fields",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().optional().default(0),
      },
      {
        name: "limit",
        type: "Query",
        schema: z
          .union([
            z.literal(10),
            z.literal(100),
            z.literal(1000),
            z.literal(10000),
          ])
          .optional()
          .default(10),
      },
      {
        name: "sort",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "id",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "code",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "postcode",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.array(NetworkResponse),
    errors: [
      {
        status: 400,
        description: `&lt;p&gt;Bad Request&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 25 | Missing header: \&lt;parameter\&gt; | The indicated parameter is missing from the request header. |
| 26 | Invalid header value: \&lt;parameter\&gt; | The indicated parameter in the request header is not recognised. |
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 29 | Bad request | Request failed schema validation. | The request failed schema validation, an array of validation errors will also be returned to help identify cause of error. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 401,
        description: `&lt;p&gt;Unauthorized&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ----  | -------  | -------------- |
| 40 | Missing credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is missing.|
| 41 | Invalid credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is not valid.|
| 42 | Expired credentials| Renew the access token using the OAuth API and try again.|

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 43 | Unauthorized DUNS Id | DUNS Id not provided or not recognised by pricing tool. | The DUNS Id assigned by the APIGW was not recognised. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 403,
        description: `&lt;p&gt;Forbidden&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 50 | Access denied  | The client application is not authorised to call this resource.|
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 51 | Forbidden requester | The client application is not authorised to call this version of the pricing tool API. | Access to new versions of the pricing tool API first require functional testing in the test environment before production access is enabled. |
| 53 | Too many requests | Temporary (1 hour) API block in place due to excessive request rate limiting. | When the rate limit is consistently triggered a temporary block is enforced on the client. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 404,
        description: `&lt;p&gt;Not Found&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 60 | Resource not found | The requested URI or resource does not exist. | The client application requested a resource that does not exist or is no longer available. The message will be specific to the resource being requested. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 405,
        description: `&lt;p&gt;Method Not Allowed&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;
 
| Code  | Message | Description |
| ---- | ------- | ----------- |
| 61 | Method not allowed | The requested method is not supported by this resource. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 61 | Method not allowed | The URI does not support the requested method. | The server resource does not support the requested method. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 429,
        description: `&lt;p&gt;Too Many Requests&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. | The application has made too many calls and has exceeded the rate limit. Check rate limit headers for more information on limit and reset values. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 500,
        description: `&lt;p&gt;Internal Server Error&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 01 | Internal application error | Internal application error |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 01 | Internal application error | {message specific to internal error.} |  The server encountered an internal application error and could not process the request. |
| 02 | Not Implemented | {message specific to functionality that is not implemented.} | Some functionality may be reserved for future use and although defined in the API specification is not yet implemented. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 503,
        description: `&lt;p&gt;Service Unavailable&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 05 | The service is temporarily unavailable | Please try again later. |`,
        schema: GatewayError,
      },
      {
        status: 504,
        description: `&lt;p&gt;Gateway Timeout&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

 | Code  | Message | Description |
 | ---- | ------- | ----------- |
 | 08 | Gateway Timeout | System timed out talking to downstream system. |`,
        schema: GatewayError,
      },
    ],
  },
  {
    method: "get",
    path: "/bt-wholesale/tmf-api/resourceInventoryManagement/v4/quoteNetworkResource/:networkId",
    alias: "getNetworkLocation",
    description: `&lt;p&gt;The /quoteNetworkResource/{networkId} HTTP GET operation can be used to retrieve a single network location based on the networkId.&lt;/p&gt;`,
    requestFormat: "json",
    parameters: [
      {
        name: "APIGW-Tracking-Header",
        type: "Header",
        schema: z.string().regex(/^[\w.~:@-]{1,255}$/),
      },
      {
        name: "Authorization",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "networkId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "fields",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: NetworkResponse,
    errors: [
      {
        status: 400,
        description: `&lt;p&gt;Bad Request&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 25 | Missing header: \&lt;parameter\&gt; | The indicated parameter is missing from the request header. |
| 26 | Invalid header value: \&lt;parameter\&gt; | The indicated parameter in the request header is not recognised. |
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 29 | Bad request | Request failed schema validation. | The request failed schema validation, an array of validation errors will also be returned to help identify cause of error. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 401,
        description: `&lt;p&gt;Unauthorized&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ----  | -------  | -------------- |
| 40 | Missing credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is missing.|
| 41 | Invalid credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is not valid.|
| 42 | Expired credentials| Renew the access token using the OAuth API and try again.|

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 43 | Unauthorized DUNS Id | DUNS Id not provided or not recognised by pricing tool. | The DUNS Id assigned by the APIGW was not recognised. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 403,
        description: `&lt;p&gt;Forbidden&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 50 | Access denied  | The client application is not authorised to call this resource.|
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 51 | Forbidden requester | The client application is not authorised to call this version of the pricing tool API. | Access to new versions of the pricing tool API first require functional testing in the test environment before production access is enabled. |
| 53 | Too many requests | Temporary (1 hour) API block in place due to excessive request rate limiting. | When the rate limit is consistently triggered a temporary block is enforced on the client. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 404,
        description: `&lt;p&gt;Not Found&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 60 | Resource not found | The requested URI or resource does not exist. | The client application requested a resource that does not exist or is no longer available. The message will be specific to the resource being requested. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 405,
        description: `&lt;p&gt;Method Not Allowed&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;
 
| Code  | Message | Description |
| ---- | ------- | ----------- |
| 61 | Method not allowed | The requested method is not supported by this resource. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 61 | Method not allowed | The URI does not support the requested method. | The server resource does not support the requested method. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 429,
        description: `&lt;p&gt;Too Many Requests&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. | The application has made too many calls and has exceeded the rate limit. Check rate limit headers for more information on limit and reset values. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 500,
        description: `&lt;p&gt;Internal Server Error&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 01 | Internal application error | Internal application error |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 01 | Internal application error | {message specific to internal error.} |  The server encountered an internal application error and could not process the request. |
| 02 | Not Implemented | {message specific to functionality that is not implemented.} | Some functionality may be reserved for future use and although defined in the API specification is not yet implemented. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 503,
        description: `&lt;p&gt;Service Unavailable&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 05 | The service is temporarily unavailable | Please try again later. |`,
        schema: GatewayError,
      },
      {
        status: 504,
        description: `&lt;p&gt;Gateway Timeout&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

 | Code  | Message | Description |
 | ---- | ------- | ----------- |
 | 08 | Gateway Timeout | System timed out talking to downstream system. |`,
        schema: GatewayError,
      },
    ],
  },
  {
    method: "get",
    path: "/tmf-api/quoteManagement/v4/quote",
    alias: "getQuotes",
    description: `&lt;p&gt;The /quote HTTP GET operation can be used to retrieve a list of pricing tool API quotes that were created using the API. Historical quotes are available for 1 month from date of creation.&lt;/p&gt;
&lt;p&gt;The API makes use of various query parameters listed below to facilitate quote searching, sorting and specifying top level fields to return.&lt;/p&gt;`,
    requestFormat: "json",
    parameters: [
      {
        name: "APIGW-Tracking-Header",
        type: "Header",
        schema: z.string().regex(/^[\w.~:@-]{1,255}$/),
      },
      {
        name: "Authorization",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "fields",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "offset",
        type: "Query",
        schema: z.number().int().optional().default(0),
      },
      {
        name: "limit",
        type: "Query",
        schema: z
          .union([
            z.literal(10),
            z.literal(20),
            z.literal(30),
            z.literal(40),
            z.literal(50),
            z.literal(100),
          ])
          .optional()
          .default(10),
      },
      {
        name: "sort",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "id",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "externalId",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "category",
        type: "Query",
        schema: z.literal("Wholesale").optional(),
      },
      {
        name: "product",
        type: "Query",
        schema: z
          .enum([
            "WholesaleEthernetEline",
            "WholesaleEthernetElan",
            "WholesaleEthernetInternet",
            "WholesaleOptical",
          ])
          .optional(),
      },
      {
        name: "startDateTime",
        type: "Query",
        schema: z.string().optional(),
      },
      {
        name: "endDateTime",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: z.array(BtQuoteResponse),
    errors: [
      {
        status: 400,
        description: `&lt;p&gt;Bad Request&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 25 | Missing header: \&lt;parameter\&gt; | The indicated parameter is missing from the request header. |
| 26 | Invalid header value: \&lt;parameter\&gt; | The indicated parameter in the request header is not recognised. |
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 29 | Bad request | Request failed schema validation. | The request failed schema validation, an array of validation errors will also be returned to help identify cause of error. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 401,
        description: `&lt;p&gt;Unauthorized&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ----  | -------  | -------------- |
| 40 | Missing credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is missing.|
| 41 | Invalid credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is not valid.|
| 42 | Expired credentials| Renew the access token using the OAuth API and try again.|

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 43 | Unauthorized DUNS Id | DUNS Id not provided or not recognised by pricing tool. | The DUNS Id assigned by the APIGW was not recognised. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 403,
        description: `&lt;p&gt;Forbidden&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 50 | Access denied  | The client application is not authorised to call this resource.|
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 51 | Forbidden requester | The client application is not authorised to call this version of the pricing tool API. | Access to new versions of the pricing tool API first require functional testing in the test environment before production access is enabled. |
| 53 | Too many requests | Temporary (1 hour) API block in place due to excessive request rate limiting. | When the rate limit is consistently triggered a temporary block is enforced on the client. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 404,
        description: `&lt;p&gt;Not Found&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 60 | Resource not found | The requested URI or resource does not exist. | The client application requested a resource that does not exist or is no longer available. The message will be specific to the resource being requested. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 405,
        description: `&lt;p&gt;Method Not Allowed&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;
 
| Code  | Message | Description |
| ---- | ------- | ----------- |
| 61 | Method not allowed | The requested method is not supported by this resource. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 61 | Method not allowed | The URI does not support the requested method. The available methods are set in the response header &#x27;Allow&#x27;. | The server resource does not support the requested method. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 429,
        description: `&lt;p&gt;Too Many Requests&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. | The application has made too many calls and has exceeded the rate limit. Check rate limit headers for more information on limit and reset values. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 500,
        description: `&lt;p&gt;Internal Server Error&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 01 | Internal application error | Internal application error |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 01 | Internal application error | {message specific to internal error.} |  The server encountered an internal application error and could not process the request. |
| 02 | Not Implemented | {message specific to functionality that is not implemented.} | Some functionality may be reserved for future use and although defined in the API specification is not yet implemented. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 503,
        description: `&lt;p&gt;Service Unavailable&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 05 | The service is temporarily unavailable | Please try again later. |`,
        schema: GatewayError,
      },
      {
        status: 504,
        description: `&lt;p&gt;Gateway Timeout&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

 | Code  | Message | Description |
 | ---- | ------- | ----------- |
 | 08 | Gateway Timeout | System timed out talking to downstream system. |`,
        schema: GatewayError,
      },
    ],
  },
  {
    method: "post",
    path: "/tmf-api/quoteManagement/v4/quote",
    alias: "postQuote",
    description: `&lt;p&gt;The /quote HTTP POST operation can be used to create a pricing tool quote.&lt;/p&gt;`,
    requestFormat: "json",
    parameters: [
      {
        name: "body",
        description: `&lt;details&gt;
&lt;summary&gt;&lt;b&gt;Request combination details&lt;/b&gt;&lt;/summary&gt;`,
        type: "Body",
        schema: QuoteRequest,
      },
      {
        name: "APIGW-Tracking-Header",
        type: "Header",
        schema: z.string().regex(/^[\w.~:@-]{1,255}$/),
      },
      {
        name: "Authorization",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "Content-Type",
        type: "Header",
        schema: z.string(),
      },
    ],
    response: BtQuoteResponse,
    errors: [
      {
        status: 400,
        description: `&lt;p&gt;Bad Request&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 25 | Missing header: \&lt;parameter\&gt; | The indicated parameter is missing from the request header. |
| 26 | Invalid header value: \&lt;parameter\&gt; | The indicated parameter in the request header is not recognised. |
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 21 | Missing body | Request is missing the body. | The server was expecting a body to be sent within the request. |
| 22 | Invalid body | {Message detailing why the body is invalid.} | The posted body is not well-formed and cannot be parsed. |
| 29 | Bad request | Request failed schema validation. | The request failed schema validation, an array of validation errors will also be returned to help identify cause of error. |
| 32 | Invalid quote configuration | {Message detailing the configuration error.} | The request passed schema validation but has an invalid configuration. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 401,
        description: `&lt;p&gt;Unauthorized&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ----  | -------  | -------------- |
| 40 | Missing credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is missing.|
| 41 | Invalid credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is not valid.|
| 42 | Expired credentials| Renew the access token using the OAuth API and try again.|

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 43 | Unauthorized DUNS Id | DUNS Id not provided or not recognised by pricing tool. | The DUNS Id assigned by the APIGW was not recognised. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 403,
        description: `&lt;p&gt;Forbidden&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 50 | Access denied  | The client application is not authorised to call this resource.|
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 51 | Forbidden requester | The client application is not authorised to call this version of the pricing tool API. | Access to new versions of the pricing tool API first require functional testing in the test environment before production access is enabled. |
| 53 | Too many requests | Temporary (1 hour) API block in place due to excessive request rate limiting. | When the rate limit is consistently triggered a temporary block is enforced on the client. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 404,
        description: `&lt;p&gt;Not Found&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 60 | Resource not found | The requested URI or resource does not exist. | The client application requested a resource that does not exist or is no longer available. The message will be specific to the resource being requested. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 405,
        description: `&lt;p&gt;Method Not Allowed&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;
 
| Code  | Message | Description |
| ---- | ------- | ----------- |
| 61 | Method not allowed | The requested method is not supported by this resource. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 61 | Method not allowed | The URI does not support the requested method. The available methods are set in the response header &#x27;Allow&#x27;. | The server resource does not support the requested method. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 415,
        description: `Unsupported Media Type

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 68 | Unsupported Media Type | The format of the posted body is not supported by the endpoint. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 68 | Unsupported Media Type | The format of the posted body is not supported by the endpoint. | The server does not support the content type provided by the client application. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 429,
        description: `&lt;p&gt;Too Many Requests&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. | The application has made too many calls and has exceeded the rate limit. Check rate limit headers for more information on limit and reset values. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 500,
        description: `&lt;p&gt;Internal Server Error&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 01 | Internal application error | Internal application error |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 01 | Internal application error | {message specific to internal error.} |  The server encountered an internal application error and could not process the request. |
| 02 | Not Implemented | {message specific to functionality that is not implemented.} | Some functionality may be reserved for future use and although defined in the API specification is not yet implemented. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 503,
        description: `&lt;p&gt;Service Unavailable&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 05 | The service is temporarily unavailable | Please try again later. |`,
        schema: GatewayError,
      },
      {
        status: 504,
        description: `&lt;p&gt;Gateway Timeout&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

 | Code  | Message | Description |
 | ---- | ------- | ----------- |
 | 08 | Gateway Timeout | System timed out talking to downstream system. |`,
        schema: GatewayError,
      },
    ],
  },
  {
    method: "get",
    path: "/tmf-api/quoteManagement/v4/quote/:quoteId",
    alias: "getQuote",
    description: `&lt;p&gt;The /quote/{quoteId} HTTP GET operation can be used to retrieve a single pricing tool API quote that was created using the API.&lt;/p&gt;`,
    requestFormat: "json",
    parameters: [
      {
        name: "APIGW-Tracking-Header",
        type: "Header",
        schema: z.string().regex(/^[\w.~:@-]{1,255}$/),
      },
      {
        name: "Authorization",
        type: "Header",
        schema: z.string(),
      },
      {
        name: "quoteId",
        type: "Path",
        schema: z.string(),
      },
      {
        name: "fields",
        type: "Query",
        schema: z.string().optional(),
      },
    ],
    response: BtQuoteResponse,
    errors: [
      {
        status: 400,
        description: `&lt;p&gt;Bad Request&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code | Message | Description |
| ---- | ------- | ----------- |
| 25 | Missing header: \&lt;parameter\&gt; | The indicated parameter is missing from the request header. |
| 26 | Invalid header value: \&lt;parameter\&gt; | The indicated parameter in the request header is not recognised. |
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 29 | Bad request | Request failed schema validation. | The request failed schema validation, an array of validation errors will also be returned to help identify cause of error. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 401,
        description: `&lt;p&gt;Unauthorized&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ----  | -------  | -------------- |
| 40 | Missing credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is missing.|
| 41 | Invalid credentials| The &lt;i&gt;Authorization&lt;/i&gt; parameter is not valid.|
| 42 | Expired credentials| Renew the access token using the OAuth API and try again.|

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 43 | Unauthorized DUNS Id | DUNS Id not provided or not recognised by pricing tool. | The DUNS Id assigned by the APIGW was not recognised. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 403,
        description: `&lt;p&gt;Forbidden&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 50 | Access denied  | The client application is not authorised to call this resource.|
            
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 51 | Forbidden requester | The client application is not authorised to call this version of the pricing tool API. | Access to new versions of the pricing tool API first require functional testing in the test environment before production access is enabled. |
| 53 | Too many requests | Temporary (1 hour) API block in place due to excessive request rate limiting. | When the rate limit is consistently triggered a temporary block is enforced on the client. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 404,
        description: `&lt;p&gt;Not Found&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 60 | Resource not found | The requested URI or resource does not exist. | The client application requested a resource that does not exist or is no longer available. The message will be specific to the resource being requested. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 405,
        description: `&lt;p&gt;Method Not Allowed&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;
 
| Code  | Message | Description |
| ---- | ------- | ----------- |
| 61 | Method not allowed | The requested method is not supported by this resource. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 61 | Method not allowed | The URI does not support the requested method. The available methods are set in the response header &#x27;Allow&#x27;. | The server resource does not support the requested method. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 429,
        description: `&lt;p&gt;Too Many Requests&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 80 | Too many requests | The client application has made too many requests in a short time; please try again later. | The application has made too many calls and has exceeded the rate limit. Check rate limit headers for more information on limit and reset values. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 500,
        description: `&lt;p&gt;Internal Server Error&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 01 | Internal application error | Internal application error |

&lt;p&gt;Pricing Tool Errors&lt;/p&gt;

| Code  | Reason | Message | Description |
| ---- | ------- | ------- | ----------- |
| 01 | Internal application error | {message specific to internal error.} |  The server encountered an internal application error and could not process the request. |
| 02 | Not Implemented | {message specific to functionality that is not implemented.} | Some functionality may be reserved for future use and although defined in the API specification is not yet implemented. |`,
        schema: z.union([GatewayError, ApplicationError]),
      },
      {
        status: 503,
        description: `&lt;p&gt;Service Unavailable&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

| Code  | Message | Description |
| ---- | ------- | ----------- |
| 05 | The service is temporarily unavailable | Please try again later. |`,
        schema: GatewayError,
      },
      {
        status: 504,
        description: `&lt;p&gt;Gateway Timeout&lt;/p&gt;

&lt;br /&gt;
&lt;p&gt;Gateway Errors&lt;/p&gt;

 | Code  | Message | Description |
 | ---- | ------- | ----------- |
 | 08 | Gateway Timeout | System timed out talking to downstream system. |`,
        schema: GatewayError,
      },
    ],
  },
]);

export const api = new Zodios(endpoints);

export function createApiClient(baseUrl: string, options?: ZodiosOptions) {
  return new Zodios(baseUrl, endpoints, options);
}

export type TBtQuoteResponse = z.infer<typeof BtQuoteResponse>;

export type TBtQuoteRequestBody = z.infer<typeof QuoteRequest>;

export type TProductPrice = z.infer<typeof ProductPrice>;

import { CustomError } from "src/app/lib/schemas/errors/custom-error";
import { TBtQuoteRequestBody } from "src/app/lib/schemas/quoting/bt-quote-api-schema";
import { formWholesaleEthernetInternetQuoteItem } from "./form-ethernet-internet-item";
import { formWholesaleEthernetElineQuoteItem } from "./form-eline-item";
import { convertBandwidthToMbits } from "../convert-bandwidth-to-mbps";
import {
  formEtherwayInfo,
  mapCircuitInterfaceToBandwidth,
} from "./form-etherway-info";
import {
  formEtherflowConnectedServiceInfo,
  formEtherflowInternetServiceInfo,
} from "./form-etherflow-info";
import {
  isScenarioOne,
  isScenarioThree,
  isScenarioTwo,
  isScenarioTwoPointOne,
} from "../categorize-scenario";
import {
  TBandwidth,
  TCircuitInterface,
  TEtherwayInfo,
  TQuoteAddressInfo,
  TQuoteRequestBody,
  TSubProductInfoWholesaleEthernetEline,
  TSubProductInfoWholesaleEthernetInternet,
} from "src/app/lib/types/quoting-types";
import { isBandwidthGreaterThanInterface } from "./is-bandwidth-greater-than-interface";

export const formQuoteItem = (
  quoteParams: TQuoteRequestBody
): TBtQuoteRequestBody[] => {
  const { id, postcode } = quoteParams.locationIdentifier;
  const {
    serviceType,
    circuitInterface,
    circuitBandwidth,
    circuitTwoBandwidth,
    numberOfIpAddresses,
  } = quoteParams.btQuoteParams;

  if (
    !numberOfIpAddresses ||
    !circuitBandwidth ||
    !circuitInterface ||
    !postcode ||
    !serviceType
  )
    throw new CustomError({
      message: "quote params missing",
      source: "formQuoteItem",
    });

  if (isBandwidthGreaterThanInterface(circuitBandwidth, circuitInterface)) {
    throw new CustomError({
      message:
        "Circuit bandwidth cannot be greater than circuit interface bandwidth",
      source: "formQuoteItem",
    });
  }

  const quoteAddressInfo: TQuoteAddressInfo[] = [
    id
      ? { "@type": "NadKeySite", nadKey: id }
      : { "@type": "PostcodeSite", postcode },
  ];

  const resilience =
    serviceType === "dual" ? "Diverse Plus (RAO2)" : "Standard";

  const etherwayInfo = formEtherwayInfo(circuitInterface, resilience);

  const formEthernetInternetSubProduct = (
    bandwidth: TBandwidth,
    reference: string
  ) => {
    const etherflowInfo = formEtherflowInternetServiceInfo(
      bandwidth,
      numberOfIpAddresses
    );
    const subProductInfo: TSubProductInfoWholesaleEthernetInternet = [
      etherwayInfo,
      etherflowInfo,
    ];
    return formWholesaleEthernetInternetQuoteItem(
      quoteAddressInfo,
      subProductInfo,
      `${reference} ${crypto.randomUUID()}`
    );
  };

  const formElineSubProduct = (
    bandwidth: TBandwidth,
    etherway: TEtherwayInfo,
    reference: string
  ) => {
    const etherflowInfo = formEtherflowConnectedServiceInfo(bandwidth);
    const subProductInfo: TSubProductInfoWholesaleEthernetEline = [
      etherway,
      etherflowInfo,
    ];
    return formWholesaleEthernetElineQuoteItem(
      quoteAddressInfo,
      subProductInfo,
      `${reference} ${crypto.randomUUID()}`
    );
  };

  if (isScenarioOne(quoteParams)) {
    return [formEthernetInternetSubProduct(circuitBandwidth, "1")];
  }

  if (isScenarioTwoPointOne(quoteParams)) {
    return [formEthernetInternetSubProduct(circuitBandwidth, "2.1")];
  }

  if (isScenarioTwo(quoteParams) && circuitTwoBandwidth) {
    const etherwayCircuitTwoInfo = formEtherwayInfo(
      circuitInterface,
      "Standard"
    );
    return [
      formEthernetInternetSubProduct(circuitBandwidth, "2"),
      formElineSubProduct(circuitTwoBandwidth, etherwayCircuitTwoInfo, "2"),
    ];
  }

  if (isScenarioThree(quoteParams)) {
    return [formElineSubProduct(circuitBandwidth, etherwayInfo, "3")];
  }

  throw new CustomError({
    message: "Something went wrong when forming the quote item to send to BT",
    source: "formQuoteItem",
  });
};

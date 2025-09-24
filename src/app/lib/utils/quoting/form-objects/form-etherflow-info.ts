import {
  TBandwidth,
  TEtherflowInfoConnectedService,
  TEtherflowInfoInternetService,
  TIpAddressBlock,
} from "src/app/lib/types/quoting-types";

export const formEtherflowInternetServiceInfo = (
  bandwidth: TBandwidth,
  ipAddressBlock: TIpAddressBlock
): TEtherflowInfoInternetService => ({
  "@type": "EtherflowInternetService",
  productSpecification: {
    id: "EtherflowInternetService",
  },
  bandwidth: bandwidth,
  cos: "Premium CoS",
  ipAddressBlock: ipAddressBlock,
});

export const formEtherflowConnectedServiceInfo = (
  bandwidth: TBandwidth
): TEtherflowInfoConnectedService => ({
  "@type": "EtherflowConnectedService",
  productSpecification: {
    id: "EtherflowConnectedService",
  },
  bandwidth: bandwidth,
  cos: "Premium CoS",
});

import { TBandwidth, TIpAddressBlock } from "src/app/lib/types/quoting-types";
import {
  formEtherflowConnectedServiceInfo,
  formEtherflowInternetServiceInfo,
} from "../form-etherflow-info";

describe("formEtherflowInternetServiceInfo", () => {
  it("should create a valid EtherflowInternetService object", () => {
    const bandwidth: TBandwidth = "10 Mbit/s";
    const ipAddressBlock: TIpAddressBlock = "Block /28 (16 LAN IP Addresses)";

    const result = formEtherflowInternetServiceInfo(bandwidth, ipAddressBlock);

    expect(result).toEqual({
      "@type": "EtherflowInternetService",
      productSpecification: {
        id: "EtherflowInternetService",
      },
      bandwidth: "10 Mbit/s",
      cos: "Premium CoS",
      ipAddressBlock: "Block /28 (16 LAN IP Addresses)",
    });
  });

  it("should work with different bandwidth and IP block values", () => {
    const bandwidth: TBandwidth = "100 Mbit/s";
    const ipAddressBlock: TIpAddressBlock = "Block /29 (8 LAN IP Addresses)";

    const result = formEtherflowInternetServiceInfo(bandwidth, ipAddressBlock);

    expect(result).toEqual({
      "@type": "EtherflowInternetService",
      productSpecification: {
        id: "EtherflowInternetService",
      },
      bandwidth: "100 Mbit/s",
      cos: "Premium CoS",
      ipAddressBlock: "Block /29 (8 LAN IP Addresses)",
    });
  });
});

describe("formEtherflowConnectedServiceInfo", () => {
  it("should create a valid EtherflowConnectedService object", () => {
    const bandwidth: TBandwidth = "1 Gbit/s";

    const result = formEtherflowConnectedServiceInfo(bandwidth);

    expect(result).toEqual({
      "@type": "EtherflowConnectedService",
      productSpecification: {
        id: "EtherflowConnectedService",
      },
      bandwidth: "1 Gbit/s",
      cos: "Premium CoS",
    });
  });

  it("should work with different bandwidth values", () => {
    const bandwidth: TBandwidth = "10 Gbit/s";

    const result = formEtherflowConnectedServiceInfo(bandwidth);

    expect(result).toEqual({
      "@type": "EtherflowConnectedService",
      productSpecification: {
        id: "EtherflowConnectedService",
      },
      bandwidth: "10 Gbit/s",
      cos: "Premium CoS",
    });
  });
});

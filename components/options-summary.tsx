"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Network, Shield, Zap } from "lucide-react"

interface OptionsSummaryProps {
  formData: any
  currentStep: string
}

export function OptionsSummary({ formData, currentStep }: OptionsSummaryProps) {
  console.log("[v0] OptionsSummary formData:", formData)

  const getStepStatus = (step: string) => {
    const stepOrder = ["address", "service-type", "network-config", "security", "quote"]
    const currentIndex = stepOrder.indexOf(currentStep)
    const stepIndex = stepOrder.indexOf(step)

    if (stepIndex < currentIndex) return "completed"
    if (stepIndex === currentIndex) return "current"
    return "upcoming"
  }

  const hasStepSelection = (step: string) => {
    switch (step) {
      case "address":
        return !!formData.selectedAddress
      case "service-type":
        return !!formData.serviceType
      case "network-config":
        return !!(
          formData.etherwayBandwidth ||
          formData.circuitInterface ||
          formData.etherflowBandwidth ||
          formData.circuitTwoBandwidth ||
          formData.preferredIpBackbone ||
          formData.numberOfIpAddresses
        )
      case "security":
        return (
          formData.includeSecurityOptions ||
          formData.secureIpDelivery ||
          formData.ztnaRequired ||
          formData.threatPreventionRequired ||
          formData.casbRequired ||
          formData.dlpRequired
        )
      default:
        return false
    }
  }

  const formatBandwidth = (bandwidth: string) => {
    return bandwidth?.replace(/(\d+)\s*(Mbit|Gbit)/g, "$1 $2/s") || ""
  }

  return (
    <Card className="sticky top-6">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          Quote Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Address Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Service Address</span>
            <Badge
              variant={
                getStepStatus("address") === "completed" || hasStepSelection("address") ? "default" : "secondary"
              }
              className="ml-auto text-xs"
            >
              {getStepStatus("address") === "completed" || hasStepSelection("address") ? "Selected" : "Pending"}
            </Badge>
          </div>
          {formData.selectedAddress ? (
            <div className="pl-6 text-sm text-muted-foreground">
              <p>{formData.selectedAddress.fullAddress}</p>
            </div>
          ) : (
            <p className="pl-6 text-sm text-muted-foreground italic">Not selected</p>
          )}
        </div>

        <Separator />

        {/* Service Type Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Network className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Service Type</span>
            <Badge
              variant={
                getStepStatus("service-type") === "completed" || hasStepSelection("service-type")
                  ? "default"
                  : "secondary"
              }
              className="ml-auto text-xs"
            >
              {getStepStatus("service-type") === "completed" || hasStepSelection("service-type")
                ? "Selected"
                : "Pending"}
            </Badge>
          </div>
          {formData.serviceType ? (
            <div className="pl-6 space-y-1">
              <p className="text-sm text-muted-foreground">
                {formData.serviceType === "single" && "Single Service"}
                {formData.serviceType === "dual" && "Dual Service"}
                {formData.serviceType === "dual-active" && "Dual Service - Active/Active"}
                {formData.serviceType === "dual-passive" && "Dual Service - Active/Passive"}
              </p>
              {formData.serviceType !== "single" && formData.diversityType && (
                <p className="text-xs text-muted-foreground">
                  Diversity: {formData.diversityType === "exchange" ? "Exchange Level" : "Physical Path"}
                </p>
              )}
            </div>
          ) : (
            <p className="pl-6 text-sm text-muted-foreground italic">Not selected</p>
          )}
        </div>

        <Separator />

        {/* Network Configuration Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Network Config</span>
            <Badge
              variant={
                getStepStatus("network-config") === "completed" || hasStepSelection("network-config")
                  ? "default"
                  : "secondary"
              }
              className="ml-auto text-xs"
            >
              {getStepStatus("network-config") === "completed" || hasStepSelection("network-config")
                ? "Configured"
                : "Pending"}
            </Badge>
          </div>
          <div className="pl-6 space-y-2">
            {formData.etherwayBandwidth ||
            formData.circuitInterface ||
            formData.etherflowBandwidth ||
            formData.preferredIpBackbone ? (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">Primary Circuit:</p>
                {formData.preferredIpBackbone && (
                  <p className="text-xs text-muted-foreground pl-2">• IP Backbone: {formData.preferredIpBackbone}</p>
                )}
                {formData.etherwayBandwidth && (
                  <p className="text-xs text-muted-foreground pl-2">
                    • Etherway Bandwidth: {formData.etherwayBandwidth}
                  </p>
                )}
                {formData.circuitInterface && (
                  <p className="text-xs text-muted-foreground pl-2">• Interface: {formData.circuitInterface}</p>
                )}
                {formData.etherflowBandwidth && (
                  <p className="text-xs text-muted-foreground pl-2">• Etherflow: {formData.etherflowBandwidth}</p>
                )}
                {formData.numberOfIpAddresses && (
                  <p className="text-xs text-muted-foreground pl-2">• IP Addresses: {formData.numberOfIpAddresses}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Primary circuit not configured</p>
            )}

            {formData.serviceType === "dual" && (
              <div className="space-y-1">
                {formData.circuitTwoBandwidth || formData.dualInternetConfig ? (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground font-medium">Secondary Circuit:</p>
                    {formData.dualInternetConfig && (
                      <p className="text-xs text-muted-foreground pl-2">
                        • Configuration: {formData.dualInternetConfig}
                      </p>
                    )}
                    {formData.circuitTwoBandwidth && (
                      <p className="text-xs text-muted-foreground pl-2">• Bandwidth: {formData.circuitTwoBandwidth}</p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">Secondary circuit not configured</p>
                )}
              </div>
            )}
          </div>
        </div>

        <Separator />

        {/* Security Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Security</span>
            <Badge
              variant={
                getStepStatus("security") === "completed" || hasStepSelection("security") ? "default" : "secondary"
              }
              className="ml-auto text-xs"
            >
              {getStepStatus("security") === "completed" || hasStepSelection("security") ? "Configured" : "Pending"}
            </Badge>
          </div>
          <div className="pl-6 space-y-1">
            {formData.includeSecurityOptions ? (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">• Security Options: Included</p>
                <p className="text-xs text-muted-foreground pl-2">• Secure IP Delivery: Enabled</p>
                {formData.ztnaRequired && (
                  <p className="text-xs text-muted-foreground pl-2">
                    • ZTNA Required: Yes ({formData.noOfZtnaUsers} users)
                  </p>
                )}
                {formData.threatPreventionRequired && (
                  <p className="text-xs text-muted-foreground pl-2">• Threat Prevention: Yes</p>
                )}
                {formData.casbRequired && <p className="text-xs text-muted-foreground pl-2">• CASB: Yes</p>}
                {formData.dlpRequired && <p className="text-xs text-muted-foreground pl-2">• DLP: Yes</p>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">Security options not configured</p>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="pt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-2">
            <span>Progress</span>
            <span>{["address", "service-type", "network-config", "security", "quote"].indexOf(currentStep) + 1}/5</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(["address", "service-type", "network-config", "security", "quote"].indexOf(currentStep) + 1) * 20}%`,
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

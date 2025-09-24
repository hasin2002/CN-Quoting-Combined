"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { HelpCircle } from "lucide-react"
import type { FormData } from "@/types/quote"

interface NetworkConfigStepProps {
  formData: FormData
  onUpdate: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
}

export function NetworkConfigStep({ formData, onUpdate, onNext, onPrev }: NetworkConfigStepProps) {
  const bandwidthOptions = [
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
  ]

  const getEtherflowOptions = () => {
    if (formData.etherwayBandwidth === "1 Gbit/s") {
      // Return options up to 1 Gbit/s
      return bandwidthOptions.filter((option) => {
        const value = Number.parseFloat(option)
        const unit = option.includes("Gbit/s") ? "Gbit/s" : "Mbit/s"
        if (unit === "Gbit/s") {
          return value <= 1
        }
        return true // All Mbit/s options are valid
      })
    } else if (formData.etherwayBandwidth === "10 Gbit/s") {
      // Return all options up to 10 Gbit/s
      return bandwidthOptions
    }
    return []
  }

  // Get interface options based on Etherway bandwidth
  const getInterfaceOptions = () => {
    if (formData.etherwayBandwidth === "1 Gbit/s") {
      return ["1000BASE-T", "1000BASE-LX", "1000BASE-SX"]
    } else if (formData.etherwayBandwidth === "10 Gbit/s") {
      return ["10GBASE-LR", "10GBASE-SR"]
    }
    return []
  }

  const ipAddressOptions = [
    "Block /29 (8 LAN IP Addresses)",
    "Block /28 (16 LAN IP Addresses)",
    "Block /27 (32 LAN IP Addresses)",
    "Block /26 (64 LAN IP Addresses)",
    "Block /25 (128 LAN IP Addresses)",
    "Block /24 (256 LAN IP Addresses)",
    "Block /23 (512 LAN IP Addresses)",
    "Block /22 (1024 LAN IP Addresses)",
    "Block /21 (2048 LAN IP Addresses)",
  ]

  const isFormValid = () => {
    const baseValid =
      formData.preferredIpBackbone &&
      formData.etherwayBandwidth &&
      formData.circuitInterface &&
      formData.etherflowBandwidth &&
      formData.numberOfIpAddresses

    if (formData.serviceType === "dual") {
      return (
        baseValid &&
        formData.dualInternetConfig &&
        (formData.dualInternetConfig === "Active / Passive" || formData.circuitTwoBandwidth)
      )
    }

    return baseValid
  }

  const isInterfaceDisabled = !formData.etherwayBandwidth

  const isEtherflowDisabled = !formData.etherwayBandwidth

  const isCircuit2Disabled =
    formData.serviceType !== "dual" ||
    !formData.dualInternetConfig ||
    formData.dualInternetConfig === "Active / Passive"

  return (
    <TooltipProvider>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="font-heading text-3xl font-bold text-foreground">Network Configuration</h1>
          <p className="text-muted-foreground">Configure your network service parameters and requirements</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Preferred IP Network */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Preferred IP Network</CardTitle>
                  <CardDescription>Select your preferred network provider</CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Choose your preferred backbone provider for IP connectivity. This determines the network
                      infrastructure that will carry your traffic.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.preferredIpBackbone}
                onValueChange={(value) => onUpdate({ preferredIpBackbone: value as FormData["preferredIpBackbone"] })}
              >
                <SelectTrigger className="border-gray-300/50">
                  <SelectValue placeholder="Choose network provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BT">BT</SelectItem>
                  <SelectItem value="Colt">Colt</SelectItem>
                  <SelectItem value="Lumen">Lumen</SelectItem>
                  <SelectItem value="PCCW">PCCW</SelectItem>
                  <SelectItem value="Cogent">Cogent</SelectItem>
                  <SelectItem value="Don't mind">Don't mind</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Etherway Bandwidth */}
          <Card>
            <CardHeader>
              <CardTitle>Etherway Bandwidth</CardTitle>
              <CardDescription>Select your required bandwidth</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.etherwayBandwidth}
                onValueChange={(value) =>
                  onUpdate({
                    etherwayBandwidth: value as FormData["etherwayBandwidth"],
                    circuitInterface: "", // Reset interface when bandwidth changes
                    etherflowBandwidth: "", // Reset etherflow when bandwidth changes
                    circuitTwoBandwidth: "", // Reset circuit 2 bandwidth
                  })
                }
              >
                <div className="flex items-center space-x-2 px-0 rounded-md py-0 border-0">
                  <RadioGroupItem value="1 Gbit/s" id="1gbps" />
                  <Label htmlFor="1gbps">1 Gbit/s</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="10 Gbit/s" id="10gbps" />
                  <Label htmlFor="10gbps">10 Gbit/s</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Interface Selection */}
          <Card className={isInterfaceDisabled ? "opacity-50" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Interface Type</CardTitle>
                  <CardDescription>
                    {isInterfaceDisabled
                      ? "Select Etherway bandwidth first"
                      : "Select the interface for your connection"}
                  </CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      The physical interface type determines the connection method and cable requirements for your
                      network service.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.circuitInterface}
                onValueChange={(value) => onUpdate({ circuitInterface: value as FormData["circuitInterface"] })}
                disabled={isInterfaceDisabled}
              >
                <SelectTrigger className="border-gray-300/50">
                  <SelectValue placeholder="Choose interface" />
                </SelectTrigger>
                <SelectContent>
                  {getInterfaceOptions().map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Etherflow Bandwidth */}
          <Card className={isEtherflowDisabled ? "opacity-50" : ""}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle>Etherflow Bandwidth</CardTitle>
                  <CardDescription>
                    {isEtherflowDisabled
                      ? "Select Etherway bandwidth first"
                      : "Select your Etherflow bandwidth requirement"}
                  </CardDescription>
                </div>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      Etherflow bandwidth determines the data transfer rate for your connection. Choose based on your
                      expected traffic volume.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.etherflowBandwidth}
                onValueChange={(value) => onUpdate({ etherflowBandwidth: value })}
                disabled={isEtherflowDisabled}
              >
                <SelectTrigger className="border-gray-300/50">
                  <SelectValue placeholder="Choose bandwidth" />
                </SelectTrigger>
                <SelectContent>
                  {getEtherflowOptions().map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Dual Service Configuration */}
          {formData.serviceType === "dual" && (
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Dual Service Configuration</CardTitle>
                    <CardDescription>Choose your dual service setup</CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        Active/Active provides load balancing across both circuits. Active/Passive uses one circuit as
                        backup for redundancy.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.dualInternetConfig}
                  onValueChange={(value) =>
                    onUpdate({
                      dualInternetConfig: value as FormData["dualInternetConfig"],
                      circuitTwoBandwidth: value === "Active / Passive" ? "" : formData.circuitTwoBandwidth,
                    })
                  }
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Active / Active" id="active-active" />
                    <Label htmlFor="active-active">Active / Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="Active / Passive" id="active-passive" />
                    <Label htmlFor="active-passive">Active / Passive</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Circuit 2 Bandwidth (always show for dual service) */}
          {formData.serviceType === "dual" && (
            <Card className={isCircuit2Disabled ? "opacity-50" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Circuit 2 Bandwidth</CardTitle>
                    <CardDescription>
                      {isCircuit2Disabled
                        ? "Select Active / Active configuration first"
                        : "Select bandwidth for the second circuit"}
                    </CardDescription>
                  </div>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        The bandwidth allocation for your secondary circuit. Only required for Active/Active
                        configurations.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.circuitTwoBandwidth}
                  onValueChange={(value) => onUpdate({ circuitTwoBandwidth: value })}
                  disabled={isCircuit2Disabled}
                >
                  <SelectTrigger className="border-gray-300/50">
                    <SelectValue placeholder="Choose bandwidth" />
                  </SelectTrigger>
                  <SelectContent>
                    {getEtherflowOptions().map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          )}

          {/* IP Addresses */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>IP Address Block</CardTitle>
              <CardDescription>Select the number of IP addresses you need</CardDescription>
            </CardHeader>
            <CardContent>
              <Select
                value={formData.numberOfIpAddresses}
                onValueChange={(value) => onUpdate({ numberOfIpAddresses: value })}
              >
                <SelectTrigger className="border-gray-300/50">
                  <SelectValue placeholder="Choose IP address block" />
                </SelectTrigger>
                <SelectContent>
                  {ipAddressOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrev}>
            Back
          </Button>
          <Button onClick={onNext} disabled={!isFormValid()} size="lg" className="px-8">
            Continue to Security Options
          </Button>
        </div>
      </div>
    </TooltipProvider>
  )
}

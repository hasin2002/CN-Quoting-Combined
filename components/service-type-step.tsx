"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Network, Zap } from "lucide-react"
import type { FormData } from "@/types/quote"

interface ServiceTypeStepProps {
  formData: FormData
  onUpdate: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
}

export function ServiceTypeStep({ formData, onUpdate, onNext, onPrev }: ServiceTypeStepProps) {
  const handleServiceTypeChange = (value: string) => {
    onUpdate({
      serviceType: value as "single" | "dual",
      // Reset dependent fields when service type changes
      dualInternetConfig: "",
      circuitTwoBandwidth: "",
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold text-foreground">Service Configuration</h1>
        <p className="text-muted-foreground">Choose the type of network service that best fits your requirements</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What service type do you want to provide?</CardTitle>
          <CardDescription>
            Select between single or dual circuit configuration for your network service
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup value={formData.serviceType} onValueChange={handleServiceTypeChange} className="space-y-4">
            <div
              className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleServiceTypeChange("single")}
            >
              <RadioGroupItem value="single" id="single" />
              <div className="flex items-center space-x-3 flex-1">
                <Network className="h-6 w-6 text-primary" />
                <div>
                  <Label htmlFor="single" className="text-base font-medium cursor-pointer">
                    Single Service
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    One primary network connection for standard connectivity needs
                  </p>
                </div>
              </div>
            </div>

            <div
              className="flex items-center space-x-3 p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
              onClick={() => handleServiceTypeChange("dual")}
            >
              <RadioGroupItem value="dual" id="dual" />
              <div className="flex items-center space-x-3 flex-1">
                <Zap className="h-6 w-6 text-primary" />
                <div>
                  <Label htmlFor="dual" className="text-base font-medium cursor-pointer">
                    Dual Service
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Two network connections for redundancy and higher availability
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev}>
          Back
        </Button>
        <Button onClick={onNext} disabled={!formData.serviceType} size="lg" className="px-8">
          Continue
        </Button>
      </div>
    </div>
  )
}

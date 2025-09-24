"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Shield, Users, AlertTriangle, Database, Eye, ChevronLeft, ChevronRight } from "lucide-react"
import type { FormData } from "@/types/quote"

interface SecurityStepProps {
  formData: FormData
  onUpdate: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  onSubmitQuote: () => void
  isLoading: boolean
}

export function SecurityStep({ formData, onUpdate, onNext, onPrev, onSubmitQuote, isLoading }: SecurityStepProps) {
  const handleSecurityToggle = (include: boolean) => {
    onUpdate({
      includeSecurityOptions: include,
      secureIpDelivery: include,
      // Reset all security options if not including
      ...(include
        ? {}
        : {
            ztnaRequired: false,
            noOfZtnaUsers: 0,
            threatPreventionRequired: false,
            casbRequired: false,
            dlpRequired: false,
          }),
    })
  }

  const isFormValid = () => {
    if (formData.includeSecurityOptions === undefined) return false

    if (!formData.includeSecurityOptions) return true

    // If ZTNA is required, must have users count
    if (formData.ztnaRequired && formData.noOfZtnaUsers <= 0) return false

    return true
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold text-foreground">Security Options</h1>
        <p className="text-muted-foreground">Enhance your network service with advanced security features</p>
      </div>

      {/* Main Security Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Security Services
          </CardTitle>
          <CardDescription>Would you like to include security options in your quote?</CardDescription>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.includeSecurityOptions === undefined ? "" : formData.includeSecurityOptions ? "yes" : "no"}
            onValueChange={(value) => handleSecurityToggle(value === "yes")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="security-yes" />
              <Label htmlFor="security-yes">Yes, include security options</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="security-no" />
              <Label htmlFor="security-no">No, network services only</Label>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Security Options Details */}
      {formData.includeSecurityOptions && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* ZTNA */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-primary" />
                Zero Trust Network Access (ZTNA)
              </CardTitle>
              <CardDescription>Secure remote access for your users</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                value={formData.ztnaRequired ? "yes" : "no"}
                onValueChange={(value) =>
                  onUpdate({
                    ztnaRequired: value === "yes",
                    noOfZtnaUsers: value === "yes" ? formData.noOfZtnaUsers : 0,
                  })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="ztna-yes" />
                  <Label htmlFor="ztna-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="ztna-no" />
                  <Label htmlFor="ztna-no">No</Label>
                </div>
              </RadioGroup>

              {formData.ztnaRequired && (
                <div className="space-y-2">
                  <Label htmlFor="ztna-users">Number of ZTNA users</Label>
                  <Input
                    id="ztna-users"
                    type="number"
                    min="1"
                    value={formData.noOfZtnaUsers || ""}
                    onChange={(e) => onUpdate({ noOfZtnaUsers: Number.parseInt(e.target.value) || 0 })}
                    placeholder="Enter number of users"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Threat Prevention */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-primary" />
                Threat Prevention
              </CardTitle>
              <CardDescription>Advanced threat detection and prevention</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.threatPreventionRequired ? "yes" : "no"}
                onValueChange={(value) => onUpdate({ threatPreventionRequired: value === "yes" })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="threat-yes" />
                  <Label htmlFor="threat-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="threat-no" />
                  <Label htmlFor="threat-no">No</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* CASB */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Database className="h-5 w-5 text-primary" />
                Cloud Access Security Broker (CASB)
              </CardTitle>
              <CardDescription>Secure cloud application access</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.casbRequired ? "yes" : "no"}
                onValueChange={(value) => onUpdate({ casbRequired: value === "yes" })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="casb-yes" />
                  <Label htmlFor="casb-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="casb-no" />
                  <Label htmlFor="casb-no">No</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* DLP */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Eye className="h-5 w-5 text-primary" />
                Data Loss Prevention (DLP)
              </CardTitle>
              <CardDescription>Prevent sensitive data from leaving your network</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={formData.dlpRequired ? "yes" : "no"}
                onValueChange={(value) => onUpdate({ dlpRequired: value === "yes" })}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="dlp-yes" />
                  <Label htmlFor="dlp-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="dlp-no" />
                  <Label htmlFor="dlp-no">No</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={onPrev} className="flex items-center gap-2 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={onNext} disabled={!isFormValid()} className="flex items-center gap-2">
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

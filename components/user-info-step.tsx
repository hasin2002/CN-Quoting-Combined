"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, User, Building, Mail, Phone } from "lucide-react"
import type { FormData } from "@/types/quote"

interface UserInfoStepProps {
  formData: FormData
  onUpdate: (updates: Partial<FormData>) => void
  onNext: () => void
  onPrev: () => void
  onSubmitQuote: () => void
  isLoading: boolean
}

export function UserInfoStep({ formData, onUpdate, onNext, onPrev, onSubmitQuote, isLoading }: UserInfoStepProps) {
  const handleInputChange = (field: keyof FormData, value: string) => {
    onUpdate({ [field]: value })
  }

  const isFormValid = () => {
    return (
      formData.firstName?.trim() && formData.lastName?.trim() && formData.email?.trim() && formData.email?.includes("@")
    )
  }

  const handleSubmit = () => {
    if (isFormValid()) {
      onSubmitQuote()
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground">Contact Information</h2>
        <p className="text-muted-foreground mt-2">Please provide your contact details to complete your quote request</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Your Details
          </CardTitle>
          <CardDescription>We'll use this information to send you the quote and follow up if needed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-sm font-medium">
                First Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Enter your first name"
                value={formData.firstName || ""}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                className="border-gray-300"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-sm font-medium">
                Last Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="lastName"
                type="text"
                placeholder="Enter your last name"
                value={formData.lastName || ""}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                className="border-gray-300"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email address"
              value={formData.email || ""}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName" className="text-sm font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              Company Name
            </Label>
            <Input
              id="companyName"
              type="text"
              placeholder="Enter your company name"
              value={formData.companyName || ""}
              onChange={(e) => handleInputChange("companyName", e.target.value)}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mobile" className="text-sm font-medium flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Mobile Number
            </Label>
            <Input
              id="mobile"
              type="tel"
              placeholder="Enter your mobile number"
              value={formData.mobile || ""}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              className="border-gray-300"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrev} className="flex items-center gap-2 bg-transparent">
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={!isFormValid() || isLoading} className="min-w-[120px]">
          {isLoading ? "Generating Quote..." : "Get Quote"}
        </Button>
      </div>
    </div>
  )
}

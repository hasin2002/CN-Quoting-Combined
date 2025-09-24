"use client"

import { useState, useCallback } from "react"
import { toast } from "@/hooks/use-toast"
import type { FormData, FormStep, Address, QuoteResponse } from "@/types/quote"

const initialFormData: FormData = {
  selectedAddress: null,
  serviceType: "",
  preferredIpBackbone: "",
  etherwayBandwidth: "",
  circuitInterface: "",
  etherflowBandwidth: "",
  dualInternetConfig: "",
  circuitTwoBandwidth: "",
  numberOfIpAddresses: "",
  includeSecurityOptions: undefined as any, // Will be properly typed below
  secureIpDelivery: false,
  ztnaRequired: false,
  noOfZtnaUsers: 0,
  threatPreventionRequired: false,
  casbRequired: false,
  dlpRequired: false,
  rbiRequired: false,
  firstName: "",
  lastName: "",
  email: "",
  companyName: "",
  mobile: "",
}

const generateQuoteId = (): string => {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 8)
  return `CN-${timestamp}-${randomPart}`.toUpperCase()
}

export function useQuoteForm() {
  const [currentStep, setCurrentStep] = useState<FormStep>("address")
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [quoteId, setQuoteId] = useState<string | null>(null)

  const updateFormData = useCallback((updates: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }))
  }, [])

  const nextStep = useCallback(() => {
    const stepOrder: FormStep[] = ["address", "service-type", "network-config", "security", "user-info", "quote"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    }
  }, [currentStep])

  const prevStep = useCallback(() => {
    const stepOrder: FormStep[] = ["address", "service-type", "network-config", "security", "user-info", "quote"]
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1])
    }
  }, [currentStep])

  const goToStep = useCallback((step: FormStep) => {
    setCurrentStep(step)
  }, [])

  const fetchAddresses = useCallback(async (postcode: string): Promise<Address[]> => {
    setIsLoading(true)

    try {
      const response = await fetch(
        `/api/addresses?postcode=${encodeURIComponent(postcode)}`,
      )

      if (!response.ok) {
        throw new Error("Failed to fetch addresses")
      }

      const addresses = await response.json()
      return addresses
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Address Lookup Failed",
        description: err instanceof Error ? err.message : "Failed to fetch addresses",
      })
      return []
    } finally {
      setIsLoading(false)
    }
  }, [])

  const submitQuote = useCallback(async (): Promise<void> => {
    console.log("[v0] submitQuote called")
    setIsLoading(true)

    try {
      const requestBody = {
        locationIdentifier: {
          postcode: formData.selectedAddress?.postcode || "",
          ...(formData.selectedAddress?.id && { id: formData.selectedAddress.id }),
        },
        btQuoteParams: {
          serviceType: formData.serviceType,
          circuitInterface: formData.circuitInterface,
          circuitBandwidth: formData.etherwayBandwidth,
          ...(formData.etherflowBandwidth && { circuitBandwidth: formData.etherflowBandwidth }),
          ...(formData.circuitTwoBandwidth && { circuitTwoBandwidth: formData.circuitTwoBandwidth }),
          ...(formData.numberOfIpAddresses && { numberOfIpAddresses: formData.numberOfIpAddresses }),
          ...(formData.preferredIpBackbone && {
            preferredIpBackbone: formData.preferredIpBackbone === "Don't mind" ? "Any" : formData.preferredIpBackbone,
          }),
          ...(formData.dualInternetConfig && { dualInternetConfig: formData.dualInternetConfig }),
        },
        ...(formData.includeSecurityOptions && {
          securityQuoteParams: {
            secureIpDelivery: formData.secureIpDelivery,
            ztnaRequired: formData.ztnaRequired,
            ...(formData.ztnaRequired && { noOfZtnaUsers: formData.noOfZtnaUsers }),
            threatPreventionRequired: formData.threatPreventionRequired,
            casbRequired: formData.casbRequired,
            dlpRequired: formData.dlpRequired,
            rbiRequired: formData.rbiRequired,
          },
        }),
        // Added user information to request body
        userInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          companyName: formData.companyName,
          mobile: formData.mobile,
        },
      }

      console.log("[v0] Making API request with body:", requestBody)

      const response = await fetch("/api/quote-retail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("[v0] API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.log("[v0] API error response:", errorData)

        throw new Error(errorData.error || "Failed to generate quote")
      }

      const quote = await response.json()
      console.log("[v0] Quote received:", quote)

      const newQuoteId = generateQuoteId()
      setQuoteId(newQuoteId)
      console.log("[v0] Generated quote ID:", newQuoteId)

      setQuoteResponse(quote[0]) // API returns array, take first item
      setCurrentStep("quote")
    } catch (err) {
      console.log("[v0] Error caught in submitQuote:", err)
      console.log("[v0] About to call toast with error")

      toast({
        variant: "destructive",
        title: "Quote Generation Failed",
        description:
          err instanceof Error
            ? err.message
            : "We're having trouble generating your quote right now. Please try again in a few moments.",
      })

      console.log("[v0] Toast called")
    } finally {
      setIsLoading(false)
      console.log("[v0] submitQuote finished, isLoading set to false")
    }
  }, [formData])

  return {
    currentStep,
    formData,
    quoteResponse,
    isLoading,
    quoteId,
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    fetchAddresses,
    submitQuote,
  }
}

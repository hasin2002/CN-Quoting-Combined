"use client"

import { ProgressIndicator } from "@/components/progress-indicator"
import { AddressLookup } from "@/components/address-lookup"
import { ServiceTypeStep } from "@/components/service-type-step"
import { NetworkConfigStep } from "@/components/network-config-step"
import { SecurityStep } from "@/components/security-step"
import { QuoteResults } from "@/components/quote-results"
import { OptionsSummary } from "@/components/options-summary"
import { UserInfoStep } from "@/components/user-info-step"
import { useQuoteForm } from "@/hooks/use-quote-form"
import type { FormStep } from "@/types/quote"
import { useState } from "react"

export default function BTEtherPricingPage() {
  const {
    currentStep,
    formData,
    quoteResponse,
    isLoading,
    quoteId, // Use quoteId from the hook instead of local state
    updateFormData,
    nextStep,
    prevStep,
    goToStep,
    fetchAddresses,
    submitQuote,
  } = useQuoteForm()

  const [isAddressReselecting, setIsAddressReselecting] = useState(false)

  const handleAddressSelect = (address: any) => {
    updateFormData({ selectedAddress: address })
  }

  const handleAddressReselectionStart = () => {
    setIsAddressReselecting(true)
  }

  const handleAddressReselectionComplete = () => {
    setIsAddressReselecting(false)
  }

  const handleStartOver = () => {
    // Reset form and go back to first step
    window.location.reload()
  }

  const handleEditQuote = () => {
    goToStep("security")
  }

  const getCompletedSteps = (): FormStep[] => {
    const completed: FormStep[] = []

    console.log("[v0] getCompletedSteps - formData:", JSON.stringify(formData))

    // Step 1: Address must be selected with actual data
    if (formData.selectedAddress?.fullAddress && formData.selectedAddress?.fullAddress.trim() !== "") {
      completed.push("address")
    } else {
      // If address isn't completed, no other steps can be completed
      console.log("[v0] getCompletedSteps - completed steps:", completed)
      return completed
    }

    if (isAddressReselecting) {
      console.log("[v0] getCompletedSteps - address reselection in progress, only address step available")
      return completed
    }

    // Step 2: Service type must be selected (and address must be completed)
    if (formData.serviceType && formData.serviceType.trim() !== "") {
      completed.push("service-type")
    } else {
      // If service type isn't completed, can't proceed to network config or security
      console.log("[v0] getCompletedSteps - completed steps:", completed)
      return completed
    }

    // Step 3: Network configuration must be completed (and previous steps completed)
    const hasNetworkConfig =
      (formData.etherwayBandwidth && formData.etherwayBandwidth.trim() !== "") ||
      (formData.etherflowBandwidth && formData.etherflowBandwidth.trim() !== "") ||
      (formData.preferredIpBackbone && formData.preferredIpBackbone.trim() !== "")

    if (hasNetworkConfig) {
      completed.push("network-config")
    } else {
      // If network config isn't completed, can't proceed to security
      console.log("[v0] getCompletedSteps - completed steps:", completed)
      return completed
    }

    // Step 4: Security step is completed if user has made security choices
    // (either enabled security options or explicitly disabled them by proceeding)
    const hasSecurityConfig =
      formData.includeSecurityOptions === true ||
      (formData.includeSecurityOptions === false &&
        (formData.ztnaRequired !== undefined || formData.threatPreventionRequired !== undefined))

    if (hasSecurityConfig) {
      completed.push("security")
    } else {
      // If security isn't completed, can't proceed to user info
      console.log("[v0] getCompletedSteps - completed steps:", completed)
      return completed
    }

    // Step 5: User info step is completed if required fields are filled
    const hasUserInfo =
      formData.firstName?.trim() && formData.lastName?.trim() && formData.email?.trim() && formData.email?.includes("@")

    if (hasUserInfo) {
      completed.push("user-info")
    }

    console.log("[v0] getCompletedSteps - completed steps:", completed)
    return completed
  }

  const handleStepClick = (step: FormStep) => {
    if (isAddressReselecting) {
      return
    }
    goToStep(step)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="font-heading text-2xl font-bold text-foreground">BT Ether Pricing</h1>
            <p className="text-sm text-muted-foreground mt-1">Get a quote for BT Ethernet services</p>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      {currentStep !== "quote" && (
        <div className="border-b bg-card">
          <div className="container mx-auto py-6">
            <ProgressIndicator
              currentStep={currentStep}
              onStepClick={handleStepClick}
              completedSteps={getCompletedSteps()}
              disabled={isAddressReselecting}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main Form Content */}
          <div className="flex-1 max-w-3xl">
            {currentStep === "address" && (
              <AddressLookup
                onAddressSelect={handleAddressSelect}
                onNext={nextStep}
                fetchAddresses={fetchAddresses}
                isLoading={isLoading}
                selectedAddress={formData.selectedAddress}
                onAddressReselectionStart={handleAddressReselectionStart}
                onAddressReselectionComplete={handleAddressReselectionComplete}
              />
            )}

            {currentStep === "service-type" && (
              <ServiceTypeStep formData={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />
            )}

            {currentStep === "network-config" && (
              <NetworkConfigStep formData={formData} onUpdate={updateFormData} onNext={nextStep} onPrev={prevStep} />
            )}

            {currentStep === "security" && (
              <SecurityStep
                formData={formData}
                onUpdate={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
                onSubmitQuote={submitQuote}
                isLoading={isLoading}
              />
            )}

            {currentStep === "user-info" && (
              <UserInfoStep
                formData={formData}
                onUpdate={updateFormData}
                onNext={nextStep}
                onPrev={prevStep}
                onSubmitQuote={submitQuote}
                isLoading={isLoading}
              />
            )}

            {currentStep === "quote" && quoteResponse && (
              <QuoteResults
                quoteResponse={quoteResponse}
                onStartOver={handleStartOver}
                onEditQuote={handleEditQuote}
                onNavigateToStep={goToStep} // Added navigation callback
                quoteId={quoteId} // Now using the actual quote ID from the hook
              />
            )}
          </div>

          <div className="w-80 hidden lg:block">
            <OptionsSummary formData={formData} currentStep={currentStep} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 Connected Networks. All rights reserved.</p>
            <p className="mt-1">
              Need help? Contact our sales team at{" "}
              <a href="mailto:sales@connected-networks.com" className="text-primary hover:underline">
                sales@connected-networks.com
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

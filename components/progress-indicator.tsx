"use client"

import { cn } from "@/lib/utils"
import type { FormStep } from "@/types/quote"

interface ProgressIndicatorProps {
  currentStep: FormStep
  className?: string
  onStepClick?: (step: FormStep) => void
  completedSteps?: FormStep[]
  disabled?: boolean
}

export function ProgressIndicator({
  currentStep,
  className,
  onStepClick,
  completedSteps = [],
  disabled = false,
}: ProgressIndicatorProps) {
  const steps = [
    { key: "address", label: "Address", number: 1 },
    { key: "service-type", label: "Service Type", number: 2 },
    { key: "network-config", label: "Configuration", number: 3 },
    { key: "security", label: "Security", number: 4 },
    { key: "user-info", label: "Contact Info", number: 5 },
    { key: "quote", label: "Quote", number: 6 },
  ]

  const currentStepIndex = steps.findIndex((step) => step.key === currentStep)

  return (
    <div className={cn("w-full max-w-4xl mx-auto px-4", className)}>
      {onStepClick && completedSteps.length > 0 && !disabled && (
        <div className="text-center mb-4">
          <p className="text-xs text-muted-foreground">← Click on completed steps to edit</p>
        </div>
      )}
      {disabled && (
        <div className="text-center mb-4">
          <p className="text-xs text-amber-600 dark:text-amber-400">
            Navigation disabled - please complete your address selection
          </p>
        </div>
      )}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors relative",
                  index <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  onStepClick && completedSteps.includes(step.key as FormStep) && step.key !== currentStep && !disabled
                    ? "cursor-pointer hover:bg-primary/80 hover:scale-105 transition-transform"
                    : "",
                  disabled && completedSteps.includes(step.key as FormStep) && step.key !== currentStep
                    ? "opacity-50 cursor-not-allowed"
                    : "",
                )}
                onClick={() => {
                  if (
                    onStepClick &&
                    completedSteps.includes(step.key as FormStep) &&
                    step.key !== currentStep &&
                    !disabled
                  ) {
                    onStepClick(step.key as FormStep)
                  }
                }}
              >
                {step.number}
                {onStepClick &&
                  completedSteps.includes(step.key as FormStep) &&
                  step.key !== currentStep &&
                  !disabled && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center",
                  index <= currentStepIndex ? "text-primary" : "text-muted-foreground",
                  onStepClick && completedSteps.includes(step.key as FormStep) && step.key !== currentStep && !disabled
                    ? "cursor-pointer hover:text-primary/80"
                    : "",
                  disabled && completedSteps.includes(step.key as FormStep) && step.key !== currentStep
                    ? "opacity-50 cursor-not-allowed"
                    : "",
                )}
                onClick={() => {
                  if (
                    onStepClick &&
                    completedSteps.includes(step.key as FormStep) &&
                    step.key !== currentStep &&
                    !disabled
                  ) {
                    onStepClick(step.key as FormStep)
                  }
                }}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 mx-4 transition-colors",
                  index < currentStepIndex ? "bg-primary" : "bg-muted",
                )}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

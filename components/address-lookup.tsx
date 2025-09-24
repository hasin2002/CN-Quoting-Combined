"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, MapPin } from "lucide-react"
import type { Address } from "@/types/quote"

interface AddressLookupProps {
  onAddressSelect: (address: Address) => void
  onNext: () => void
  fetchAddresses: (postcode: string) => Promise<Address[]>
  isLoading: boolean
  selectedAddress: Address | null
  onAddressReselectionStart?: () => void
  onAddressReselectionComplete?: () => void
}

export function AddressLookup({
  onAddressSelect,
  onNext,
  fetchAddresses,
  isLoading,
  selectedAddress,
  onAddressReselectionStart,
  onAddressReselectionComplete,
}: AddressLookupProps) {
  const [postcode, setPostcode] = useState("")
  const [addresses, setAddresses] = useState<Address[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [isReselecting, setIsReselecting] = useState(false)

  const handleSearch = async () => {
    if (!postcode.trim()) return

    const wasAddressSelected = selectedAddress && selectedAddress.id
    if (wasAddressSelected) {
      setIsReselecting(true)
      onAddressReselectionStart?.()
    }

    onAddressSelect({ fullAddress: "", postcode: "" })

    setHasSearched(true)
    const results = await fetchAddresses(postcode.trim())

    const sortedResults = results.sort((a, b) => {
      // Natural sort function that handles mixed alphanumeric strings
      const naturalSort = (str1: string, str2: string) => {
        // Split strings into chunks of numbers and letters
        const chunk = (str: string) => {
          const chunks = []
          let i = 0
          while (i < str.length) {
            let chunk = ""
            const isDigit = /\d/.test(str[i])

            // Collect consecutive digits or consecutive non-digits
            while (i < str.length && /\d/.test(str[i]) === isDigit) {
              chunk += str[i]
              i++
            }

            chunks.push(isDigit ? Number.parseInt(chunk, 10) : chunk)
          }
          return chunks
        }

        const chunksA = chunk(str1)
        const chunksB = chunk(str2)
        const maxLength = Math.max(chunksA.length, chunksB.length)

        for (let i = 0; i < maxLength; i++) {
          const chunkA = chunksA[i] || ""
          const chunkB = chunksB[i] || ""

          if (chunkA !== chunkB) {
            // If both are numbers, compare numerically
            if (typeof chunkA === "number" && typeof chunkB === "number") {
              return chunkA - chunkB
            }
            // If both are strings, compare lexicographically
            if (typeof chunkA === "string" && typeof chunkB === "string") {
              return chunkA.localeCompare(chunkB)
            }
            // Numbers come before strings
            return typeof chunkA === "number" ? -1 : 1
          }
        }
        return 0
      }

      return naturalSort(a.fullAddress, b.fullAddress)
    })

    setAddresses(sortedResults)
  }

  const handleAddressSelect = (fullAddress: string) => {
    const address = addresses.find((addr) => addr.fullAddress === fullAddress)
    if (address) {
      onAddressSelect(address)
      if (isReselecting) {
        setIsReselecting(false)
        onAddressReselectionComplete?.()
      }
    }
  }

  const showPreviousSelection = selectedAddress && selectedAddress.id && !hasSearched

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-heading text-3xl font-bold text-foreground">Find Your Location</h1>
        <p className="text-muted-foreground">Enter your postcode to find available network services at your location</p>
      </div>

      {showPreviousSelection && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              Currently Selected Address
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{selectedAddress.fullAddress}</p>
            <p className="text-sm text-muted-foreground mt-1">Search for a new postcode below to change your address</p>
          </CardContent>
        </Card>
      )}

      {isReselecting && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950">
          <CardContent className="pt-6">
            <p className="text-sm text-amber-800 dark:text-amber-200">
              ⚠️ You're changing your address. Please select a new address from the list below to continue. Navigation to
              other steps is disabled until you complete your address selection.
            </p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            Address Lookup
          </CardTitle>
          <CardDescription>We'll search for your address to provide accurate pricing and availability</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode</Label>
            <div className="flex gap-2">
              <Input
                id="postcode"
                placeholder="e.g. SW1A 1AA"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={!postcode.trim() || isLoading} className="px-6">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  "Search"
                )}
              </Button>
            </div>
          </div>

          {hasSearched && addresses.length === 0 && !isLoading && (
            <div className="p-3 rounded-md bg-muted">
              <p className="text-sm text-muted-foreground">
                No addresses found for this postcode. Please check and try again.
              </p>
            </div>
          )}

          {addresses.length > 0 && (
            <div className="space-y-3">
              <Label>Select your address:</Label>
              <Select value={selectedAddress?.fullAddress || ""} onValueChange={handleAddressSelect}>
                <SelectTrigger className="border-gray-300/50">
                  <SelectValue placeholder="Choose an address from the list..." />
                </SelectTrigger>
                <SelectContent>
                  {addresses.map((address, index) => (
                    <SelectItem key={index} value={address.fullAddress}>
                      {address.fullAddress}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      {addresses.length > 0 && (
        <div className="flex justify-end">
          <Button
            onClick={onNext}
            size="lg"
            className="px-8"
            disabled={!selectedAddress || isReselecting}
            variant={selectedAddress && !isReselecting ? "default" : "secondary"}
          >
            Continue to Service Configuration
          </Button>
        </div>
      )}
    </div>
  )
}

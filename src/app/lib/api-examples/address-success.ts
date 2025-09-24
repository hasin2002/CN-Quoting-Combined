import { z } from "zod";
import { cleanedAddressSchema } from "../schemas/addresses/cleaned-address";

export const addressResponseExample: z.infer<typeof cleanedAddressSchema>[] = [
  {
    id: "A00018816538/TH",
    postcode: "GU21 6DE",
    fullAddress: "1, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816578/TH",
    postcode: "GU21 6DE",
    fullAddress: "10, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00029938560/TH",
    postcode: "GU21 6DE",
    fullAddress: "11, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816515/TH",
    postcode: "GU21 6DE",
    fullAddress: "12, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816546/TH",
    postcode: "GU21 6DE",
    fullAddress: "13, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816562/TH",
    postcode: "GU21 6DE",
    fullAddress: "14, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00029938554/TH",
    postcode: "GU21 6DE",
    fullAddress: "15, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816714/TH",
    postcode: "GU21 6DE",
    fullAddress: "16, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816602/TH",
    postcode: "GU21 6DE",
    fullAddress: "17, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816722/TH",
    postcode: "GU21 6DE",
    fullAddress: "18, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816523/TH",
    postcode: "GU21 6DE",
    fullAddress: "6, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816531/TH",
    postcode: "GU21 6DE",
    fullAddress: "7, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816626/TH",
    postcode: "GU21 6DE",
    fullAddress: "8, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    id: "A00018816570/TH",
    postcode: "GU21 6DE",
    fullAddress: "9, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    postcode: "GU21 6DE",
    fullAddress:
      "Towpath Between Lockfield And, Basingstoke Canal, GU21 6DE, Woking",
  },
  {
    postcode: "GU21 6DE",
    fullAddress:
      "Land 9 To 19 Church Street Wes, Church Street West, GU21 6DE, Woking",
  },
  {
    postcode: "GU21 6DE",
    fullAddress: "Land Rear Of 1 To 16, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    postcode: "GU21 6DE",
    fullAddress: "Millennium Court, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    postcode: "GU21 6DE",
    fullAddress: "Millennium Place, Vale Farm Road, GU21 6DE, Woking",
  },
  {
    postcode: "GU21 6DE",
    fullAddress: "Play Area, Vale Farm Road, GU21 6DE, Woking",
  },
];

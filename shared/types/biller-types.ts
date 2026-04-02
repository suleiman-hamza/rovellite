export interface Biller {
  id: number
  name: string
  slug: string
  groupId: number
  skipValidation: boolean
  handleWithProductCode: boolean
  isRestricted: boolean
  hideInstitution: boolean
  sendSms: boolean
  images?: string
}

export interface Response {
  error: boolean
  status: string
  message: string
  responseCode: string
  responseData: Biller[]
}

export interface Package {
  id: number
  name: string
  slug: string
  amount: number | null
  billerId: number
  hasPending: boolean
  sequenceNumber: number
}

export interface PackagesResponse {
  error: boolean
  status: string
  message: string
  responseCode: string
  responseData: Package[]
}

export interface CustomerAccountDetails {
  error: boolean
  status: string
  message: string
  responseCode: string
  responseData: {
    billerName: string
    customer: {
      firstName: string
      lastName: string
      customerName: string
      accountNumber: string
      customerType: string
      arrearsBalance: number
      address: string
      phoneNumber: string
      emailAddress: string
    }
    paid: boolean
    statusCode: string
    minPayableAmount: number
  }
}

export interface AirtimePackage {
  id: number
  name: string
  slug: string
  amount: number | null
  billerId: number
  hasPending: boolean
  sequenceNumber: number
}

export interface AirtimeResponse {
  error: boolean
  status: string
  message: string
  responseCode: string
  responseData: AirtimePackage[]
}

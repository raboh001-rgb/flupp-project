import { config, apiEndpoints } from './config'

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public statusText: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiRequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  headers?: Record<string, string>
  body?: any
  signal?: AbortSignal
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, signal } = options
  
  const url = `${config.api.baseUrl}${endpoint}`
  
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
    signal,
  }

  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body)
  }

  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), config.api.timeout)
    
    const response = await fetch(url, {
      ...requestOptions,
      signal: signal || controller.signal,
    })
    
    clearTimeout(timeoutId)

    if (!response.ok) {
      throw new ApiError(
        `API request failed: ${response.statusText}`,
        response.status,
        response.statusText
      )
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408, 'Request Timeout')
    }
    
    throw new ApiError(
      error instanceof Error ? error.message : 'Unknown error',
      500,
      'Internal Server Error'
    )
  }
}

// Booking API functions
export const bookingApi = {
  create: (bookingData: any) =>
    apiRequest(apiEndpoints.bookingsCreate, {
      method: 'POST',
      body: bookingData,
    }),
  
  update: (id: string, bookingData: any) =>
    apiRequest(`${apiEndpoints.bookingsUpdate}/${id}`, {
      method: 'PUT',
      body: bookingData,
    }),
  
  cancel: (id: string) =>
    apiRequest(`${apiEndpoints.bookingsCancel}/${id}`, {
      method: 'POST',
    }),
  
  getById: (id: string) =>
    apiRequest(`${apiEndpoints.bookings}/${id}`),
  
  getAll: (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : ''
    return apiRequest(`${apiEndpoints.bookings}${queryParams}`)
  },
}

// Payment API functions
export const paymentApi = {
  createIntent: (amount: number, bookingId: string) =>
    apiRequest(apiEndpoints.paymentsCreateIntent, {
      method: 'POST',
      body: { amount, bookingId },
    }),
  
  confirm: (paymentIntentId: string) =>
    apiRequest(apiEndpoints.paymentsConfirm, {
      method: 'POST',
      body: { paymentIntentId },
    }),
}

// Provider API functions
export const providerApi = {
  search: (filters: any) =>
    apiRequest(`${apiEndpoints.providersSearch}?${new URLSearchParams(filters)}`),
  
  getProfile: (id: string) =>
    apiRequest(`${apiEndpoints.providersProfile}/${id}`),
  
  getAll: () =>
    apiRequest(apiEndpoints.providers),
}

// Veterinary API functions
export const veterinaryApi = {
  search: (filters: any) => {
    const queryParams = new URLSearchParams(filters)
    return apiRequest(`${apiEndpoints.veterinarySearch}?${queryParams}`)
  },
  
  getAll: () =>
    apiRequest(apiEndpoints.veterinary),
  
  getById: (id: string) =>
    apiRequest(`${apiEndpoints.veterinary}/${id}`),
}

// Marketplace API functions
export const marketplaceApi = {
  getListings: (filters?: any) => {
    const queryParams = filters ? `?${new URLSearchParams(filters)}` : ''
    return apiRequest(`${apiEndpoints.marketplaceListings}${queryParams}`)
  },
  
  createListing: (listingData: any) =>
    apiRequest(apiEndpoints.marketplaceCreate, {
      method: 'POST',
      body: listingData,
    }),
  
  purchase: (listingId: string, purchaseData: any) =>
    apiRequest(`${apiEndpoints.marketplacePurchase}/${listingId}`, {
      method: 'POST',
      body: purchaseData,
    }),
}

// Review API functions
export const reviewApi = {
  create: (reviewData: any) =>
    apiRequest(apiEndpoints.reviewsCreate, {
      method: 'POST',
      body: reviewData,
    }),
  
  getForProvider: (providerId: string) =>
    apiRequest(`${apiEndpoints.reviews}/provider/${providerId}`),
  
  getForUser: (userId: string) =>
    apiRequest(`${apiEndpoints.reviews}/user/${userId}`),
}

// User API functions  
export const userApi = {
  getProfile: () =>
    apiRequest(apiEndpoints.usersProfile),
  
  updateProfile: (profileData: any) =>
    apiRequest(apiEndpoints.usersProfile, {
      method: 'PUT',
      body: profileData,
    }),
  
  getBookings: () =>
    apiRequest(apiEndpoints.usersBookings),
}
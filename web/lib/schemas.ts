import { z } from 'zod'

// Base schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')

export const phoneSchema = z
  .string()
  .regex(
    /^(?:(?:\+44)|(?:0))(?:\d{10}|\d{11})$/,
    'Please enter a valid UK phone number'
  )
  .transform((phone) => phone.replace(/\s+/g, ''))

export const postcodeSchema = z
  .string()
  .regex(
    /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i,
    'Please enter a valid UK postcode'
  )
  .transform((postcode) => postcode.toUpperCase().replace(/\s+/g, ''))

// User schemas
export const userRegistrationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')  
    .max(50, 'Last name must be less than 50 characters'),
  email: emailSchema,
  phone: phoneSchema,
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    ),
  confirmPassword: z.string(),
  acceptTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const userLoginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const userProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  email: emailSchema,
  phone: phoneSchema.optional(),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    postcode: postcodeSchema,
    country: z.string().default('United Kingdom'),
  }).optional(),
  preferences: z.object({
    notifications: z.boolean().default(true),
    emailMarketing: z.boolean().default(false),
    smsNotifications: z.boolean().default(true),
  }).optional(),
})

// Pet schemas
export const petSchema = z.object({
  name: z
    .string()
    .min(1, 'Pet name is required')
    .max(30, 'Pet name must be less than 30 characters'),
  species: z.enum(['dog', 'cat', 'rabbit', 'bird', 'other'], {
    required_error: 'Please select a pet species',
  }),
  breed: z.string().max(50, 'Breed must be less than 50 characters').optional(),
  age: z
    .number()
    .min(0, 'Age cannot be negative')
    .max(50, 'Please enter a valid age'),
  weight: z
    .number()
    .min(0.1, 'Weight must be greater than 0')
    .max(200, 'Please enter a valid weight'),
  weightUnit: z.enum(['kg', 'lbs']).default('kg'),
  gender: z.enum(['male', 'female', 'unknown']).optional(),
  neutered: z.boolean().optional(),
  microchipped: z.boolean().optional(),
  vaccinated: z.boolean().optional(),
  specialNeeds: z.string().max(500, 'Special needs must be less than 500 characters').optional(),
  notes: z.string().max(1000, 'Notes must be less than 1000 characters').optional(),
})

// Booking schemas
export const bookingSchema = z.object({
  serviceType: z.enum(['boarding', 'grooming', 'daycare', 'training'], {
    required_error: 'Please select a service type',
  }),
  providerId: z.string().min(1, 'Provider is required'),
  petId: z.string().min(1, 'Pet is required'),
  startDate: z.date({
    required_error: 'Start date is required',
  }),
  endDate: z.date({
    required_error: 'End date is required', 
  }),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
  specialRequests: z.string().max(500, 'Special requests must be less than 500 characters').optional(),
  emergencyContact: z.object({
    name: z.string().min(1, 'Emergency contact name is required'),
    phone: phoneSchema,
    relationship: z.string().min(1, 'Relationship is required'),
  }),
}).refine((data) => data.endDate >= data.startDate, {
  message: 'End date must be after start date',
  path: ['endDate'],
})

// Provider schemas  
export const providerRegistrationSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must be less than 100 characters'),
  ownerFirstName: z
    .string()
    .min(1, 'First name is required')
    .max(50, 'First name must be less than 50 characters'),
  ownerLastName: z
    .string()
    .min(1, 'Last name is required')
    .max(50, 'Last name must be less than 50 characters'),
  email: emailSchema,
  phone: phoneSchema,
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    postcode: postcodeSchema,
    country: z.string().default('United Kingdom'),
  }),
  services: z
    .array(z.enum(['boarding', 'grooming', 'daycare', 'training', 'walking', 'sitting']))
    .min(1, 'Please select at least one service'),
  description: z
    .string()
    .min(50, 'Description must be at least 50 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  pricing: z.record(
    z.string(),
    z.object({
      price: z.number().min(0, 'Price cannot be negative'),
      unit: z.enum(['hour', 'day', 'night', 'service']),
    })
  ),
  availability: z.object({
    weekdays: z.array(z.number().min(0).max(6)),
    startTime: z.string(),
    endTime: z.string(),
  }),
  insurance: z.boolean().refine(val => val === true, {
    message: 'Insurance is required to register as a provider'
  }),
  dbs: z.boolean().refine(val => val === true, {
    message: 'DBS check is required to register as a provider'
  }),
})

// Marketplace schemas
export const marketplaceListingSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(80, 'Title must be less than 80 characters'),
  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  category: z.enum([
    'food', 'toys', 'accessories', 'beds', 'carriers', 
    'grooming', 'health', 'training', 'other'
  ], {
    required_error: 'Please select a category',
  }),
  condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor'], {
    required_error: 'Please select item condition',
  }),
  price: z
    .number()
    .min(0.50, 'Minimum price is £0.50')
    .max(10000, 'Maximum price is £10,000'),
  images: z
    .array(z.string().url('Invalid image URL'))
    .min(1, 'At least one image is required')
    .max(8, 'Maximum 8 images allowed'),
  location: z.object({
    city: z.string().min(1, 'City is required'),
    postcode: postcodeSchema,
  }),
  deliveryOptions: z.object({
    collection: z.boolean().default(true),
    localDelivery: z.boolean().default(false),
    postage: z.boolean().default(false),
    deliveryFee: z.number().min(0).optional(),
  }),
})

// Review schemas
export const reviewSchema = z.object({
  providerId: z.string().min(1, 'Provider ID is required'),
  bookingId: z.string().min(1, 'Booking ID is required'),
  rating: z
    .number()
    .min(1, 'Rating must be at least 1 star')
    .max(5, 'Rating cannot exceed 5 stars'),
  title: z
    .string()
    .min(1, 'Review title is required')
    .max(100, 'Title must be less than 100 characters'),
  comment: z
    .string()
    .min(10, 'Comment must be at least 10 characters')
    .max(500, 'Comment must be less than 500 characters'),
  wouldRecommend: z.boolean(),
})

// Search schemas
export const providerSearchSchema = z.object({
  serviceType: z.enum(['boarding', 'grooming', 'daycare', 'training']).optional(),
  location: z.string().optional(),
  radius: z.number().min(1).max(50).default(10),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  petType: z.enum(['dog', 'cat', 'rabbit', 'bird', 'other']).optional(),
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  rating: z.number().min(1).max(5).optional(),
  sortBy: z.enum(['distance', 'price', 'rating', 'availability']).default('distance'),
})

export const veterinarySearchSchema = z.object({
  location: z.string().optional(),
  radius: z.number().min(1).max(50).default(10),
  specialty: z.string().optional(),
  emergencyServices: z.boolean().optional(),
  sortBy: z.enum(['distance', 'rating', 'name']).default('distance'),
})

export const marketplaceSearchSchema = z.object({
  query: z.string().optional(),
  category: z.enum([
    'food', 'toys', 'accessories', 'beds', 'carriers',
    'grooming', 'health', 'training', 'other'
  ]).optional(),
  condition: z.enum(['new', 'like-new', 'good', 'fair', 'poor']).optional(),
  priceRange: z.object({
    min: z.number().min(0).optional(),
    max: z.number().min(0).optional(),
  }).optional(),
  location: z.string().optional(),
  radius: z.number().min(1).max(100).default(25),
  sortBy: z.enum(['newest', 'price-low', 'price-high', 'distance']).default('newest'),
})

// Type exports for TypeScript
export type UserRegistration = z.infer<typeof userRegistrationSchema>
export type UserLogin = z.infer<typeof userLoginSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
export type Pet = z.infer<typeof petSchema>
export type Booking = z.infer<typeof bookingSchema>
export type ProviderRegistration = z.infer<typeof providerRegistrationSchema>
export type MarketplaceListing = z.infer<typeof marketplaceListingSchema>
export type Review = z.infer<typeof reviewSchema>
export type ProviderSearch = z.infer<typeof providerSearchSchema>
export type VeterinarySearch = z.infer<typeof veterinarySearchSchema>
export type MarketplaceSearch = z.infer<typeof marketplaceSearchSchema>
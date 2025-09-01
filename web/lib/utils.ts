import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(
  amount: number,
  currency: string = 'GBP',
  locale: string = 'en-GB'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount / 100) // Assuming amount is in pence
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string {
  return new Intl.DateTimeFormat('en-GB', options).format(
    typeof date === 'string' ? new Date(date) : date
  )
}

export function formatTime(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
  }
): string {
  return new Intl.DateTimeFormat('en-GB', options).format(
    typeof date === 'string' ? new Date(date) : date
  )
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return `${formatDate(dateObj)} at ${formatTime(dateObj)}`
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
    .trim()
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
}

export function truncate(text: string, length: number = 100): string {
  if (text.length <= length) return text
  return text.substring(0, length).trim() + '...'
}

export function getServiceIcon(serviceType: string): string {
  const icons: Record<string, string> = {
    boarding: '🏠',
    grooming: '✂️',
    daycare: '🏃',
    training: '🎓',
    veterinary: '🩺',
    marketplace: '🛍️',
    walking: '🐕‍🦺',
    sitting: '🏡',
    feeding: '🍽️',
    bathing: '🛁',
    nail_trimming: '✂️',
    teeth_cleaning: '🦷',
    puppy_training: '🐶',
    obedience: '👥',
    agility: '🏃‍♀️',
  }
  return icons[serviceType.toLowerCase()] || '🐾'
}

export function getServiceColor(serviceType: string): string {
  const colors: Record<string, string> = {
    boarding: 'warm',
    grooming: 'cool', 
    daycare: 'purple',
    training: 'purple',
    veterinary: 'flupp',
    marketplace: 'purple',
  }
  return colors[serviceType.toLowerCase()] || 'flupp'
}

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c // Distance in miles
  return Math.round(d * 10) / 10 // Round to 1 decimal place
}

export function formatDistance(distance: number, unit: string = 'miles'): string {
  if (distance < 0.1) {
    return '< 0.1 miles'
  }
  return `${distance} ${unit}`
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180)
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: string): boolean {
  // UK phone number regex
  const phoneRegex = /^(?:(?:\+44)|(?:0))(?:\d{10}|\d{11})$/
  return phoneRegex.test(phone.replace(/\s+/g, ''))
}

export function isValidPostcode(postcode: string): boolean {
  // UK postcode regex
  const postcodeRegex = /^[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}$/i
  return postcodeRegex.test(postcode)
}

export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    // Format: 07XXX XXX XXX
    return cleaned.replace(/(\d{5})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  if (cleaned.length === 12 && cleaned.startsWith('44')) {
    // Format: +44 7XXX XXX XXX
    return '+' + cleaned.replace(/(\d{2})(\d{4})(\d{3})(\d{3})/, '$1 $2 $3 $4')
  }
  
  return phone
}

export function formatPostcode(postcode: string): string {
  const cleaned = postcode.replace(/\s+/g, '').toUpperCase()
  
  if (cleaned.length >= 5) {
    const incode = cleaned.slice(-3)
    const outcode = cleaned.slice(0, -3)
    return `${outcode} ${incode}`
  }
  
  return postcode.toUpperCase()
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'An unexpected error occurred'
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}
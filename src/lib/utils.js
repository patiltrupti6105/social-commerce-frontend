import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function formatRelativeTime(date) {
  if (!date) return ''
  // Handle array format [year, month, day, hour, min, sec] that older
  // Spring Boot versions emit when write-dates-as-timestamps is not set.
  // With the fix in application.properties this should never happen, but
  // keeping it here as a safety net for any cached data.
  let d
  if (Array.isArray(date)) {
    // Month in JS Date is 0-indexed; Java LocalDateTime month is 1-indexed
    d = new Date(date[0], date[1] - 1, date[2], date[3] || 0, date[4] || 0, date[5] || 0)
  } else {
    d = new Date(date)
  }
  if (isNaN(d.getTime())) return ''

  const now = new Date()
  const diffInSeconds = Math.floor((now - d) / 1000)

  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`

  return formatDate(d)
}

export function truncate(str, length = 100) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

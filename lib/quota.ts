import { cookies } from "next/headers"

export interface QuotaData {
  count: number
  resetAt: number
}

const QUOTA_LIMIT = 10
const QUOTA_WINDOW_MS = 24 * 60 * 60 * 1000 // 24 hours
const COOKIE_NAME = "dg_free_uses"

/**
 * Get current quota status from cookie
 */
export async function getQuotaStatus(): Promise<QuotaData> {
  const cookieStore = await cookies()
  const quotaCookie = cookieStore.get(COOKIE_NAME)

  if (!quotaCookie?.value) {
    // First time user - initialize quota
    const now = Date.now()
    return {
      count: 0,
      resetAt: now + QUOTA_WINDOW_MS,
    }
  }

  try {
    const data: QuotaData = JSON.parse(quotaCookie.value)
    const now = Date.now()

    // Check if quota window has expired
    if (now > data.resetAt) {
      return {
        count: 0,
        resetAt: now + QUOTA_WINDOW_MS,
      }
    }

    return data
  } catch {
    // Invalid cookie data - reset
    const now = Date.now()
    return {
      count: 0,
      resetAt: now + QUOTA_WINDOW_MS,
    }
  }
}

/**
 * Check if user has exceeded quota
 */
export async function isQuotaExceeded(): Promise<boolean> {
  const quota = await getQuotaStatus()
  return quota.count >= QUOTA_LIMIT
}

/**
 * Increment quota count and return updated data
 */
export async function incrementQuota(): Promise<QuotaData> {
  const quota = await getQuotaStatus()
  const updatedQuota = {
    ...quota,
    count: quota.count + 1,
  }

  return updatedQuota
}

/**
 * Set quota cookie with updated data
 */
export function setQuotaCookie(data: QuotaData): string {
  const cookieValue = JSON.stringify(data)
  const expires = new Date(data.resetAt)

  return `${COOKIE_NAME}=${cookieValue}; Path=/; HttpOnly; SameSite=Strict; Expires=${expires.toUTCString()}`
}

/**
 * Get quota limit and remaining uses
 */
export function getQuotaLimits() {
  return {
    limit: QUOTA_LIMIT,
    windowMs: QUOTA_WINDOW_MS,
  }
}

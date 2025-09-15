import { cookies } from "next/headers"

export interface QuotaData {
  count: number
  resetAt: number
}

export async function getQuotaStatus(): Promise<QuotaData> {
  const cookieStore = await cookies()
  const quotaCookie = cookieStore.get("dg_free_uses")

  if (!quotaCookie) {
    return { count: 0, resetAt: Date.now() + 24 * 60 * 60 * 1000 }
  }

  try {
    const data: QuotaData = JSON.parse(quotaCookie.value)

    // Reset if past reset time
    if (Date.now() > data.resetAt) {
      return { count: 0, resetAt: Date.now() + 24 * 60 * 60 * 1000 }
    }

    return data
  } catch {
    return { count: 0, resetAt: Date.now() + 24 * 60 * 60 * 1000 }
  }
}

export function createQuotaCookie(data: QuotaData): string {
  return JSON.stringify(data)
}

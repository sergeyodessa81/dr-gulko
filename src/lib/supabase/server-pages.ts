import { createServerClient } from "@supabase/ssr"
import type { NextApiRequest, NextApiResponse } from "next"
import { getCookie, setCookie, deleteCookie } from "cookies-next"

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Используй это в API-роутах (/pages/api/*)
 */
export function createServerClientApi(req: NextApiRequest, res: NextApiResponse) {
  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        const v = getCookie(name, { req, res })
        return typeof v === "string" ? v : undefined
      },
      set(name: string, value: string, options: { path?: string; maxAge?: number; domain?: string; secure?: boolean; sameSite?: "lax"|"strict"|"none" }) {
        setCookie(name, value, { req, res, httpOnly: true, path: "/", sameSite: "lax", ...options })
      },
      remove(name: string, options?: { path?: string; domain?: string }) {
        deleteCookie(name, { req, res, path: "/", ...options })
      },
    },
  })
}

/**
 * Используй это в getServerSideProps
 */
export function createServerClientGSSP(ctx: { req: NextApiRequest, res: NextApiResponse }) {
  return createServerClientApi(ctx.req, ctx.res)
}

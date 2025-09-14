// /middleware.ts  (ROOT)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_req: NextRequest) {
  // ничего не делаем — пропускаем все запросы
  return NextResponse.next()
}

// опционально: исключим статические файлы
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

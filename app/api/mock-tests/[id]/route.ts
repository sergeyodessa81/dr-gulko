import { NextResponse } from 'next/server';
import type { MockTest } from '@/types/mock-tests';
import test001 from '@/data/mock-tests/001.json';

export const runtime = 'edge';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (params.id !== '001') {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  const body = test001 as unknown as MockTest;
  return new NextResponse(JSON.stringify(body), {
    status: 200,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'public, max-age=60',
    },
  });
}

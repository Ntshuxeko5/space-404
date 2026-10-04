import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { mp } = body;
  if (!mp) return NextResponse.json({ error: 'Missing mp' }, { status: 400 });

  try {
    const order = await prisma.order.findFirst({
      where: { payfastMp: mp },
      include: { items: true },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json({
      ok: true,
      order,
      provider: 'payfast',
    });
  } catch (err: any) {
    console.error('PayFast verify error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { reference, mp, provider } = body;

  if (provider === 'payfast' || mp) {
    if (!mp) return NextResponse.json({ error: 'Missing mp' }, { status: 400 });
    try {
      const order = await prisma.order.findFirst({
        where: { payfastMp: mp },
        include: { items: true },
      });
      if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      return NextResponse.json({ ok: true, order, provider: 'payfast' });
    } catch (err: any) {
      console.error('PayFast verify error', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }

  if (!reference) return NextResponse.json({ error: 'Missing reference' }, { status: 400 });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: 'Paystack key not configured' }, { status: 500 });

  try {
    const res = await fetch(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = await res.json();
    if (!data || !data.status) return NextResponse.json({ error: 'Verify failed', detail: data }, { status: 500 });

    const orderId = data.data?.metadata?.orderId;
    if (!orderId) return NextResponse.json({ error: 'Order metadata missing' }, { status: 400 });

    const paid = data.data.status === 'success';
    await prisma.order.update({ where: { id: orderId }, data: { paid, paidAt: paid ? new Date() : null, paystackResponse: data } });

    const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
    return NextResponse.json({ ok: true, order, raw: data, provider: 'paystack' });
  } catch (err: any) {
    console.error('Paystack verify error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

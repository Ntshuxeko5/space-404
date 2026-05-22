import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function POST(request: Request) {
  const body = await request.json();
  const { orderId, email, amount } = body;
  if (!orderId || !email || !amount) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) return NextResponse.json({ error: 'Paystack key not configured' }, { status: 500 });

  // verify order exists and matches email/amount
  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  // allow email match with customerEmail when order has no user
  if (order.userId == null) {
    if (!order.customerEmail || order.customerEmail !== email) {
      return NextResponse.json({ error: 'Email does not match order' }, { status: 401 });
    }
  }

  // ensure amount matches server-side total
  if (Math.abs(order.total - amount) > 0.01) {
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
  }

  // Initialize Paystack transaction
  const res = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${secret}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: Math.round(amount * 100), email, metadata: { orderId } }),
  });
  const data = await res.json();
  if (!data || !data.status) return NextResponse.json({ error: 'Paystack init failed', detail: data }, { status: 500 });

  // save reference on order
  await prisma.order.update({ where: { id: orderId }, data: { paystackRef: data.data.reference } });

  return NextResponse.json({ authorization_url: data.data.authorization_url, reference: data.data.reference });
}

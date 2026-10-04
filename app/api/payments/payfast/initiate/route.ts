import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import crypto from 'crypto';

function generatePayfastSignature(data: Record<string, string>, passphrase?: string): string {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  let queryString = entries.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`).join('&');
  if (passphrase) {
    queryString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`;
  }
  return crypto.createHash('md5').update(queryString).digest('hex');
}

export async function POST(request: Request) {
  const body = await request.json();
  const { orderId, email, amount } = body;
  if (!orderId || !email || !amount) return NextResponse.json({ error: 'Missing params' }, { status: 400 });

  const merchantId = process.env.PAYFAST_MERCHANT_ID;
  const merchantKey = process.env.PAYFAST_MERCHANT_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const passphrase = process.env.PAYFAST_PASSPHRASE;
  const sandbox = process.env.PAYFAST_SANDBOX !== 'false';

  if (!merchantId || !merchantKey) return NextResponse.json({ error: 'PayFast not configured' }, { status: 500 });

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

  if (order.userId == null) {
    if (!order.customerEmail || order.customerEmail !== email) {
      return NextResponse.json({ error: 'Email does not match order' }, { status: 401 });
    }
  }

  if (Math.abs(order.total - amount) > 0.01) {
    return NextResponse.json({ error: 'Amount mismatch' }, { status: 400 });
  }

  const payfastMp = `order-${orderId}-${Date.now()}`;
  const url = sandbox ? 'https://sandbox.payfast.co.za/eng/process' : 'https://www.payfast.co.za/eng/process';

  const payload: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${baseUrl}/payments/return?provider=payfast&mp=${encodeURIComponent(payfastMp)}`,
    cancel_url: `${baseUrl}/cart`,
    notify_url: `${baseUrl}/api/payments/payfast/notify`,
    name_first: 'Customer',
    name_last: '',
    email_address: email,
    m_payment_id: payfastMp,
    amount: amount.toFixed(2),
    item_name: `SPACE 404 Order ${orderId.slice(0, 8)}`,
    item_description: `Payment for SPACE 404 exclusive streetwear order #${orderId.slice(0, 8)}`,
    custom_int1: orderId,
    custom_str1: 'space404',
  };

  const signature = generatePayfastSignature(payload, passphrase);
  payload['signature'] = signature;

  await prisma.order.update({
    where: { id: orderId },
    data: { paymentProvider: 'payfast', payfastMp },
  });

  return NextResponse.json({
    redirect_url: `${url}?${Object.entries(payload).map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`).join('&')}`,
    mp: payfastMp,
    sandbox,
  });
}

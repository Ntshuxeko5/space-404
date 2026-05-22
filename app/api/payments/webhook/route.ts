import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import crypto from 'crypto';

// Single, consolidated webhook handler for Paystack events.
export async function POST(request: Request) {
  try {
    const secret = process.env.PAYSTACK_SECRET_KEY || '';
    const signature = request.headers.get('x-paystack-signature') || '';
    const bodyText = await request.text();

    if (secret) {
      const hash = crypto.createHmac('sha512', secret).update(bodyText).digest('hex');
      if (hash !== signature) {
        console.warn('Invalid paystack signature');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(bodyText);
    const event = payload.event || payload.eventType || payload.type;
    const data = payload.data || payload.transaction || payload;

    // handle charge.success / transaction.success events
    if (event === 'charge.success' || event === 'transaction.success' || data.status === 'success') {
      const reference = data.reference || data.charge?.reference;
      if (reference) {
        // find order with this reference
        const order = await prisma.order.findFirst({ where: { paystackRef: reference } });
        if (order && !order.paid) {
          await prisma.order.update({ where: { id: order.id }, data: { paid: true, paidAt: new Date(), paystackResponse: data } });
          console.log('Order marked paid:', order.id);
        }
      }

      // fallback: try to use metadata.orderId if present
      const orderId = data.metadata?.orderId;
      if (orderId) {
        const existing = await prisma.order.findUnique({ where: { id: orderId } });
        if (existing && !existing.paid) {
          await prisma.order.update({ where: { id: orderId }, data: { paid: true, paidAt: new Date(), paystackResponse: data } });
          console.log('Order marked paid by metadata:', orderId);
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('webhook error', err);
    return NextResponse.json({ error: 'webhook error' }, { status: 500 });
  }
}

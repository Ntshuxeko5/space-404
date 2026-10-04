import { NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';
import crypto from 'crypto';

const PAYFAST_IPS = [
  '41.74.179.185',
  '41.74.179.186',
  '41.74.179.187',
  '41.74.179.188',
  '41.74.179.189',
  '41.74.179.190',
  '41.74.179.191',
  '41.74.179.192',
  '41.74.179.193',
  '41.74.179.194',
  '41.74.179.195',
  '41.74.179.196',
  '41.74.179.197',
  '41.74.179.198',
  '41.74.179.199',
  '41.74.179.200',
  '196.38.86.25',
  '196.38.86.26',
  '196.38.86.27',
  '196.38.86.28',
  '196.38.86.29',
  '196.38.86.30',
  '196.38.86.31',
  '196.38.86.32',
  '196.38.86.33',
  '196.38.86.34',
  '196.38.86.35',
  '196.38.86.36',
  '196.38.86.37',
  '196.38.86.38',
  '196.38.86.39',
  '196.38.86.40',
  '197.97.94.221',
  '169.51.185.23',
  '169.51.185.167',
  '108.168.235.13',
  '108.168.235.14',
  '108.168.235.15',
  '108.168.235.16',
  '108.168.235.17',
  '108.168.235.18',
  '108.168.235.19',
  '108.168.235.20',
  '108.168.235.21',
  '108.168.235.22',
  '108.168.235.23',
  '108.168.235.24',
  '108.168.235.25',
  '108.168.235.26',
  '108.168.235.27',
  '108.168.235.28',
  '108.168.235.29',
  '108.168.235.30',
  '108.168.235.31',
  '108.168.235.32',
  '108.168.235.33',
  '108.168.235.34',
  '108.168.235.35',
  '108.168.235.36',
  '108.168.235.37',
  '108.168.235.38',
  '108.168.235.39',
  '108.168.235.40',
  '185.46.143.25',
  '185.46.143.26',
  '185.46.143.27',
  '185.46.143.28',
  '185.46.143.29',
  '185.46.143.30',
  '185.46.143.31',
  '185.46.143.32',
  '185.46.143.33',
  '185.46.143.34',
  '185.46.143.35',
  '185.46.143.36',
  '185.46.143.37',
  '185.46.143.38',
  '185.46.143.39',
  '185.46.143.40',
  '185.46.143.41',
  '185.46.143.42',
  '185.46.143.43',
  '185.46.143.44',
  '185.46.143.45',
  '185.46.143.46',
  '185.46.143.47',
  '185.46.143.48',
  '185.46.143.49',
  '185.46.143.50',
  '185.46.143.51',
  '185.46.143.52',
  '185.46.143.53',
  '185.46.143.54',
  '185.46.143.55',
  '185.46.143.56',
  '185.46.143.57',
  '185.46.143.58',
  '185.46.143.59',
  '185.46.143.60',
  '185.46.143.61',
  '185.46.143.62',
  '185.46.143.63',
  '185.46.143.64',
  '185.46.143.65',
  '185.46.143.66',
  '185.46.143.67',
  '185.46.143.68',
  '185.46.143.69',
  '185.46.143.70',
];

function generateSignature(data: Record<string, string>, passphrase?: string): string {
  const entries = Object.entries(data).sort(([a], [b]) => a.localeCompare(b));
  let queryString = entries.map(([k, v]) => `${k}=${encodeURIComponent(v).replace(/%20/g, '+')}`).join('&');
  if (passphrase) {
    queryString += `&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, '+')}`;
  }
  return crypto.createHash('md5').update(queryString).digest('hex');
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data: Record<string, string> = {};
    formData.forEach((value, key) => {
      if (typeof value === 'string') data[key] = value;
    });

    const orderId = data['custom_int1'];
    const mp = data['m_payment_id'];
    const pfToken = data['pf_payment_id'];
    const paymentStatus = data['payment_status'];
    const amountGross = parseFloat(data['amount_gross'] || '0');
    const receivedSignature = data['signature'];

    if (!orderId) {
      return new NextResponse('Invalid order reference', { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderId } });
    if (!order) {
      return new NextResponse('Order not found', { status: 404 });
    }

    if (order.payfastMp && order.payfastMp !== mp) {
      return new NextResponse('MP mismatch', { status: 400 });
    }

    if (Math.abs(order.total - amountGross) > 0.01) {
      return new NextResponse('Amount mismatch', { status: 400 });
    }

    const passphrase = process.env.PAYFAST_PASSPHRASE;
    const signatureData = { ...data };
    delete signatureData['signature'];
    const expectedSignature = generateSignature(signatureData, passphrase);

    if (receivedSignature !== expectedSignature) {
      return new NextResponse('Signature validation failed', { status: 400 });
    }

    const sandbox = process.env.PAYFAST_SANDBOX !== 'false';
    if (!sandbox) {
      const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '';
      const ip = clientIp.split(',')[0]?.trim();
      if (ip && !PAYFAST_IPS.includes(ip) && !ip.startsWith('127.')) {
        return new NextResponse('IP not allowed', { status: 403 });
      }
    }

    const paid = paymentStatus === 'COMPLETE';
    await prisma.order.update({
      where: { id: orderId },
      data: {
        paid,
        paidAt: paid ? new Date() : null,
        payfastToken: pfToken,
        payfastResponse: data as any,
        status: paid ? 'paid' : paymentStatus.toLowerCase(),
      },
    });

    return new NextResponse('OK', { status: 200 });
  } catch (err: any) {
    console.error('PayFast notify error:', err);
    return new NextResponse('Server error', { status: 500 });
  }
}

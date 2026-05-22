import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

export async function POST(request: Request) {
  // allow guest checkout with customerEmail OR authenticated user
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? verifyToken(token as string) as any : null;

  try {
    const { items, customerEmail } = await request.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Invalid items' }, { status: 400 });
    }

    const productIds = Array.from(new Set(items.map((it: any) => it.productId)));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
  const productMap: Record<string, any> = {};
  products.forEach((p: any) => (productMap[p.id] = p));

    let serverTotal = 0;
    const itemsToCreate = [] as any[];

    for (const it of items) {
      const prod = productMap[it.productId];
      if (!prod) return NextResponse.json({ error: `Product not found: ${it.productId}` }, { status: 400 });
      if (it.quantity == null || it.quantity <= 0) return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
      if (it.size && Array.isArray(prod.sizes) && prod.sizes.length > 0 && !prod.sizes.includes(it.size)) {
        return NextResponse.json({ error: `Invalid size for product ${prod.id}` }, { status: 400 });
      }

      const price = prod.price;
      serverTotal += price * it.quantity;

      itemsToCreate.push({ productId: it.productId, size: it.size || '', quantity: it.quantity, price });
    }

    // Optionally, you can compare total and serverTotal. We'll prefer serverTotal to avoid tampering.
    const finalTotal = serverTotal;

    const order = await prisma.order.create({
      data: {
        userId: user?.id,
        customerEmail: customerEmail ?? null,
        total: finalTotal,
        items: { create: itemsToCreate },
      },
      include: { items: true },
    });

    return NextResponse.json(order);
  } catch (err: any) {
    console.error('Create order error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  const email = url.searchParams.get('email');

  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? verifyToken(token as string) as any : null;

  if (id) {
    const order = await prisma.order.findUnique({ where: { id }, include: { items: true } });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // allow if admin
    if (user && user.isAdmin) return NextResponse.json(order);

    // allow if email matches
    if (email && order.customerEmail && email === order.customerEmail) return NextResponse.json(order);

    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // if no id, only admin can list orders
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const orders = await prisma.order.findMany({ include: { items: true } });
  return NextResponse.json(orders);
}

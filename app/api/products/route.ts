import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

const p: any = prisma;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  if (id) {
  const product = await p.product.findUnique({ where: { id }, include: { productCollections: { include: { collection: true } } } });
    return NextResponse.json(product);
  }

  const collection = url.searchParams.get('collection');
  const category = url.searchParams.get('category');
  const size = url.searchParams.get('size');
  const q = url.searchParams.get('q');
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '24');

  const where: any = { inStock: true };
  if (category) where.category = category;
  if (q) where.OR = [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }];
  if (size) where.sizes = { has: size };

  if (collection) {
  const col = await p.collection.findUnique({ where: { slug: collection } });
    if (!col) return NextResponse.json({ items: [], total: 0 });
  const pcs = await p.productCollection.findMany({ where: { collectionId: col.id }, select: { productId: true } });
    const ids = pcs.map((p: any) => p.productId);
    where.id = { in: ids.length ? ids : [''] };
  }

  const total = await p.product.count({ where });
  const items = await p.product.findMany({ where, skip: (page - 1) * limit, take: limit });
  return NextResponse.json({ items, total, page, limit });
}

export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? verifyToken(token as string) as any : null;
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { collectionIds, ...rest } = body;
  const product = await p.product.create({ data: rest });

  if (collectionIds && Array.isArray(collectionIds)) {
    for (const cId of collectionIds) {
      await p.productCollection.create({ data: { productId: product.id, collectionId: cId } }).catch(() => {});
    }
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? verifyToken(token as string) as any : null;
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, collectionIds, ...rest } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const product = await p.product.update({ where: { id }, data: rest });

  if (Array.isArray(collectionIds)) {
    // remove existing links not in list
    await p.productCollection.deleteMany({ where: { productId: id, collectionId: { notIn: collectionIds } } });
    for (const cId of collectionIds) {
      await p.productCollection.upsert({ where: { productId_collectionId: { productId: id, collectionId: cId } }, create: { productId: id, collectionId: cId }, update: {} }).catch(() => {});
    }
  }

  return NextResponse.json(product);
}

export async function DELETE(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? verifyToken(token as string) as any : null;
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  await p.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

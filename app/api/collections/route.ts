import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { verifyToken } from '../../../lib/auth';

export async function GET() {
const p: any = prisma;

export async function GET() {
  const collections = await p.collection.findMany({ include: { productCollections: { include: { product: true } } } });
  return NextResponse.json(collections);
}

export async function POST(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? verifyToken(token as string) as any : null;
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { name, slug, description } = body;
  if (!name || !slug) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

  const created = await p.collection.create({ data: { name, slug, description } });
  return NextResponse.json(created);
}

export async function PUT(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? verifyToken(token as string) as any : null;
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id, name, slug, description } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  const updated = await p.collection.update({ where: { id }, data: { name, slug, description } });
  return NextResponse.json(updated);
}

export async function DELETE(request: Request) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  const user = token ? verifyToken(token as string) as any : null;
  if (!user || !user.isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

  await p.productCollection.deleteMany({ where: { collectionId: id } });
  await p.collection.delete({ where: { id } });
  return NextResponse.json({ success: true });
}

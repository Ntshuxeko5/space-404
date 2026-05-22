import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';
import { hashPassword, comparePassword, signToken } from '../../../lib/auth';

export async function POST(request: Request) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  const body = await request.json();

  if (action === 'register') {
    const { email, password, name } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User exists' }, { status: 400 });
    }
    const user = await prisma.user.create({
      data: {
        email,
        password: hashPassword(password),
        name,
      },
    });
    const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  }

  if (action === 'login') {
    const { email, password } = body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const ok = comparePassword(password, user.password);
    if (!ok) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = signToken({ id: user.id, email: user.email, isAdmin: user.isAdmin });
    return NextResponse.json({ user: { id: user.id, email: user.email, name: user.name }, token });
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}

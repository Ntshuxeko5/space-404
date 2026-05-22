import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

async function saveBuffer(buffer: Buffer, fileName: string) {
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadsDir, { recursive: true });
  const safeName = `${Date.now()}-${fileName.replace(/[^a-zA-Z0-9.\-_]/g, '-')}`;
  const outPath = path.join(uploadsDir, safeName);

  // attempt optional resize via sharp if installed
  try {
    // try dynamic import of sharp; if not installed, fallback to writing file
    const mod = await import('sharp').catch(() => null);
    if (mod && mod.default) {
      await mod.default(buffer).resize({ width: 1200, withoutEnlargement: true }).toFile(outPath);
    } else {
      await fs.writeFile(outPath, buffer);
    }
  } catch {
    // fallback to just writing file
    await fs.writeFile(outPath, buffer);
  }

  return `/uploads/${path.basename(outPath)}`;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // handle form uploads (browser FormData upload)
      const form = await request.formData();
  const entry = form.get('file');
  if (!entry || typeof (entry as File).arrayBuffer !== 'function') return NextResponse.json({ error: 'Missing file field' }, { status: 400 });
  const file = entry as File;
  const arrayBuffer = await file.arrayBuffer();
  const buf = Buffer.from(arrayBuffer);
  const url = await saveBuffer(buf, file.name || 'upload.bin');
      return NextResponse.json({ url });
    }

    // default: expect JSON { fileName, data } where data may be data:<mime>;base64,... or raw base64
  const body = await request.json();
  const { fileName, data } = body as { fileName?: string; data?: string };
  if (!data) return NextResponse.json({ error: 'Missing file data' }, { status: 400 });

    const match = data.match(/^data:(.+);base64,(.+)$/);
    const base64 = match ? match[2] : data;
    const buf = Buffer.from(base64, 'base64');
    const url = await saveBuffer(buf, fileName || 'upload.bin');
    return NextResponse.json({ url });
  } catch (err) {
    console.error('upload error', err);
    return NextResponse.json({ error: (err as Error)?.message || 'Upload failed' }, { status: 500 });
  }
}

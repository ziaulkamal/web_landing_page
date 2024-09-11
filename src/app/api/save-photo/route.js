import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { image } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');

    // Determine file path and ensure the directory exists
    const filePath = path.join(process.cwd(), 'public', 'image', `ip_${ip}.jpg`);
    fs.writeFileSync(filePath, base64Data, 'base64');

    return NextResponse.json({ status: 'success', message: 'Photo saved successfully' });
  } catch (error) {
    console.error('Error saving photo:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to save photo' }, { status: 500 });
  }
}

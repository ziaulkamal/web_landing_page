import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { image } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const base64Data = image.replace(/^data:image\/jpeg;base64,/, '');

    // Define the directory and ensure it exists
    const dir = path.join(process.cwd(), 'public', 'image');
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Define the file path, sanitize IP address
    const sanitizedIp = ip.replace(/[^a-zA-Z0-9]/g, '_'); // Sanitize IP address for file naming
    const filePath = path.join(dir, `ip_${sanitizedIp}.jpg`);
    fs.writeFileSync(filePath, base64Data, 'base64');

    return NextResponse.json({ status: 'success', message: 'Photo saved successfully' });
  } catch (error) {
    console.error('Error saving photo:', error);
    return NextResponse.json({ status: 'error', message: 'Failed to save photo' }, { status: 500 });
  }
}

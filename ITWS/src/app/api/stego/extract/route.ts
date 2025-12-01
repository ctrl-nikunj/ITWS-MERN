import { NextRequest, NextResponse } from 'next/server';
import { stegoExtract } from '@/lib/stego-worker.mjs';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const stegoFile = formData.get('stego') as File;
        const coverFile = formData.get('cover') as File;

        if (!stegoFile || !coverFile) {
            return NextResponse.json({ error: 'Missing files' }, { status: 400 });
        }

        const stegoBuffer = Buffer.from(await stegoFile.arrayBuffer());
        const coverBuffer = Buffer.from(await coverFile.arrayBuffer());

        const result = await stegoExtract(stegoBuffer, coverBuffer);

        if (result) {
            return NextResponse.json({ secret: result });
        } else {
            return NextResponse.json({ error: result }, { status: 500 });
        }
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

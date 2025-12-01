import { NextRequest, NextResponse } from 'next/server';
import { stegoEmbed } from '@/lib/stego-worker.mjs';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const coverFile = formData.get('cover') as File;
        const secretFile = formData.get('secret') as File;

        if (!coverFile || !secretFile) {
            return NextResponse.json({ error: 'Missing files' }, { status: 400 });
        }

        const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
        const secretBuffer = Buffer.from(await secretFile.arrayBuffer());

        const result = await stegoEmbed(
            coverBuffer,
            secretBuffer,
        );

        if (result) {
            return NextResponse.json({ stego: result });
        } else {
            return NextResponse.json({ error: result }, { status: 500 });
        }
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

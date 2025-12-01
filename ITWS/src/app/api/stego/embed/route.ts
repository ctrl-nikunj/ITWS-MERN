import { NextRequest, NextResponse } from 'next/server';
import { runStegoWorker } from '@/lib/run-worker';

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

        const result = await runStegoWorker({
            type: 'embed',
            cover: coverBuffer,
            secret: secretBuffer,
        });

        if (result.success) {
            return NextResponse.json({ stego: result.data });
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

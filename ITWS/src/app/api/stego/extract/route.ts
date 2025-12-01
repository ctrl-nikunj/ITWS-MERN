import { NextRequest, NextResponse } from 'next/server';
import { runStegoWorker } from '@/lib/run-worker';

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

        const result = await runStegoWorker({
            type: 'extract',
            stego: stegoBuffer,
            cover: coverBuffer,
        });

        if (result.success) {
            return NextResponse.json({ success: true, secret: result.data });
        } else {
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

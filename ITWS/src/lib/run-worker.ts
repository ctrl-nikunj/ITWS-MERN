import { Worker } from 'worker_threads';
import path from 'path';

export function runStegoWorker(task: any): Promise<any> {
    return new Promise((resolve, reject) => {
        // In Next.js, process.cwd() is the project root.
        // public files are in /public
        const workerPath = path.join(process.cwd(), 'public', 'workers', 'stego-worker.mjs');

        const worker = new Worker(workerPath);

        worker.on('message', (result) => {
            resolve(result);
            // Terminate worker after single use to save resources (or keep a pool if high load)
            // For this task, terminating is fine.
            worker.terminate();
        });

        worker.on('error', (err) => {
            reject(err);
            worker.terminate();
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                reject(new Error(`Worker stopped with exit code ${code}`));
            }
        });

        worker.postMessage(task);
    });
}

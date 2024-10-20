import { BrotliCompress } from 'zlib';
import { createReadStream, createWriteStream } from 'fs';

export const compressFile = async (srcPath, destPath) => {
    return new Promise((resolve, reject) => {
        const readStream = createReadStream(srcPath);
        const writeStream = createWriteStream(destPath);
        const brotliStream = BrotliCompress();

        readStream.on('error', (err) => {
            console.error(`Read error: ${err.message}`);
            reject(err);
        });

        writeStream.on('error', (err) => {
            console.error(`Write error: ${err.message}`);
            reject(err);
        });

        writeStream.on('finish', () => {
            console.log(`File compressed successfully to ${destPath}`);
            resolve();
        });

        readStream.pipe(brotliStream).pipe(writeStream);
    });
};

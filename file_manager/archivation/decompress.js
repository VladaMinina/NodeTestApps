
import { createReadStream, createWriteStream } from 'fs';
import { BrotliDecompress } from 'zlib';

export const decompressFile = async (srcPath, destPath) => {
    return new Promise((resolve, reject) => {
        const readStream = createReadStream(srcPath);
        const writeStream = createWriteStream(destPath);
        const brotliStream = BrotliDecompress();

        readStream.on('error', (err) => {
            console.error(`Read error: ${err.message}`);
            reject(err);
        });

        writeStream.on('error', (err) => {
            console.error(`Write error: ${err.message}`);
            reject(err);
        });

        writeStream.on('finish', () => {
            console.log(`File decompressed successfully to ${destPath}`);
            resolve();
        });

        readStream.pipe(brotliStream).pipe(writeStream);
    });
};

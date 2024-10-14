import { createHash } from 'crypto';
import { createReadStream } from 'fs';

export const calculateHash = async (filePath) => {
    const hash = createHash('sha256'); 
    const stream = createReadStream(filePath);

    stream.on('data', (data) => {
        hash.update(data); 
    });

    return new Promise((resolve, reject) => {
        stream.on('end', () => {
            const result = hash.digest('hex'); 
            resolve(result);
        });

        stream.on("close", () => {
            console.log("Read stream was closed");
        });

        stream.on('error', (err) => {
            reject(err); 
        });
    });
};
import fs from 'fs/promises';
import { resolvePath } from './utils/resolvePath.js';
import { compressFile } from './archivation/compress.js';
import { decompressFile } from './archivation/decompress.js';
import { handleOsOperations } from './osOperations/osOperationsHandler.js';
import { calculateHash } from './hashOperations/hashCalculation.js';
import { checkValidParams } from './utils/checkValidNumberOfParams.js'
import { handleFileOperations } from './fileOperations/handleFileOperations.js'

export const commandHandler = async (currentDir, operation, args) => {
    console.log('processing request');
    switch (operation) {
        case 'up':
        case 'cd':
        case 'ls':
            return handleFileOperations(currentDir, operation, args);
        case 'add':
        case 'cat':
        case 'rn':
        case 'cp':
        case 'mv':
        case 'rm':
            handleFileOperations(currentDir, operation, args);
            break;
        case 'os':
            if (!checkValidParams(args, 1)) {
                console.error(`Operation ${operation} failed. no arguments provided`);
                break;
            }
            handleOsOperations(args);
            break;
        case 'hash':
            if (!checkValidParams(args, 1)) {
                console.log(`Operation ${operation} failed, not provided arguments.`);
                break;
            }
            const hashFilePath = resolvePath(currentDir, args[0]);
            try {
                await fs.access(hashFilePath);
                const fileHash = await calculateHash(hashFilePath);
                console.log(`Hash for file ${hashFilePath}: ${fileHash}`);
            } catch (error) {
                console.error(`Operation failed: ${error.message}`);
            }
            break;
        case 'compress':
        case 'decompress':
            if (!checkValidParams(args, 2)) {
                console.error('Operation failed: source or destination path not provided.');
                break;
            }
            const src = resolvePath(currentDir, args[0]);
            const dest = resolvePath(currentDir, args[1]);
            console.log(src, dest);


            try {
                await fs.access(src);
                if (operation == 'compress') {
                    await compressFile(src, dest);
                } else {
                    await decompressFile(src, dest);
                }
            } catch (error) {
                console.error(`Operation ${operation} failed:`, error.message);
            }
            break;
        default:
            console.error(`Invalid operation: '${operation}' is not supported.`);
    }
    return currentDir;
}
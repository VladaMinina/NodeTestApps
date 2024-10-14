import { createReadStream, createWriteStream } from 'fs';
import { checkValidParams, } from '../utils/checkValidNumberOfParams.js';
import { resolvePath } from '../utils/resolvePath.js';
import { printCurrentDir } from '../utils/utilPrintDirectory.js'
import path from 'path';
import os from 'os';
import fs from 'fs/promises';

const homeDir = os.homedir();

const copyFileUsingStreams = (source, destination) => {
    return new Promise((resolve, reject) => {
        const readStream = createReadStream(source);
        const writeStream = createWriteStream(destination);

        readStream.on('error', (err) => reject(`Read error: ${err.message}`));
        writeStream.on('error', (err) => reject(`Write error: ${err.message}`));

        readStream.pipe(writeStream).on('finish', resolve);
    });
};

export const handleFileOperations = async (currentDir, operation, args) => {
    switch (operation) {
        case 'up':
            if (currentDir === homeDir) {
                printCurrentDir(currentDir);
            } else {
                const parentDir = path.resolve(currentDir, '..');
                printCurrentDir(parentDir);
                return parentDir;
            }
            break;
        case 'cd':
            if (!checkValidParams(args, 1)) {
                console.error('Operation cd: invalid path to change.');
                break;
            }
            try {
                const targetPath = resolvePath(currentDir, args[0]);
                const stat = await fs.lstat(targetPath);
                if (stat.isDirectory()) {
                    printCurrentDir(targetPath);
                    if (currentDir !== targetPath) {
                        return targetPath;
                    }
                } else {
                    console.error('Operation failed');
                }
            } catch (error) {
                console.error('Operation failed', error);
            }
            break;
        case 'ls':
            try {
                const files = await fs.readdir(currentDir, { withFileTypes: true });
                const sortedFiles = files.sort((a, b) => {
                    if (a.isDirectory() && !b.isDirectory()) {
                        return -1;
                    } else if (!a.isDirectory() && b.isDirectory()) {
                        return 1;
                    } else {
                        return a.name.localeCompare(b.name);
                    }
                });

                let counter = 0;
                sortedFiles.forEach(element => {
                    if (element.isDirectory()) {
                        console.log(`${counter}\t ${element.name}/\tdirectory`);
                    } else {
                        console.log(`${counter}\t ${element.name}/\tfile`);
                    }
                    counter += 1;
                });
            } catch (error) {
                console.error(`Operation list files failed`, error);
            }
            printCurrentDir(currentDir);
            break;
        case 'add':
            if (!checkValidParams(args, 1)) {
                console.error('Operation add: no file name provided.');
                break;
            }
            const filePath = resolvePath(currentDir, args[0]);
            console.log('resolved path', filePath);
            try {
                await fs.access(filePath);
                console.log('File already exists');
            } catch (error) {
                if (error.code === 'ENOENT') {
                    try {
                        await fs.writeFile(filePath, '');
                        console.log(`File created successfully ${args[0]}`);
                    } catch (error) {
                        console.error('File creation failed:', error);
                    }
                } else {
                    console.error('Operation add failed:', error.message);
                }
            };
            break;
        case 'cat':
            if (!args || args.length === 0) {
                console.error(`Operation failed: no file name provided.`);
                break;
            }
            const fileToRead = resolvePath(currentDir, args[0]);
            try {
                await fs.access(fileToRead);
                await new Promise((resolve, reject) => {
                    const readStream = createReadStream(fileToRead, { encoding: 'utf8' });

                    readStream.on("data", (data) => {
                        process.stdout.write(data);
                    });
                    readStream.on("error", (error) => {
                        reject(error); 
                    });
                    readStream.on("end", () => {
                        console.log("\nAll the data in the file has been read");
                        resolve();
                    });
                });
            } catch (error) {
                if (error.code == 'ENOENT') {
                    console.error(`Operation cat failed. File doesnt exist.`);
                } else {
                    console.error('Operation cat failed:', error.message);
                }
            }
            break;
        case 'rn':
            if (!args || args.length < 2) {
                console.log(`Operation ${operation} failed, not provided arguments.`);
                break;
            }
            const pathToRename = resolvePath(currentDir, args[0]);
            const newFileName = resolvePath(currentDir, args[1]);
            console.log(pathToRename, '   ', newFileName);
            try {
                await fs.access(newFileName);
                console.error(`Name conflict. File with this name already exists.`);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    //we dont have name conflict
                    try {
                        await fs.access(pathToRename);
                        await fs.rename(pathToRename, newFileName);
                        console.log('File renamed successfully');
                    } catch (error) {
                        if (error.code === 'ENOENT') {
                            console.error(`File with provided name doestn exists`);
                        }
                    }
                }
            }
            break;
        case 'cp':
            if (!args || args.length < 2) {
                console.log(`Operation ${operation} failed, not provided arguments.`);
                break;
            }
            const srcPath = resolvePath(currentDir, args[0]);
            const destDir = resolvePath(currentDir, args[1]);
            const fileName = path.basename(srcPath);
            const destPath = path.join(destDir, fileName);

            try {
                await fs.access(srcPath);
                await fs.access(destDir);
                await copyFileUsingStreams(srcPath, destPath);
                console.log(`File copied to ${destPath}`);
            } catch (error) {
                console.error(`Operation ${operation} failed. Not right path ${error.message}`);
            }
            break;
        case 'mv':
            if (args.length < 2) {
                console.error('Operation mv: source or destination path not provided.');
                break;
            }
            const srcMvPath = resolvePath(currentDir, args[0]);
            const destMvDir = resolvePath(currentDir, args[1]);
            const destMvPath = path.join(destMvDir, path.basename(srcMvPath));

            try {
                await fs.access(srcMvPath);
                await fs.access(destMvDir);

                await copyFileUsingStreams(srcMvPath, destMvPath);
                console.log(`File moved to ${destMvPath}`);

                await fs.unlink(srcMvPath);
                console.log(`Original file deleted: ${srcMvPath}`);
            } catch (error) {
                console.error(`Operation ${operation} failed:`, error.message);
                break;
            }
            break;

        case 'rm':
            if (args.length === 0) {
                console.error(`Operation ${operation} failed: no file path provided.`);
                break;
            }

            const fileToRemove = resolvePath(currentDir, args[0]);
            try {
                await fs.access(fileToRemove);
                await fs.unlink(fileToRemove); 
                console.log(`File deleted: ${fileToRemove}`);
            } catch (error) {
                if (error.code === 'ENOENT') {
                    //do nothing
                } else {
                    console.error('Operation rm failed:', error.message);
                }
            }
            break;
    }
    return currentDir;
}
import os from 'os';
import { commandHandler } from './commandHandler.js';

const args = process.argv.slice(2);
const usernameArg = args.find(arg => arg.startsWith('--username='));

if (!usernameArg) {
    console.error('Username not provided. Use CLArguments');
    throw Error('Username not provided');
}

const username = usernameArg.split('=')[1];
const homeDir = os.homedir();
let currentDir = homeDir;

console.log(`Welcome to the File Manager, ${username}!`);
console.log(`You are currently in ${currentDir}`);

process.on('SIGINT', () => {
    console.log(`\nThank you for using File Manager, ${username}, goodbye!`);
    process.exit(0);
})

process.stdin.on('data', async (input) => {
    const command = input.toString().trim();
    const [operation, ...args] = command.split(' ');

    if (command === '.exit') {
        console.log(`Thank you for using File Manager, ${username}, goodbye!`);
        process.exit(0);
    }
    currentDir = await commandHandler(currentDir, operation, args);
});
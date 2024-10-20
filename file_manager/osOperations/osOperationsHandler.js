import os from 'os';

export const handleOsOperations = (args) => {
    const osCommand = args[0];

    switch (osCommand) {
        case '--EOL':
            console.log(`Default system EOL: ${JSON.stringify(os.EOL)}`);
            break;
        case '--cpus':
            const cpus = os.cpus();
            console.log(`Total CPUs: ${cpus.length}`);
            cpus.forEach((cpu, index) => {
                console.log(`CPU Info: \nIndex: ${cpu.index + 1}, \nModel: ${cpu.model}, \nSpeed: ${cpu.speed / 1000}GHZ`);
            })
        case '--homedir':
            console.log(`Home directory: ${os.homedir()}`);
            break;

        case '--username':
            console.log(`Current system username: ${os.userInfo().username}`);
            break;

        case '--architecture':
            console.log(`CPU architecture: ${os.arch()}`);
            break;
        default:
            console.error(`Operation os: Unknown command '${osCommand}'. 
                            Functionality was not implemented.`);

    }
};
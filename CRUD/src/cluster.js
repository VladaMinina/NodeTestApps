import http from 'node:http';
import dotenv from 'dotenv';
import { router } from './routes/routers.js';
import cluster from 'node:cluster';
import os from 'node:os';

dotenv.config({ path: './.env' });
const numCPUs = os.cpus().length;

const PORT = Number(process.env.PORT) || 5000; 

let server; 

const startWorkerServer = (port) => {
    const serverInstance = http.createServer((req, res) => {
        try {
            router(req, res);
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
        }
    });

    serverInstance.on('error', (err) => {
        console.error('Server error:', err);
    });

    serverInstance.listen(port, () => {
        console.log(`Worker is running on port ${port}`);
    });

    return serverInstance;
};

if (cluster.isPrimary) {
    console.log(`Primary process is running with PID: ${process.pid}`);

    for (let i = 0; i < numCPUs - 1; i++) {
        cluster.fork({ PORT: PORT + i + 1 });
    }

    const loadBalancer = http.createServer((req, res) => {
        const workerPort = PORT + ((cluster.worker?.id || 0) % (numCPUs - 1)) + 1;
        const options = {
            hostname: 'localhost',
            port: workerPort,
            path: req.url,
            method: req.method,
            headers: req.headers,
        };

        const proxy = http.request(options, (response) => {
            response.pipe(res, { end: true });
        });

        req.pipe(proxy, { end: true });
    });

    loadBalancer.listen(PORT, () => {
        console.log(`Load Balancer is running on http://localhost:${PORT}`);
    });
} else {
   
    const workerPort = Number(process.env.PORT) || PORT + (cluster.worker.id - 1);
    server = startWorkerServer(workerPort);
}

export { server };

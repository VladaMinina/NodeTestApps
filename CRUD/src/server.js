import http from 'http';
import dotenv from 'dotenv';
import { router } from './routes/routers.js';

dotenv.config({ path: './.env' });

const PORT = process.env.PORT || 5000;

const server = http.createServer((req, res) => {
    try {
        router(req, res);
    } catch(error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Internal Server Error', error: error.message }));
    }
});

server.on('error', (err) => {
    console.error('Server error:', err);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { server };
import { getUsers } from '../controllers/userController.js';

const router = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
  
    if (pathname === '/api/users' && req.method === 'GET') {
      getUsers(req, res);
    } else {
        console.log('not implemented yet');
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
}

export { router };
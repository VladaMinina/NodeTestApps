import { getUsers, createUser, getUserById, updateUser, deleteUser } from '../controllers/userController.js';

const router = (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;
  
    if (pathname === '/api/users' && req.method === 'GET') {
        getUsers(req, res);
    } else if (pathname === '/api/users' && req.method === 'POST') {
        createUser(req, res);
    } else if (pathname.match(/^\/api\/users\/([0-9a-fA-F-]+)$/) && req.method === 'GET') {
        const userId = pathname.split('/')[3];
        getUserById(req, res, userId);
    } else if (pathname.match(/^\/api\/users\/([0-9a-fA-F-]+)$/) && req.method === 'PUT') {
        const userId = pathname.split('/')[3];
        updateUser(req, res, userId);
    } else if (pathname.match(/^\/api\/users\/([0-9a-fA-F-]+)$/) && req.method === 'DELETE') {
        const userId = pathname.split('/')[3];
        deleteUser(req, res, userId);
    } else {
        console.log('not implemented yet');
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Route not found' }));
    }
}

export { router };
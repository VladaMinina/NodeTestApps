import { users, User} from '../models/user_model.js';
import { v4 as  uid, validate as isUuid } from 'uuid'


const getUsers = ( _, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const usersArray = Array.from(users.values());
    res.end(JSON.stringify(usersArray));
}

const createUser = (req, res) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
  
    req.on('end', () => {
      const { name, age, hobbies = [] } = JSON.parse(body);
      
      if (!name || !age) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Name and age are required' }));
        return;
      }
  
      const id = uid();
      const newUser = new User(id, name, age, hobbies);
      users.set(newUser.id, newUser);
  
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newUser));
    });
  }

export { getUsers, createUser }
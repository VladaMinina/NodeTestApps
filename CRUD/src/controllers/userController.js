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

const getUserById = (req, res, userId) => {
    if (!isUuid(userId)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Invalid user ID provided' }));
      return;
    }
  
    const user = users.get(userId);
    
    if (!user) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User not found' }));
      return;
    }
  
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(user));
}

const updateUser = (req, res, userId) => {
    if (!isUuid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid user ID provided' }));
        return;
    }

    const user = users.get(userId);
    if(!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
    }

    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
  
    req.on('end', () => {
      const { name, age, hobbies } = JSON.parse(body);
  
      if(!name && !age && !Array.isArray(hobbies)){
        res.writeHead(400, {'Content-type': 'application/json'});
        res.end(JSON.stringify({ message: 'Data to update not provided' }));
        return;
      }
      if(name) {
        user.name = name;
      }
      if(age) {
        user.age = age;
      }
      if(hobbies) {
        user.hobbies = hobbies;
      }
      users.set(user.id, user);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    });
}

const deleteUser = (req, res, userId) => {
    if (!isUuid(userId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid user ID provided' }));
        return;
    }

    const user = users.get(userId);
    if(!user) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User not found' }));
        return;
    }

    users.delete(userId);
    res.writeHead(204);
    res.end();
    //Use 204 No Content only when you don’t want to return any data in the response.
}

export { getUsers, createUser, getUserById, updateUser, deleteUser }
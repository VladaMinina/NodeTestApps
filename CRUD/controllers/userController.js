import { users, User} from '../models/user_model.js';
import { v4 as  uid, validate as isUuid } from 'uuid'


const getUsers = ( _, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(users));
}

export { getUsers }
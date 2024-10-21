import { v4 as uid } from 'uuid';

const mapUsers = new Map();

class User{
    constructor(username, age, hobbies = []) {
        if(!username || !age || !Array.isArray(hobbies)) {
            throw new Error('Username and age are required!');
        }
        this.id = uid();
        this.username = username;
        this.age = age;
        this.hobbies = hobbies;
    }
}

export {mapUsers as users, User}
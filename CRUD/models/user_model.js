import { v4 as uid } from 'uuid';

const mapUsers = new Map();

class User{
    constructor(id, name, age, hobbies = []) {
        if(!id || !name || !age || !Array.isArray(hobbies)) {
            throw new Error('Username and age are required!');
        }
        this.id = id;
        this.username = name;
        this.age = age;
        this.hobbies = hobbies;
        console.log(this.id, this.hobbies, this.username, this.age);
    }
}

export {mapUsers as users, User}
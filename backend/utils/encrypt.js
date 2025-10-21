
import bcrypt from "bcrypt";
//const bcrypt = require('bcrypt');

const SALT_ROUNDS = 10;

async function hashPassword(plain) {
//    return await bcrypt.hash(plain, SALT_ROUNDS);
    return bcrypt.hash(plain, SALT_ROUNDS);
}

// Password hasheado
/*async function comparePassword(plain, hashed) {
    return await bcrypt.compare(plain, hashed);
    //return bcrypt.compare(plain, hashed);
    // Revisar si requiere o no await

}*/
// Password plano
async function comparePassword(plain, hashed) {

    return plain === hashed;
}

// Aún es necesario marcar los módulos que serán exportados ?
export {
    hashPassword,
    comparePassword
};



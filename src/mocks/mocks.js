import { fakerES_MX as fa } from '@faker-js/faker';
import { createHash } from '../utils/index.js';

export const generaPet = () => {
    const name = fa.animal.petName();
    const specie = fa.animal.type();
    const birthDate = fa.date.birthdate({ mode: 'age', min: 1, max: 15 });
    const adopted = fa.datatype.boolean();
    const image = fa.image.avatar();

    const pet = {
        name,
        specie,
        birthDate,
        adopted,
        image
    };

    if (adopted) {
        pet.owner = fa.person.fullName();
    }

    return { pet };
};

export const generaUser = async () => {
    const first_name = fa.person.firstName();
    const last_name = fa.person.lastName();
    const email = fa.internet.email({
        firstName: first_name,
        lastName: last_name,
        provider: 'gmail.com'
    });
    const password = await createHash('coder123');
    const role = fa.helpers.arrayElement(['user', 'admin']);
    const pets = [];

    return {
        first_name,
        last_name,
        email,
        password,
        role,
        pets
    };
};

export const generaUsers = async (cantidad) => {
    const usuarios = [];

    for (let i = 0; i < cantidad; i++) {
        usuarios.push(await generaUser());
    }

    return usuarios;
};

export const generaPets = (cantidad) => {
    const mascotas = [];

    for (let i = 0; i < cantidad; i++) {
        mascotas.push(generaPet().pet);
    }

    return mascotas;
};

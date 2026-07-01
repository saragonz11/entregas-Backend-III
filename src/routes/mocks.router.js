import { Router } from 'express';
import { generaPet, generaUser, generaUsers, generaPets } from '../mocks/mocks.js';
import userModel from '../dao/models/User.js';
import petModel from '../dao/models/Pet.js';

const router = Router();

router.get('/mockingpets', (req, res) => {
    let { cantidad } = req.query;

    if (cantidad < 0) {
        return res.status(400).json({ error: 'Cantidad enviada debe de ser positiva' });
    }

    if (!cantidad) cantidad = 1;

    const mascotas = generaPets(Number(cantidad));

    return res.status(200).json({ mascotas });
});

router.get('/mockingusers', async (req, res) => {
    try {
        let { cantidad } = req.query;

        if (cantidad < 0) {
            return res.status(400).json({ error: 'Cantidad enviada debe de ser positiva' });
        }

        if (!cantidad) cantidad = 50;

        const usuarios = await generaUsers(Number(cantidad));

        return res.status(200).json({ usuarios });
    } catch (error) {
        console.error('Error generando usuarios mock:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.post('/generateData', async (req, res) => {
    try {
        let { users, pets, user, pet } = req.query;

        const usersCount = parseInt(users ?? user) || 1;
        const petsCount = parseInt(pets ?? pet) || 1;

        if (usersCount < 0 || petsCount < 0) {
            return res.status(400).json({ error: 'Cantidad enviada debe de ser positiva' });
        }

        const usersToInsert = [];
        for (let i = 0; i < usersCount; i++) {
            usersToInsert.push(await generaUser());
        }

        const usersInsertados = usersCount > 0
            ? await userModel.insertMany(usersToInsert)
            : [];

        const petsToInsert = [];

        for (let i = 0; i < petsCount; i++) {
            const petData = generaPet().pet;

            if (petData.adopted && usersInsertados.length > 0) {
                const randomUser = usersInsertados[Math.floor(Math.random() * usersInsertados.length)];
                petData.owner = randomUser._id;
            } else if (petData.adopted) {
                delete petData.owner;
                petData.adopted = false;
            }

            petsToInsert.push(petData);
        }

        const petsInsertados = petsCount > 0
            ? await petModel.insertMany(petsToInsert)
            : [];

        return res.status(201).json({
            message: 'Datos generados exitosamente',
            users: usersInsertados,
            pets: petsInsertados
        });
    } catch (error) {
        console.error('Error generando datos:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router;

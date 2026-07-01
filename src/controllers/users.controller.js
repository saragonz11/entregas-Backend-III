import { usersService } from '../services/index.js';

const getAllUsers = async (req, res) => {
    try {
        const users = await usersService.getAll();
        res.send({ status: 'success', payload: users });
    } catch (error) {
        res.status(500).send('Ha ocurrido un error en la petición, por favor ver detalle: ', error);
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: 'error', error: 'User not found' });
        res.send({ status: 'success', payload: user });
    } catch (error) {
        res.status(500).send('Ha ocurrido un error en la petición, por favor ver detalle: ', error);
    }
};

const updateUser = async (req, res) => {
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: 'error', error: 'User not found' });
        await usersService.update(userId, updateBody);
        res.send({ status: 'success', message: 'User updated' });
    } catch (error) {
        res.status(500).send('Ha ocurrido un error en la petición, por favor ver detalle: ', error);
    }
};

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if (!user) return res.status(404).send({ status: 'error', error: 'User not found' });
        await usersService.delete(userId);
        res.send({ status: 'success', message: 'User deleted' });
    } catch (error) {
        res.status(500).send('Ha ocurrido un error en la petición, por favor ver detalle: ', error);
    }
};

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
};

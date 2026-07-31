import { describe, it, before, after, beforeEach } from 'mocha';
import { expect } from 'chai';
import mongoose, { isValidObjectId } from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import config from '../src/config/config.js';
import { createHash } from '../src/utils/index.js';
import userModel from '../src/dao/models/User.js';
import petModel from '../src/dao/models/Pet.js';
import adoptionModel from '../src/dao/models/Adoption.js';

const requester = request(app);

describe('Pruebas funcionales - router adoption.router.js', function () {
    this.timeout(15000);

    let userId;
    let petId;
    let adoptedPetId;
    let adoptionId;

    before(async () => {
        await mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME });
    });

    beforeEach(async () => {
        await adoptionModel.deleteMany({ owner: { $exists: true } });
        await userModel.deleteMany({ email: /adoption-test/ });
        await petModel.deleteMany({ specie: 'adoption-test' });

        const hashedPassword = await createHash('coder123');

        const user = await userModel.create({
            first_name: 'Test',
            last_name: 'Adoption',
            email: `adoption-test-${Date.now()}@gmail.com`,
            password: hashedPassword,
            role: 'user',
            pets: []
        });
        userId = user._id.toString();

        const pet = await petModel.create({
            name: 'Rocky',
            specie: 'adoption-test',
            birthDate: new Date('2022-01-15'),
            adopted: false
        });
        petId = pet._id.toString();

        const adoptedPet = await petModel.create({
            name: 'Luna',
            specie: 'adoption-test',
            birthDate: new Date('2021-05-10'),
            adopted: true,
            owner: user._id
        });
        adoptedPetId = adoptedPet._id.toString();
    });

    after(async () => {
        await adoptionModel.deleteMany({});
        await userModel.deleteMany({ email: /adoption-test/ });
        await petModel.deleteMany({ specie: 'adoption-test' });
        await mongoose.connection.close();
    });

    describe('GET /api/adoptions', () => {
        it('Debería devolver un array de adopciones con status success', async () => {
            const { status, body } = await requester.get('/api/adoptions');

            expect(status).to.be.eq(200);
            expect(body).to.have.property('status', 'success');
            expect(body).to.have.property('payload');
            expect(body.payload).to.be.an('array');
        });

        it('Debería incluir las propiedades owner y pet en cada adopción', async () => {
            await adoptionModel.create({ owner: userId, pet: petId });

            const { status, body } = await requester.get('/api/adoptions');

            expect(status).to.be.eq(200);
            expect(body.payload.length).to.be.greaterThan(0);
            expect(body.payload[0]).to.have.property('owner');
            expect(body.payload[0]).to.have.property('pet');
        });
    });

    describe('GET /api/adoptions/:aid', () => {
        it('Debería devolver una adopción específica por ID válido', async () => {
            const adoption = await adoptionModel.create({ owner: userId, pet: petId });
            adoptionId = adoption._id.toString();

            const { status, body } = await requester.get(`/api/adoptions/${adoptionId}`);

            expect(status).to.be.eq(200);
            expect(body).to.have.property('status', 'success');
            expect(body).to.have.property('payload');
            expect(isValidObjectId(body.payload._id)).to.be.true;
            expect(body.payload._id.toString()).to.be.eq(adoptionId);
        });

        it('Debería devolver error 404 si el ID de adopción no existe', async () => {
            const fakeId = new mongoose.Types.ObjectId().toString();

            const { status, body } = await requester.get(`/api/adoptions/${fakeId}`);

            expect(status).to.be.eq(404);
            expect(body).to.have.property('status', 'error');
            expect(body).to.have.property('error', 'Adoption not found');
        });
    });

    describe('POST /api/adoptions/:uid/:pid', () => {
        it('Debería crear una adopción exitosamente con usuario y mascota válidos', async () => {
            const { status, body } = await requester.post(`/api/adoptions/${userId}/${petId}`);

            expect(status).to.be.eq(200);
            expect(body).to.have.property('status', 'success');
            expect(body).to.have.property('message', 'Pet adopted');

            const petUpdated = await petModel.findById(petId);
            expect(petUpdated.adopted).to.be.true;
            expect(petUpdated.owner.toString()).to.be.eq(userId);

            const adoption = await adoptionModel.findOne({ owner: userId, pet: petId });
            expect(adoption).to.not.be.null;
        });

        it('Debería devolver error 404 si el usuario no existe', async () => {
            const fakeUserId = new mongoose.Types.ObjectId().toString();

            const { status, body } = await requester.post(`/api/adoptions/${fakeUserId}/${petId}`);

            expect(status).to.be.eq(404);
            expect(body).to.have.property('status', 'error');
            expect(body).to.have.property('error', 'user Not found');
        });

        it('Debería devolver error 404 si la mascota no existe', async () => {
            const fakePetId = new mongoose.Types.ObjectId().toString();

            const { status, body } = await requester.post(`/api/adoptions/${userId}/${fakePetId}`);

            expect(status).to.be.eq(404);
            expect(body).to.have.property('status', 'error');
            expect(body).to.have.property('error', 'Pet not found');
        });

        it('Debería devolver error 400 si la mascota ya está adoptada', async () => {
            const { status, body } = await requester.post(`/api/adoptions/${userId}/${adoptedPetId}`);

            expect(status).to.be.eq(400);
            expect(body).to.have.property('status', 'error');
            expect(body).to.have.property('error', 'Pet is already adopted');
        });
    });
});

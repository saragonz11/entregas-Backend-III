import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import usersRouter from './routes/users.router.js';
import petsRouter from './routes/pets.router.js';
import adoptionsRouter from './routes/adoption.router.js';
import sessionsRouter from './routes/sessions.router.js';
import mocksRouter from './routes/mocks.router.js';
import config from './config/config.js';

const app = express();
const PORT = config.PORT;

mongoose.connect(config.MONGO_URL, { dbName: config.DB_NAME })
    .then(() => console.log('Conexión exitosa a MongoDB'))
    .catch((err) => {
        console.error('Error conectando a MongoDB:', err);
        process.exit(1);
    });

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Adoptme API',
            version: '1.0.0',
            description: 'Documentación del proyecto Adoptme - Backend III'
        }
    },
    apis: ['./src/docs/*.yaml']
};

const specs = swaggerJSDoc(swaggerOptions);

app.use(express.json());
app.use(cookieParser());

app.use('/api/users', usersRouter);
app.use('/api/pets', petsRouter);
app.use('/api/adoptions', adoptionsRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/api/mocks', mocksRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs));

const isMainModule = process.argv[1] === fileURLToPath(import.meta.url);

if (isMainModule) {
    app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));
}

export default app;

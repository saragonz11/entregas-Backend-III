# Adoptme – Entrega Final

**Curso:** Backend III – Testing y Escalabilidad  
**Autora:** Sara González Londoño  

API REST de adopción de mascotas con documentación Swagger, tests funcionales y Docker.

---

## Para el evaluador – evidencia rápida

| Criterio | Evidencia | Cómo verificar |
| -------- | --------- | -------------- |
| Swagger módulo **Users** | `src/docs/Users.yaml`, `src/docs/Components.yaml` | Con el servidor arriba: [http://localhost:8080/docs](http://localhost:8080/docs) → tag **Users** |
| Tests de `adoption.router.js` | `test/adoption.test.js` | `npm test` (cubre GET /, GET /:aid y POST /:uid/:pid – éxito y error) |
| Dockerfile | `Dockerfile` | `docker build -t sari22/adoptme:1.0.0 .` |
| Imagen en Docker Hub | Link público abajo | `docker pull sari22/adoptme:1.0.0` |
| README con instrucciones Docker | Este archivo | Secciones *Docker Hub* y *Ejecutar con Docker* |

### Endpoints de adopciones cubiertos por tests

| Método | Ruta | Casos |
| ------ | ---- | ----- |
| `GET` | `/api/adoptions` | éxito (listado) |
| `GET` | `/api/adoptions/:aid` | éxito / `404` no encontrada |
| `POST` | `/api/adoptions/:uid/:pid` | éxito / `404` usuario / `404` mascota / `400` ya adoptada |

---

## Imagen en Docker Hub

**Link público:** [https://hub.docker.com/r/sari22/adoptme](https://hub.docker.com/r/sari22/adoptme)

```bash
docker pull sari22/adoptme:1.0.0
```

---

## Cómo levantar el proyecto (recomendado para corrección)

### Opción A – Docker Compose (API + Mongo)

```bash
docker compose up --build
```

- API: http://localhost:8080  
- Swagger Users: http://localhost:8080/docs  
- Mongo: `localhost:27017`

```bash
# Detener
docker compose down
```

### Opción B – Imagen de Docker Hub + Mongo local/Atlas

```bash
docker pull sari22/adoptme:1.0.0

docker run -d \
  --name adoptme \
  -p 8080:8080 \
  -e PORT=8080 \
  -e MONGO_URL="mongodb://host.docker.internal:27017" \
  -e DB_NAME=adoptme \
  sari22/adoptme:1.0.0
```

> Si usas Atlas, reemplaza `MONGO_URL` por tu connection string.  
> `127.0.0.1` **no** funciona desde dentro del contenedor; usa Atlas o `host.docker.internal` (Mac/Windows).

### Opción C – Node local

```bash
cp .env.example .env   # o crear .env manualmente
npm install
npm start
```

Variables de entorno:

```env
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017
DB_NAME=adoptme
```

---

## Cómo correr los tests

Con MongoDB disponible (Compose: `docker compose up mongo -d`, o Atlas/local):

```bash
npm test
```

Archivo: `test/adoption.test.js`  
Framework: Mocha + Chai + Supertest.

---

## Documentación Swagger (Users)

Con el servidor en marcha:

1. Abrir http://localhost:8080/docs  
2. Revisar el tag **Users**:
   - `GET /api/users`
   - `GET /api/users/{uid}`
   - `PUT /api/users/{uid}`
   - `DELETE /api/users/{uid}`

Archivos: `src/docs/Users.yaml` y `src/docs/Components.yaml`.

---

## Construir y publicar la imagen

```bash
# Construir
docker build -t sari22/adoptme:1.0.0 .

# Publicar (ya subida; comando de referencia)
docker login
docker push sari22/adoptme:1.0.0
```

El `Dockerfile`:

1. Usa `node:20.11.0`
2. Instala dependencias (`npm install`)
3. Copia el código (`./src`)
4. Expone el puerto `8080`
5. Ejecuta `npm start`

---

## Prueba rápida de la API

```bash
curl http://localhost:8080/api/users
curl -X POST "http://localhost:8080/api/mocks/generateData?users=2&pets=2"
curl http://localhost:8080/api/adoptions
```

---

## Estructura relevante para la entrega

```
├── Dockerfile
├── docker-compose.yml
├── README.md
├── src/
│   ├── app.js                 # Express + Swagger en /docs
│   ├── docs/
│   │   ├── Users.yaml         # Documentación módulo Users
│   │   └── Components.yaml
│   └── routes/
│       └── adoption.router.js
└── test/
    └── adoption.test.js       # Tests funcionales de adoptions
```

---

## Checklist de criterios

- [x] Documentar con Swagger el módulo Users  
- [x] Tests funcionales de todos los endpoints de `adoption.router.js` (éxito y error)  
- [x] Dockerfile para generar la imagen de forma reproducible  
- [x] Imagen publicada en Docker Hub con link público en este README  
- [x] Instrucciones claras para construir, ejecutar y usar el proyecto con Docker  

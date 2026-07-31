# Adoptme – Entrega Final

**Curso:** Backend III – Testing y Escalabilidad  
**Autora:** Sara González Londoño  

API REST de adopción de mascotas con:

1. Documentación Swagger del módulo **Users**
2. Tests funcionales de `adoption.router.js`
3. **Dockerfile** optimizado y reproducible
4. Imagen publicada en **Docker Hub** (acceso público)
5. **README.md** con instrucciones Docker + enlace a Docker Hub + Swagger Users

---

## Link a la imagen en Docker Hub

**Imagen pública:** https://hub.docker.com/r/sari22/adoptme  

**Pull de la imagen:**

```bash
docker pull sari22/adoptme:1.0.0
```

- Repositorio: [https://hub.docker.com/r/sari22/adoptme](https://hub.docker.com/r/sari22/adoptme)
- Tag: `sari22/adoptme:1.0.0`

---

## Criterios de la rúbrica (evidencia explícita)

### 1. Creación y configuración del Dockerfile

Se ha desarrollado un **Dockerfile optimizado y reproducible** para generar la imagen del proyecto de manera adecuada.

- Archivo: [`Dockerfile`](./Dockerfile)
- Multi-stage build (dependencias + producción)
- Base: `node:20.11.0-alpine`
- Instala dependencias con `npm ci --omit=dev`
- Copia el código fuente (`./src`)
- Expone el puerto `8080`
- Comando de ejecución: `npm start`

```bash
docker build -t sari22/adoptme:1.0.0 .
```

### 2. Publicación en Docker Hub

La imagen generada del proyecto ha sido **subida a Docker Hub** y es **accesible públicamente**.

- Repositorio público: [https://hub.docker.com/r/sari22/adoptme](https://hub.docker.com/r/sari22/adoptme)
- Imagen / tag: `sari22/adoptme:1.0.0`
- Visibilidad: **pública** (`is_private: false`)

```bash
docker pull sari22/adoptme:1.0.0
```

### 3. Documentación en README.md y Swagger

El README.md contiene:

- Instrucciones claras para ejecutar el proyecto con **Docker**
- El **enlace a Docker Hub**
- La documentación de **Swagger para Users**

| Recurso | Ubicación |
| ------- | --------- |
| Swagger UI (Users) | http://localhost:8080/docs |
| Spec Users | `src/docs/Users.yaml` |
| Schemas | `src/docs/Components.yaml` |
| Endpoints Users documentados | `GET /api/users`, `GET /api/users/{uid}`, `PUT /api/users/{uid}`, `DELETE /api/users/{uid}` |

### 4. Tests funcionales de `adoption.router.js`

Archivo: `test/adoption.test.js`

| Método | Ruta | Casos |
| ------ | ---- | ----- |
| `GET` | `/api/adoptions` | éxito (200, array) |
| `GET` | `/api/adoptions/:aid` | éxito (200) / error (404) |
| `POST` | `/api/adoptions/:uid/:pid` | éxito (200) / 404 usuario / 404 mascota / 400 ya adoptada |

```bash
npm test
```

---

## Ejecutar el proyecto con Docker

### Opción 1 – Docker Compose (recomendado para corrección)

Levanta la API y MongoDB:

```bash
docker compose up --build
```

- API: http://localhost:8080  
- Swagger Users: http://localhost:8080/docs  
- MongoDB: `localhost:27017`

```bash
docker compose down
```

### Opción 2 – Imagen pública de Docker Hub

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

> Si usas MongoDB Atlas, reemplaza `MONGO_URL` por tu connection string.  
> Dentro del contenedor no uses `127.0.0.1` para Mongo: usa Atlas o `host.docker.internal` (Mac/Windows).

### Opción 3 – Ejecución local con Node

```bash
cp .env.example .env
npm install
npm start
```

Variables de entorno (`.env`):

```env
PORT=8080
MONGO_URL=mongodb://127.0.0.1:27017
DB_NAME=adoptme
```

---

## Documentación Swagger – módulo Users

Con el servidor en marcha:

1. Abrir **http://localhost:8080/docs**
2. Ir al tag **Users**
3. Probar:
   - `GET /api/users` – listar usuarios
   - `GET /api/users/{uid}` – obtener usuario por id
   - `PUT /api/users/{uid}` – actualizar usuario
   - `DELETE /api/users/{uid}` – eliminar usuario

Archivos de documentación:

- `src/docs/Users.yaml`
- `src/docs/Components.yaml`

---

## Construir y publicar la imagen (referencia)

```bash
# Construir imagen reproducible desde el Dockerfile
docker build -t sari22/adoptme:1.0.0 .

# Publicar en Docker Hub (imagen ya publicada y pública)
docker login
docker push sari22/adoptme:1.0.0
```

Enlace público de la imagen: [https://hub.docker.com/r/sari22/adoptme](https://hub.docker.com/r/sari22/adoptme)

---

## Prueba rápida

```bash
curl http://localhost:8080/api/users
curl http://localhost:8080/docs
curl -X POST "http://localhost:8080/api/mocks/generateData?users=2&pets=2"
curl http://localhost:8080/api/adoptions
```

---

## Estructura relevante

```
├── Dockerfile                 # Multi-stage, optimizado y reproducible
├── docker-compose.yml         # App + Mongo para prueba local
├── README.md                  # Este archivo (Docker + Docker Hub + Swagger)
├── src/
│   ├── app.js                 # Express + Swagger UI en /docs
│   ├── docs/
│   │   ├── Users.yaml         # Documentación Swagger del módulo Users
│   │   └── Components.yaml
│   └── routes/
│       └── adoption.router.js
└── test/
    └── adoption.test.js       # Tests funcionales (éxito y error)
```

---

## Checklist de entrega

- [x] Dockerfile optimizado y reproducible (multi-stage + `npm ci --omit=dev`)
- [x] Imagen subida a Docker Hub y accesible públicamente: [sari22/adoptme](https://hub.docker.com/r/sari22/adoptme)
- [x] README con instrucciones Docker, enlace a Docker Hub y Swagger Users
- [x] Swagger del módulo Users en `/docs`
- [x] Tests funcionales completos de `adoption.router.js`

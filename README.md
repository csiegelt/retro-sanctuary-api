# 🎮 Retro Sanctuary API

API REST para gestión de consolas retro y videojuegos clásicos. Desarrollada con Node.js, Express, MongoDB y autenticación JWT.

---

## 📋 Características

- ✅ Autenticación con JWT
- ✅ Roles de usuario (user/admin)
- ✅ CRUD completo de consolas retro
- ✅ CRUD completo de videojuegos
- ✅ Soft delete en consolas
- ✅ Autorización y permisos por rol
- ✅ Relaciones entre modelos con populate
- ✅ Validaciones con Mongoose
- ✅ Manejo centralizado de errores

---

## 🚀 Tecnologías

- **Node.js** v18+
- **Express** v5.2.1
- **MongoDB** con Mongoose v9.1.5
- **JWT** para autenticación
- **Bcrypt** para hasheo de contraseñas

---

## 📦 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/csiegelt/retro-sanctuary-api.git
cd retro-sanctuary-api
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/retroSanctuary
JWT_SECRET=tu_secreto_super_seguro_cambiar_en_produccion
JWT_EXPIRES_IN=30d
```

### 4. Ejecutar el servidor

**Modo desarrollo:**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

---

## 📚 Modelos de Datos

### User (Usuario)

```javascript
{
  nombre: String,      // Obligatorio, 3-50 caracteres
  email: String,       // Obligatorio, único, formato email
  password: String,    // Obligatorio, hasheado, mínimo 6 caracteres
  role: String,        // 'user' o 'admin', default: 'user'
  createdAt: Date,
  updatedAt: Date
}
```

### Console (Consola)

```javascript
{
  nombre: String,          // Obligatorio, único
  fabricante: String,      // Obligatorio
  añoLanzamiento: Number,  // Obligatorio, entre 1970 y año actual+1
  isDeleted: Boolean,      // Default: false (soft delete)
  createdAt: Date,
  updatedAt: Date
}
```

### Game (Videojuego)

```javascript
{
  titulo: String,          // Obligatorio, max 200 caracteres
  genero: String,          // Enum: Acción, Aventura, RPG, etc.
  precioEstimado: Number,  // Obligatorio, >= 0
  console: ObjectId,       // Referencia a Console
  user: ObjectId,          // Referencia a User (creador)
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 Endpoints API

### 🔐 Autenticación

#### Registrar Usuario

```bash
POST /api/auth/register
```

**Body:**
```json
{
  "nombre": "Carlos Siegel",
  "email": "carlos@mail.com",
  "password": "password123"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Carlos Siegel",
    "email": "carlos@mail.com",
    "password": "password123"
  }'
```

**Respuesta exitosa (201):**
```json
{
  "status": "success",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "user": {
      "_id": "65f1234...",
      "nombre": "Carlos Siegel",
      "email": "carlos@mail.com",
      "role": "user",
      "createdAt": "2026-03-10T..."
    }
  }
}
```

---

#### Iniciar Sesión

```bash
POST /api/auth/login
```

**Body:**
```json
{
  "email": "carlos@mail.com",
  "password": "password123"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "carlos@mail.com",
    "password": "password123"
  }'
```

---

### 🎮 Consolas

#### Listar todas las consolas (Público)

```bash
GET /api/consoles
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/consoles
```

**Respuesta (200):**
```json
{
  "status": "success",
  "results": 3,
  "data": {
    "consoles": [
      {
        "_id": "65f...",
        "nombre": "Nintendo Entertainment System",
        "fabricante": "Nintendo",
        "añoLanzamiento": 1985,
        "createdAt": "2026-03-10T..."
      }
    ]
  }
}
```

---

#### Obtener una consola (Público)

```bash
GET /api/consoles/:id
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/consoles/65f1234567890abcdef12345
```

---

#### Crear consola (Solo Admin)

```bash
POST /api/consoles
```

**Headers requeridos:**
```
Authorization: Bearer TU_TOKEN_JWT
```

**Body:**
```json
{
  "nombre": "Super Nintendo",
  "fabricante": "Nintendo",
  "añoLanzamiento": 1991
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/consoles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "nombre": "Super Nintendo",
    "fabricante": "Nintendo",
    "añoLanzamiento": 1991
  }'
```

---

#### Actualizar consola (Solo Admin)

```bash
PUT /api/consoles/:id
```

**Headers:**
```
Authorization: Bearer TU_TOKEN_JWT_ADMIN
```

**Body:**
```json
{
  "nombre": "SNES - Super Nintendo Entertainment System",
  "fabricante": "Nintendo",
  "añoLanzamiento": 1991
}
```

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:3000/api/consoles/65f1234567890abcdef12345 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "nombre": "SNES",
    "fabricante": "Nintendo",
    "añoLanzamiento": 1991
  }'
```

---

#### Eliminar consola - Soft Delete (Solo Admin)

```bash
DELETE /api/consoles/:id
```

**Headers:**
```
Authorization: Bearer TU_TOKEN_JWT_ADMIN
```

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3000/api/consoles/65f1234567890abcdef12345 \
  -H "Authorization: Bearer TU_TOKEN"
```

**Respuesta (204):** Sin contenido

---

### 🕹️ Videojuegos

#### Listar todos los videojuegos (Público)

```bash
GET /api/games
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/games
```

**Respuesta (200) - Con populate:**
```json
{
  "status": "success",
  "results": 2,
  "data": {
    "games": [
      {
        "_id": "65f...",
        "titulo": "Super Mario Bros",
        "genero": "Plataformas",
        "precioEstimado": 150,
        "console": {
          "_id": "65f...",
          "nombre": "Nintendo Entertainment System",
          "fabricante": "Nintendo",
          "añoLanzamiento": 1985
        },
        "user": {
          "_id": "65f...",
          "nombre": "Carlos Siegel",
          "email": "carlos@mail.com"
        },
        "createdAt": "2026-03-10T..."
      }
    ]
  }
}
```

---

#### Obtener un videojuego (Público)

```bash
GET /api/games/:id
```

**Ejemplo con curl:**
```bash
curl http://localhost:3000/api/games/65f1234567890abcdef12345
```

---

#### Crear videojuego (Usuario autenticado)

```bash
POST /api/games
```

**Headers:**
```
Authorization: Bearer TU_TOKEN_JWT
```

**Body:**
```json
{
  "titulo": "The Legend of Zelda",
  "genero": "Aventura",
  "precioEstimado": 200,
  "console": "65f1234567890abcdef12345"
}
```

**Ejemplo con curl:**
```bash
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "titulo": "The Legend of Zelda",
    "genero": "Aventura",
    "precioEstimado": 200,
    "console": "65f1234567890abcdef12345"
  }'
```

**Géneros válidos:**
- Acción
- Aventura
- RPG
- Deportes
- Puzzle
- Estrategia
- Plataformas
- Carreras
- Lucha
- Otro

---

#### Actualizar videojuego (Solo el creador)

```bash
PUT /api/games/:id
```

**Headers:**
```
Authorization: Bearer TU_TOKEN_JWT
```

**Body:**
```json
{
  "titulo": "The Legend of Zelda: Edición Oro",
  "precioEstimado": 250
}
```

**Ejemplo con curl:**
```bash
curl -X PUT http://localhost:3000/api/games/65f1234567890abcdef12345 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "titulo": "Zelda Gold Edition",
    "precioEstimado": 250
  }'
```

---

#### Eliminar videojuego (Solo el creador)

```bash
DELETE /api/games/:id
```

**Headers:**
```
Authorization: Bearer TU_TOKEN_JWT
```

**Ejemplo con curl:**
```bash
curl -X DELETE http://localhost:3000/api/games/65f1234567890abcdef12345 \
  -H "Authorization: Bearer TU_TOKEN"
```

**Respuesta (204):** Sin contenido

---

## 🔒 Autenticación y Permisos

### Niveles de acceso:

| Endpoint | Público | Usuario | Admin |
|----------|---------|---------|-------|
| POST /api/auth/register | ✅ | ✅ | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ |
| GET /api/consoles | ✅ | ✅ | ✅ |
| GET /api/consoles/:id | ✅ | ✅ | ✅ |
| POST /api/consoles | ❌ | ❌ | ✅ |
| PUT /api/consoles/:id | ❌ | ❌ | ✅ |
| DELETE /api/consoles/:id | ❌ | ❌ | ✅ |
| GET /api/games | ✅ | ✅ | ✅ |
| GET /api/games/:id | ✅ | ✅ | ✅ |
| POST /api/games | ❌ | ✅ | ✅ |
| PUT /api/games/:id | ❌ | ✅* | ✅* |
| DELETE /api/games/:id | ❌ | ✅* | ✅* |

*Solo el usuario que creó el juego

---

## ⚠️ Manejo de Errores

La API devuelve errores en formato JSON consistente:

### Error de validación (400)
```json
{
  "status": "fail",
  "message": "Datos inválidos: El nombre es obligatorio. El email ya está registrado"
}
```

### No autenticado (401)
```json
{
  "status": "error",
  "message": "No estás autenticado. Por favor inicia sesión"
}
```

### Sin permisos (403)
```json
{
  "status": "error",
  "message": "No tienes permisos para realizar esta acción"
}
```

### No encontrado (404)
```json
{
  "status": "fail",
  "message": "Consola no encontrada"
}
```

### Error del servidor (500)
```json
{
  "status": "error",
  "message": "Error en el servidor"
}
```

---

## 🧪 Ejemplos de Flujo Completo

### Ejemplo 1: Registrar usuario y crear un videojuego

```bash
# 1. Registrar usuario
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Juan Perez","email":"juan@mail.com","password":"123456"}'

# Guarda el token de la respuesta

# 2. Crear consola (requiere admin, este paso lo haría un admin)
curl -X POST http://localhost:3000/api/consoles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_ADMIN" \
  -d '{"nombre":"PlayStation","fabricante":"Sony","añoLanzamiento":1994}'

# Guarda el ID de la consola creada

# 3. Crear videojuego
curl -X POST http://localhost:3000/api/games \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN" \
  -d '{
    "titulo":"Final Fantasy VII",
    "genero":"RPG",
    "precioEstimado":300,
    "console":"ID_DE_PLAYSTATION"
  }'

# 4. Listar todos los juegos con información completa
curl http://localhost:3000/api/games
```

---

## 📁 Estructura del Proyecto

```
backend_modulo2/
├── config/
│   └── database.js          # Configuración de MongoDB
├── controllers/
│   ├── auth.controller.js   # Lógica de autenticación
│   ├── console.controller.js # Lógica de consolas
│   └── game.controller.js   # Lógica de videojuegos
├── middlewares/
│   ├── auth.middleware.js   # Verificación JWT y roles
│   └── error.middleware.js  # Manejo centralizado de errores
├── models/
│   ├── Users.js             # Schema de usuarios
│   ├── Console.js           # Schema de consolas
│   └── Game.js              # Schema de videojuegos
├── routes/
│   ├── auth.routes.js       # Rutas de autenticación
│   ├── console.routes.js    # Rutas de consolas
│   └── game.routes.js       # Rutas de videojuegos
├── utils/
│   ├── AppError.js          # Clase de errores personalizados
│   └── catchAsync.js        # Wrapper para async/await
├── .env                     # Variables de entorno
├── .gitignore
├── package.json
├── README.md
└── server.js                # Punto de entrada
```

---

## 🛡️ Seguridad

- ✅ Contraseñas hasheadas con bcrypt (salt rounds: 10)
- ✅ Tokens JWT con expiración configurable
- ✅ Validación de datos con Mongoose
- ✅ Prevención de inyección NoSQL
- ✅ Headers seguros
- ✅ Rate limiting (próximamente)

---

## 📝 Scripts Disponibles

```json
{
  "start": "node server.js",      // Producción
  "dev": "nodemon server.js"      // Desarrollo con auto-reload
}
```

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

MIT

---

## 👨‍💻 Autor

**Carlos Siegel**
- GitHub: [@csiegelt](https://github.com/csiegelt)

---

## 🙏 Agradecimientos

Proyecto desarrollado como parte del Diplomado en Desarrollo Full Stack.

---

**¿Necesitas ayuda?** Abre un issue en el repositorio.
# Splitwise Backend

Este es el **backend** de mi proyecto final del bootcamp: un gestor de **gastos compartidos**.
Lo he hecho con Node + Express y MongoDB Atlas (vía Mongoose). He intentado hacer todo sencillo pero efectivo/limitacion de mi tiempo.
---

## 🚀 Tecnologías
- **Node.js + Express**
- **MongoDB Atlas** + **Mongoose**
- **dotenv**, **cors**, **nodemon**

---

## 🧭 Estructura rápida
```
splitwise-back/
├─ models/
│  ├─ User.js
│  └─ Expense.js
├─ node_modules
├─ routes/
│   ├─expenses.js
│   └─uaers.js
├─ server.js
├─ package.json
└─ .env
```

- `server.js`: arranca Express, conecta con Mongo Atlas y define las rutas.
- `models/User.js`: esquema simple de usuario (nombre y email). 
- `models/Expense.js`: esquema para gastos (título, importe, quién paga, participantes, fecha).


---

## 🔚 Endpoints principales (con ejemplos)

### Crear usuario
**POST** `/users`
```json
{
  "name": "Sergio Garcia Lopez",
  "email": "sergio@example.com"
}
```

### Listar usuarios
**GET** `/users`

### Crear gasto
**POST** `/expenses`
```json
{
  "title": "Cena",
  "amount": 25.5,
  "paidBy": "<ID de usuario que pagó>",
  "participants": ["<ID user 1>", "<ID user 2>"],
  "date": "2025-08-30T00:00:00.000Z",
  "description": "Hamburguesas"
}
```

### Listar gastos (últimos primero)
**GET** `/expenses`

---

## 🙋🏽‍♂️ Cómo levantar **localmente**
1) Instala dependencias:
```bash
npm i
```

2) Crea un archivo **.env** en la raíz con:
```bash
PORT=3000
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/gestor-gastos?retryWrites=true&w=majority
```
- Sustituye `<usuario>`, `<password>` y `<cluster>` por los mios de **MongoDB Atlas**.
- La base se llama `gestor-gastos`.

3) Arranca en desarrollo (con recarga):
```bash
npm run dev
```
Si prefieres sin nodemon:
```bash
npm start
```

4) Comprueba en el navegador o Postman:
```
GET http://localhost:3000/users
GET http://localhost:3000/expenses
```

---

## 🧰 Tests rápidos con Postman (en texto/código)

### 1) Crear usuario
```
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "Laura",
  "email": "laura@example.com"
}
```

### 2) Crear gasto
```
POST http://localhost:3000/expenses
Content-Type: application/json

{
  "title": "Taxi",
  "amount": 18,
  "paidBy": "<ID de Laura>",
  "participants": ["<ID de Laura>", "<ID de Sergio>"],
  "date": "2025-08-30T00:00:00.000Z",
  "description": "Aeropuerto"
}
```

### 3) Listar
```
GET http://localhost:3000/users
GET http://localhost:3000/expenses
```

---

## 🌐 Despliegue en **Render** 
Yo he seguido estos pasos:

1. Subí este backend a un repo llamado **`splitwise-back`** (GitHub).
2. Entré en **Render** → *New* → *Web Service* → conecté con GitHub y elegí `splitwise-back`.
3. Configuración:
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Region**: la más cercana
4. En **Environment → Add Environment Variable** puse:
   - `PORT` = `3000`
   - `MONGO_URI` = tu cadena de Atlas
5. Deploy. Cuando termina me da una URL como:
   - `https://mi-api-splitwise.onrender.com`
6. Probé:
```
GET https://mi-api-splitwise.onrender.com/users
GET https://mi-api-splitwise.onrender.com/expenses
```

---

## 🧷 Variables de entorno (ejemplos)
**.env (local)**
```bash
PORT=3000
MONGO_URI=mongodb+srv://sergio:xxx@cluster0.xxxxx.mongodb.net/gestor-gastos
```

**Render → Environment**
- `PORT=3000`
- `MONGO_URI=<tu cadena Atlas>`

**Netlifi + Render**
    Añadida la variable de entorno VITE_BACKEND_URL en Netlify apuntando al backend en Render.
	•	Redeploy del sitio en Netlify usando Trigger deploy → Deploy site para aplicar los cambios.

---

## 🛠️ Problemas reales que me salieron y cómo los arreglé

- **EADDRINUSE: 3000 ya estaba en uso**  
  Solución en Windows:
  ```bash
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

- **ECONNREFUSED 127.0.0.1:27017** (intentaba conectar a Mongo local)  
  Puse bien el **`MONGO_URI`** de Atlas (con `mongodb+srv://...`) y listo.

- **CORS bloqueando el fetch del front**  
  Añadí `cors()` en `server.js`:
  ```js
  import cors from "cors";
  app.use(cors());
  ```

- **`npm run dev` no existía**  
  Añadí los scripts en `package.json`:
  ```json
  {
    "scripts": {
      "dev": "nodemon server.js",
      "start": "node server.js"
    }
  }
  ```

---

## 🧾 Por qué hice así cada cosa (breve y claro)
- **Express** porque lo vimos en clase y es directo.
- **Mongoose** por la comodidad de los esquemas y `populate`.
- **Rutas REST sencillas** (`/users`, `/expenses`).
- **CORS** para que el front pueda llamar sin problema.
- **dotenv** para no subir contraseñas.

---

## ✅ Conclusiones y agradecimientos
- Aprendí a **levantar un backend real** con Atlas y a **exponerlo** por Render.
- Dejé los ejemplos en JSON para que **cualquier profe** pueda probar rápido en Postman.
- Por oden, empece con back y hasta que no acabe no hice el fron como aconseja Data
- Gracias a los profesores, en este caso a Data, por recomendaciones y la paciencia.


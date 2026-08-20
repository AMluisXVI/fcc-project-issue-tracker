# 🚀 Issue Tracker

**FCC Quality Assurance Project**

API de seguimiento de issues agrupados por proyecto (`/api/issues/:project`), con filtros por query string. Corresponde al proyecto "Issue Tracker" del certificado Quality Assurance de freeCodeCamp.

Issue-tracking API grouped by project (`/api/issues/:project`) with query-string filters. It implements the "Issue Tracker" project of the freeCodeCamp Quality Assurance certificate.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Mocha](https://img.shields.io/badge/Mocha-8D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Chai](https://img.shields.io/badge/Chai-A30701?style=for-the-badge&logo=chai&logoColor=white)
![freeCodeCamp](https://img.shields.io/badge/freeCodeCamp-0A0A23?style=for-the-badge&logo=freecodecamp&logoColor=white)
![tests](https://img.shields.io/badge/tests-14%2F14-brightgreen?style=for-the-badge)

---

## 📋 Características / Features

- Creación, consulta, edición y borrado de issues por proyecto.
- Filtros por cualquier campo (incluido `_id`, `open`, `created_by`, etc.) vía query string en `GET`.
- Campo `open` normalizado como booleano (`true`/`false`) en filtros y actualizaciones.
- Almacenamiento en memoria (`Map`) — sin base de datos.

- Create, read, update and delete issues per project.
- Filter by any field (including `_id`, `open`, `created_by`, etc.) via query string on `GET`.
- `open` is normalized to boolean (`true`/`false`) in filters and updates.
- In-memory storage (`Map`) — no database.

---

## ⚡ Inicio rápido / Quick Start

```bash
npm install
cp sample.env .env
npm start
```

Luego abre `http://localhost:3000`.

Then open `http://localhost:3000`.

> 💡 El `sample.env` ya incluye `PORT=3000`. Para correr los tests, activa `NODE_ENV=test` en `.env`.
>
> 💡 `sample.env` already includes `PORT=3000`. To run the tests, enable `NODE_ENV=test` in `.env`.

---

## 🛠️ Configuración / Configuration

| 🔧 Variable | 📝 Uso / Usage |
|----------|-------------|
| `PORT` | Puerto del servidor (por defecto `3000`) / Server port (default `3000`). |
| `NODE_ENV=test` | Activa el runner de tests y el endpoint `/_api/get-tests`, que freeCodeCamp usa para leer los resultados / Enables the test runner and the `/_api/get-tests` endpoint used by freeCodeCamp to read results. |

---

## 🔌 API

Todos los endpoints usan el proyecto como parte de la ruta y devuelven JSON. / All endpoints use the project as part of the route and return JSON.

### 📥 POST /api/issues/:project

Crea un issue. / Creates an issue.

| 🔑 Campo / Field | ✅ Obligatorio / Required | 📝 Descripción |
|---------------|------------------------|-------------|
| `issue_title` | sí / yes | Título del issue / Issue title |
| `issue_text` | sí / yes | Descripción / Description |
| `created_by` | sí / yes | Autor / Author |
| `assigned_to` | no | Asignado / Assignee |
| `status_text` | no | Estado / Status |

Ejemplo de request body / Example request body:

```json
{"issue_title":"Bug","issue_text":"API crashes","created_by":"Alice"}
```

Ejemplo de respuesta / Example response:

```json
{"issue_title":"Bug","issue_text":"API crashes","created_by":"Alice","assigned_to":"","status_text":"","open":true,"created_on":"2026-08-20T17:00:00.000Z","updated_on":"2026-08-20T17:00:00.000Z","_id":"b1c6e8a4-...-...-...-69f4f2a1c3d9"}
```

### 📤 GET /api/issues/:project?open=false&created_by=Alice&...

Lista los issues del proyecto, filtrados por cualquier campo del issue mediante query string. / Lists the project issues, filtered by any issue field via query string.

```json
[{"issue_title":"Bug","issue_text":"API crashes","created_by":"Alice","assigned_to":"","status_text":"","open":false,"created_on":"...","updated_on":"...","_id":"..."}]
```

### ✏️ PUT /api/issues/:project

Actualiza campos editables de un issue. / Updates editable fields of an issue.

| 🔑 Campo / Field | 📝 Descripción |
|---------------|-------------|
| `_id` | Obligatorio / Required |
| `issue_title`, `issue_text`, `created_by`, `assigned_to`, `status_text`, `open` | Campos actualizables / Updatable fields |

Request body / Request body:

```json
{"_id":"b1c6e8a4-...-...-...-69f4f2a1c3d9","open":false}
```

Response / Respuesta:

```json
{"result":"successfully updated","_id":"b1c6e8a4-...-...-...-69f4f2a1c3d9"}
```

### 🗑️ DELETE /api/issues/:project

Borra un issue. / Deletes an issue.

Request body / Request body:

```json
{"_id":"b1c6e8a4-...-...-...-69f4f2a1c3d9"}
```

Response / Respuesta:

```json
{"result":"successfully deleted","_id":"b1c6e8a4-...-...-...-69f4f2a1c3d9"}
```

### ❌ Errores / Errors

| Caso / Case | Respuesta / Response |
|-------------|----------------------|
| `POST` sin `issue_title`, `issue_text` o `created_by` | `{"error":"required field(s) missing"}` |
| `PUT` sin `_id` | `{"error":"missing _id"}` |
| `PUT` sin campos a actualizar | `{"error":"no update field(s) sent","_id":"..."}` |
| `PUT` con `_id` inexistente / non-existent | `{"error":"could not update","_id":"..."}` |
| `DELETE` sin `_id` | `{"error":"missing _id"}` |
| `DELETE` con `_id` inexistente / non-existent | `{"error":"could not delete","_id":"..."}` |

---

## ✅ Tests / Pruebas

```bash
npm test
```

Necesita `NODE_ENV=test` en `.env`. / Requires `NODE_ENV=test` in `.env`.

Resultado: **14 functional tests passing**.

Result: **14 functional tests passing**.

> 💡 freeCodeCamp lee los resultados vía `/_api/get-tests` cuando el servidor corre con `NODE_ENV=test`.
>
> 💡 freeCodeCamp reads the results via `/_api/get-tests` when the server runs with `NODE_ENV=test`.

---

## 📁 Estructura / File structure

| 📄 Archivo / File | 📝 Descripción |
|----------------|-------------|
| `server.js` | Arranque del servidor Express / Express server bootstrap. |
| `routes/api.js` | Rutas CRUD de `/api/issues/:project` y almacenamiento en memoria / `/api/issues/:project` CRUD routes and in-memory storage. |
| `tests/2_functional-tests.js` | Functional tests de la API / API functional tests. |
| `views/issue.html` | Vista de prueba en el navegador / Demo view in the browser. |

---

## 💡 Notas técnicas / Technical notes

**ES:** El proyecto sigue la anatomía de los QA projects modernos de fCC: sin base de datos, los datos viven en un `Map` en memoria. Los filtros de `GET` comparan `String(issue[key]) === String(expected)`, y `open` se normaliza de `'true'`/`'false'` a booleano antes de comparar y al actualizar. Los `_id` se generan con `crypto.randomUUID()`. `PUT` solo acepta campos de la lista `EDITABLE_FIELDS`.

**EN:** This project follows the modern fCC QA project anatomy: no database, data lives in an in-memory `Map`. `GET` filters compare `String(issue[key]) === String(expected)`, and `open` is normalized from `'true'`/`'false'` to boolean before comparing and when updating. `_id` values are generated with `crypto.randomUUID()`. `PUT` only accepts fields from the `EDITABLE_FIELDS` list.

---

## 🔗 Enlaces / Links

[![Challenge](https://img.shields.io/badge/Challenge-freeCodeCamp-0A0A23?style=for-the-badge&logo=freecodecamp&logoColor=white)](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker)
[![Repo](https://img.shields.io/badge/Repo-GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/AMluisXVI/fcc-project-issue-tracker)
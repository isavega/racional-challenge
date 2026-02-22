# Racional API

API de inversiones construida con NestJS, TypeScript y Firebase (Firestore).

## Prerequisitos

- **Node.js** >= 18
- **Yarn** >= 1.22
- **Proyecto en Firebase** con Firestore habilitado
- **Service Account** de Firebase (archivo JSON)

## Instalación y ejecución local

```bash
# 1. Instalar dependencias
yarn install

# 2. Copiar archivo de variables de entorno y configurar
cp .env.example .env
# Editar .env con los valores reales:
#   FIREBASE_SERVICE_ACCOUNT=<base64 del service account>
#   API_KEY=<cualquier string secreto>

# 4. Iniciar en modo desarrollo
yarn start:dev
```

La API estará disponible en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/docs`.

## Configurar FIREBASE_SERVICE_ACCOUNT

1. Ir a la [consola de Firebase](https://console.firebase.google.com/)
2. Seleccionar tu proyecto → Configuración del proyecto → Cuentas de servicio
3. Hacer clic en **"Generar nueva clave privada"** y descargar el archivo JSON
4. Codificar el archivo en base64:

```bash
# macOS / Linux
base64 -i service-account.json | tr -d '\n'

# O con cat
cat service-account.json | base64 | tr -d '\n'
```

5. Pegar el resultado en la variable `FIREBASE_SERVICE_ACCOUNT` del archivo `.env`

**Nota:** Si no se configura `FIREBASE_SERVICE_ACCOUNT`, el SDK intentará usar Application Default Credentials (útil cuando se ejecuta dentro de Google Cloud o con `gcloud auth application-default login`).

## Autenticación con API Key

Todos los endpoints protegidos requieren el header `X-API-Key` con el valor configurado en la variable de entorno `API_KEY`.

```bash
curl -H "X-API-Key: your-secret-api-key-here" http://localhost:3000/users/some-id
```

Los endpoints `/health` y `/seed` están excluidos de esta validación.

## Rutas de la API

### Health Check

```
GET /health
```

**Respuesta:**
```json
{
  "status": "ok",
  "timestamp": "2025-06-15T12:00:00.000Z"
}
```

---

### Usuarios

#### Actualizar usuario

```
PATCH /users/:id
```

**Body:**
```json
{
  "name": "María González",
  "email": "maria@example.com",
  "rut": "12.345.678-9",
  "phone": "+56912345678"
}
```

Todos los campos son opcionales.

**Respuesta exitosa:**
```json
{
  "success": true,
  "data": {
    "id": "abc123",
    "name": "María González",
    "email": "maria@example.com",
    "rut": "12.345.678-9",
    "phone": "+56912345678",
    "createdAt": { "_seconds": 1718452800, "_nanoseconds": 0 },
    "updatedAt": { "_seconds": 1718453000, "_nanoseconds": 0 }
  },
  "message": "User updated successfully"
}
```

---

### Portafolios

#### Actualizar portafolio

```
PATCH /portfolios/:id
```

**Body:**
```json
{
  "name": "Mi Portafolio",
  "currency": "CLP"
}
```

#### Obtener resumen del portafolio

```
GET /portfolios/:id/summary
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "portfolioId": "port-123",
    "cashBalance": 7700000,
    "stocksValue": 4404.75,
    "totalValue": 7704404.75,
    "currency": "CLP"
  },
  "message": "Portfolio summary retrieved"
}
```

#### Obtener movimientos del portafolio

```
GET /portfolios/:id/movements?limit=20&page=1
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": "tx-001",
        "movementType": "DEPOSIT",
        "portfolioId": "port-123",
        "userId": "user-456",
        "amount": 5000000,
        "date": { "_seconds": 1718452800, "_nanoseconds": 0 },
        "notes": "Initial deposit"
      },
      {
        "id": "ord-001",
        "movementType": "BUY",
        "portfolioId": "port-123",
        "userId": "user-456",
        "ticker": "AAPL",
        "quantity": 10,
        "price": 175.50,
        "status": "EXECUTED",
        "date": { "_seconds": 1718366400, "_nanoseconds": 0 }
      }
    ],
    "total": 11,
    "page": 1,
    "limit": 20,
    "totalPages": 1
  },
  "message": "Portfolio movements retrieved"
}
```

---

### Transacciones

#### Crear depósito

```
POST /transactions/deposit
```

**Body:**
```json
{
  "portfolioId": "port-123",
  "userId": "user-456",
  "amount": 500000,
  "date": "2025-06-15T12:00:00Z",
  "notes": "Monthly deposit"
}
```

#### Crear retiro

```
POST /transactions/withdrawal
```

**Body:**
```json
{
  "portfolioId": "port-123",
  "userId": "user-456",
  "amount": 100000,
  "date": "2025-06-20T12:00:00Z",
  "notes": "Emergency fund"
}
```

---

### Órdenes

#### Crear orden

```
POST /orders
```

**Body:**
```json
{
  "portfolioId": "port-123",
  "userId": "user-456",
  "ticker": "AAPL",
  "type": "BUY",
  "quantity": 10,
  "price": 175.50,
  "date": "2025-06-15T14:30:00Z"
}
```

Las órdenes se crean siempre con status `PENDING`.

---

### Seed (solo desarrollo)

```
POST /seed
```

Crea datos de prueba: 2 usuarios, 2 portafolios, 10 transacciones y 12 órdenes. Solo funciona cuando `NODE_ENV` no es `production`.

---

## Modelo de datos

### users/{userId}
| Campo      | Tipo        | Descripción                     |
|------------|-------------|---------------------------------|
| name       | string      | Nombre completo del usuario     |
| email      | string      | Correo electrónico              |
| rut        | string/null | RUT chileno                     |
| phone      | string/null | Teléfono de contacto            |
| createdAt  | Timestamp   | Fecha de creación               |
| updatedAt  | Timestamp   | Fecha de última actualización   |

### portfolios/{portfolioId}
| Campo      | Tipo         | Descripción                    |
|------------|--------------|--------------------------------|
| userId     | string       | ID del usuario propietario     |
| name       | string       | Nombre del portafolio          |
| currency   | "CLP"/"USD"  | Moneda del portafolio          |
| createdAt  | Timestamp    | Fecha de creación              |
| updatedAt  | Timestamp    | Fecha de última actualización  |

### transactions/{transactionId}
| Campo       | Tipo                     | Descripción                  |
|-------------|--------------------------|------------------------------|
| portfolioId | string                   | ID del portafolio asociado   |
| userId      | string                   | ID del usuario               |
| type        | "DEPOSIT"/"WITHDRAWAL"   | Tipo de transacción          |
| amount      | number                   | Monto de la transacción      |
| date        | Timestamp                | Fecha de la transacción      |
| notes       | string/null              | Notas opcionales             |
| createdAt   | Timestamp                | Fecha de creación            |

### orders/{orderId}
| Campo       | Tipo                                | Descripción                    |
|-------------|-------------------------------------|--------------------------------|
| portfolioId | string                              | ID del portafolio asociado     |
| userId      | string                              | ID del usuario                 |
| ticker      | string                              | Símbolo de la acción           |
| type        | "BUY"/"SELL"                        | Tipo de orden                  |
| quantity    | number                              | Cantidad de acciones           |
| price       | number                              | Precio por acción              |
| status      | "PENDING"/"EXECUTED"/"CANCELLED"    | Estado de la orden             |
| date        | Timestamp                           | Fecha de la orden              |
| createdAt   | Timestamp                           | Fecha de creación              |

## Decisiones de diseño

- **Firestore como base de datos:** Se eligió por su integración nativa con el ecosistema Firebase, escalabilidad automática y modelo de documentos flexible. No requiere administración de infraestructura.
- **Módulo Firebase global:** Se marca como `@Global()` para que `FirebaseService` esté disponible en todos los módulos sin necesidad de reimportarlo.
- **Agregación en memoria:** Firestore no soporta operaciones de agregación nativas como SUM o JOIN, por lo que el cálculo del resumen del portafolio se realiza en memoria después de consultar los documentos.
- **Respuestas estandarizadas:** Todas las respuestas siguen el formato `{ success, data, message }` para éxito y `{ success, data, message, statusCode, timestamp, path }` para errores.
- **Guard de API Key global:** Se implementa como guard global con un decorador `@Public()` para excluir endpoints específicos.
- **Sin tests unitarios:** Se priorizó entregar una API funcional, bien documentada y con datos de prueba (seed) sobre escribir tests. La lógica más compleja (agregación del resumen del portafolio) sería la candidata principal para tests unitarios. En producción se agregarían tests unitarios para los servicios y tests de integración para los endpoints con un emulador de Firestore.

## Limitaciones conocidas y mejoras para producción

1. **Agregación a escala:** La agregación en memoria para el resumen del portafolio y los movimientos no escala con grandes volúmenes de datos. En producción se recomienda:
   - Usar Cloud Functions con triggers para mantener contadores/sumas incrementales
   - Implementar un sistema de caché (Redis) para valores calculados
   - Considerar BigQuery para análisis a gran escala

2. **Precisión de decimales:** JavaScript usa `number` (IEEE 754 double precision) que puede tener errores de redondeo en operaciones financieras. En producción:
   - Usar una librería como `decimal.js` o `bignumber.js`
   - Almacenar montos como enteros (centavos/unidades mínimas)
   - Definir reglas de redondeo explícitas

3. **Sistema de autenticación:** El guard de API Key es un mecanismo simple de secreto compartido. En producción:
   - Implementar autenticación con Firebase Auth o JWT
   - Agregar autorización basada en roles (RBAC)
   - Validar que los usuarios solo puedan acceder a sus propios recursos

4. **Paginación:** La paginación actual es offset-based y se realiza en memoria. En producción:
   - Usar paginación basada en cursores de Firestore (`startAfter`)
   - Limitar las consultas directamente en Firestore en lugar de traer todos los documentos

5. **Rate limiting:** No se implementa limitación de tasa de solicitudes. En producción se recomienda usar `@nestjs/throttler` o un API Gateway.

## Uso de Inteligencia Artificial

Se utilizó **Cursor** (IDE con IA integrada, basado en Claude) como herramienta de apoyo durante todo el desarrollo. A continuación se detalla cómo se integró en el flujo de trabajo:

### Flujo de trabajo

1. **Definición del prompt inicial:** Se redactó un prompt detallado con los requisitos funcionales, el stack tecnológico, la estructura de módulos, el modelo de datos y las reglas de implementación. Este prompt funcionó como un "brief técnico" que asegura que la IA entienda el alcance completo antes de generar código.

2. **Planificación antes de ejecución:** Antes de escribir código, se usó el modo Plan de Cursor para generar y revisar un plan de implementación estructurado. Esto permitió validar la arquitectura, el orden de dependencias y las decisiones técnicas antes de comprometerse con la implementación.

3. **Generación iterativa:** El código se generó módulo por módulo, verificando la compilación después de cada paso. No se aceptó código generado sin revisión — cada archivo se evaluó contra los requisitos y las convenciones del framework.

4. **Code review asistido por IA:** Una vez que la API funcionaba, se usó la IA para auditar el código con ojo crítico de senior engineer. Esto reveló mejoras concretas que se implementaron en una segunda iteración.

### Decisiones tomadas con apoyo de IA

- **Estructura modular de NestJS:** La IA propuso la separación en módulos (firebase, users, portfolios, transactions, orders, seed, common) siguiendo las convenciones de NestJS. Se validó que esta estructura fuera coherente con proyectos NestJS de producción.
- **Patrón de guard global con `@Public()`:** La IA sugirió el patrón estándar de NestJS usando `Reflector` y `SetMetadata`, que se verificó contra la documentación oficial.
- **Agregación en memoria:** La decisión de agregar en memoria (vs. alternativas como Cloud Functions con triggers) fue una decisión consciente documentada como limitación, priorizando simplicidad para el alcance del challenge.

### Decisiones tomadas por criterio propio

- **Elección de Firestore sobre PostgreSQL:** Se eligió Firestore por la velocidad de setup (sin migraciones, sin Docker) y por la familiaridad con el ecosistema Firebase, priorizando entregar un producto funcional en el tiempo disponible.
- **Mejoras post-generación:** Tras la auditoría, se decidió implementar: extracción de constantes de colecciones, validación de existencia de entidades, servicio de validación compartido, seed idempotente con batch writes, comparación timing-safe de API key, y validación de query params con DTOs.
- **Documentación de limitaciones:** Se decidió documentar explícitamente las limitaciones (agregación a escala, precisión decimal, auth por usuario) en lugar de implementar soluciones parciales que podrían dar una falsa sensación de completitud.

### Reflexión

La IA fue más útil como **acelerador de implementación** que como tomador de decisiones. El valor principal estuvo en reducir el tiempo de scaffolding y boilerplate, permitiendo dedicar más tiempo a revisar la calidad del código, pensar en edge cases, y documentar decisiones. Las decisiones arquitecturales y la definición del estándar de calidad fueron criterio propio.

## Grobplanung

### 1. Schritt Projekt Setup
**Geplant:  1h | Ist:**

- Neues NestJS Projekt aufsetzen.
- User & Auth von bestehendem Projekt auf das neue Projekt migrieren.
- . env Datei anpassen, vorbereiten
- Globaler Prefix /api setzen
- Swagger konfigurieren (/docs) und mit persönlichen Daten erweitern.
- Logging Middleware/Interceptor migrieren.
- `informations/` Struktur für Swagger-Config erstellt
- YAML-Export für OpenAPI-Spec hinzugefügt
---

### 2. Datenbank Todo-Entity und Seed-Daten
**Geplant: 1.5h | Ist:**

- SQLite3 Connection anpassen zu data/todo.db
- TODO Entity erstellen (id, user_id, title, description, isClosed, timestamps)
- Relation zu User Entity hinzufügen
- Seed-Service:  2 User (admin/user) und 4 TODOs beim Start anlegen
- User-Entity anpassen (isAdmin-Field bereits vorhanden)
- Testen ob Datenbank korrekt angelegt wird.
---

### 3. TODO CRUD Implementation
**Geplant: 2.5h | Ist:**

- TODO Module, Controller, Service erstellen
- DTOs:  CreateTodoDto, UpdateTodoAdminDto, UpdateTodoDto, ReturnTodoDto mit Validierungen
- POST /api/todo - Todo erstellen (authenticated user)
- GET /api/todo - Liste (User:  nur eigene + isClosed=false, Admin: alle)
- GET /api/todo/:id - Einzelne Todos (Berechtigungsprüfung)
- PATCH /api/todo/:id - Update (User: nur eigene + nur isClosed auf true, Admin: alles)
- DELETE /api/todo/:id - Löschen (nur Admins)
- Guards für JWT-Auth und Admin-Rechte implementiert
---

### 4. Validierung, Swagger & Postman Test
**Geplant: 2h | Ist:**

- Alle Validierungen prüfen (title 8-50 Zeichen, description optional)
- Swagger Decorators für alle Todo-Endpoints (@ApiOperation, @ApiResponse)
- Alle DTOs mit @ApiProperty und Beispielwerten versehen
- HTTP Status-Codes prüfen (200, 201, 400, 401, 403, 404, 409)
- Manuelle Tests mit Swagger UI durchgeführt
- Fehler beheben bis alle Endpoints korrekt funktionieren
---

### 5. Unit Tests und Finalisierung
**Geplant: 1h | Ist:**

- Unit Tests für TodoService schreiben (100% Coverage)
- Unit-Tests für UserService (100% Coverage)
- Unit-Tests für PasswordService (100% Coverage)
- Coverage-Konfiguration in `package.json` angepasst
- Edge Cases für Branch Coverage identifiziert und getestet
- `pnpm run format` ausgeführt
- `pnpm run lint` ausgeführt und Fehler behoben
- `pnpm run test:cov` - **100% Statement, Branch, Function & Line Coverage erreicht**
- `pnpm run build` erfolgreich
- README.md mit Fazit aktualisiert
---
config/ → Handles database connections & environment variables.
controllers/ → Contains the logic for handling requests.
models/ → Database schemas/models (MongoDB/PostgreSQL).
routes/ → API endpoints for different functionalities.
middlewares/ → Custom middlewares for authentication, error handling, and security.
utils/ → Helper functions (JWT, email, logging, etc.).
app.js → Initializes Express and middleware.
server.js → Starts the server.

install --> npm init -y
npm install express @prisma/client bcryptjs dotenv jsonwebtoken cors helmet
npm install -D prisma nodemon


Initialize Prisma --> npx prisma init

Database Migrate --> npx prisma migrate dev --name init


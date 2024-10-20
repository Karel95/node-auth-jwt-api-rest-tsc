
npm init

npm install ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma --save-dev

npm install express jsonwebtoken bcrypt @prisma/client dotenv typescript

npx tsc --init --outDir dist/ --rootDir src

tsconfig.json:
"exclude": ["node-modules", "dist"],
"include": ["src"],

src/app.ts:
package.json:
"scripts": {
  "dev": "tsnd --respawn --clear src/app.ts",
},
npm run dev

src/server.ts:
package.json:
"scripts": {
  "dev": "tsnd --respawn --clear src/server.ts",
},

routes/authRoutes.ts

models/
user.ts
user.interface.ts
jwt.interface.ts

controllers/authController.ts

services/
password.service.ts
auth.service.ts

docker-compose.yml

npx prisma init

schema.prisma:
model user {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}

npx prisma generate

docker-compose up -d

npx prisma migrate dev

npm run dev

Postman: POST
http://localhost:3000/auth/register
http://localhost:3000/auth/login
{ 
    "email": "", 
    "password": ""
}

routes/userRoutes.ts

controllers/usersController.ts

Postman: POST, GET, PUT, DEL

package.json:
"scripts": {
    "dev": "tsnd --respawn --clear src/server.ts",
    "build": "rimraf dist && tsc",
    "start": "node dist/server.js",
  },
npm run build

npm install --save-dev @types/cors

npx prisma migrate dev --name add-name-to-user


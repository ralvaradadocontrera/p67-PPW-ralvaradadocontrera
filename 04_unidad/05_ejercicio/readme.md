

npm install express @prisma/client @prisma/adapter-pg pg
npm install prisma --save-dev
npm install -D @types/pg

npx prisma init
npx prisma generate
npx prisma migrate dev --name tiendita

npm start



import express from 'express';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';

const app = express();
dotenv.config();

app.use(bodyParser.json());

app.get('/test', (req, res) => res.sendStatus(200));

(async () => {
   try {
     await createConnection({
       type: 'mysql',
       host: process.env.DB_HOST,
       port: 3306,
       username: process.env.DB_USERNAME,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME,
       entities: [],
       synchronize: true, // DO NOT USE FOR PRODUCTION! USE MIGRATIONS INSTEAD
     });
     app.listen(parseInt(process.env.DB_PORT, 10), () => {
       console.log(`Server is up and listening on port ${process.env.PORT || 4000}.`);
     });
   } catch (err) {
     console.log(err);
   }
 })();
 
 export default app;
import express from 'express';
import bodyParser from 'body-parser';
import { createConnection } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entities/User';
import router from './routes/router';

// Loads the expres server and binds it to a variable
const app = express();
// Loads the .env file
dotenv.config();

app.use(bodyParser.json());
app.use(router);

app.get('/test', (req, res) => res.sendStatus(200));

(async () => {
   try {
     // Connects to the database using your credentials
     await createConnection({
       type: 'postgres',
       host: process.env.DB_HOST,
       port: 5432,
       username: process.env.DB_USERNAME,
       password: process.env.DB_PASSWORD,
       database: process.env.DB_NAME,
       // Entities are also called 'models' on other databases/ORMs
       entities: [User],
       synchronize: true, // DO NOT USE FOR PRODUCTION! USE MIGRATIONS INSTEAD
     });
     app.listen(parseInt(process.env.PORT, 10), () => {
       console.log(`Server is up and listening on port ${process.env.PORT || 4000}.`);
     });
   } catch (err) {
     console.log(err);
   }
 })();
 
 export default app;
import app from './app.js';
import Loaders from './Loaders/index.js';
import { configDotenv } from 'dotenv';

configDotenv();

Loaders.dbConn();

app.listen(4000, () => {
  console.log("server running")
})
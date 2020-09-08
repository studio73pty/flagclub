const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
//const bcrypt = require('bcrypt-nodejs');
require('dotenv').config();



const db = knex({
    client: 'mysql',
    connection: {
      host : process.env.DB_HOST,
      user : process.env.DB_USER,
      password : process.env.DB_PASSWORD,
      port: 3306,
      database: process.env.DATABASE
    }
});


const app = express();

  // Middleware
app.use(bodyParser.json());
app.use(cors({origin: '*'}));
  

//Inicio de endpoints

app.get('/', (req, res) => {res.json('deporte vivo!')});








const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`I'm alive here ${port}`))

const connectToMongo = require('./db');
const express = require('express')
var cors=require("cors")

// require("./db");  // Promises syntax

const app = express()
const port = 5000
connectToMongo();
app.use(express.json())
app.use(cors());
// Available Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


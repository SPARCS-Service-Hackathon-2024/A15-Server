const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./src/api/routes/userRoutes');
const db = require('./src/config/db')

const app = express();

app.use(cors());
app.use(bodyParser.json({
  limit: "200mb"
}));

app.use('/users', userRoutes);

db.connectDatabase();

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

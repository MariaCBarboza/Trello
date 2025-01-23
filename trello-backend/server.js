const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');


dotenv.config();
const app = express();

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error(err));

app.use(express.json());
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('API funcionando!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
connectDB();

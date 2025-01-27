const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const quadroRoutes = require('./routes/quadroRoutes');
const authRoutes = require('./routes/authRoutes');
const path = require('path');
const cors = require('cors');
const listaRoutes = require('./routes/listaRoutes')
const cardRoutes = require('./routes/cardRoutes')



dotenv.config();
const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB conectado!'))
  .catch(err => console.error(err));

app.use(express.json());
app.use('/api', authRoutes, quadroRoutes, listaRoutes, cardRoutes);


app.get('/', (req, res) => {
    res.send('API funcionando!');
});

app.use(express.static(path.join(__dirname, 'public')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
connectDB();

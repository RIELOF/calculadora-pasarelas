const express = require('express');
const cors = require('cors');
const { calcularComisiones, TASAS_DEFAULT } = require('./src/comisiones');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post('/calcular', (req, res) => {
  const { monto, tipo, tasas } = req.body;

  if (monto === undefined || monto === null) {
    return res.status(400).json({ error: 'El campo monto es requerido' });
  }
  if (!tipo) {
    return res.status(400).json({ error: 'El campo tipo es requerido' });
  }

  const montoNum = Number(monto);
  if (!Number.isFinite(montoNum) || montoNum <= 0) {
    return res.status(400).json({ error: 'El monto debe ser un número positivo' });
  }

  try {
    const resultado = calcularComisiones(montoNum, tipo, tasas || TASAS_DEFAULT);
    res.json(resultado);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/tasas', (req, res) => {
  res.json(TASAS_DEFAULT);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

# Comparador de Pasarelas de Pago — Chile

Herramienta web para comparar comisiones de las principales pasarelas de pago en Chile.

## Pasarelas incluidas

| Pasarela | Débito | Crédito | Prepago |
|---|---|---|---|
| Transbank (Webpay) | 1.75% | 3.20% | 1.75% |
| Flow | 2.89% | 2.89% | 2.89% |
| Mercado Pago | 2.99% | 2.99% | 2.99% |
| Compraquí Básico | 2.30% | 2.30% | 2.30% |
| Compraquí Súper | 1.29% | 1.59% | 1.44% |
| Getnet | 1.50% | 3.00% | 1.50% |

## Requisitos

- Node.js 18+
- npm 8+

---

## Opción 1: Desarrollo manual

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
# Corre en http://localhost:3001
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Corre en http://localhost:5173
```

Abrir **http://localhost:5173** en el navegador.

---

## Opción 2: Docker

```bash
docker-compose up --build
```

Abrir **http://localhost** en el navegador.

---

## API

### POST /calcular

Calcula comisiones para todas las pasarelas.

**Request:**
```json
{
  "monto": 100000,
  "tipo": "debito"
}
```

**Response** (ordenado de menor a mayor comisión):
```json
[
  {
    "pasarela": "Compraquí Súper",
    "porcentaje": 1.29,
    "comision": 1290,
    "liquido": 98710
  }
]
```

Tipos válidos: `debito`, `credito`, `prepago`

### GET /tasas

Retorna las tasas por defecto de cada pasarela.

---

## Estructura del proyecto

```
calculadora/
├── backend/
│   ├── index.js          # Servidor Express (puerto 3001)
│   ├── src/
│   │   └── comisiones.js # Lógica de cálculo (función pura)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── services/api.js
│   │   └── components/
│   │       ├── FormCalculo.jsx        # Input monto + tipo
│   │       ├── TablaResultados.jsx    # Tabla comparativa
│   │       ├── GraficoBarras.jsx      # Gráfico Chart.js
│   │       └── ConfiguracionTasas.jsx # Editor de tasas
│   └── package.json
└── docker-compose.yml
```

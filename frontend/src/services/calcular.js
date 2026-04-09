// Valor UF referencial en CLP (actualizar periódicamente)
export const UF_CLP_DEFAULT = 38500;

export const TASAS_DEFAULT = {
  // Transbank: tarifa variable (%) + tarifa fija (UF) por transacción — tarjetas nacionales
  transbank: {
    debito:  { pct: 0.0061, uf: 0.001784 },
    credito: { pct: 0.0132, uf: 0.001915 },
    prepago: { pct: 0.0111, uf: 0.001784 },
  },
  flow:             { debito: 0.0289, credito: 0.0289, prepago: 0.0289 },
  mercadopago:      { debito: 0.0299, credito: 0.0299, prepago: 0.0299 },
  compraquisBasico: { debito: 0.023,  credito: 0.023,  prepago: 0.023  },
  compraquisSuper:  { debito: 0.0129, credito: 0.0159, prepago: 0.0144 },
  tuuPercentual:    { debito: 0.0149, credito: 0.0149, prepago: 0.0149 },
  tuuMixta:         {
    debito:  { pct: 0.0079, uf: 0.00169 },
    credito: { pct: 0.0079, uf: 0.00169 },
    prepago: { pct: 0.0079, uf: 0.00169 },
  },
  getnet:           {
    debito:  { pct: 0.0058, uf: 0.001668 },
    credito: { pct: 0.0146, uf: 0.001792 },
    prepago: { pct: 0.0121, uf: 0.001668 },
  },
};

const NOMBRES = {
  transbank:        'Transbank (Webpay)',
  flow:             'Flow',
  mercadopago:      'Mercado Pago',
  compraquisBasico: 'Compraquí Básico',
  compraquisSuper:  'Compraquí Súper',
  tuuPercentual:    'TUU',
  tuuMixta:         'TUU (Mixto)',
  getnet:           'Getnet',
};

const IVA = 0.19;

function calcularNeta(monto, rate, ufCLP) {
  if (typeof rate === 'number') {
    return Math.round(monto * rate);
  }
  // rate = { pct, uf } — Transbank
  return Math.round(monto * rate.pct + rate.uf * ufCLP);
}

export function calcularComisiones(monto, tipo, tasas = TASAS_DEFAULT, ufCLP = UF_CLP_DEFAULT) {
  return Object.entries(tasas)
    .map(([key, rates]) => {
      const rate = rates[tipo];
      const comisionNeta = calcularNeta(monto, rate, ufCLP);
      const iva = Math.round(comisionNeta * IVA);
      const comision = comisionNeta + iva;

      return {
        pasarela: NOMBRES[key] || key,
        porcentaje: typeof rate === 'number' ? rate * 100 : rate.pct * 100,
        tarifaUF: typeof rate === 'object' ? rate.uf : null,
        comisionNeta,
        iva,
        comision,
        liquido: monto - comision,
      };
    })
    .sort((a, b) => a.comision - b.comision);
}

const TASAS_DEFAULT = {
  transbank: { debito: 0.0175, credito: 0.032, prepago: 0.0175 },
  flow: { debito: 0.0289, credito: 0.0289, prepago: 0.0289 },
  mercadopago: { debito: 0.0299, credito: 0.0299, prepago: 0.0299 },
  compraquisBasico: { debito: 0.023, credito: 0.023, prepago: 0.023 },
  compraquisSuper: { debito: 0.0129, credito: 0.0159, prepago: 0.0144 },
  getnet: { debito: 0.015, credito: 0.030, prepago: 0.015 },
};

const NOMBRES = {
  transbank: 'Transbank (Webpay)',
  flow: 'Flow',
  mercadopago: 'Mercado Pago',
  compraquisBasico: 'Compraquí Básico',
  compraquisSuper: 'Compraquí Súper',
  getnet: 'Getnet',
};

const TIPOS_VALIDOS = ['debito', 'credito', 'prepago'];

function calcularComisiones(monto, tipo, tasas = TASAS_DEFAULT) {
  const tipoNorm = tipo.toLowerCase();

  if (!TIPOS_VALIDOS.includes(tipoNorm)) {
    throw new Error('Tipo de tarjeta inválido. Use: debito, credito o prepago');
  }
  if (!Number.isFinite(monto) || monto <= 0) {
    throw new Error('El monto debe ser un número positivo');
  }

  return Object.entries(tasas)
    .map(([key, rates]) => {
      const porcentaje = rates[tipoNorm];
      const comision = Math.round(monto * porcentaje);
      const liquido = monto - comision;
      return {
        pasarela: NOMBRES[key] || key,
        porcentaje: porcentaje * 100,
        comision,
        liquido,
      };
    })
    .sort((a, b) => a.comision - b.comision);
}

module.exports = { calcularComisiones, TASAS_DEFAULT, NOMBRES };

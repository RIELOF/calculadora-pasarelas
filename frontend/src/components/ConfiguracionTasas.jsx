import { TASAS_DEFAULT } from '../App';

const NOMBRES = {
  transbank: 'Transbank (Webpay)',
  flow: 'Flow',
  mercadopago: 'Mercado Pago',
  compraquisBasico: 'Compraquí Básico',
  compraquisSuper: 'Compraquí Súper',
  getnet: 'Getnet',
};

export default function ConfiguracionTasas({ tasas, onChange }) {
  const handleChange = (pasarela, tipo, valor) => {
    const num = parseFloat(valor);
    if (isNaN(num) || num < 0 || num > 100) return;
    onChange({
      ...tasas,
      [pasarela]: {
        ...tasas[pasarela],
        [tipo]: num / 100,
      },
    });
  };

  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <h3 className="card-title">Personalizar tasas (%)</h3>
      <div className="tabla-wrapper">
        <table className="config-tabla">
          <thead>
            <tr>
              <th>Pasarela</th>
              <th>Débito</th>
              <th>Crédito</th>
              <th>Prepago</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(tasas).map(([key, rates]) => (
              <tr key={key}>
                <td>{NOMBRES[key] || key}</td>
                {['debito', 'credito', 'prepago'].map((tipo) => (
                  <td key={tipo}>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={(rates[tipo] * 100).toFixed(2)}
                      onChange={(e) => handleChange(key, tipo, e.target.value)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="btn-reset" onClick={() => onChange(TASAS_DEFAULT)}>
        Restaurar valores por defecto
      </button>
    </div>
  );
}

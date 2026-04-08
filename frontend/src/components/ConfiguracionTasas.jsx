import { TASAS_DEFAULT, UF_CLP_DEFAULT } from '../services/calcular';

const NOMBRES = {
  transbank:        'Transbank (Webpay)',
  flow:             'Flow',
  mercadopago:      'Mercado Pago',
  compraquisBasico: 'Compraquí Básico',
  compraquisSuper:  'Compraquí Súper',
  getnet:           'Getnet',
};

const clp = (v) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

export default function ConfiguracionTasas({ tasas, onChange, ufCLP, onUfChange }) {
  const handleChange = (pasarela, tipo, campo, valor) => {
    const num = parseFloat(valor);
    if (isNaN(num) || num < 0) return;

    const rateActual = tasas[pasarela][tipo];
    const nuevaRate =
      typeof rateActual === 'object'
        ? { ...rateActual, [campo]: campo === 'pct' ? num / 100 : num }
        : num / 100;

    onChange({
      ...tasas,
      [pasarela]: { ...tasas[pasarela], [tipo]: nuevaRate },
    });
  };

  const esTransbank = (key) => typeof Object.values(tasas[key])[0] === 'object';

  return (
    <div className="card" style={{ marginTop: '0.75rem' }}>
      <h3 className="card-title">Personalizar tasas</h3>

      {/* Valor UF */}
      <div className="uf-row">
        <label htmlFor="uf-val">Valor UF referencial</label>
        <div className="uf-input-wrap">
          <span>$</span>
          <input
            id="uf-val"
            type="number"
            min="1"
            step="1"
            value={ufCLP}
            onChange={(e) => onUfChange(Number(e.target.value))}
            style={{ width: '110px' }}
          />
          <span className="uf-hint">actual ≈ {clp(ufCLP)}</span>
        </div>
      </div>

      <div className="config-tabla-wrapper">
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
                {['debito', 'credito', 'prepago'].map((tipo) => {
                  const rate = rates[tipo];
                  return (
                    <td key={tipo}>
                      {typeof rate === 'object' ? (
                        <div className="transbank-rate">
                          <input
                            type="number" min="0" max="100" step="0.01"
                            value={(rate.pct * 100).toFixed(2)}
                            onChange={(e) => handleChange(key, tipo, 'pct', e.target.value)}
                            title="Tasa variable (%)"
                          />
                          <span className="rate-sep">% +</span>
                          <input
                            type="number" min="0" step="0.000001"
                            value={rate.uf}
                            onChange={(e) => handleChange(key, tipo, 'uf', e.target.value)}
                            title="Tarifa fija (UF)"
                            style={{ width: '72px' }}
                          />
                          <span className="rate-sep">UF</span>
                        </div>
                      ) : (
                        <input
                          type="number" min="0" max="100" step="0.01"
                          value={(rate * 100).toFixed(2)}
                          onChange={(e) => handleChange(key, tipo, 'pct', e.target.value)}
                        />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn-reset" onClick={() => { onChange(TASAS_DEFAULT); onUfChange(UF_CLP_DEFAULT); }}>
        Restaurar valores por defecto
      </button>
    </div>
  );
}

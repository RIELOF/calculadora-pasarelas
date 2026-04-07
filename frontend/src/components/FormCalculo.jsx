import { useState } from 'react';

function formatearMonto(valor) {
  const solo_digitos = valor.replace(/\D/g, '');
  return solo_digitos.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

export default function FormCalculo({ onCalcular, loading }) {
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState('debito');
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const montoLimpio = monto.replace(/\./g, '');
    const montoNum = parseInt(montoLimpio, 10);

    if (!montoLimpio || isNaN(montoNum) || montoNum <= 0) {
      setValidationError('Ingresa un monto válido mayor a $0');
      return;
    }
    if (montoNum > 999_999_999) {
      setValidationError('El monto máximo es $999.999.999');
      return;
    }

    setValidationError('');
    onCalcular(montoNum, tipo);
  };

  return (
    <div className="card">
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="monto">Monto de venta (CLP)</label>
            <div className="input-prefix">
              <span>$</span>
              <input
                id="monto"
                type="text"
                inputMode="numeric"
                placeholder="100.000"
                value={monto}
                onChange={(e) => setMonto(formatearMonto(e.target.value))}
                autoComplete="off"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tipo">Tipo de tarjeta</label>
            <select
              id="tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
            >
              <option value="debito">Débito</option>
              <option value="credito">Crédito</option>
              <option value="prepago">Prepago</option>
            </select>
          </div>

          <button type="submit" className="btn-calcular" disabled={loading}>
            {loading ? 'Calculando…' : 'Calcular'}
          </button>
        </div>

        {validationError && (
          <p className="form-validation-error">{validationError}</p>
        )}
      </form>
    </div>
  );
}

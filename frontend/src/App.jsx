import { useState } from 'react';
import FormCalculo from './components/FormCalculo';
import TablaResultados from './components/TablaResultados';
import GraficoBarras from './components/GraficoBarras';
import ConfiguracionTasas from './components/ConfiguracionTasas';
import { calcular } from './services/api';

export const TASAS_DEFAULT = {
  transbank: { debito: 0.0175, credito: 0.032, prepago: 0.0175 },
  flow: { debito: 0.0289, credito: 0.0289, prepago: 0.0289 },
  mercadopago: { debito: 0.0299, credito: 0.0299, prepago: 0.0299 },
  compraquisBasico: { debito: 0.023, credito: 0.023, prepago: 0.023 },
  compraquisSuper: { debito: 0.0129, credito: 0.0159, prepago: 0.0144 },
  getnet: { debito: 0.015, credito: 0.030, prepago: 0.015 },
};

export default function App() {
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [tasas, setTasas] = useState(TASAS_DEFAULT);
  const [mostrarConfig, setMostrarConfig] = useState(false);

  const handleCalcular = async (monto, tipo) => {
    setLoading(true);
    setError('');
    try {
      const data = await calcular(monto, tipo, tasas);
      setResultados(data);
    } catch (err) {
      setError(err.message);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Comparador de Pasarelas de Pago</h1>
        <p>Compara comisiones de las principales pasarelas en Chile</p>
      </header>

      <main className="app-main">
        <FormCalculo onCalcular={handleCalcular} loading={loading} />

        {error && <div className="error-msg">⚠️ {error}</div>}

        {resultados.length > 0 && (
          <>
            <TablaResultados resultados={resultados} />
            <GraficoBarras resultados={resultados} />
          </>
        )}

        <div className="config-section">
          <button
            className="btn-config"
            onClick={() => setMostrarConfig((v) => !v)}
          >
            {mostrarConfig ? '▲ Ocultar configuración' : '⚙️ Personalizar tasas'}
          </button>
          {mostrarConfig && (
            <ConfiguracionTasas tasas={tasas} onChange={setTasas} />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Tasas referenciales — verificar con cada proveedor antes de contratar</p>
      </footer>
    </div>
  );
}

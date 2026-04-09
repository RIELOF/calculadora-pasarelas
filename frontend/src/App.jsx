import { useState, useEffect, useMemo } from 'react';
import FormCalculo from './components/FormCalculo';
import TablaResultados from './components/TablaResultados';
import GraficoBarras from './components/GraficoBarras';
import ConfiguracionTasas from './components/ConfiguracionTasas';
import FiltrosPasarelas from './components/FiltrosPasarelas';
import { calcularComisiones, TASAS_DEFAULT, UF_CLP_DEFAULT } from './services/calcular';
import { obtenerUF } from './services/uf';

const clp = (v) =>
  new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 2 }).format(v);

const VEINTICUATRO_HORAS = 24 * 60 * 60 * 1000;

// Lista fija de nombres para los filtros
const TODAS_PASARELAS = Object.values({
  transbank:        'Transbank (Webpay)',
  flow:             'Flow',
  mercadopago:      'Mercado Pago',
  compraquisBasico: 'Compraquí Básico',
  compraquisSuper:  'Compraquí Súper',
  klap:             'Klap',
  sumup:            'SumUp',
  tuuPercentual:    'TUU',
  tuuMixta:         'TUU (Mixta)',
  getnet:           'Getnet',
});

export default function App() {
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState('');
  const [tasas, setTasas] = useState(TASAS_DEFAULT);
  const [ufCLP, setUfCLP] = useState(UF_CLP_DEFAULT);
  const [ufFecha, setUfFecha] = useState(null);
  const [ufCargando, setUfCargando] = useState(true);
  const [mostrarConfig, setMostrarConfig] = useState(false);
  const [activas, setActivas] = useState(new Set(TODAS_PASARELAS));

  const fetchUF = async () => {
    setUfCargando(true);
    try {
      const { valor, fecha } = await obtenerUF();
      setUfCLP(valor);
      setUfFecha(fecha);
    } catch {
      // Mantiene el valor por defecto si falla
    } finally {
      setUfCargando(false);
    }
  };

  useEffect(() => {
    fetchUF();
    const intervalo = setInterval(fetchUF, VEINTICUATRO_HORAS);
    return () => clearInterval(intervalo);
  }, []);

  const handleCalcular = (monto, tipo) => {
    try {
      const data = calcularComisiones(monto, tipo, tasas, ufCLP);
      setResultados(data);
      setError('');
    } catch (err) {
      setError(err.message);
      setResultados([]);
    }
  };

  const resultadosFiltrados = useMemo(
    () => resultados.filter((r) => activas.has(r.pasarela)),
    [resultados, activas]
  );

  return (
    <div className="app">
      <header className="app-header">
        <h1>Comparador de Pasarelas de Pago</h1>
        <p>Compara comisiones de las principales pasarelas en Chile</p>
        <div className="uf-banner">
          {ufCargando ? (
            <span className="uf-loading">Obteniendo UF…</span>
          ) : (
            <>
              <span className="uf-valor">UF: <strong>{clp(ufCLP)}</strong></span>
              {ufFecha && (
                <span className="uf-fecha">
                  actualizada {ufFecha.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
              )}
              <button className="uf-refresh" onClick={fetchUF} title="Actualizar UF">↻</button>
            </>
          )}
        </div>
      </header>

      <main className="app-main">
        <FormCalculo onCalcular={handleCalcular} />

        <FiltrosPasarelas
          pasarelas={TODAS_PASARELAS}
          activas={activas}
          onChange={setActivas}
        />

        {error && <div className="error-msg">⚠️ {error}</div>}

        {resultadosFiltrados.length > 0 && (
          <>
            <TablaResultados resultados={resultadosFiltrados} />
            <GraficoBarras resultados={resultadosFiltrados} />
          </>
        )}

        {resultados.length > 0 && resultadosFiltrados.length === 0 && (
          <div className="error-msg">⚠️ Selecciona al menos una pasarela para ver resultados.</div>
        )}

        <div className="config-section">
          <button className="btn-config" onClick={() => setMostrarConfig((v) => !v)}>
            {mostrarConfig ? '▲ Ocultar configuración' : '⚙️ Personalizar tasas'}
          </button>
          {mostrarConfig && (
            <ConfiguracionTasas
              tasas={tasas}
              onChange={setTasas}
              ufCLP={ufCLP}
              onUfChange={setUfCLP}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Tasas referenciales — verificar con cada proveedor antes de contratar</p>
        <p className="app-footer-firma">Diseñado por <strong>AGH</strong></p>
      </footer>
    </div>
  );
}

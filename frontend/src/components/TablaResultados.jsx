const clp = (value) =>
  new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(value);

export default function TablaResultados({ resultados }) {
  return (
    <div className="card">
      <h2 className="card-title">Comparativa de comisiones</h2>

      {/* Tabla — desktop */}
      <div className="tabla-wrapper">
        <table className="tabla-resultados">
          <thead>
            <tr>
              <th>Pasarela</th>
              <th>Tasa</th>
              <th>Comisión</th>
              <th>Monto líquido</th>
            </tr>
          </thead>
          <tbody>
            {resultados.map((r, i) => {
              const esMejor = i === 0;
              const esPeor = i === resultados.length - 1;
              return (
                <tr
                  key={r.pasarela}
                  className={esMejor ? 'row-mejor' : esPeor ? 'row-peor' : ''}
                >
                  <td>
                    <div className="pasarela-cell">
                      {r.pasarela}
                      {esMejor && <span className="badge badge-mejor">🟢 más barato</span>}
                      {esPeor  && <span className="badge badge-peor">🔴 más caro</span>}
                    </div>
                  </td>
                  <td className="num">{r.porcentaje.toFixed(2)}%</td>
                  <td className="num comision-val">− {clp(r.comision)}</td>
                  <td className="num liquido-val">{clp(r.liquido)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards — móvil */}
      <div className="cards-mobile">
        {resultados.map((r, i) => {
          const esMejor = i === 0;
          const esPeor = i === resultados.length - 1;
          return (
            <div
              key={r.pasarela}
              className={`result-card ${esMejor ? 'mejor' : esPeor ? 'peor' : ''}`}
            >
              <div className="result-card-header">
                <span className="result-card-name">{r.pasarela}</span>
                {esMejor && <span className="badge badge-mejor">🟢 más barato</span>}
                {esPeor  && <span className="badge badge-peor">🔴 más caro</span>}
              </div>
              <div className="result-card-body">
                <div className="result-card-item">
                  <span className="result-card-label">Tasa</span>
                  <span className="result-card-value">{r.porcentaje.toFixed(2)}%</span>
                </div>
                <div className="result-card-item">
                  <span className="result-card-label">Comisión</span>
                  <span className="result-card-value comision-val">− {clp(r.comision)}</span>
                </div>
                <div className="result-card-item">
                  <span className="result-card-label">Líquido</span>
                  <span className="result-card-value liquido-val">{clp(r.liquido)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const TODAS = 'todas';

export default function FiltrosPasarelas({ pasarelas, activas, onChange }) {
  const todasActivas = activas.size === pasarelas.length;

  const toggleTodas = () => {
    if (todasActivas) {
      onChange(new Set());
    } else {
      onChange(new Set(pasarelas));
    }
  };

  const toggle = (nombre) => {
    const nuevo = new Set(activas);
    if (nuevo.has(nombre)) {
      nuevo.delete(nombre);
    } else {
      nuevo.add(nombre);
    }
    onChange(nuevo);
  };

  return (
    <div className="filtros-card card">
      <div className="filtros-header">
        <span className="filtros-titulo">Filtrar pasarelas</span>
        <button className="filtros-toggle-todas" onClick={toggleTodas}>
          {todasActivas ? 'Deseleccionar todas' : 'Seleccionar todas'}
        </button>
      </div>
      <div className="filtros-grid">
        {pasarelas.map((nombre) => (
          <label key={nombre} className="filtro-item">
            <input
              type="checkbox"
              checked={activas.has(nombre)}
              onChange={() => toggle(nombre)}
            />
            <span>{nombre}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

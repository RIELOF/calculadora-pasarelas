const BASE_URL = import.meta.env.VITE_API_URL || '';

export async function calcular(monto, tipo, tasas) {
  let res;
  try {
    res = await fetch(`${BASE_URL}/calcular`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ monto, tipo, tasas }),
    });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté disponible.');
  }

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Error al calcular');
  }
  return data;
}

export async function obtenerTasas() {
  const res = await fetch(`${BASE_URL}/tasas`);
  if (!res.ok) throw new Error('Error al obtener tasas');
  return res.json();
}

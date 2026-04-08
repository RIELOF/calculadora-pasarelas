const UF_API = 'https://mindicador.cl/api/uf';

export async function obtenerUF() {
  const res = await fetch(UF_API);
  if (!res.ok) throw new Error('No se pudo obtener el valor de la UF');
  const data = await res.json();
  const valor = data.serie[0].valor;
  const fecha = new Date(data.serie[0].fecha);
  return { valor, fecha };
}

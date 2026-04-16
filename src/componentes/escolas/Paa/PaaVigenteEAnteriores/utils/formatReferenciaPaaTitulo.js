/** Troca " a " por "/" na referência do período (ex.: 2024 a 2025 → 2024/2025). */
export const formatReferenciaPaaTitulo = (referencia) => {
  if (!referencia) return '';
  const s = String(referencia);
  const idx = s.toLowerCase().indexOf(' a ');
  if (idx === -1) return s;
  return `${s.slice(0, idx)}/${s.slice(idx + 3)}`;
};

/** Título da barra do card: `PAA 2024/2025` ou `PAA` se não houver referência. */
export const tituloCardPaa = (referencia) => {
  const formatado = formatReferenciaPaaTitulo(referencia);
  return formatado ? `PAA ${formatado}` : 'PAA';
};

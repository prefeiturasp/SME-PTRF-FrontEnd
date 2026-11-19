// Converte uma data ISO (aaaa-mm-dd) em dd/mm/aaaa, sem passar pelo fuso do navegador.
export const formatarDataIso = (dataIso) => (dataIso ? dataIso.split("-").reverse().join("/") : "");

export const formatarIntervalo = (dataInicial, dataFinal) =>
  // `${formatarDataIso(dataInicial)} a ${formatarDataIso(dataFinal)}`;
  `${formatarDataIso(dataInicial).substr(6, 4) }/${formatarDataIso(dataFinal).substr(6, 4)}`;
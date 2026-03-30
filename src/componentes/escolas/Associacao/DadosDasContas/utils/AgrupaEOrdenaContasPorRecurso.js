export const agrupaContasPorRecurso = (contas) => {
  return contas.reduce((grupos, conta, index) => {
    const recurso = conta.nome_recurso;
    if (!grupos[recurso]) {
        grupos[recurso] = [];
    }
    grupos[recurso].push({ ...conta, indexOriginal: index });
    return grupos;
  }, {});
};

export const ordenaGrupos = (grupos) => {
  return Object.entries(grupos).sort(([a], [b]) => {
    const aIsPTRF = a.includes('PTRF');
    const bIsPTRF = b.includes('PTRF');
    
    if (aIsPTRF && !bIsPTRF) return -1;
    if (!aIsPTRF && bIsPTRF) return 1;
    
    return a.localeCompare(b);
  });
}
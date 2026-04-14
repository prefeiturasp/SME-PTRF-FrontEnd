/**
 * Em retificação, o botão "Retificar o PAA" (nova retificação sobre a atual) só deve aparecer
 * quando a ata de retificação já foi gerada com sucesso.
 */
export function ataRetificacaoGerada(vigente) {
  const ata = vigente?.retificacao?.ata;
  if (!ata) return false;
  return (
    ata.existe_arquivo === true && ata.status?.status_geracao === 'CONCLUIDO'
  );
}

export function podeExibirBotaoRetificar(vigente) {
  if (!vigente) return false;
  if (vigente.esta_em_retificacao) {
    return ataRetificacaoGerada(vigente);
  }
  return Boolean(vigente.pode_retificar);
}

import { visoesService } from "../../../../../services/visoes.service";
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
  const regras_podem_retificar = [
    visoesService.featureFlagAtiva('paa-retificacao'),
    vigente.pode_retificar,
  ]
  const regras_podem_continuar_retificacao = [
    visoesService.featureFlagAtiva('paa-retificacao'),
    vigente.esta_em_retificacao,
    // ciclo_retificacao_sem_documento=True indica que o ciclo corrente ainda não gerou
    // seu próprio documento — o doc exibido pode ser fallback do ciclo anterior (FINAL),
    // por isso não inferimos o estado via versao do documento.
    vigente.ciclo_retificacao_sem_documento === true,
  ]

  return regras_podem_retificar.every((regra) => regra === true) ||
          regras_podem_continuar_retificacao.every((regra) => regra === true);
}

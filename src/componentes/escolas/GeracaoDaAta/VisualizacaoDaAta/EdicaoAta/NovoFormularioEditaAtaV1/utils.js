export const formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes = (
  lista_cargos_composicao,
) => {
  let lista_formatada = [];

  Object.entries(lista_cargos_composicao || {}).forEach(([chave, membro]) => {
    if (!membro) return;

    lista_formatada.push({
      id: membro?.id,
      cargo: membro?.cargo_associacao_label,
      data_inicio_no_cargo: membro?.data_inicio_no_cargo?.split("-").reverse().join("/"),
      identificacao: membro?.ocupante_do_cargo?.codigo_identificacao ?? "",
      membro: true,
      nome: membro?.ocupante_do_cargo?.nome ?? "",
      presente: !membro?.vago,
      vago: membro?.vago,
      presidente_da_reuniao: false,
      secretario_da_reuniao: false,
      professor_gremio: false,
    });
  });

  return lista_formatada;
};

export const formataDataInicioNoCargo = (data) => {
    if (typeof data === "string" && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return data.split("-").reverse().join("/");
    }
    return data;
};

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
      identificacao: membro?.ocupante_do_cargo?.codigo_identificacao || membro?.ocupante_do_cargo?.cpf_responsavel || "",
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

export const removeOcupantesDaListaDeNaoMembros = (
  listaMembros = [],
  naoMembros = [],
) => {
  const membros = (listaMembros || []).map((membro) => ({ ...membro }));

  const naoMembrosRestantes = (naoMembros || []).filter((naoMembro) => {
    const identificacaoNaoMembro = naoMembro?.identificacao?.trim();
    const nomeNaoMembro = naoMembro?.nome?.trim().toLowerCase();

    const ocupante = membros.find((membro) => {
      if (!membro.membro || membro.vago || membro.professor_gremio) {
        return false;
      }

      const identificacoes = [membro.identificacao, membro.cpf_responsavel]
        .map((identificacao) => identificacao?.trim())
        .filter(Boolean);

      const mesmaIdentificacao =
        identificacaoNaoMembro &&
        identificacoes.includes(identificacaoNaoMembro);
      const mesmoNome =
        nomeNaoMembro && nomeNaoMembro === membro.nome?.trim().toLowerCase();

      return mesmaIdentificacao || mesmoNome;
    });

    if (!ocupante) {
      return true;
    }

    if (naoMembro.presidente_da_reuniao) {
      membros.forEach((membro) => {
        membro.presidente_da_reuniao = membro === ocupante;
      });
    }
    if (naoMembro.secretario_da_reuniao) {
      membros.forEach((membro) => {
        membro.secretario_da_reuniao = membro === ocupante;
      });
    }

    return false;
  });

  return [...membros, ...naoMembrosRestantes];
};

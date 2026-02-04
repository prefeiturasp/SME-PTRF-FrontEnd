export const getParecerSelecionado = (pareceres, parecerId) => {
  if (!pareceres || pareceres.length === 0) {
    return null;
  }
  return pareceres.find((parecer) => parecer.id === parecerId) || null;
};

export const isParecerReprovado = (parecer) => {
  if (!parecer) {
    return false;
  }
  const identificador = (parecer.id || "").toUpperCase();
  const nome = (parecer.nome || "").toUpperCase();
  return (
    identificador.includes("REPROV") ||
    identificador.includes("REJEIT") ||
    nome.includes("REPROV")
  );
};

export const adicionaProfessorGremioNaLista = (
  lista = [],
  ataUuid,
  professorDefaults = {},
  precisaProfessorGremio = true,
) => {
  if (!precisaProfessorGremio) {
    return lista.filter((participante) => !participante.professor_gremio);
  }

  const existeProfessor = lista.some(
    (participante) => participante.professor_gremio,
  );
  if (existeProfessor) {
    return lista.map((participante) =>
      participante.professor_gremio
        ? {
            ...participante,
            id: participante.id || participante.uuid || "professor-gremio",
            professor_gremio: true,
            presente: participante.presente ?? true,
          }
        : participante,
    );
  }

  return [
    ...lista,
    {
      id: ataUuid ? `${ataUuid}-professor-gremio` : "professor-gremio",
      ata: ataUuid || "",
      cargo: professorDefaults.cargo || "",
      identificacao: professorDefaults.identificacao || "",
      nome: professorDefaults.nome || "",
      editavel: true,
      membro: false,
      adicao: false,
      presente: professorDefaults.presente ?? true,
      presidente_da_reuniao: false,
      secretario_da_reuniao: false,
      professor_gremio: true,
    },
  ];
};

export const formatarListaCargoComposicaoParaFormatoDaListaParticipantes = (
  lista_cargos_composicao,
) => {
  let lista_formatada = [];

  if (lista_cargos_composicao && lista_cargos_composicao.diretoria_executiva) {
    lista_cargos_composicao.diretoria_executiva.forEach((membro) => {
      lista_formatada.push({
        id: membro.id,
        cargo: membro.cargo,
        identificacao: membro.identificacao,
        membro: true,
        nome: membro.nome,
        presente: true,
        presidente_da_reuniao: false,
        secretario_da_reuniao: false,
        professor_gremio: false,
      });
    });
  }

  if (lista_cargos_composicao && lista_cargos_composicao.conselho_fiscal) {
    lista_cargos_composicao.conselho_fiscal.forEach((membro) => {
      lista_formatada.push({
        id: membro.id,
        cargo: membro.cargo,
        identificacao: membro.identificacao,
        membro: true,
        nome: membro.nome,
        presente: true,
        presidente_da_reuniao: false,
        secretario_da_reuniao: false,
        professor_gremio: false,
      });
    });
  }

  return lista_formatada;
};

export const extraiProfessorDefaults = (lista = []) => {
  const professor = (lista || []).find(
    (participante) => participante.professor_gremio,
  );
  if (!professor) {
    return null;
  }

  return {
    nome: professor.nome || "",
    cargo: professor.cargo || "",
    identificacao: professor.identificacao || "",
    presente: professor.presente ?? true,
  };
};

export const listaPossuiParticipantesAssociacao = (lista = []) => {
  return lista.some((participante) => !participante.professor_gremio);
};

export const constroiMapaDeMembrosAssociacao = (listaPadrao = []) => {
  return new Set(
    (listaPadrao || [])
      .filter((participante) => participante && participante.membro)
      .map((participante) => participante.identificacao)
      .filter((identificacao) => Boolean(identificacao)),
  );
};

export const marcaParticipantesComoMembrosDaAssociacao = (
  listaParticipantes = [],
  listaPadrao = [],
) => {
  const identificadoresMembros = constroiMapaDeMembrosAssociacao(listaPadrao);
  return (listaParticipantes || []).map((participante) => {
    const ehMembro =
      Boolean(participante?.membro) ||
      identificadoresMembros.has(participante?.identificacao);
    return {
      ...participante,
      membro: ehMembro,
    };
  });
};

export const normalizaParaData = (valor) => {
  if (valor instanceof Date) {
    return valor;
  }
  const data = new Date(valor);
  return isNaN(data.getTime()) ? null : data;
};

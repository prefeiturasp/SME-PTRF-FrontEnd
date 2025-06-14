import api from '../api'
import { TOKEN_ALIAS, ASSOCIACAO_UUID } from '../auth.service'
import { visoesService } from '../visoes.service';

const authHeader = ()=>({
  headers: {
    Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
    'Content-Type': 'application/json',
  },
});

// Prestação de Contas
export const getStatusPeriodoPorData = async (uuid_associacao, data_incial_periodo) => {
  return(await api.get(`/api/associacoes/${uuid_associacao}/status-periodo/?data=${data_incial_periodo}`, authHeader())).data
};

export const postConcluirPeriodo = async (periodo_uuid, justificativaPendencia='') => {
  if(visoesService.featureFlagAtiva('novo-processo-pc')){
    
    const payLoad = {
      justificativa_acertos_pendentes: justificativaPendencia,
      associacao_uuid: localStorage.getItem(ASSOCIACAO_UUID),
      periodo_uuid: periodo_uuid
    }

    return(await api.post(`/api/prestacoes-contas/concluir-v2/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo_uuid=${periodo_uuid}`, payLoad, authHeader())).data
  }
  else{
  
    const payLoad = {
      justificativa_acertos_pendentes: justificativaPendencia,
    }
    
    return(await api.post(`/api/prestacoes-contas/concluir/?associacao_uuid=${localStorage.getItem(ASSOCIACAO_UUID)}&periodo_uuid=${periodo_uuid}`, payLoad, authHeader())).data
  }
};


export const getPeriodosNaoFuturos = async () => {
  return(await api.get('/api/periodos/lookup-until-now/', authHeader())).data
};

export const getPeriodosAteAgoraForaImplantacaoDaAssociacao = async (uuid_associacao) => {
  return(await api.get(`/api/associacoes/${uuid_associacao}/periodos-ate-agora-fora-implantacao/`, authHeader())).data
};


export const getStatus = async (periodo_uuid, conta_uuid) => {
  return (
    await api.get(
      `/api/prestacoes-contas/por-conta-e-periodo/?conta_associacao_uuid=${conta_uuid}&periodo_uuid=${periodo_uuid}`,
      authHeader()
    )
  ).data
};

export const getIniciarPrestacaoDeContas = async (conta_uuid, periodo_uuid) => {
  return (
    await api.post(
      `/api/prestacoes-contas/iniciar/?conta_associacao_uuid=${conta_uuid}&periodo_uuid=${periodo_uuid}`,
      {},
      authHeader()
    )
  ).data
};

// Detalhe Prestação de Contas
// *** Novas implementações História 34038 - Sprint 16 ***
// *** Créditos não serão mais exibidos, nem conciliados/desconciliados História 52339 - Sprint - 34***
export const getTransacoes = async (periodo_uuid, conta_uuid, conferido, acao_associacao_uuid, ordenar_por_numero_do_documento, ordenar_por_data_especificacao, ordenar_por_valor, ordenar_por_imposto) => {

  const apiUrl = '/api/conciliacoes/transacoes-despesa/';
  const params = {
    periodo: periodo_uuid,
    conta_associacao: conta_uuid,
    conferido: conferido,
    acao_associacao: acao_associacao_uuid,
    ordenar_por_numero_do_documento: ordenar_por_numero_do_documento,
    ordenar_por_data_especificacao: ordenar_por_data_especificacao,
    ordenar_por_valor: ordenar_por_valor,
    ordenar_por_imposto: ordenar_por_imposto
  };

const queryString = Object.keys(params)
  .filter((key) => params[key] !== undefined && params[key] !== null) 
  .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  .join('&');

const apiUrlWithParams = `${apiUrl}?${queryString}`;
  return (await api.get(apiUrlWithParams, authHeader())).data
};
export const patchConciliarDespesa = async (periodo_uuid, conta_uuid, transacao_uuid) => {
  return (await api.patch(`/api/conciliacoes/conciliar-despesa/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&transacao=${transacao_uuid}`, {}, authHeader())).data
};
export const patchDesconciliarDespesa = async (conta_uuid, transacao_uuid) => {
  return (await api.patch(`/api/conciliacoes/desconciliar-despesa/?conta_associacao=${conta_uuid}&transacao=${transacao_uuid}`, {}, authHeader())).data
};
export const getConciliar = async (rateio_uuid, periodo_uuid) => {
  return (await api.patch(`/api/rateios-despesas/${rateio_uuid}/conciliar/?periodo=${periodo_uuid}`, {}, authHeader())).data
};

export const getDesconciliar = async (rateio_uuid, periodo_uuid) => {
  return (await api.patch(`/api/rateios-despesas/${rateio_uuid}/desconciliar/?periodo=${periodo_uuid}`, {}, authHeader())).data
};
// *** Fim novas implementaçãoes ***

export const getDespesasPrestacaoDeContas = async (periodo_uuid, conta_uuid, acao_associacao_uuid, conferido) => {
  return (await api.get(`/api/conciliacoes/despesas/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&acao_associacao=${acao_associacao_uuid}&conferido=${conferido}`, authHeader())).data
};

export const getReceitasPrestacaoDeContas = async (periodo_uuid, conta_uuid, acao_associacao_uuid, conferido) => {
  return ( await api.get(`/api/conciliacoes/receitas/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&acao_associacao=${acao_associacao_uuid}&conferido=${conferido}`,authHeader())).data
};

export const getConciliarReceita = async (receita_uuid, periodo_uuid) => {
  return (await api.patch(`/api/receitas/${receita_uuid}/conciliar/?periodo=${periodo_uuid}`, {}, authHeader())).data
};

export const getDesconciliarReceita = async (receita_uuid, periodo_uuid) => {
  return (await api.patch(`/api/receitas/${receita_uuid}/desconciliar/?periodo=${periodo_uuid}`, {}, authHeader())).data
};

export const getObservacoes = async (periodo_uuid, conta_uuid, associacao_uuid) => {
  return (await api.get(`/api/conciliacoes/observacoes/?periodo=${periodo_uuid}&conta_associacao=${conta_uuid}&associacao=${associacao_uuid}`,authHeader())).data
};

export const getVisualizarExtratoBancario = async (observacao_uuid) => {
    return (await api
            .get(`/api/conciliacoes/download-extrato-bancario/?observacao_uuid=${observacao_uuid}`, {
                responseType: 'blob',
                timeout: 30000,
                ...authHeader()
            })
            .then((response) => {
                //Create a Blob from the arquivo Stream
                const file = new Blob([response.data], {type: response.data.type});
                //Build a URL from the file
                const fileURL = URL.createObjectURL(file);
                let objeto = document.querySelector( "#comprovante_extrato_bancario" );
                objeto.data = fileURL;
            }).catch(error => {
                return error.response;
            })
    )
};

export const getDownloadExtratoBancario = async (nome_do_arquivo_com_extensao, observacao_uuid) => {
  return (await api
          .get(`/api/conciliacoes/download-extrato-bancario/?observacao_uuid=${observacao_uuid}`, {
            responseType: 'blob',
            timeout: 30000,
            ...authHeader()
          })
          .then((response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', nome_do_arquivo_com_extensao);
            document.body.appendChild(link);
            link.click();
          }).catch(error => {
            return error.response;
          })
  )
};

export const pathSalvarJustificativaPrestacaoDeConta = async (payload) => {
  const formData = new FormData();
  formData.append("periodo_uuid", payload.periodo_uuid);
  formData.append("conta_associacao_uuid", payload.conta_associacao_uuid);
  formData.append("observacao", payload.observacao);
  formData.append("justificativa_ou_extrato_bancario", "JUSTIFICATIVA")

  return (await api.patch(`/api/conciliacoes/salvar-observacoes/`, formData, authHeader())).data
}

export const pathExtratoBancarioPrestacaoDeConta = async (payload) => {
  const formData = new FormData();
  formData.append("periodo_uuid", payload.periodo_uuid);
  formData.append("conta_associacao_uuid", payload.conta_associacao_uuid);
  formData.append("saldo_extrato", payload.saldo_extrato);
  formData.append("justificativa_ou_extrato_bancario", "EXTRATO_BANCARIO")

  // Nesessário pois o formData retornava um string 'null' e não null
  if (payload.data_extrato){
    formData.append("data_extrato", payload.data_extrato);
  }
  if (payload.data_atualizacao_comprovante_extrato){
    formData.append("data_atualizacao_comprovante_extrato", payload.data_atualizacao_comprovante_extrato);
  }
  if (payload.comprovante_extrato){
    formData.append("comprovante_extrato", payload.comprovante_extrato);
  }
  const authHeaderMultipart = ()=>({
    headers: {
      Authorization: `JWT ${localStorage.getItem(TOKEN_ALIAS)}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  return (await api.patch(`/api/conciliacoes/salvar-observacoes/`, formData, authHeaderMultipart())).data
}

export const getDataPreenchimentoAta = async (uuidPrestacaoDeContas) => {
    return (await api.get(`/api/prestacoes-contas/${uuidPrestacaoDeContas}/ata/`,authHeader())).data
};

export const getIniciarAta = async (uuidPrestacaoDeContas) => {
    return (await api.post(`/api/prestacoes-contas/${uuidPrestacaoDeContas}/iniciar-ata/`, {}, authHeader())).data
};

export const getIniciarPreviaAta = async (associacaoUuid, periodoUuid) => {
    return (await api.post(`/api/prestacoes-contas/iniciar-previa-ata/?associacao=${associacaoUuid}&periodo=${periodoUuid}`, {}, authHeader())).data
};


export const getInfoAta = async () => {
    return (await api.get(`/api/prestacoes-contas/${localStorage.getItem("uuidPrestacaoConta")}/info-para-ata/`,authHeader())).data
};

export const getPreviaInfoAta = async (associacaoUuid, periodoUuid) => {
    return (await api.get(`/api/prestacoes-contas/previa-info-para-ata/?associacao=${associacaoUuid}&periodo=${periodoUuid}`,authHeader())).data
};

export const gerarPreviaRelatorioAposAcertos = async (uuid) => {
  if(uuid){
    return (await api.get(`/api/analises-prestacoes-contas/previa-relatorio-apos-acertos/?analise_prestacao_uuid=${uuid}`,authHeader())).data
  }
}

export const regerarRelatorioAposAcertos = async (uuid) => {
  if(uuid){
    return (await api.get(`/api/analises-prestacoes-contas/regerar-relatorio-apos-acertos/?analise_prestacao_uuid=${uuid}`,authHeader())).data
  }
}

export const regerarPreviaRelatorioAposAcertos = async (uuid) => {
  if(uuid){
    return (await api.get(`/api/analises-prestacoes-contas/regerar-previa-relatorio-apos-acertos/?analise_prestacao_uuid=${uuid}`,authHeader())).data
  }
}

export const verificarStatusGeracaoAposAcertos = async (uuid) => {
  return (await api.get(`/api/analises-prestacoes-contas/status-info_relatorio_apos_acertos/?analise_prestacao_uuid=${uuid}`,authHeader())).data
}

export const downloadDocumentPdfAposAcertos = async (analise_atual_uuid) => {
  return api
            .get(`/api/analises-prestacoes-contas/download-documento-pdf_apos_acertos/?analise_prestacao_uuid=${analise_atual_uuid}`, {
                responseType: 'blob',
                timeout: 30000,
                ...authHeader(),
              })
            .then((response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `relatorio_apos_acertos.pdf`);
                document.body.appendChild(link);
                link.click();
            }).catch(error => {
                return error.response;
            });
}

export const getConcluirPrestacaoDeConta = async (
  uuidPrestacaoDeContas,
  payload
) => {
  return (
    await api.patch(
      `/api/prestacoes-contas/${uuidPrestacaoDeContas}/concluir/`,
      payload,
      authHeader()
    )
  ).data
};


export const getFiqueDeOlhoPrestacoesDeContas = async () => {
  return (await api.get(`/api/prestacoes-contas/fique-de-olho/`,authHeader())).data
};

export const getTextoExplicacaoPaa = async () => {
  return (await api.get(`/api/parametros-ue/texto-pagina-paa-ue/`,authHeader())).data
};

export const patchTextoExplicacaoPaa = async (payload) => {
  return (await api.patch(`api/parametros-ue/update-texto-pagina-paa-ue/`, {
          ...payload
      },
      authHeader(),
  ))
};

export const getAtaRetificadora = async (prestacao_uuid) => {
  return (await api.get(`/api/prestacoes-contas/${prestacao_uuid}/ata-retificacao/`,authHeader())).data
};

export const getIniciarAtaRetificadora = async (uuidPrestacaoDeContas) => {
  return (await api.post(`/api/prestacoes-contas/${uuidPrestacaoDeContas}/iniciar-ata-retificacao/`, {}, authHeader())).data
};

export const getMembrosCargos = async (associacao_uuid) => {
    return (await api.get(`/api/membros-associacao/membros-cargos/?associacao_uuid=${associacao_uuid}`,authHeader())).data
};

// Presidente ausente
export const getStatusPresidente = async (associacao_uuid) => {
  return (await api.get(`/api/associacoes/${associacao_uuid}/status-presidente/`,authHeader())).data
};


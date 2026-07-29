import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import {
    periodoFechado,
    comparaObjetos,
    periodoFechadoImposto,
    trataNumericos,
    metodosAuxiliares,
} from "../utils";
import {
    getErrorMessage
} from "../../../../../utils/obtemMsgErroAxios";
import {
    deleteDespesa,
    marcarLancamentoExcluido,
    getValidarDataDaDespesa
} from "../../../../../services/escolas/Despesas.service";
import {useParams, useLocation} from 'react-router-dom';
import {DespesaContext} from "../../../../../context/Despesa";
import moment from "moment";
import { getPeriodoPorUuid } from "../../../../../services/sme/Parametrizacoes.service";
import { STATUS_CONTA_ASSOCIACAO, STATUS_SOLICITACAO_ENCERRAMENTO_CONTA_ASSOCIACAO } from "../../../../../constantes/contaAssociacao";
import {toastCustom} from "../../../../Globais/ToastCustom";
import {visoesService} from "../../../../../services/visoes.service";
import {useMutationDespesaConfirmavel} from "./useMutationDespesaConfirmavel";
import {useDespesaTabelas} from "./useDespesaTabelas";
import {useValidacoesFormDespesa} from "./useValidacoesFormDespesa";
import {useFluxoSalvarDespesa} from "./useFluxoSalvarDespesa";

export const useDespesaFormController = ({verbo_http, veioDeSituacaoPatrimonial}) => {

    let {origem} = useParams();
    const aux = metodosAuxiliares;
    const parametroLocation = useLocation();

    const despesaContext = useContext(DespesaContext);

    const [show, setShow] = useState(false);
    const [showAvisoCapital, setShowAvisoCapital] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [textoModalDelete, setShowTextoModalDelete] = useState('')
    const [showPeriodoFechado, setShowPeriodoFechado] = useState(false);
    const [showPeriodoFechadoImposto, setShowPeriodoFechadoImposto] = useState(false);
    const [showErroGeral, setShowErroGeral] = useState(false);
    const [btnSubmitDisable, setBtnSubmitDisable] = useState(false);
    const salvandoDespesaRef = useRef(false);

    const setSubmitDisabled = useCallback((disabled) => {
        salvandoDespesaRef.current = disabled;
        setBtnSubmitDisable(disabled);
    }, []);

    const desabilitaBtnSalvar = useCallback(() => setSubmitDisabled(true), [setSubmitDisabled]);
    const habilitaBtnSalvar = useCallback(() => setSubmitDisabled(false), [setSubmitDisabled]);

    const [saldosInsuficientesDaAcao, setSaldosInsuficientesDaAcao] = useState([]);
    const [saldosInsuficientesDaConta, setSaldosInsuficientesDaConta] = useState([]);
    const [readOnlyBtnAcao, setReadOnlyBtnAcao] = useState(false);
    const [readOnlyCampos, setReadOnlyCampos] = useState(false);
    const [cssEscondeDocumentoTransacao, setCssEscondeDocumentoTransacao] = useState('escondeItem');
    const [labelDocumentoTransacao, setLabelDocumentoTransacao] = useState('');
    const [exibeMsgErroValorRecursos, setExibeMsgErroValorRecursos] = useState(false);
    const [exibeMsgErroValorOriginal, setExibeMsgErroValorOriginal] = useState(false);
    const [numeroDocumentoReadOnly, setNumeroDocumentoReadOnly] = useState(false);
    const [mensagensAceitaCusteioCapital, setMensagensAceitaCusteioCapital] = useState([]);
    const [showDeletarRateioComEstorno, setShowDeletarRateioComEstorno] = useState(false);

    const [showRetencaoImposto, setShowRetencaoImposto] = useState(false);
    const [cssEscondeDocumentoTransacaoImposto, setCssEscondeDocumentoTransacaoImposto] = useState([]);
    const [labelDocumentoTransacaoImposto, setLabelDocumentoTransacaoImposto] = useState([]);
    const [readOnlyCamposImposto, setReadOnlyCamposImposto] = useState([]);
    const [showExcluirImposto, setShowExcluirImposto] = useState(false);
    const [formErrorsImposto, setFormErrorsImposto] = useState([])
    const [disableBtnAdicionarImposto, setDisableBtnAdicionarImposto] = useState(false);
    const [objetoParaComparacao, setObjetoParaComparacao] = useState({});
    const [showDespesaIncompletaNaoPermitida, setShowDespesaIncompletaNaoPermitida] = useState(false);


    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome')

    const {
        despesasTabelas,
        especificaoes_capital,
        especificacoes_custeio,
        loading,
        setLoading,
    } = useDespesaTabelas({
        parametroLocation,
        veioDeSituacaoPatrimonial,
        visao_selecionada,
    });

    const handleSuccessDespesa = async (response) => {
        console.log("Operação realizada com sucesso!");
        aux.getPath(origem);
    };

    const handleErroCriarDespesa = (response) => {
        let mensagemErro = 'Verifique se os dados foram preenchidos corretamente.';
        if (response && response.data) {
            const error = {response};
            mensagemErro = getErrorMessage(error, "Ocorreu um erro criar/editar despesa.");
        }
        toastCustom.ToastCustomError('Erro ao tentar salvar despesa.', mensagemErro);
    };

    const handleErrorDespesa = (response) => {
        setLoading(false);
        habilitaBtnSalvar();
        handleErroCriarDespesa(response);
    };

    const { mutationCreate, mutationUpdate } = useMutationDespesaConfirmavel(
        (response) => handleSuccessDespesa(response, null),
        handleErrorDespesa,
        setLoading,
        setSubmitDisabled
    );

    const [contasIniciais, setContasIniciais] = useState([])


    useEffect(() => {    
        let contasJaExistentesEmAlgumRateioOuImpostoNoInicioDoFormulario = new Set();

        if(despesaContext && despesaContext.initialValues && despesaContext.initialValues.rateios) {
            despesaContext.initialValues.rateios.forEach(rateio => {
                if(rateio.conta_associacao) {
                    contasJaExistentesEmAlgumRateioOuImpostoNoInicioDoFormulario.add(rateio.conta_associacao.uuid)
                }
            });
        }
        
        if(despesaContext && despesaContext.initialValues && despesaContext.initialValues.despesas_impostos) {
            despesaContext.initialValues.despesas_impostos.forEach(imposto => {
                if(imposto.rateios[0] && imposto.rateios[0].conta_associacao) {
                    contasJaExistentesEmAlgumRateioOuImpostoNoInicioDoFormulario.add(imposto.rateios[0].conta_associacao)
                }
            });
        }

        setContasIniciais(contasJaExistentesEmAlgumRateioOuImpostoNoInicioDoFormulario);
    }, [despesaContext]);

   

    const isEditing = () => {
        return despesaContext.verboHttp === "PUT";
    }

    const retornaPeriodo = async (periodo_uuid) => {
        let periodo = await getPeriodoPorUuid(periodo_uuid);
        return periodo;
    }

    const limparSelecaoContasDesabilitadas = (setFieldValue, values, imposto=false) => {
        if(imposto) {
            const contasParaSeremDesabilitadasDaSelecao = despesasTabelas.contas_associacao
            .filter(conta => conta.solicitacao_encerramento !== null && !conta.dataEncerramentoMaiorOuIgualQueDataTransacaoImposto)
            .map(conta => conta.uuid);

            values.despesas_impostos.forEach(function (imposto, idx) {
                if (imposto.rateios[0].conta_associacao) {
                  const uuid = typeof imposto.rateios[0].conta_associacao === 'object' ? imposto.rateios[0].conta_associacao.uuid : imposto.rateios[0].conta_associacao;
            
                  if (contasParaSeremDesabilitadasDaSelecao.includes(uuid)) {
                    setFieldValue(`despesas_impostos[${idx}].rateios[0].conta_associacao`, null);
                  }
                }
              });
            
        } else {
            const contasParaSeremDesabilitadasDaSelecao = despesasTabelas.contas_associacao
            .filter(conta => conta.solicitacao_encerramento !== null && !conta.dataEncerramentoMaiorOuIgualQueDataTransacao)
            .map(conta => conta.uuid);

            values.rateios.forEach(function (rateio, idx) {
                if (rateio.conta_associacao) {
                  const uuid = typeof rateio.conta_associacao === 'object' ? rateio.conta_associacao.uuid : rateio.conta_associacao;
            
                  if (contasParaSeremDesabilitadasDaSelecao.includes(uuid)) {
                    setFieldValue(`rateios[${idx}].conta_associacao`, null);
                  }
                }
              });
        }
    }

    const transformaEmData = (data_transacao) => {
        if(moment.isMoment(data_transacao)){
            return data_transacao;
        } else {
            return moment(data_transacao, "YYYY-MM-DD").toDate();
        }
    }
      
    const filterContas = (data, imposto=false) => {
        let data_transacao = transformaEmData(data);

        return despesasTabelas.contas_associacao.filter((conta) => {
            const dataInicioContaMenorDataTransacao = transformaEmData(conta.data_inicio) <= data_transacao
            
            if(imposto) {
                const dataEncerramentoMaiorOuIgualQueDataTransacaoImposto = conta.solicitacao_encerramento && 
                transformaEmData(conta.solicitacao_encerramento.data_de_encerramento_na_agencia) >= data_transacao

                conta.dataEncerramentoMaiorOuIgualQueDataTransacaoImposto = dataEncerramentoMaiorOuIgualQueDataTransacaoImposto;
            } else {
                const dataEncerramentoMaiorOuIgualQueDataTransacao = conta.solicitacao_encerramento && 
                transformaEmData(conta.solicitacao_encerramento.data_de_encerramento_na_agencia) >= data_transacao

                conta.dataEncerramentoMaiorOuIgualQueDataTransacao = dataEncerramentoMaiorOuIgualQueDataTransacao;
            }
            
            return  dataInicioContaMenorDataTransacao;
            }
        )        
    }

    const renderContaAssociacaoOptions = useCallback((data_transacao, imposto=false) => {
        const getOptionPorStatus = (item, key) => {
          const defaultProps = {
            key: item.uuid,
            value: item.uuid,
            'data-qa': `render-conta-associacao-option-${key + 1}`,
          };
      
          let informacaoExtra = '';
          let desativarSelecaoOption = false;
      
          if (item.status === STATUS_CONTA_ASSOCIACAO.ATIVA) {
            return <option {...defaultProps} key={item.uuid}>{item.nome}</option>;
          }
      
          if (item.solicitacao_encerramento) {

            informacaoExtra = `- Conta encerrada em ${moment(
              item.solicitacao_encerramento.data_de_encerramento_na_agencia
            ).format('DD/MM/YYYY')}`;
            if(aux.origemAnaliseLancamento(parametroLocation)) { 
                // Fluxo solicitação de ajuste
                if (!imposto && item.dataEncerramentoMaiorOuIgualQueDataTransacao) {
                    desativarSelecaoOption = false;
                } else if (imposto && item.dataEncerramentoMaiorOuIgualQueDataTransacaoImposto) {
                    desativarSelecaoOption = false;
                } else {
                    desativarSelecaoOption = true;
                }
            } else { 
                // Fluxo normal (sem ser ajuste)
                if(item.solicitacao_encerramento.status === STATUS_SOLICITACAO_ENCERRAMENTO_CONTA_ASSOCIACAO.PENDENTE && !isEditing()) {
                    desativarSelecaoOption = true;
                } else if(item.solicitacao_encerramento.status === STATUS_SOLICITACAO_ENCERRAMENTO_CONTA_ASSOCIACAO.APROVADA && !isEditing()) {
                    return
                } else if(item.solicitacao_encerramento.status === STATUS_SOLICITACAO_ENCERRAMENTO_CONTA_ASSOCIACAO.PENDENTE && isEditing()) {
                    desativarSelecaoOption = true;
                } else if(item.solicitacao_encerramento.status === STATUS_SOLICITACAO_ENCERRAMENTO_CONTA_ASSOCIACAO.APROVADA && isEditing()) {     
                    if(contasIniciais && contasIniciais.has(item.uuid)) {
                         // Se já for a conta da despesa, ela mesmo sendo encerrada aparece desabilitada
                        desativarSelecaoOption = true;
                    } else {
                        // Se não for a conta da despesa e estiver encerrada, não aparece
                        return
                    }
                }
            }
          }
      
          return (
            <option
              {...defaultProps}
              disabled={desativarSelecaoOption}
            >{`${item.nome} ${informacaoExtra}`}</option>
          );
        };
      
        return filterContas(data_transacao, imposto).map((item, key) => getOptionPorStatus(item, key));
      }, [despesasTabelas, contasIniciais]);
      

    useEffect(() => {
        const tipoTransacaoIni = despesaContext.initialValues.tipo_transacao;
        const tipoTransacaoId =
            tipoTransacaoIni != null
                ? (typeof tipoTransacaoIni === "object" ? tipoTransacaoIni.id : tipoTransacaoIni)
                : null;
        if (tipoTransacaoId != null && verbo_http === "PUT") {
            aux.exibeDocumentoTransacao(tipoTransacaoId, setCssEscondeDocumentoTransacao, setLabelDocumentoTransacao, despesasTabelas);
            aux.exibeDocumentoTransacaoImpostoUseEffect(despesaContext.initialValues.despesas_impostos || [], setLabelDocumentoTransacaoImposto, labelDocumentoTransacaoImposto, setCssEscondeDocumentoTransacaoImposto, cssEscondeDocumentoTransacaoImposto, despesasTabelas);
        }
        if (despesaContext.initialValues.data_transacao && verbo_http === "PUT") {
            if(aux.origemAnaliseLancamento(parametroLocation)){
                validateFormDespesas(despesaContext.initialValues);
                aux.bloqueiaCamposDespesaPrincipal(parametroLocation, setReadOnlyCampos, setReadOnlyBtnAcao)
            }
            else{
                periodoFechado(despesaContext.initialValues.data_transacao, setReadOnlyBtnAcao, setShowPeriodoFechado, setReadOnlyCampos, onShowErroGeral);
            }

            if (despesaContext && despesaContext.initialValues && despesaContext.initialValues.despesas_impostos){
                if(aux.origemAnaliseLancamento(parametroLocation)){                  
                    validateFormDespesas(despesaContext.initialValues);
                    aux.bloqueiaCamposDespesaImposto(
                        parametroLocation, setReadOnlyCamposImposto,
                        setDisableBtnAdicionarImposto, despesaContext
                    )
                }
                else{
                    periodoFechadoImposto(despesaContext.initialValues.despesas_impostos, setReadOnlyBtnAcao, setShowPeriodoFechadoImposto, setReadOnlyCamposImposto, setDisableBtnAdicionarImposto, onShowErroGeral);
                }
            }
        }
        if (verbo_http === "PUT") {
            setObjetoParaComparacao(despesaContext.initialValues)
        }
    }, [despesaContext.initialValues, despesasTabelas]);

    const initialValues = () => {
        return despesaContext.initialValues;
    };

    // Validações adicionais
    const [formErrors, setFormErrors] = useState({});
    const [enviarFormulario, setEnviarFormulario] = useState(true);

    const liberaBtnSalvar = (values) => {
        values.despesas_impostos.map((despesa_imposto) => {
            if(values.data_transacao && despesa_imposto.data_transacao){
                let data_despesa_principal = moment(values.data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                let data_despesa_imposto = moment(despesa_imposto.data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                
                let diff = moment(data_despesa_imposto,"YYYY-MM-DD HH:mm:ss").diff(moment(data_despesa_principal,"YYYY-MM-DD HH:mm:ss"));
                let dias = moment.duration(diff).asDays();

                if(dias < 0){
                    setEnviarFormulario(false)
                    setBtnSubmitDisable(true)
                }
                
            }
        })
    }

    const removeRateio = (remove, index, rateio) => {
        if(rateio && rateio.estorno && rateio.estorno.uuid){
            setShowDeletarRateioComEstorno(true);
        }
        else{
            remove(index)
        }
    }

    const acaoNaoAceitaTipoRecurso = (values) => {
        let mensagens = []
        values.rateios.map((rateio, indexRateio) => {
            let index = indexRateio + 1;
            let uuid_acao = null;
            
            if(rateio.acao_associacao && rateio.acao_associacao.uuid){
                uuid_acao = rateio.acao_associacao.uuid;
            }
            else if(rateio.acao_associacao){
                uuid_acao = rateio.acao_associacao;
            }

            if(uuid_acao){
                let id_categoria_receita_lower = rateio.aplicacao_recurso.toLowerCase();

                // Verificação criada caso seja acrescentada outra ação além de CAPITAL OU CUSTEIO
                let aceita_selecionado  = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_' + id_categoria_receita_lower);

                let aceita_capital = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_capital');
                let aceita_custeio = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_custeio');

                // Caso aceite livre automaticamente aceita qualquer ação CAPITAL, CUSTEIO ou qualquer outra que seja criada
                let aceita_livre = eval('despesasTabelas.acoes_associacao.find(element => element.uuid === uuid_acao).acao.aceita_livre');

                if(!aceita_livre && !aceita_selecionado && !aceita_capital && !aceita_custeio){
                    let mensagem = `A ação selecionada não aceita despesas de nenhum tipo (capital ou custeio). Você deseja confirmar o cadastro da despesa de ${id_categoria_receita_lower} nesta ação?`
                    let objeto = {
                        mensagem: mensagem,
                        despesa: index
                    }
                    mensagens.push(objeto);
                }
                else if(!aceita_livre && !aceita_selecionado && aceita_capital){
                    let mensagem = `A ação selecionada aceita apenas despesas de capital. Você deseja confirmar o cadastro da despesa de ${id_categoria_receita_lower} nesta ação?`
                    let objeto = {
                        mensagem: mensagem,
                        despesa: index
                    }
                    mensagens.push(objeto);
                }
                else if(!aceita_livre && !aceita_selecionado && aceita_custeio){
                    let mensagem = `A ação selecionada aceita apenas despesas de custeio. Você deseja confirmar o cadastro da despesa de ${id_categoria_receita_lower} nesta ação?`
                    let objeto = {
                        mensagem: mensagem,
                        despesa: index
                    }
                    mensagens.push(objeto);
                }
            }
        });
        setMensagensAceitaCusteioCapital(mensagens)
        return mensagens;
    }

    const existeErrosPersonalizadosComMensagem = (erros) =>
        Object.values(erros).some((msg) => msg !== null && msg !== undefined && String(msg).length > 0)

    const onCancelarTrue = () => {
        setShow(false);
        aux.getPath(origem, parametroLocation);
    };

    const onShowModal = () => {
        setShow(true);
    };


    const houveAlteracoes = (values) => {
        return !comparaObjetos(values, objetoParaComparacao)
    }

    const [showModalErroDeletarDespesa, setShowModalErroDeletarDespesa] = useState(false)
    const [textoModalErroDeletarDespesa, setTextoModalErroDeletarDespesa] = useState('')

    const onDeletarTrue = async (setShowDelete, setLoading, despesaContext, origem) => {
        setShowDelete(false);
        setLoading(true);

        try {
            await deleteDespesa(despesaContext.idDespesa)
            console.log("Despesa deletada com sucesso.");

            if(aux.origemAnaliseLancamento(parametroLocation)){
                let uuid_analise_lancamento = parametroLocation.state.uuid_analise_lancamento;
                let response_exclui_lancamento = await marcarLancamentoExcluido(uuid_analise_lancamento);
                
                if (response_exclui_lancamento.status === 200) {
                    console.log("Exclusão de lancamento realizada com sucesso!");
                }
            }

            aux.getPath(origem, parametroLocation);
        }catch (error){
            console.log(error.response);
            let texto_erro = ''
            if (error && error.response && error.response.data && error.response.data.error && error.response.data.error.itens_erro && error.response.data.error.itens_erro.length > 0){
                texto_erro += '<p class="mb-2">Despesa não pode ser apagada porque os seguintes itens fazem referência a ela:</p>'
                error.response.data.error.itens_erro.map((erro)=>(
                    texto_erro += `<p class="mb-1"><small>${erro}</small></p>`
                ))
            } else if (error && error.response && error.response.data && error.response.data.erro && error.response.data.erro === 'rateio_com_conta_status_inativa') {
                texto_erro += `<p class="mb-1">${error.response.data.mensagem}</p>`
            }else {
                texto_erro += '<p class="mb-0">Despesa não pode ser apagada porque é referenciada no sistema</p>'
            }
            setTextoModalErroDeletarDespesa(texto_erro)
            setShowModalErroDeletarDespesa(true)
            setLoading(false);
        }
    };

    const eh_despesa_com_comprovacao_fiscal = (values) => {
        if(!values.eh_despesa_sem_comprovacao_fiscal || values.eh_despesa_sem_comprovacao_fiscal === undefined){
            return true
        }
        else{
            return false;
        }
    }


    const eh_despesa_reconhecida = (values) => {
        if(values.eh_despesa_reconhecida_pela_associacao || values.eh_despesa_reconhecida_pela_associacao === undefined){
            return true;
        }
        else{
            return false;
        }
    }

    const onShowErroGeral = () => {
        setShowErroGeral(true);
    };

    const {validacoesPersonalizadas, validateFormDespesas} = useValidacoesFormDespesa({
        salvandoDespesaRef,
        setEnviarFormulario,
        setBtnSubmitDisable,
        parametroLocation,
        retornaPeriodo,
        setReadOnlyBtnAcao,
        setShowPeriodoFechado,
        setReadOnlyCampos,
        onShowErroGeral,
        setShowPeriodoFechadoImposto,
        setDisableBtnAdicionarImposto,
        setReadOnlyCamposImposto,
        eh_despesa_reconhecida,
        despesasTabelas,
        setNumeroDocumentoReadOnly,
        setShowRetencaoImposto,
    });


    const limpa_campos_sem_comprovacao_fiscal = (values, setFieldValue) => {
        setFieldValue("cpf_cnpj_fornecedor", "")
        setFieldValue("tipo_documento", null)
        setFieldValue("data_documento", "")
        setFieldValue("numero_documento", "")

        for(let rateio=0; rateio<=values.rateios.length-1; rateio++){
            setFieldValue(`rateios[${rateio}].tipo_custeio`, "")
            setFieldValue(`rateios[${rateio}].especificacao_material_servico`, "")
        }
    }

    const eh_despesa_com_retencao_imposto = (values) => {
        if(!values.retem_imposto || values.retem_imposto === undefined){
            return false;
        }
        else{
            return true;
        }
    }

    const tipos_documento_com_recolhimento_imposto = () => {
        let tipos_documento = [];

        if(despesasTabelas && despesasTabelas.tipos_documento){
            for(let documento=0; documento<=despesasTabelas.tipos_documento.length-1; documento++){
                let tipo_documento = despesasTabelas.tipos_documento[documento];
                if(tipo_documento.eh_documento_de_retencao_de_imposto){
                    tipos_documento.push(tipo_documento)
                }
            }
        }
    
        return tipos_documento;
    }

    const preenche_tipo_despesa_custeio = (values, index) => {
        let tributo_tarifas;
        if(despesasTabelas && despesasTabelas.tipos_custeio){
            tributo_tarifas = despesasTabelas.tipos_custeio.find(element => element.eh_tributos_e_tarifas === true);
            values.despesas_impostos[index].rateios[0].tipo_custeio = tributo_tarifas.id.toString();
        }        
        
        return tributo_tarifas ? tributo_tarifas : ""
    }

    const acoes_custeio = () => {
        let acoes = [];

        if(despesasTabelas && despesasTabelas.acoes_associacao){
            for(let acao=0; acao<=despesasTabelas.acoes_associacao.length-1; acao++){
                let objeto_acao = despesasTabelas.acoes_associacao[acao];
                if(!objeto_acao.e_recursos_proprios && objeto_acao.acao.aceita_custeio){   
                    acoes.push(objeto_acao)
                }
            }
        }
        return acoes;
    }

    const setValorRateioRealizadoImposto = (setFieldValue, valor, index) =>{
        setFieldValue(`despesas_impostos[${index}].rateios[0].valor_rateio`, trataNumericos(valor))
    };

    const mostraModalExcluirImposto = () => {
        if(verbo_http === "PUT"){
            setShowExcluirImposto(true);
        }
    }

    const cancelarExclusaoImposto = (setFieldValue) => {
        setFieldValue("retem_imposto", true);
        setShowExcluirImposto(false);
    }

    const [listaDemotivosPagamentoAntecipado, setListaDemotivosPagamentoAntecipado] = useState([]);
    const [selectMotivosPagamentoAntecipado, setSelectMotivosPagamentoAntecipado] = useState([]);
    const [checkBoxOutrosMotivosPagamentoAntecipado, setCheckBoxOutrosMotivosPagamentoAntecipado] = useState(false);
    const [txtOutrosMotivosPagamentoAntecipado, setTxtOutrosMotivosPagamentoAntecipado] = useState('');

    useEffect(()=>{
        setCheckBoxOutrosMotivosPagamentoAntecipado(!!despesaContext.initialValues.outros_motivos_pagamento_antecipado.trim())
    }, [despesaContext.initialValues.outros_motivos_pagamento_antecipado])


    const handleChangeCheckBoxOutrosMotivosPagamentoAntecipado = (event) =>{
        setCheckBoxOutrosMotivosPagamentoAntecipado(event.target.checked);
        if (!event.target.checked){
            setCheckBoxOutrosMotivosPagamentoAntecipado(false);
            setTxtOutrosMotivosPagamentoAntecipado("")
        }
    };

    const handleChangeTxtOutrosMotivosPagamentoAntecipado = (event) =>{
        setTxtOutrosMotivosPagamentoAntecipado(event.target.value)
    };

    const montaPayloadMotivosPagamentoAntecipado = () =>{
        let motivos = [];
        if (selectMotivosPagamentoAntecipado && selectMotivosPagamentoAntecipado.length > 0){
            selectMotivosPagamentoAntecipado.map((motivo)=>
                motivos.push(motivo.id)
            )
        }
        return motivos
    }

    const bloqueiaLinkCadastrarEstorno = (rateio) => {
        let bloqueia_link = true;

        if(rateio.conta_associacao && rateio.acao_associacao && rateio.aplicacao_recurso && trataNumericos(rateio.valor_rateio) !== 0){
            bloqueia_link = false;
        }

        if(aux.origemAnaliseLancamento(parametroLocation)){
            if(!aux.temPermissaoEdicao(parametroLocation) || aux.ehOperacaoExclusao(parametroLocation)){
                bloqueia_link = true;
            }
        }

        return bloqueia_link;
    }

    const bloqueiaCamposDespesa = () => {
        let bloqueia_link = false;

        if(readOnlyCampos){
            bloqueia_link = true;
        }

        if(aux.origemAnaliseLancamento(parametroLocation)){
            if(!aux.temPermissaoEdicao(parametroLocation) || aux.ehOperacaoExclusao(parametroLocation)){
                bloqueia_link = true;
            }
        }

        return bloqueia_link;
    }

    const bloqueiaRateioEstornado = (rateio) => {
        if(rateio.estorno && rateio.estorno.uuid){
            return true;
        }

        return false;
    }

    const [modalState, setModalState] = useState("saldo-insuficiente-conta" | "acao-nao-aceita-tipo-de-aplicacao" | "saldo-insuficiente-acao" | "despesa-ja-demonstrada" | "despesa-ja-cadastrada" | "pagamento-antecipado" | "despesa-imcompleta" | "close" )

    const {
        onSubmit,
        serviceIniciaEncadeamentoDosModais,
        serviceSubmitModais,
        validaMotivosPagamentoAntecipado,
    } = useFluxoSalvarDespesa({
        despesaContext,
        parametroLocation,
        despesasTabelas,
        enviarFormulario,
        setFormErrors,
        setLoading,
        habilitaBtnSalvar,
        setShowDespesaIncompletaNaoPermitida,
        retornaPeriodo,
        mutationCreate,
        mutationUpdate,
        origem,
        setExibeMsgErroValorRecursos,
        setExibeMsgErroValorOriginal,
        setSaldosInsuficientesDaConta,
        setSaldosInsuficientesDaAcao,
        setModalState,
        acaoNaoAceitaTipoRecurso,
        setListaDemotivosPagamentoAntecipado,
        setSelectMotivosPagamentoAntecipado,
        setTxtOutrosMotivosPagamentoAntecipado,
        montaPayloadMotivosPagamentoAntecipado,
        txtOutrosMotivosPagamentoAntecipado,
        checkBoxOutrosMotivosPagamentoAntecipado,
        validacoesPersonalizadas,
    });

    const numeroDocumentoImpostoReadOnly = (tipo_documento, index, values) => {
        let documento_imposto;
        if(despesasTabelas && despesasTabelas.tipos_documento){
            if(tipo_documento && tipo_documento.id){
                documento_imposto = despesasTabelas.tipos_documento.find(element => element.id === Number(tipo_documento.id));
            }
            else if(tipo_documento){
                documento_imposto = despesasTabelas.tipos_documento.find(element => element.id === Number(tipo_documento));
            }
        }

        if(documento_imposto && !documento_imposto.numero_documento_digitado){
            values.despesas_impostos[index].numero_documento = ""
            return true;
        }
        else{
            return false;
        }
    }

    const onCalendarCloseDataPagamento = async (values, setFieldValue) => {
        try {
            let {data_transacao, associacao} = values
            associacao = associacao && associacao.uuid ? associacao.uuid : associacao
            if (data_transacao) {
                await getValidarDataDaDespesa(associacao, data_transacao.toISOString().substring(0, 10))
            }
                       
        } catch (error) {
            setFieldValue("data_transacao", null)

            if(error.response && error.response.data) {
                setFormErrors(prevState => ({...prevState, data_transacao: error.response.data.mensagem}))
            }
        }

        for(let despesa_imposto = 0; despesa_imposto <= values.despesas_impostos.length -1; despesa_imposto ++){

            let erro = await validacoesPersonalizadas(values, setFieldValue, "despesa_imposto", despesa_imposto)
            
            setFormErrorsImposto(prevState => ({...prevState, [despesa_imposto] : erro}))
        }
    }

    const onCalendarCloseDataPagamentoImposto = async(values, setFieldValue, index) => {
        let erro = await validacoesPersonalizadas(values, setFieldValue, "despesa_imposto", index)
        setFormErrorsImposto({
            ...formErrorsImposto,
            [index]: erro
        })
        liberaBtnSalvar(values);
    }

    const onCalendarCloseDataDoDocumento = async(values, setFieldValue) => {
        try {
            let {data_documento, associacao} = values
            associacao = associacao && associacao.uuid ? associacao.uuid : associacao
            await getValidarDataDaDespesa(associacao, data_documento.toISOString().substring(0, 10))
            setFormErrors(prevState => ({...prevState, data_documento: ''}))
                       
        } catch (error) {
            setFieldValue("data_documento", null)

            if(error.response && error.response.data) {
                setFormErrors(prevState => ({...prevState, data_documento: error.response.data.mensagem}))
            }
        }
    }

    const tabelasContextValue = useMemo(() => ({
        despesasTabelas,
        especificacoes_custeio,
        especificaoes_capital,
        aux,
        despesaContext,
        verbo_http,
        parametroLocation,
        veioDeSituacaoPatrimonial,
        renderContaAssociacaoOptions,
        filterContas,
        limparSelecaoContasDesabilitadas,
        tipos_documento_com_recolhimento_imposto,
        acoes_custeio,
        preenche_tipo_despesa_custeio,
        numeroDocumentoImpostoReadOnly,
    }), [
        despesasTabelas, especificacoes_custeio, especificaoes_capital, despesaContext,
        verbo_http, parametroLocation, veioDeSituacaoPatrimonial,
        renderContaAssociacaoOptions, filterContas, limparSelecaoContasDesabilitadas,
    ]);

    const uiContextValue = useMemo(() => ({
        readOnlyCampos: readOnlyCampos || veioDeSituacaoPatrimonial,
        readOnlyBtnAcao: readOnlyBtnAcao || veioDeSituacaoPatrimonial,
        btnSubmitDisable: btnSubmitDisable || veioDeSituacaoPatrimonial,
        disableBtnAdicionarImposto: disableBtnAdicionarImposto || veioDeSituacaoPatrimonial,
        numeroDocumentoReadOnly,
        setNumeroDocumentoReadOnly,
        cssEscondeDocumentoTransacao,
        setCssEscondeDocumentoTransacao,
        labelDocumentoTransacao,
        setLabelDocumentoTransacao,
        cssEscondeDocumentoTransacaoImposto,
        setCssEscondeDocumentoTransacaoImposto,
        labelDocumentoTransacaoImposto,
        setLabelDocumentoTransacaoImposto,
        readOnlyCamposImposto,
        formErrors,
        setFormErrors,
        formErrorsImposto,
        setFormErrorsImposto,
        exibeMsgErroValorOriginal,
        exibeMsgErroValorRecursos,
        showRetencaoImposto,
        setShowRetencaoImposto,
        showDeletarRateioComEstorno,
        setShowDeletarRateioComEstorno,
        showExcluirImposto,
        setShowExcluirImposto,
        showAvisoCapital,
        setShowAvisoCapital,
        setShowDelete,
        setShowTextoModalDelete,
        setShow,
        eh_despesa_com_comprovacao_fiscal,
        eh_despesa_reconhecida,
        eh_despesa_com_retencao_imposto,
        limpa_campos_sem_comprovacao_fiscal,
        bloqueiaRateioEstornado,
        bloqueiaCamposDespesa,
        bloqueiaLinkCadastrarEstorno: (rateio) => veioDeSituacaoPatrimonial || bloqueiaLinkCadastrarEstorno(rateio),
        desabilitaBtnSalvar,
        habilitaBtnSalvar,
    }), [
        readOnlyCampos, veioDeSituacaoPatrimonial, readOnlyBtnAcao, btnSubmitDisable,
        disableBtnAdicionarImposto, numeroDocumentoReadOnly, cssEscondeDocumentoTransacao,
        labelDocumentoTransacao, cssEscondeDocumentoTransacaoImposto, labelDocumentoTransacaoImposto,
        readOnlyCamposImposto, formErrors, formErrorsImposto, exibeMsgErroValorOriginal,
        exibeMsgErroValorRecursos, showRetencaoImposto, showDeletarRateioComEstorno,
        showExcluirImposto, showAvisoCapital, desabilitaBtnSalvar, habilitaBtnSalvar,
    ]);

    const fluxoContextValue = useMemo(() => ({
        validacoesPersonalizadas,
        validateFormDespesas,
        onSubmit,
        removeRateio,
        houveAlteracoes,
        onShowModal,
        onCancelarTrue,
        saldosInsuficientesDaAcao,
        saldosInsuficientesDaConta,
        mensagensAceitaCusteioCapital,
        setValorRateioRealizadoImposto,
        cancelarExclusaoImposto,
        mostraModalExcluirImposto,
        validaMotivosPagamentoAntecipado,
        listaDemotivosPagamentoAntecipado,
        selectMotivosPagamentoAntecipado,
        setSelectMotivosPagamentoAntecipado,
        checkBoxOutrosMotivosPagamentoAntecipado,
        txtOutrosMotivosPagamentoAntecipado,
        handleChangeCheckBoxOutrosMotivosPagamentoAntecipado,
        handleChangeTxtOutrosMotivosPagamentoAntecipado,
        modalState,
        setModalState,
        serviceIniciaEncadeamentoDosModais,
        serviceSubmitModais,
        onCalendarCloseDataPagamento,
        onCalendarCloseDataPagamentoImposto,
        onCalendarCloseDataDoDocumento,
    }), [
        validacoesPersonalizadas, validateFormDespesas, onSubmit, removeRateio,
        houveAlteracoes, onShowModal, onCancelarTrue, saldosInsuficientesDaAcao,
        saldosInsuficientesDaConta, mensagensAceitaCusteioCapital,
        listaDemotivosPagamentoAntecipado, selectMotivosPagamentoAntecipado,
        checkBoxOutrosMotivosPagamentoAntecipado, txtOutrosMotivosPagamentoAntecipado,
        modalState, serviceIniciaEncadeamentoDosModais, serviceSubmitModais,
        onCalendarCloseDataPagamento, onCalendarCloseDataPagamentoImposto,
        onCalendarCloseDataDoDocumento, validaMotivosPagamentoAntecipado,
    ]);

    return {
        loading,
        setLoading,
        tabelas: tabelasContextValue,
        ui: uiContextValue,
        fluxo: fluxoContextValue,
        formik: {
            initialValues,
            onSubmit,
            validateFormDespesas,
        },
        modais: {
            show,
            setShow,
            setLoading,
            origem,
            parametroLocation,
            showAvisoCapital,
            setShowAvisoCapital,
            despesaContext,
            showDelete,
            setShowDelete,
            onDeletarTrue,
            textoModalDelete,
            showPeriodoFechado,
            setShowPeriodoFechado,
            showPeriodoFechadoImposto,
            setShowPeriodoFechadoImposto,
            showErroGeral,
            setShowErroGeral,
            showModalErroDeletarDespesa,
            setShowModalErroDeletarDespesa,
            textoModalErroDeletarDespesa,
            showDespesaIncompletaNaoPermitida,
            setShowDespesaIncompletaNaoPermitida,
        },
    };
};

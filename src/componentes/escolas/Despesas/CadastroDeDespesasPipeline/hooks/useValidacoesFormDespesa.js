import {useCallback} from "react";
import moment from "moment";
import {getPeriodoFechado} from "../../../../../services/escolas/Associacao.service";
import {
    valida_cpf_cnpj,
    metodosAuxiliares,
} from "../utils";

/**
 * Validações de formulário (personalizadas + Formik validate) do cadastro pipeline.
 */
export const useValidacoesFormDespesa = (deps) => {
    const {
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
    } = deps;

    const aux = metodosAuxiliares;

    const validacoesPersonalizadas = useCallback(async (values, setFieldValue, origem=null, index=null) => {

        let erros = {};
        let cpf_cnpj_valido;

        if(values.cpf_cnpj_fornecedor){
            cpf_cnpj_valido = !(!values.cpf_cnpj_fornecedor || values.cpf_cnpj_fornecedor.trim() === "" || !valida_cpf_cnpj(values.cpf_cnpj_fornecedor));
        }
        else{
            cpf_cnpj_valido = true;
        }

        if(!eh_despesa_reconhecida(values) && !values.numero_boletim_de_ocorrencia){
            erros = {
                numero_boletim_de_ocorrencia: "Digite um número de boletim de ocorrência"
            }
            setEnviarFormulario(false)
            setBtnSubmitDisable(true) /* submit */
        }
        else{
            setEnviarFormulario(true)
            if (!salvandoDespesaRef.current) {
                setBtnSubmitDisable(false)
            }
        }
        
        if (!cpf_cnpj_valido) {
            erros = {
                cpf_cnpj_fornecedor: "Digite um CPF ou um CNPJ válido"
            }
            setEnviarFormulario(false)
            setBtnSubmitDisable(true) /* submit */
        } else {
            aux.get_nome_razao_social(values.cpf_cnpj_fornecedor, setFieldValue, values.nome_fornecedor);
            setEnviarFormulario(true)
            if (!salvandoDespesaRef.current) {
                setBtnSubmitDisable(false)
            }
        }

        if(aux.origemAnaliseLancamento(parametroLocation)){
            if (values.data_transacao && origem==="despesa_principal"){
                let data = moment(values.data_transacao, "YYYY-MM-DD").format("YYYY-MM-DD");

                try {
                    let periodo_da_data = await getPeriodoFechado(data);
                    let periodo_da_analise = await retornaPeriodo(parametroLocation.state.periodo_uuid);

                    if(periodo_da_data && periodo_da_analise && periodo_da_data.periodo_referencia === periodo_da_analise.referencia){
                        setReadOnlyBtnAcao(false);
                        erros = {
                            data_transacao: null
                        }
                    }
                    else{
                        setReadOnlyBtnAcao(true);
                        erros = {
                            data_transacao: "Permitido apenas datas dentro do período referente à devolução"
                        }
                    }
                }
                catch (e) {
                    console.log("Erro ao buscar perído ", e)
                }
            }
        }

        // Verifica se deve utilizar logica de periodo fechado
        if(!aux.origemAnaliseLancamento(parametroLocation)){
            // Verifica período fechado para a receita
            if (values.data_transacao && origem==="despesa_principal") {
                let data = moment(values.data_transacao, "YYYY-MM-DD").format("YYYY-MM-DD");
                try {
                    let periodo_fechado = await getPeriodoFechado(data);

                    if (!periodo_fechado.aceita_alteracoes) {
                        erros = {
                            data_transacao: "Período Fechado"
                        }

                        if(values.retem_imposto){
                            setEnviarFormulario(true)
                        }
                        else{
                            setEnviarFormulario(false)
                        }

                        setReadOnlyBtnAcao(true);
                        setShowPeriodoFechado(true);
                        setReadOnlyCampos(true);
                    } else {
                        setEnviarFormulario(true)
                        setReadOnlyBtnAcao(false);
                        setShowPeriodoFechado(false);
                        setReadOnlyCampos(false);
                    }
                } catch (e) {
                    setReadOnlyBtnAcao(true);
                    setShowPeriodoFechado(true);
                    setReadOnlyCampos(true);
                    onShowErroGeral();
                    console.log("Erro ao buscar perído ", e)
                }
            }
        }

        /* validacoes imposto */
        if(origem === "despesa_imposto" && values.despesas_impostos && values.despesas_impostos[index].data_transacao){
            if(values.data_transacao){
                let data_despesa_principal = moment(values.data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                let data_despesa_imposto = moment(values.despesas_impostos[index].data_transacao, "YYYY-MM-DD HH:mm:ss").format("YYYY-MM-DD HH:mm:ss");
                
                let diff = moment(data_despesa_imposto,"YYYY-MM-DD HH:mm:ss").diff(moment(data_despesa_principal,"YYYY-MM-DD HH:mm:ss"));
                let dias = moment.duration(diff).asDays();

                if(dias < 0){
                    erros = {
                        despesa_imposto_data_transacao: "Data do imposto menor que data da despesa"
                    }
                    setEnviarFormulario(false)
                    setBtnSubmitDisable(true) /* submit */
                }
                // logica periodo fechado
                else{
                    setEnviarFormulario(true)
                    if (!salvandoDespesaRef.current) {
                        setBtnSubmitDisable(false)
                    }

                    if(!aux.origemAnaliseLancamento(parametroLocation)){
                        try{
                            let data = moment(values.despesas_impostos[index].data_transacao, "YYYY-MM-DD").format("YYYY-MM-DD");
                            let periodo_fechado = await getPeriodoFechado(data);
                            if (!periodo_fechado.aceita_alteracoes) {
                                erros = {
                                    despesa_imposto_data_transacao: null
                                }
                                setEnviarFormulario(false)
                                setReadOnlyBtnAcao(true);
                                setShowPeriodoFechadoImposto(true);
                                setDisableBtnAdicionarImposto(true);
                                setReadOnlyCamposImposto(prevState => ({...prevState, [index]: true}));
                            } else {
                                setEnviarFormulario(true)
                                setReadOnlyBtnAcao(false);
                                setShowPeriodoFechadoImposto(false);
                                setDisableBtnAdicionarImposto(false);
                                setReadOnlyCamposImposto(prevState => ({...prevState, [index]: false}));
                            }
                        }
                        catch (e) {
                            setReadOnlyBtnAcao(true);
                            setShowPeriodoFechadoImposto(true);
                            setDisableBtnAdicionarImposto(true);
                            setReadOnlyCamposImposto(prevState => ({...prevState, [index]: true}));
                            onShowErroGeral();
                            console.log("Erro ao buscar perído ", e)
                        }
                    }
                }
                
            }
            else{
                erros = {
                    despesa_imposto_data_transacao: "Data do imposto sem data de despesa"
                }
                setEnviarFormulario(false)
                setBtnSubmitDisable(true) /* submit */
            }
        }
        return erros;
    }, [aux])


    const validateFormDespesas = useCallback(async (values) => {

        values.qtde_erros_form_despesa = document.getElementsByClassName("is_invalid").length;
        const errors = {};
        if (values.tipo_documento) {
            let documento;
            if (despesasTabelas && despesasTabelas.tipos_documento) {
                if (values.tipo_documento.id) {
                    documento = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento.id));
                } else {
                    documento = despesasTabelas.tipos_documento.find(element => element.id === Number(values.tipo_documento));
                }
            }
            const exibe_campo_numero_documento = documento;
            if (exibe_campo_numero_documento && !exibe_campo_numero_documento.numero_documento_digitado) {
                values.numero_documento = "";
                setNumeroDocumentoReadOnly(true);
            } else {
                setNumeroDocumentoReadOnly(false);
            }
            if (documento && documento.pode_reter_imposto) {
                setShowRetencaoImposto(true);
            } else {
                setShowRetencaoImposto(false);
            }
        }
        if (await aux.getErroValorRealizadoRateios(values) !== 0) {
            let diferenca = Number(aux.getErroValorRealizadoRateios(values)).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            errors.valor_recusos_acoes = 'O total das despesas classificadas deve corresponder ao valor total dos recursos do Programa. Diferença de  R$ ' + diferenca;
        }
        if (await aux.getErroValorOriginalRateios(values) !== 0) {
            let diferenca = Number(aux.getErroValorOriginalRateios(values)).toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });
            errors.valor_original = "O total das despesas originais deve corresponder ao valor total dos recursos originais. Diferença de  R$ " + diferenca;
        }
        return errors;
    }, [despesasTabelas, setNumeroDocumentoReadOnly, setShowRetencaoImposto]);

    return { validacoesPersonalizadas, validateFormDespesas };
};

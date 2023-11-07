import {
    calculaValorOriginal,
    calculaValorRecursoAcoes, round,
    trataNumericos
} from "../../../utils/ValidacoesAdicionaisFormularios";
import {deleteDespesa, getNomeRazaoSocial} from "../../../services/escolas/Despesas.service";
import {getVerificarSaldo} from "../../../services/escolas/RateiosDespesas.service";

const onShowModal = (setShow) => {
    setShow(true);
};

const onCancelarTrue = (setShow, setLoading, origem, parametroLocation=null) => {
    setShow(false);
    setLoading(true);
    getPath(origem, parametroLocation);
};

const onHandleClose = (setShow, setShowDelete, setShowAvisoCapital, setShowSaldoInsuficiente, setShowPeriodoFechado, setShowSaldoInsuficienteConta, setShowPeriodoFechadoImposto) => {
    setShow(false);
    setShowDelete(false);
    setShowAvisoCapital(false);
    setShowSaldoInsuficiente(false);
    setShowPeriodoFechado(false);
    setShowSaldoInsuficienteConta(false);
    setShowPeriodoFechadoImposto(false);
};

const onShowAvisoCapitalModal = (setShowAvisoCapital) => {
    setShowAvisoCapital(true);
};

const handleAvisoCapital = (value, setShowAvisoCapital) => {
    if (value === "CAPITAL"){
        onShowAvisoCapitalModal(setShowAvisoCapital)
    }
};

const onShowDeleteModal = (setShowDelete, setShowTextoModalDelete, values) => {
    let possui_estorno = false;
    let possui_imposto = values.retem_imposto;

    for(let rateio=0; rateio<=values.rateios.length-1; rateio++){
        if(values.rateios[rateio].estorno && values.rateios[rateio].estorno.uuid){
            possui_estorno = true;
        }
    }

    if(possui_estorno && possui_imposto){
        setShowTextoModalDelete("<p>A exclusão dessa despesa resultará na exclusão do crédito de estorno vinculado e do imposto vinculado. Confirma?</p>");
    }
    else if(possui_estorno){
        setShowTextoModalDelete("<p>A exclusão dessa despesa resultará na exclusão do crédito de estorno vinculado. Confirma?</p>");
    }
    else if(possui_imposto){
        setShowTextoModalDelete("<p>Excluir essa despesa excluirá também a despesa referente ao imposto retido. Confirma exclusão?</p>");
    }
    else{
        setShowTextoModalDelete("<p>Tem certeza que deseja excluir esta despesa? A ação não poderá ser desfeita.</p>");
    }
    
    setShowDelete(true);
};

const onDeletarTrue = (setShowDelete, setLoading, despesaContext, origem) => {
    setShowDelete(false);
    setLoading(true);
    deleteDespesa(despesaContext.idDespesa)
    .then(response => {
        console.log("Despesa deletada com sucesso.");
        getPath(origem);
    })
    .catch(error => {
        console.log(error);
        setLoading(false);
        alert("Um Problema Ocorreu. Entre em contato com a equipe para reportar o problema, obrigado.");
    });
};

const onShowErroGeral = (setShowErroGeral) => {
    setShowErroGeral(true);
};

const verificarSaldo = async (payload, despesaContext) => {
    return await getVerificarSaldo(payload, despesaContext.idDespesa);
};

const getPath = (origem, parametroLocation=null) => {
    let path;
    if (origem === undefined){
        path = `/lista-de-despesas`;
    }else {
        path = `/detalhe-das-prestacoes`;
    }

    if(parametroLocation){
        if(origemAnaliseLancamento(parametroLocation)){
            if(parametroLocation.state.uuid_pc){
                let ancora = ""
                if(parametroLocation.state.operacao === "requer_inclusao_documento_gasto"){
                    ancora = "tabela-acertos-documentos"
                }
                else if(parametroLocation.state.operacao === "requer_atualizacao_lancamento_gasto" || parametroLocation.state.operacao === "requer_exclusao_lancamento_gasto"){
                    ancora = "tabela-acertos-lancamentos"
                }

                path = `${parametroLocation.state.origem}/${parametroLocation.state.uuid_pc}#${ancora}`;
            }
        }
    }

    window.location.assign(path)
};

const get_nome_razao_social = async (cpf_cnpj, setFieldValue, nome_fornecedor="") => {
    if (!nome_fornecedor){
        let resp = await getNomeRazaoSocial(cpf_cnpj);
        if (resp && resp.length > 0 && resp[0].nome){
            setFieldValue("nome_fornecedor", resp[0].nome);
        }
    }
};

const exibeDocumentoTransacao = (valor, setCssEscondeDocumentoTransacao, setLabelDocumentoTransacao, despesasTabelas) => {
    if (valor && despesasTabelas && despesasTabelas.tipos_transacao){
        let exibe_documento_transacao =  despesasTabelas.tipos_transacao.find(element => element.id === Number(valor));
        if (exibe_documento_transacao.tem_documento){
            setCssEscondeDocumentoTransacao("");
            setLabelDocumentoTransacao(exibe_documento_transacao.nome);
        }else {
            setCssEscondeDocumentoTransacao("escondeItem");
        }
    }else {
        setCssEscondeDocumentoTransacao("escondeItem");
    }
};

const exibeDocumentoTransacaoImposto = (valor, setLabelDocumentoTransacao, labelDocumentoTransacaoImposto, setCssEscondeDocumentoTransacaoImposto, cssEscondeDocumentoTransacaoImposto, despesasTabelas, index) => {
    if(valor && despesasTabelas && despesasTabelas.tipos_transacao){
        let exibe_documento_transacao =  despesasTabelas.tipos_transacao.find(element => element.id === Number(valor));
        if (exibe_documento_transacao.tem_documento){
            setCssEscondeDocumentoTransacaoImposto({
                ...cssEscondeDocumentoTransacaoImposto,
                [index]: ""
            })
            setLabelDocumentoTransacao({
                ...labelDocumentoTransacaoImposto,
                [index]: exibe_documento_transacao.nome
            })
        }
        else{
            setCssEscondeDocumentoTransacaoImposto({
                ...cssEscondeDocumentoTransacaoImposto,
                [index]: "escondeItem"
            })
        }
    }
    else{
        setCssEscondeDocumentoTransacaoImposto({
            ...cssEscondeDocumentoTransacaoImposto,
            [index]: "escondeItem"
        })
    }
}

const exibeDocumentoTransacaoImpostoUseEffect = (despesas_impostos, setLabelDocumentoTransacao, labelDocumentoTransacaoImposto, setCssEscondeDocumentoTransacaoImposto, cssEscondeDocumentoTransacaoImposto, despesasTabelas) => {
    despesas_impostos.map((despesa_imposto, index_imposto) => {
        if(despesa_imposto.tipo_transacao && despesasTabelas && despesasTabelas.tipos_transacao){
            let exibe_documento_transacao =  despesasTabelas.tipos_transacao.find(element => element.id === Number(despesa_imposto.tipo_transacao));
            if(exibe_documento_transacao.tem_documento){
                setCssEscondeDocumentoTransacaoImposto(prevState => ([...prevState, ""]))
                setLabelDocumentoTransacao(prevState => ([...prevState, exibe_documento_transacao.nome]))
            }
            else{
                setCssEscondeDocumentoTransacaoImposto(prevState => ([...prevState, {[index_imposto]: "escondeItem"}]))
            }
        }
        else{
            setCssEscondeDocumentoTransacaoImposto(prevState => ([...prevState, {[index_imposto]: "escondeItem"}]))
        }  
    });

    
}

const setValorRealizado = (setFieldValue, valor) =>{
    setFieldValue("valor_total", trataNumericos(valor))
};

const limpaTipoDespesaCusteio = (setFieldValue) => {
    setFieldValue('rateios[0].tipo_custeio', null)
}

const setaValoresCusteioCapital = (mais_de_um_tipo_de_despesa = null, values, setFieldValue) =>{
    if (mais_de_um_tipo_de_despesa && mais_de_um_tipo_de_despesa === 'nao'){
        setFieldValue('rateios[0].valor_rateio', calculaValorRecursoAcoes(values));
        setFieldValue('rateios[0].quantidade_itens_capital', "");
        setFieldValue('rateios[0].valor_item_capital', calculaValorOriginal(values));
    }
};

const setValoresRateiosOriginal = (mais_de_um_tipo_de_despesa = null, values, setFieldValue) =>{
    if (mais_de_um_tipo_de_despesa && mais_de_um_tipo_de_despesa === 'nao' ){
        setFieldValue('rateios[0].valor_original', calculaValorOriginal(values));
    }
};

const getErroValorOriginalRateios = (values) =>{

    let valor_ptfr_original;

    valor_ptfr_original = calculaValorOriginal(values);
    let valor_total_dos_rateios_original = 0;
    let valor_total_dos_rateios_capital_original = 0;
    let valor_total_dos_rateios_custeio_original = 0;

    values.rateios.map((rateio)=>{
        if (rateio.aplicacao_recurso === "CAPITAL"){
            valor_total_dos_rateios_capital_original = valor_total_dos_rateios_capital_original + trataNumericos(rateio.quantidade_itens_capital) * trataNumericos(rateio.valor_item_capital)
        }else{
            valor_total_dos_rateios_custeio_original = valor_total_dos_rateios_custeio_original + trataNumericos(rateio.valor_original)
        }
    });

    if(values.retem_imposto && values.despesas_impostos && values.despesas_impostos.length > 0){
        let valor_imposto = 0;

        values.despesas_impostos.map((despesa_imposto) => {
            if(despesa_imposto.rateios.length > 0){
                despesa_imposto.rateios.map((rateio) => {
                    valor_imposto = valor_imposto + trataNumericos(rateio.valor_original);
                });
            }
        });

        valor_total_dos_rateios_original = valor_total_dos_rateios_capital_original + valor_total_dos_rateios_custeio_original + valor_imposto;
    }
    else{
        valor_total_dos_rateios_original = valor_total_dos_rateios_capital_original + valor_total_dos_rateios_custeio_original;
    }

    return round(valor_ptfr_original, 2) - round(valor_total_dos_rateios_original, 2)

};

const getErroValorRealizadoRateios = (values) =>{
    let var_valor_recursos_acoes;

    if(values.retem_imposto && values.despesas_impostos && values.despesas_impostos.length > 0){
        let valor_imposto = 0;

        values.despesas_impostos.map((despesa_imposto) => {
            if(despesa_imposto.rateios.length > 0){
                despesa_imposto.rateios.map((rateio) => {
                    valor_imposto = valor_imposto + trataNumericos(rateio.valor_rateio);
                });
            }
        });

        var_valor_recursos_acoes = trataNumericos(values.valor_total) - trataNumericos(values.valor_recursos_proprios) - trataNumericos(valor_imposto);
    }
    else{
        var_valor_recursos_acoes = trataNumericos(values.valor_total) - trataNumericos(values.valor_recursos_proprios);
    }

    let var_valor_total_dos_rateios = 0;
    let var_valor_total_dos_rateios_capital = 0;
    let var_valor_total_dos_rateios_custeio = 0;

    values.rateios.map((rateio) => {
        var_valor_total_dos_rateios_custeio = var_valor_total_dos_rateios_custeio + trataNumericos(rateio.valor_rateio)
    });
    var_valor_total_dos_rateios = var_valor_total_dos_rateios_capital + var_valor_total_dos_rateios_custeio;

    return round(var_valor_recursos_acoes, 2) - round(var_valor_total_dos_rateios, 2);
};

export const apenasNumero = (valor) => {
	const re = /^[0-9\b]+$/;
	
	if (valor === '' || re.test(valor)) {
		return true;
		
	}
	return false;
}

const onHandleChangeApenasNumero = (e, setFieldValue, campo) => {
    let valor = e.target.value;
    if(apenasNumero(valor)){
        setFieldValue(campo, valor)
     }
}

const origemAnaliseLancamento = (parametroLocation) => {
    if(parametroLocation){
        if(!parametroLocation.state){
            return false;
        }
        
        if(parametroLocation.state && parametroLocation.state.origem_visao === "UE"){
            if(parametroLocation.state && parametroLocation.state.origem === "/consulta-detalhamento-analise-da-dre"){
                return true;
            }
            else{
                return false;
            }
        }
        else if(parametroLocation.state && parametroLocation.state.origem_visao === "DRE"){
            if(parametroLocation.state && parametroLocation.state.origem === "/dre-detalhe-prestacao-de-contas-resumo-acertos"){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }
    else{
        return false;
    }
}

const mantemConciliacaoAtual = (values) => {
    values.rateios.map((rateio) => {
        rateio.update_conferido = true;
    });
}

const mantemConciliacaoAtualImposto = (despesa_imposto) => {
    despesa_imposto.rateios.map((rateio) => {
        rateio.update_conferido = true;
    });
}

const temPermissaoEdicao = (parametroLocation) => {
    if(parametroLocation && parametroLocation.state){
        if(parametroLocation.state.tem_permissao_de_edicao){
            return true;
        }
    }

    return false;
}

const ehOperacaoAtualizacao = (parametroLocation) => {
    if(parametroLocation && parametroLocation.state){
        if(parametroLocation.state.operacao === "requer_atualizacao_lancamento_gasto"){
            return true;
        }
    }

    return false;
}

const ehOperacaoExclusao = (parametroLocation) => {
    if(parametroLocation && parametroLocation.state){
        if(parametroLocation.state.operacao === "requer_exclusao_lancamento_gasto"){
            return true;
        }
    }

    return false;
}

const ehOperacaoInclusao = (parametroLocation) => {
    if(parametroLocation && parametroLocation.state){
        if(parametroLocation.state.operacao === "requer_inclusao_documento_gasto"){
            return true;
        }
    }

    return false;
}

const bloqueiaCamposDespesaPrincipal = (parametroLocation, setReadOnlyCampos, setReadOnlyBtnAcao) => {
    if(!parametroLocation.state.tem_permissao_de_edicao || ehOperacaoExclusao(parametroLocation)){
        setReadOnlyCampos(true);

        let bloqueia_btn_acao = false;

        if(parametroLocation.state.origem_visao === "DRE"){
            bloqueia_btn_acao = true;
        }
        else if(parametroLocation.state.operacao !== "requer_exclusao_lancamento_gasto"){
            bloqueia_btn_acao = true;
        }

        setReadOnlyBtnAcao(bloqueia_btn_acao);
    }
}

const bloqueiaCamposDespesaImposto = (parametroLocation, setReadOnlyCamposImposto, setDisableBtnAdicionarImposto, despesaContext) => {
    let despesas_impostos = despesaContext.initialValues.despesas_impostos;
    
    if(!parametroLocation.state.tem_permissao_de_edicao || ehOperacaoExclusao(parametroLocation)){
        for(let i=0; i<=despesas_impostos.length-1; i++){
            setReadOnlyCamposImposto(prevState => ({...prevState, [i]: true}));
            setDisableBtnAdicionarImposto(true);
        }
    }
}

const mostraBotaoDeletar = (idDespesa, parametroLocation) => {
    if (parametroLocation && parametroLocation.state && !parametroLocation.state.tem_permissao_de_edicao){
        return false
    }

    if(origemAnaliseLancamento(parametroLocation)){
        if(!temPermissaoEdicao(parametroLocation)){
            return false;
        }
        else{
            if(ehOperacaoExclusao(parametroLocation)){
                return true;
            }
            else if(ehOperacaoAtualizacao(parametroLocation)){
                return false;
            }
            else if(ehOperacaoInclusao(parametroLocation)){
                return false;
            }
        }
    }
    else{
        if(idDespesa){
            return true;
        }
        else{
            return false;
        }
    }
}


const validaConciliacao = (values, periodo_da_analise) => {
    // Esse metodo é utilizado apenas para reabertura seletiva
    // Novos rateios adicionados a despesa devem ser validados para definir se irão ser automaticamente conciliados

    let rateios = values.rateios;

    let rateios_existentes = rateios.filter((item) => (item.uuid !== undefined));
    let novos_rateios = rateios.filter((item) => (item.uuid === undefined));

    if(novos_rateios.length > 0){
        let rateios_existentes_nao_conciliados = rateios_existentes.filter((item) => (item.conferido === false));
        
        if(rateios_existentes_nao_conciliados.length === 0){
            if(periodo_da_analise && periodo_da_analise.id){
                novos_rateios.map((rateio) => {
                    rateio.update_conferido = true;
                    rateio.conferido = true;
                    rateio.periodo_conciliacao = periodo_da_analise.id
                });
            }  
        }
    }    
}

const conciliaRateios = (values, periodo_da_analise) => {
    // Esse metodo é utilizado apenas para reabertura seletiva
    // Todos os rateios da despesa criada devem ser automaticamente conciliados
    
    let rateios = values.rateios;

    if(periodo_da_analise && periodo_da_analise.id){
        rateios.map((rateio) => {
            rateio.update_conferido = true;
            rateio.conferido = true;
            rateio.periodo_conciliacao = periodo_da_analise.id
        });
    }  
}

const documentoTransacaoObrigatorio = (value, despesasTabelas) => {
    // Valida se o documento transação deve ser considerado para o calculo de despesa rascunho

    if (value && despesasTabelas && despesasTabelas.tipos_transacao){
        let id_transacao = value.id ? value.id : value;
        let exibe_documento_transacao =  despesasTabelas.tipos_transacao.find(element => element.id === Number(id_transacao));
        
        if(exibe_documento_transacao && exibe_documento_transacao.tem_documento){
            return true;
        }
    }
    return false;
}

export const metodosAuxiliares = {
    onShowModal,
    onCancelarTrue,
    onHandleClose,
    onShowAvisoCapitalModal,
    onShowDeleteModal,
    onDeletarTrue,
    handleAvisoCapital,
    onShowErroGeral,
    verificarSaldo,
    getPath,
    get_nome_razao_social,
    exibeDocumentoTransacao,
    setValorRealizado,
    setaValoresCusteioCapital,
    setValoresRateiosOriginal,
    getErroValorOriginalRateios,
    getErroValorRealizadoRateios,
    onHandleChangeApenasNumero,
    exibeDocumentoTransacaoImposto,
    exibeDocumentoTransacaoImpostoUseEffect,
    origemAnaliseLancamento,
    mantemConciliacaoAtual,
    mantemConciliacaoAtualImposto,
    temPermissaoEdicao,
    ehOperacaoAtualizacao,
    ehOperacaoExclusao,
    bloqueiaCamposDespesaPrincipal,
    bloqueiaCamposDespesaImposto,
    mostraBotaoDeletar,
    validaConciliacao,
    conciliaRateios,
    documentoTransacaoObrigatorio,
    limpaTipoDespesaCusteio
};
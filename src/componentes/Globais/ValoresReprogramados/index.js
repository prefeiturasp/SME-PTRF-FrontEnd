import React, {useState, useEffect, useCallback, useRef} from "react";
import { useLocation } from 'react-router-dom';
import { Botoes } from "./Botoes";
import { ValoresReprogramadosFormFormik } from "./ValoresReprogramadosFormFormik";
import { BarraStatus } from "./BarraStatus";
import { Cabecalho } from "./Cabecalho";
import { TextoExplicativo } from "./TextoExplicativoDaPagina";
import { PaginasContainer } from "../../../paginas/PaginasContainer";
import { 
    getValoresReprogramados, 
    patchSalvarValoresReprogramados ,
    patchConcluirValoresReprogramados,
    getStatusValoresReprogramados,
    getTextoExplicativoUe,
    getTextoExplicativoDre
} from "../../../services/ValoresReprogramados.service";
import { visoesService } from "../../../services/visoes.service";
import Loading from "../../../utils/Loading";
import { trataNumericos, exibeDataPT_BR } from "../../../utils/ValidacoesAdicionaisFormularios";
import "./valores-reprogramados.scss"
import { toastCustom } from "../ToastCustom";
import { 
    ModalConclusaoValoresReprogramadosNaoPermitido, 
    ModalDescartarAlteracoesValoresReprogramados,
    ModalConcluirValoresReprogramados
} from "../../../utils/Modais";


export const ValoresReprogramados = () => {
    // Dados localstorage
    const visao_selecionada = visoesService.getItemUsuarioLogado('visao_selecionada.nome');
    const associacao_selecionada = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid');

    const formRef = useRef();
    const parametros = useLocation();

    // States
    const [valoresReprogramados, setValoresReprogramados] = useState(false);
    const [objetoParaComparacao, setObjetoParaComparacao] = useState(false);
    const [statusValoresReprogramados, setStatusValoresReprogramados] = useState(false);
    const [uuidAssociacao, setUuidAssociacao] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showConclusaoNaoPermitida, setShowConclusaoNaoPermitida] = useState(false);
    const [msgConclusaoNaoPermitida, setMsgConclusaoNaoPermitida] = useState("");
    const [showDescartarAlteracoes, setShowDescartarAlteracoes] = useState(false);
    const [textoExplicativo, setShowTextoExplicativo] = useState("")
    const [showConcluir, setShowConcluir] = useState(false);

    // Chamadas a API
    const carregaUuidAssociacao = useCallback(async () => {
        if(visao_selecionada && associacao_selecionada){
            if(visao_selecionada === "UE"){
                setUuidAssociacao(associacao_selecionada);
            }
            else if(visao_selecionada === "DRE"){
                if (parametros && parametros.state && parametros.state.uuid_associacao){
                    setUuidAssociacao(parametros.state.uuid_associacao);
                }
            }
        }
    }, [visao_selecionada, associacao_selecionada, parametros]);

    const carregaValoresReprogramados = useCallback(async () => {
        if(uuidAssociacao){
            try {
                let listaValoresReprogramados = await getValoresReprogramados(uuidAssociacao);
                if(listaValoresReprogramados){
                    setValoresReprogramados(listaValoresReprogramados);
                    setObjetoParaComparacao(listaValoresReprogramados);
                    setLoading(false);
                }
                else{
                    setValoresReprogramados(false);
                    setObjetoParaComparacao(false);
                }
            }
            catch (e) {
                console.log("Erro ao buscar valores reprogramados ", e)
            }
        }
    }, [uuidAssociacao]);


    const carregaStatusValoresReprogramados = useCallback(async () => {
        if(uuidAssociacao){
            try {
                let status = await getStatusValoresReprogramados(uuidAssociacao);
                if(status){
                    setStatusValoresReprogramados(status.status);
                }
                else{
                    setStatusValoresReprogramados(false);
                }
            }
            catch (e) {
                console.log("Erro ao buscar status valores reprogramados ", e)
            }
        }
    }, [uuidAssociacao]);

    const carregaTextoExplicativo = useCallback(async () => {
        if(visao_selecionada){
            if(visao_selecionada === "UE"){
                let texto = await getTextoExplicativoUe();
                setShowTextoExplicativo(texto.detail);
            }
            else if(visao_selecionada === "DRE"){
                let texto = await getTextoExplicativoDre();
                setShowTextoExplicativo(texto.detail);
            }
        }
    }, [visao_selecionada]);

    // useEffects
    useEffect(() => {
        carregaUuidAssociacao()
    }, [carregaUuidAssociacao])

    useEffect(() => {
        carregaValoresReprogramados()
    }, [carregaValoresReprogramados])

    useEffect(() => {
        carregaStatusValoresReprogramados()
    }, [carregaStatusValoresReprogramados])

    useEffect(() => {
        carregaTextoExplicativo()
    }, [carregaTextoExplicativo])


    // handles

    const handleSalvarValoresReprogramados = async () => {
        let dadosForm = formRef.current.values
        let dadosFormatado = formataDados(dadosForm);

        let payload = {
            associacao_uuid: uuidAssociacao,
            visao: visao_selecionada,
            dadosForm: dadosFormatado
        }

        try {
            setLoading(true);
            let valores = await patchSalvarValoresReprogramados(payload);
            setValoresReprogramados(valores);
            setObjetoParaComparacao(valores);
            setLoading(false);
            toastCustom.ToastCustomSuccess('Informações salvas com sucesso.', `As informações dos valores reprogramados foram salvos com sucesso.`)
        } catch (e) {
            console.log("Erro ao salvar Valores Reprogramados ", e.response)
        }
    }

    const handleOnClickConcluirValoresReprogramados = async () => {
        let dadosForm = formRef.current.values;
        let dadosFormatado = formataDados(dadosForm);
        let validado = validaPayload(dadosFormatado);

        if(validado){
            setShowConcluir(true);
        }
        else{
            if(visao_selecionada === "UE"){
                setMsgConclusaoNaoPermitida("Todos os campos da coluna de valores da Associação devem estar preenchidos (zeros são permitidos).")
            }
            else if(visao_selecionada === "DRE"){
                setMsgConclusaoNaoPermitida("Todos os campos da coluna de valores da DRE devem estar preenchidos (zeros são permitidos).")
            }

            setShowConclusaoNaoPermitida(true);
        } 
    }

    const handleConcluirValoresReprogramados = async () => {
        let dadosForm = formRef.current.values;
        let dadosFormatado = formataDados(dadosForm);

        let payload = {
            associacao_uuid: uuidAssociacao,
            visao: visao_selecionada,
            dadosForm: dadosFormatado
        }

        try {
            setShowConcluir(false);
            setLoading(true);
            let valores = await patchConcluirValoresReprogramados(payload);
            setValoresReprogramados(valores);
            setObjetoParaComparacao(valores);
            let status = await getStatusValoresReprogramados(uuidAssociacao);
            setStatusValoresReprogramados(status.status);
            setLoading(false);
            toastCustom.ToastCustomSuccess('Concluído com sucesso.', `${status.status.texto}`)
        } catch (e) {
            console.log("Erro ao salvar Valores Reprogramados ", e.response)
        }    
    }

    const objetosDiferentes = () => {
        let dadosForm = formRef.current.values;
        let dadosComparacao = objetoParaComparacao;

        let tem_diferenca = false;
        let atributo = visao_selecionada === "UE" ? "valor_ue" : "valor_dre";

        for(let i=0; i<=dadosComparacao.contas.length-1; i++){
            let contaForm = dadosForm.contas[i].conta;
            let contaComparacao = dadosComparacao.contas[i].conta;

            for(let x=0; x<=contaComparacao.acoes.length-1; x++){
                let acaoForm = contaForm.acoes[x];
                let acaoComparacao = contaComparacao.acoes[x];

                if(acaoComparacao.custeio && acaoForm.custeio){
                    // Formata valor do form
                    acaoForm.custeio[atributo] = trataNumericos(acaoForm.custeio[atributo])
                    
                    // Formata valor do objeto de comparacao (estado inicial do objeto)
                    acaoComparacao.custeio[atributo] = trataNumericos(acaoComparacao.custeio[atributo])

                    if(acaoComparacao.custeio[atributo] !== acaoForm.custeio[atributo]){
                        tem_diferenca = true;
                        break;
                    }
                }

                if(acaoComparacao.capital && acaoForm.capital){
                    // Formata valor do form
                    acaoForm.capital[atributo] = trataNumericos(acaoForm.capital[atributo])
                                        
                    // Formata valor do objeto de comparacao (estado inicial do objeto)
                    acaoComparacao.capital[atributo] = trataNumericos(acaoComparacao.capital[atributo])

                    if(acaoComparacao.capital[atributo] !== acaoForm.capital[atributo]){
                        tem_diferenca = true;
                        break;
                    }
                }

                if(acaoComparacao.livre && acaoForm.livre){
                    // Formata valor do form
                    acaoForm.livre[atributo] = trataNumericos(acaoForm.livre[atributo])
                                        
                    // Formata valor do objeto de comparacao (estado inicial do objeto)
                    acaoComparacao.livre[atributo] = trataNumericos(acaoComparacao.livre[atributo])

                    if(acaoComparacao.livre[atributo] !== acaoForm.livre[atributo]){
                        tem_diferenca = true;
                        break;
                    }
                }
            }
        }

        return tem_diferenca;
    }

    const handleVoltar = () => {
        if(objetosDiferentes()){
            setShowDescartarAlteracoes(true);
        }
        else{
            redirecionarUsuario();
        }
    }

    const handleOnKeyDown = (setFieldValue, e, aplicacao, index_conta, index_acao, origem) => {
        /* Função necessária para que o usuário consiga apagar a máscara do input */

        let backspace = 8;
        let teclaPressionada = e.keyCode;
        let nome_aplicacao = aplicacao.nome;
        let valor = origem === "UE" ? aplicacao.valor_ue : aplicacao.valor_dre;
        let atributo = origem === "UE" ? "valor_ue" : "valor_dre";
        
        if(teclaPressionada === backspace){
            if(valor === 0 || valor === "R$0,00"){
                setFieldValue(`contas[${index_conta}].conta.acoes[${index_acao}].${nome_aplicacao}.${atributo}`, null);

                if(origem === "DRE"){
                    // Necessario para esconder input quando o valor for nulo
                    setFieldValue(`contas[${index_conta}].conta.acoes[${index_acao}].${nome_aplicacao}.status_conferencia`, null);
                }
                else if(origem === "UE"){
                    setFieldValue(`contas[${index_conta}].conta.acoes[${index_acao}].${nome_aplicacao}.status_conferencia`, "sem-texto-ou-icone");
                }
                
            }
        }
    }

    const handleChangeStatusConferencia = (setFieldValue, e, aplicacao, index_conta, index_acao, origem) => {
        let nome_aplicacao = aplicacao.nome;
        let valor_ue = null;
        let valor_dre = null;

        if(origem === "DRE"){
            valor_dre = e.target.value;
            valor_ue = aplicacao.valor_ue;
        }
        else if(origem === "UE"){
            valor_dre = aplicacao.valor_dre;
            valor_ue = e.target.value;
        }

        valor_ue = trataNumericos(valor_ue);
        valor_dre = trataNumericos(valor_dre);

        if((valor_ue || valor_ue === 0 ) && (valor_dre || valor_dre === 0)){
            if(valor_ue === valor_dre){
                setFieldValue(`contas[${index_conta}].conta.acoes[${index_acao}].${nome_aplicacao}.status_conferencia`, "correto");
            }
            else if(valor_ue !== valor_dre){
                setFieldValue(`contas[${index_conta}].conta.acoes[${index_acao}].${nome_aplicacao}.status_conferencia`, "incorreto");
            }
        }
        else if((valor_ue || valor_ue === 0 ) && (!valor_dre || valor_dre === 0)){
            setFieldValue(`contas[${index_conta}].conta.acoes[${index_acao}].${nome_aplicacao}.status_conferencia`, null);
        }
    }

    const handleClickEstaCorreto = (setFieldValue, aplicacao, index_conta, index_acao) => {
        let nome_aplicacao = aplicacao.nome;
        let valor_ue = aplicacao.valor_ue;

        setFieldValue(`contas[${index_conta}].conta.acoes[${index_acao}].${nome_aplicacao}.valor_dre`, valor_ue);
        setFieldValue(`contas[${index_conta}].conta.acoes[${index_acao}].${nome_aplicacao}.status_conferencia`, "correto");
    }

    // validacoes

    const editavelUE = () => {
        if(periodoFechado()){
            return false;
        }

        if(visao_selecionada === "UE"){
            if(visoesService.getPermissoes(['change_valores_reprogramados_ue'])){
                if(valoresReprogramados && valoresReprogramados.associacao){
                    let status = valoresReprogramados.associacao.status_valores_reprogramados;
    
                    if(status === "NAO_FINALIZADO" || status === "EM_CORRECAO_UE"){
                        return true;
                    }
                }
            }  
        }

        return false;
    }

    const editavelDRE = () => {
        if(periodoFechado()){
            return false;
        }

        if(visao_selecionada === "DRE"){
            if(visoesService.getPermissoes(['change_valores_reprogramados_dre'])){
                if(valoresReprogramados && valoresReprogramados.associacao){
                    let status = valoresReprogramados.associacao.status_valores_reprogramados;
                    if(status === "EM_CONFERENCIA_DRE" || status === "VALORES_CORRETOS"){
                        return true;
                    }
                }
            }
        }

        return false;
    }

    const periodoFechado = () => {
        if(statusValoresReprogramados.periodo_fechado){
            return true;
        }

        return false;
    }

    const permiteSalvarOuConcluir = () => {
        let permite = visao_selecionada === "UE" ? editavelUE() : editavelDRE();
        return permite;
    }

    const defineCorBarraStatus = (numero_cor) => {
        return `cor-${numero_cor}`
    }

    const valoresSomadosUE = (dado_conta) => {
        let total_ue = 0;
        let acoes = dado_conta.conta.acoes;

        for(let i=0; i<=acoes.length-1; i++){
            let acao = acoes[i];

            if(acao.capital){
                let valor_ue_capital = acao.capital.valor_ue ? trataNumericos(acao.capital.valor_ue) : 0;
                total_ue = total_ue + valor_ue_capital;
            }

            if(acao.custeio){
                let valor_ue_custeio = acao.custeio.valor_ue ? trataNumericos(acao.custeio.valor_ue) : 0;
                total_ue = total_ue + valor_ue_custeio;
            }

            if(acao.livre){
                let valor_ue_livre = acao.livre.valor_ue ? trataNumericos(acao.livre.valor_ue) : 0;
                total_ue = total_ue + valor_ue_livre;
            }
        }

        let total_ue_formatado = total_ue.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        
        return total_ue_formatado;
    }

    const valoresSomadosDRE = (dado_conta) => {
        let total_dre = 0;
        let acoes = dado_conta.conta.acoes;

        for(let i=0; i<=acoes.length-1; i++){
            let acao = acoes[i];

            if(acao.capital){
                let valor_dre_capital = acao.capital.valor_dre ? trataNumericos(acao.capital.valor_dre) : 0;
                total_dre = total_dre + valor_dre_capital;
            }

            if(acao.custeio){
                let valor_dre_custeio = acao.custeio.valor_dre ? trataNumericos(acao.custeio.valor_dre) : 0;
                total_dre = total_dre + valor_dre_custeio;
            }

            if(acao.livre){
                let valor_dre_livre = acao.livre.valor_dre ? trataNumericos(acao.livre.valor_dre) : 0;
                total_dre = total_dre + valor_dre_livre;
            }
        }

        let total_dre_formatado = total_dre.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        
        return total_dre_formatado;
    }

    const validaPayload = (dadosForm) => {
        let validado = false;
        
        if(visao_selecionada === "UE"){
            validado = true;
            for(let i=0; i<= dadosForm.contas.length-1; i++){
                let conta = dadosForm.contas[i].conta
    
                for(let a=0; a<=conta.acoes.length-1; a++){
                    let acao = conta.acoes[a]
                    
                    if(acao.custeio){
                        if(acao.custeio.valor_ue === null){
                            validado = false;
                            break;
                        }
                    }

                    if(acao.capital){
                        if(acao.capital.valor_ue === null){
                            validado = false;
                            break;
                        }
                    }

                    if(acao.livre){
                        if(acao.livre.valor_ue === null){
                            validado = false;
                            break;
                        }
                    }
                }   
            }    
        }
        else if(visao_selecionada === "DRE"){
            validado = true;
            for(let i=0; i<= dadosForm.contas.length-1; i++){
                let conta = dadosForm.contas[i].conta
    
                for(let a=0; a<=conta.acoes.length-1; a++){
                    let acao = conta.acoes[a]
                    
                    if(acao.custeio){
                        if(acao.custeio.valor_dre === null){
                            validado = false;
                            break;
                        }
                    }

                    if(acao.capital){
                        if(acao.capital.valor_dre === null){
                            validado = false;
                            break;
                        }
                    }

                    if(acao.livre){
                        if(acao.livre.valor_dre === null){
                            validado = false;
                            break;
                        }
                    }
                }   
            }
        }

        return validado;
    }

    const redirecionarUsuario = () => {
        let path;

        if(visao_selecionada === "UE"){
            path = "/lista-de-receitas";
        }
        else if(visao_selecionada === "DRE"){
            path = "/dre-valores-reprogramados";
        }

        window.location.assign(path);
    }

    const formataDados = (dadosForm) => {
        for(let c=0; c<= dadosForm.contas.length-1; c++){
            let conta = dadosForm.contas[c].conta

            for(let a=0; a<=conta.acoes.length-1; a++){
                let acao = conta.acoes[a]
                
                if(acao.custeio){
                    acao.custeio.valor_ue = trataNumericos(acao.custeio.valor_ue)
                    acao.custeio.valor_dre = trataNumericos(acao.custeio.valor_dre)
                }

                if(acao.capital){
                    acao.capital.valor_ue = trataNumericos(acao.capital.valor_ue)
                    acao.capital.valor_dre = trataNumericos(acao.capital.valor_dre)
                }

                if(acao.livre){
                    acao.livre.valor_ue = trataNumericos(acao.livre.valor_ue)
                    acao.livre.valor_dre = trataNumericos(acao.livre.valor_dre)
                }
            }   
        }

        return dadosForm;
    }

    const exibeAcao = (acao) => {
        if(!acao.custeio && !acao.capital && !acao.livre){
            return false;
        }

        return true;
    }

    const rowSpan = (acao) => {
        let total = 1

        if(acao.capital){
            total = total +1
        }

        if(acao.custeio){
            total = total + 1
        };

        if(acao.livre){
            total = total + 1
        }

        return total;
    }

    const textoPeriodo = () => {
        let periodo = valoresReprogramados.associacao.periodo_inicial
        let texto = "-"

        if(periodo){
            let data_inicio = periodo.data_inicio_realizacao_despesas ? exibeDataPT_BR(periodo.data_inicio_realizacao_despesas) : "-";
            let data_fim = periodo.data_fim_realizacao_despesas ? exibeDataPT_BR(periodo.data_fim_realizacao_despesas) : "-";
            texto = `${periodo.referencia} - ${data_inicio} até ${data_fim}`;
        }

        return texto
    }

    return (
        <>
            <PaginasContainer>

                <h1 className="titulo-itens-painel mt-5">Valores reprogramados</h1>
                <TextoExplicativo
                    textoExplicativo={textoExplicativo}
                />
                
                <div className="page-content-inner">
                    {loading ? (
                        <Loading
                            corGrafico="black"
                            corFonte="dark"
                            marginTop="0"
                            marginBottom="0"
                        />
                    ) :
                        
                        <>
                            <Cabecalho
                                valoresReprogramados={valoresReprogramados}
                                textoPeriodo={textoPeriodo}
                            />

                            <BarraStatus
                                statusValoresReprogramados={statusValoresReprogramados}
                                defineCorBarraStatus={defineCorBarraStatus}
                            />
                            <Botoes
                                handleSalvarValoresReprogramados={handleSalvarValoresReprogramados}
                                handleOnClickConcluirValoresReprogramados={handleOnClickConcluirValoresReprogramados}
                                handleVoltar={handleVoltar}
                                permiteSalvarOuConcluir={permiteSalvarOuConcluir}
                            />
                            <ValoresReprogramadosFormFormik
                                valoresReprogramados={valoresReprogramados}
                                formRef={formRef}
                                editavelUE={editavelUE}
                                editavelDRE={editavelDRE}
                                valoresSomadosUE={valoresSomadosUE}
                                valoresSomadosDRE={valoresSomadosDRE}
                                handleOnKeyDown={handleOnKeyDown}
                                handleChangeStatusConferencia={handleChangeStatusConferencia}
                                handleClickEstaCorreto={handleClickEstaCorreto}
                                visao_selecionada={visao_selecionada}
                                exibeAcao={exibeAcao}
                                rowSpan={rowSpan}
                            />
                            <Botoes
                                handleSalvarValoresReprogramados={handleSalvarValoresReprogramados}
                                handleOnClickConcluirValoresReprogramados={handleOnClickConcluirValoresReprogramados}
                                handleVoltar={handleVoltar}
                                permiteSalvarOuConcluir={permiteSalvarOuConcluir}
                            />
                        </>
                        
                    }
                    
                </div>

                <section>
                    <ModalConclusaoValoresReprogramadosNaoPermitido
                        show={showConclusaoNaoPermitida}
                        handleClose={()=>setShowConclusaoNaoPermitida(false)}
                        bodyText={msgConclusaoNaoPermitida}
                    />
                </section>

                <section>
                    <ModalDescartarAlteracoesValoresReprogramados
                        show={showDescartarAlteracoes}
                        handleClose={()=>setShowDescartarAlteracoes(false)}
                        redirecionarUsuario={redirecionarUsuario}
                    />
                </section>

                <section>
                    <ModalConcluirValoresReprogramados
                        show={showConcluir}
                        handleClose={()=>setShowConcluir(false)}
                        handleConcluirValoresReprogramados={handleConcluirValoresReprogramados}
                    />
                </section>

            </PaginasContainer>
        </>
    )
}
import React, {useCallback, useEffect, useState, useMemo} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {
    getConcluirAnalise,
    getAnalisesDePcDevolvidas,
    getUltimaAnalisePc,
    getLancamentosAjustes,
    getDocumentosAjustes,
    getExtratosBancariosAjustes,
    getInfoAta,
    getDespesasPeriodosAnterioresAjustes,
} from "../../../../../services/dres/PrestacaoDeContas.service";
import moment from "moment";
import {gerarUuid, trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import {TopoComBotoes} from "./TopoComBotoes";
import {ModalErroDevolverParaAcerto} from "../DevolucaoParaAcertos/ModalErroDevolverParaAcerto";
import TabsConferenciaAtualHistorico from "./TabsConferenciaAtualHistorico";
import {useCarregaPrestacaoDeContasPorUuid} from "../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import {ModalConfirmaDevolverParaAcerto} from "../DevolucaoParaAcertos/ModalConfirmaDevolverParaAcerto";
import {ModalConciliacaoBancaria} from "../DevolucaoParaAcertos/ModalConciliacaoBancaria";
import {ModalComprovanteSaldoConta} from "../DevolucaoParaAcertos/ModalComprovanteSaldoConta";
import Loading from "../../../../../utils/Loading";
import {isNaN} from "formik";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { mantemEstadoAnaliseDre as meapcservice } from "../../../../../services/mantemEstadoAnaliseDre.service";
import { visoesService } from "../../../../../services/visoes.service";
import {useHandleDevolverParaAssociacao} from "../hooks/useHandleDevolverParaAssociacao";

export const ResumoDosAcertos = () => {

    const {prestacao_conta_uuid} = useParams()
    const props = useLocation();
    const navigate = useNavigate();

    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacao_conta_uuid)

    const [dataLimiteDevolucao, setDataLimiteDevolucao] = useState('')
    const [showModalErroDevolverParaAcerto, setShowModalErroDevolverParaAcerto] = useState(false)
    const [textoErroDevolverParaAcerto, setTextoErroDevolverParaAcerto] = useState('')
    const [analiseAtualUuid, setAnaliseAtualUuid] = useState('')
    const [analisesDePcDevolvidas, setAnalisesDePcDevolvidas] = useState([])
    const [showModalConfirmaDevolverParaAcerto, setShowModalConfirmaDevolverParaAcerto] = useState(false)
    const [loading, setLoading] = useState(true)
    const [totalExtratosAjustes, setTotalExtratosAjustes] = useState(undefined)
    const [totalLancamentosAjustes, setTotalLancamentosAjustes] = useState(undefined)
    const [totalDocumentosAjustes, setTotalDocumentosAjustes] = useState(undefined)
    const [totalDespesasPeriodosAnterioresAjustes, setDespesasPeriodosAnterioresAjustes] = useState(undefined)    
    const [forcaVerificaSeExibeMsg, setForcaVerificaSeExibeMsg] = useState('')
    const [pcEmAnalise, setPcEmAnalise] = useState(false)
    const [analisesDeContaDaPrestacao, setAnalisesDeContaDaPrestacao] = useState([])
    const [infoAta, setInfoAta] = useState([])
    const [editavel, setEditavel] = useState(false)
    const [showModalConciliacaoBancaria, setShowModalConciliacaoBancaria] = useState(false)
    const [showModalComprovanteSaldoConta, setShowModalComprovanteSaldoConta] = useState(false)
    const [showModalLancamentosConciliacao, setShowModalLancamentosConciliacao] = useState(false)
    const [contasPendenciaConciliacao, setContasPendenciaConciliacao] = useState([])
    const [contasPendenciaLancamentosConciliacao, setContasPendenciaLancamentosConciliacao] = useState([])
    const [showModalJustificativaSaldoConta, setShowModalJustificativaSaldoConta] = useState(false)
    const [contasSolicitarCorrecaoJustificativaConciliacao, setContasSolicitarCorrecaoJustificativaConciliacao] = useState([])
    const [btnDevolverParaAcertoDisabled, setBtnDevolverParaAcertoDisabled] = useState(false)

    const handleDevolverParaAssociacao = useHandleDevolverParaAssociacao({
        prestacaoDeContas,
        setContasPendenciaConciliacao,
        setShowModalComprovanteSaldoConta,
        setShowModalConciliacaoBancaria,
        setShowModalConfirmaDevolverParaAcerto,
        setBtnDevolverParaAcertoDisabled,
        setContasPendenciaLancamentosConciliacao,
        setShowModalLancamentosConciliacao,
        setShowModalJustificativaSaldoConta,
        setContasSolicitarCorrecaoJustificativaConciliacao
    });

    const carregaInfoAta = useCallback(async () =>{
        if (prestacaoDeContas.uuid){
            return await getInfoAta(prestacaoDeContas.uuid);
        }
    }, [prestacaoDeContas]);

    const getAnalisePrestacao = useCallback(()=>{
        if (prestacaoDeContas) {
            let arrayAnalises = [];
            if (prestacaoDeContas && prestacaoDeContas.analises_de_conta_da_prestacao && prestacaoDeContas.analises_de_conta_da_prestacao.length > 0){
                prestacaoDeContas.analises_de_conta_da_prestacao.map((conta)=>{
                        arrayAnalises.push({
                            uuid: conta.uuid,
                            conta_associacao: conta.conta_associacao.uuid,
                            data_extrato: conta.data_extrato,
                            saldo_extrato: conta.saldo_extrato !== null ? valorTemplate(conta.saldo_extrato) : null,
                        })
                    });
                return arrayAnalises;
            }else {
                return arrayAnalises;
            }
        }else {
            return undefined
        }
    }, [prestacaoDeContas])

    const verificaEditavel = useCallback(() => {
        if(prestacaoDeContas.status === 'EM_ANALISE'){
            return true;
        }
        else{
            return false;
        }
    }, [prestacaoDeContas]);

    useEffect(() => {
        if(props && props.state && props.state.analisesDeContaDaPrestacao){
            setAnalisesDeContaDaPrestacao(props.state.analisesDeContaDaPrestacao)
        }
        else if(prestacaoDeContas){
            setAnalisesDeContaDaPrestacao(getAnalisePrestacao())
        }

    }, [getAnalisePrestacao, props, prestacaoDeContas])

    useEffect(() => {
        const fetchInfoAta = async () => {
            if (props && props.state && props.state.infoAta) {
                setInfoAta(props.state.infoAta);
            } else if (prestacaoDeContas) {
                const info = await carregaInfoAta();
                setInfoAta(info);
            }
        };
    
        fetchInfoAta();
    
    }, [carregaInfoAta, props, prestacaoDeContas]);

    useEffect(() => {
        if(props && props.state && props.state.editavel){
            setEditavel(props.state.editavel);
        }
        else if(prestacaoDeContas){
            setEditavel(verificaEditavel())
        }

    }, [verificaEditavel, props, prestacaoDeContas])

    // Necessario para quando voltar da aba Histórico para Conferencia atual
    const setAnaliseAtualUuidComPCAnaliseAtualUuid = useCallback(async () => {
        let analise_atual_uuid = '';
        if (editavel) {
            if (prestacaoDeContas && prestacaoDeContas.analise_atual && prestacaoDeContas.analise_atual.uuid) {
                analise_atual_uuid = prestacaoDeContas.analise_atual.uuid
            }
        } else {
            if (prestacaoDeContas && prestacaoDeContas.uuid) {
                let ultima_analise = await getUltimaAnalisePc(prestacaoDeContas.uuid)

                if (ultima_analise && ultima_analise.uuid) {
                    analise_atual_uuid = ultima_analise.uuid
                }
            }
        }
        setAnaliseAtualUuid(analise_atual_uuid)

        // Necessário para o local storage funcionar em conjunto com as abas
        let objetoAnaliseDrePorUsuario = meapcservice.getAnaliseDreUsuarioLogado();
        if(objetoAnaliseDrePorUsuario.analise_pc_uuid && analise_atual_uuid){
            if(objetoAnaliseDrePorUsuario.analise_pc_uuid !== analise_atual_uuid){
                meapcservice.limpaAnaliseDreUsuarioLogado(visoesService.getUsuarioLogin())
            }
        }
        salvaAnaliseAtualLocalStorage(analise_atual_uuid)

        // Necessario alterar os estados dos totais para chamar novamente o método verificaSeExibeMsg setado com undefined
        setTotalExtratosAjustes(undefined)
        setTotalLancamentosAjustes(undefined)
        setTotalDocumentosAjustes(undefined)
        setDespesasPeriodosAnterioresAjustes(undefined)
        setForcaVerificaSeExibeMsg(gerarUuid())
    }, [prestacaoDeContas, props])

    useEffect(() => {
        setAnaliseAtualUuidComPCAnaliseAtualUuid()
    }, [setAnaliseAtualUuidComPCAnaliseAtualUuid])

    // Necessario para exibir ou não o botão Histórico da Tabs
    const totalAnalisesDePcDevolvidas = useMemo(() => analisesDePcDevolvidas.length, [analisesDePcDevolvidas]);

    useEffect(() => {
        let mounted = true;
        const carregaAnalisesDePcDevolvidas = async () => {
            if (mounted) {
                let analises_pc_devolvidas = await getAnalisesDePcDevolvidas(prestacao_conta_uuid)
                setAnalisesDePcDevolvidas(analises_pc_devolvidas)
            }
        }
        carregaAnalisesDePcDevolvidas()
        return () => {
            mounted = false;
        }
    }, [prestacao_conta_uuid])

    const setPrimeiraAnalisePcDevolvida = useCallback(() => {
        if (analisesDePcDevolvidas && analisesDePcDevolvidas.length > 0) {
            let ultimo_indice_array = analisesDePcDevolvidas.length - 1
            setAnaliseAtualUuid(analisesDePcDevolvidas[ultimo_indice_array].uuid)
        }
        // Necessario alterar os estados dos totais para chamar novamente o método verificaSeExibeMsg setado com ''
        setTotalExtratosAjustes('')
        setTotalLancamentosAjustes('')
        setTotalDocumentosAjustes('')
        setDespesasPeriodosAnterioresAjustes('')
    }, [analisesDePcDevolvidas])

    useEffect(() => {
        setPrimeiraAnalisePcDevolvida()
    }, [setPrimeiraAnalisePcDevolvida])

    const verificaPcEmAnalise = useCallback(() => {
        if(prestacaoDeContas && prestacaoDeContas.status === "EM_ANALISE"){
            setPcEmAnalise(true);
        }
        else{
            setPcEmAnalise(false)
            setPrimeiraAnalisePcDevolvida()
        }
    }, [prestacaoDeContas, setPrimeiraAnalisePcDevolvida])

    useEffect(() => {
        verificaPcEmAnalise()
    }, [verificaPcEmAnalise])
  
    const verificaQtdeLancamentosDocumentosAjustes = useCallback(async () => {
        setLoading(true)
        if (infoAta && infoAta.contas && infoAta.contas.length > 0 && analiseAtualUuid) {
            infoAta.contas.map(async (conta) => {
                const extratos_ajustes = await getExtratosBancariosAjustes(analiseAtualUuid, conta.conta_associacao.uuid);
                if(extratos_ajustes) {
                    setTotalExtratosAjustes(prev => prev || 0 + 1)
                }
                const lancamentos_ajustes = await getLancamentosAjustes(analiseAtualUuid, conta.conta_associacao.uuid)
                setTotalLancamentosAjustes(lanc => isNaN(lanc) ? 0 + lancamentos_ajustes.length : lanc + lancamentos_ajustes.length)
                const documentos_ajustes = await getDocumentosAjustes(analiseAtualUuid, conta.conta_associacao.uuid)
                setTotalDocumentosAjustes(documentos_ajustes.length)
                const despesas_periodos_anteriores_ajustes = await getDespesasPeriodosAnterioresAjustes(analiseAtualUuid, conta.conta_associacao.uuid);
                setDespesasPeriodosAnterioresAjustes(prev => isNaN(prev) ? 0 + despesas_periodos_anteriores_ajustes.length : prev + despesas_periodos_anteriores_ajustes.length);
            })
        }

        setLoading(false)
    }, [analiseAtualUuid, infoAta])

    useEffect(() => {
        verificaQtdeLancamentosDocumentosAjustes()
    }, [verificaQtdeLancamentosDocumentosAjustes, forcaVerificaSeExibeMsg])

    const handleChangeDataLimiteDevolucao = useCallback((name, value) => {
        setDataLimiteDevolucao(value)
    }, [])

    const onClickBtnVoltar = useCallback(() => {
        navigate(`/dre-detalhe-prestacao-de-contas/${prestacao_conta_uuid}#devolucao_para_acerto`)
    }, [prestacao_conta_uuid, navigate])

    const trataAnalisesDeContaDaPrestacao = useCallback(() => {
        let analises = [...analisesDeContaDaPrestacao]
        analises.forEach(item => {
            item.data_extrato = item.data_extrato ? moment(item.data_extrato).format("YYYY-MM-DD") : null;
            item.saldo_extrato = item.saldo_extrato ? trataNumericos(item.saldo_extrato) : 0;
        })
        return analises
    }, [analisesDeContaDaPrestacao])

    const devolverParaAcertos = useCallback(async () => {
        setShowModalConfirmaDevolverParaAcerto(false)

        let analises = trataAnalisesDeContaDaPrestacao()
        let payload = {
            devolucao_tesouro: false,
            analises_de_conta_da_prestacao: analises,
            resultado_analise: "DEVOLVIDA",
            data_limite_ue: moment(dataLimiteDevolucao).format("YYYY-MM-DD"),
            devolucoes_ao_tesouro_da_prestacao: []
        }

        if(prestacaoDeContas.pode_devolver === false){
            setShowModalErroDevolverParaAcerto(true);
            setTextoErroDevolverParaAcerto("Foram solicitados acertos que demandam exclusão dos documentos e fechamentos na conclusão do acerto. Para fazer a devolução dessa prestação de contas é necessário reabrir ou devolver primeiro a prestação de contas mais recente para que sejam gerados novos documentos.")
        }
        else{
            try {
                setLoading(true);
                await getConcluirAnalise(prestacaoDeContas.uuid, payload);
                console.log("Devolução para acertos concluída com sucesso!")
                toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi alterada para “Devolvida para acertos”.')
                setLoading(false);
                onClickBtnVoltar();
            }catch (e){
                console.log("Erro ao Devolver para Acerto ", e.response)
                if (e.response.data.mensagem) {
                    setTextoErroDevolverParaAcerto(e.response.data.mensagem)
                } else {
                    setTextoErroDevolverParaAcerto('Erro ao devolver para acerto!')
                }
                setLoading(false);
            }
            setLoading(false);
        }
    }, [dataLimiteDevolucao, trataAnalisesDeContaDaPrestacao, prestacao_conta_uuid, onClickBtnVoltar])
    const handleConfirmarDevolucaoConciliacao = useCallback(async () => {
        setShowModalConciliacaoBancaria(false)
        setShowModalConfirmaDevolverParaAcerto(true)
    }, [])

    const irParaExtratoBancario = useCallback(() => {
        navigate(`/dre-detalhe-prestacao-de-contas/${prestacao_conta_uuid}#collapse_sintese_por_realizacao_da_despesa`)
    }, [prestacao_conta_uuid, navigate])

    const handleConfirmarComprovanteSaldo = useCallback(() => {
        setShowModalComprovanteSaldoConta(false)
        irParaExtratoBancario();
    }, [irParaExtratoBancario])

    const handleIrParaJustificativaSaldoConta = useCallback(() => {
        setShowModalJustificativaSaldoConta(false);
        irParaExtratoBancario();
    }, [irParaExtratoBancario])

    const handleIrParaExtratoLancamentosConciliacao = useCallback(() => {
        setShowModalLancamentosConciliacao(false);
        irParaExtratoBancario();
    }, [irParaExtratoBancario])

    const handleFecharModalLancamentosConciliacao = useCallback(() => {
        setShowModalLancamentosConciliacao(false);
    }, [])

    const obterNomeContaPorUuid = useCallback((uuid) => {
        if (!uuid || !infoAta?.contas) {
            return null;
        }

        return infoAta.contas.find(_conta => _conta.conta_associacao.uuid === uuid)?.conta_associacao?.nome || null;
    }, [infoAta]);

    const obterNomeConta = useCallback((conta) => {
        if (!conta) {
            return 'N/E';
        }

        if (typeof conta === 'string') {
            return obterNomeContaPorUuid(conta) || 'N/E';
        }

        if (typeof conta === 'object') {
            return conta.nome ||
                conta.nome_conta ||
                conta.conta_nome ||
                conta?.conta_associacao?.nome ||
                obterNomeContaPorUuid(conta.uuid) ||
                obterNomeContaPorUuid(conta.conta_uuid) ||
                'N/E';
        }

        return 'N/E';
    }, [obterNomeContaPorUuid]);

    const obterContasSemComprovanteSaldo = useCallback(() => {
        if (!contasPendenciaConciliacao || contasPendenciaConciliacao.length === 0) {
            return [];
        }
        return contasPendenciaConciliacao.map(obterNomeConta);
    }, [contasPendenciaConciliacao, obterNomeConta])

    const obterContasLancamentosConciliacao = useCallback(() => {
        if (!contasPendenciaLancamentosConciliacao || contasPendenciaLancamentosConciliacao.length === 0) {
            return [];
        }

        return contasPendenciaLancamentosConciliacao.map(obterNomeConta);
    }, [contasPendenciaLancamentosConciliacao, obterNomeConta])

    const obterContasJustificativaConciliacao = useCallback(() => {
        if (!contasSolicitarCorrecaoJustificativaConciliacao || contasSolicitarCorrecaoJustificativaConciliacao.length === 0) {
            return [];
        }

        return contasSolicitarCorrecaoJustificativaConciliacao.map(obterNomeConta);
    }, [contasSolicitarCorrecaoJustificativaConciliacao, obterNomeConta])

    const formatarListaContas = useCallback((contas) => {
        if (!contas || contas.length === 0) {
            return 'nenhuma conta identificada';
        }
        return contas.join(', ');
    }, [])

    const contasSemComprovanteTexto = useMemo(() => {
        const contas = obterContasSemComprovanteSaldo();
        return formatarListaContas(contas);
    }, [formatarListaContas, obterContasSemComprovanteSaldo])

    const contasLancamentosConciliacaoTexto = useMemo(() => {
        const contas = obterContasLancamentosConciliacao();
        return formatarListaContas(contas);
    }, [formatarListaContas, obterContasLancamentosConciliacao])

    const contasJustificativaConciliacao = useMemo(() => {
        return obterContasJustificativaConciliacao();
    }, [obterContasJustificativaConciliacao])

    const contasJustificativaConciliacaoTexto = useMemo(() => {
        return formatarListaContas(contasJustificativaConciliacao);
    }, [formatarListaContas, contasJustificativaConciliacao])

    const textoSolicitacoesLancamentosConciliacao = useMemo(() => {
        return `<p><strong>Acertos que alteram a conciliação bancária</strong></p><p>Foram indicados acertos de inclusão/exclusão de lançamento na(s) conta(s) ${contasLancamentosConciliacaoTexto} que alteram o saldo da conciliação bancária. Favor solicitar o acerto de saldo para que a PC possa ser devolvida.</p>`;
    }, [contasLancamentosConciliacaoTexto])

    const textoComprovanteSaldoConciliacao = useMemo(() => {
        return `<p><strong>Comprovante de saldo da conta</strong></p><p>A(s) conta(s) ${contasSemComprovanteTexto} não possuem comprovante de saldo. Favor solicitar o acerto para envio do comprovante para que a PC possa ser devolvida.</p>`;
    }, [contasSemComprovanteTexto])

    const textoJustificativaSaldoConciliacao = useMemo(() => {
        return `<p><strong>Justificativa de saldo da conta</strong></p><p>A(s) conta(s) ${contasJustificativaConciliacaoTexto} não possuem justificativa de saldo da conta. Favor solicitar o acerto para inclusão da justificativa para que a PC possa ser devolvida.</p>`;
    }, [contasJustificativaConciliacaoTexto])

    const textoModalLancamentosConciliacao = useMemo(() => {
        const blocos = [];
        if (contasPendenciaLancamentosConciliacao.length > 0) {
            blocos.push(textoSolicitacoesLancamentosConciliacao);
        }
        if (contasPendenciaConciliacao.length > 0) {
            blocos.push(textoComprovanteSaldoConciliacao);
        }
        if (contasJustificativaConciliacao.length > 0) {
            blocos.push(textoJustificativaSaldoConciliacao);
        }
        if (blocos.length === 0) {
            return textoSolicitacoesLancamentosConciliacao;
        }
        return blocos.join('');
    }, [
        contasPendenciaLancamentosConciliacao,
        contasPendenciaConciliacao,
        contasJustificativaConciliacao,
        textoSolicitacoesLancamentosConciliacao,
        textoComprovanteSaldoConciliacao,
        textoJustificativaSaldoConciliacao
    ])


    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    const limpaStorage = () => {
        let conferencia_atual = document.getElementById('nav-conferencia-atual-tab')

        // Necessário para a função de limpar storage ser executada corretamente em conjunto com
        // ref_click_historico, na pagina das abas
        if(conferencia_atual !== null){
            meapcservice.limpaAnaliseDreUsuarioLogado(visoesService.getUsuarioLogin())

            if(analisesDePcDevolvidas && analisesDePcDevolvidas.length > 0){
                let ultimo_indice_array = analisesDePcDevolvidas.length - 1
                salvaAnaliseAtualLocalStorage(analisesDePcDevolvidas[ultimo_indice_array].uuid)
            }
        }       
    }

    const salvaAnaliseAtualLocalStorage = (analise_uuid) => {
        let objetoAnaliseDrePorUsuario = meapcservice.getAnaliseDreUsuarioLogado();
        objetoAnaliseDrePorUsuario.analise_pc_uuid = analise_uuid
        meapcservice.setAnaliseDrePorUsuario(visoesService.getUsuarioLogin(), objetoAnaliseDrePorUsuario)
    }

    const podeDevolver = useMemo(() => {
        return prestacaoDeContas.pode_devolver && editavel && dataLimiteDevolucao && (totalLancamentosAjustes > 0 || totalDocumentosAjustes > 0 || totalExtratosAjustes > 0 || totalDespesasPeriodosAnterioresAjustes > 0) 
    }, [prestacaoDeContas, editavel, dataLimiteDevolucao, totalLancamentosAjustes, totalDocumentosAjustes, totalExtratosAjustes, totalDespesasPeriodosAnterioresAjustes])
    
    const msgNaoExistemSolicitacoesDeAcerto = useMemo(() => {
        if ((totalLancamentosAjustes > 0 || totalDocumentosAjustes > 0 || totalExtratosAjustes > 0 || totalDespesasPeriodosAnterioresAjustes > 0)){   
            return null;
        } else {
            if (prestacaoDeContas && prestacaoDeContas.devolucoes_da_prestacao && prestacaoDeContas.devolucoes_da_prestacao.length > 0) {
                return 'Não existem novas solicitações salvas desde o retorno da Associação. Consulte acima as solicitações anteriores';
            } else {
                return 'Não existem solicitações para acerto salvas desde o envio da PC da Associação';
            }
        }
    }, [prestacaoDeContas, totalLancamentosAjustes, totalDocumentosAjustes, totalExtratosAjustes, totalDespesasPeriodosAnterioresAjustes])

    return (
        <>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
                <div className="page-content-inner">
                    <TopoComBotoes
                        onClickBtnVoltar={onClickBtnVoltar}
                        setShowModalConfirmaDevolverParaAcerto={setShowModalConfirmaDevolverParaAcerto}
                        podeDevolver={podeDevolver}
                        prestacaoDeContas={prestacaoDeContas}
                        onClickDevolver={handleDevolverParaAssociacao}
                        devolverDisabled={btnDevolverParaAcertoDisabled}
                    />

                    {
                        loading || !analiseAtualUuid ? (
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />                            
                        ) : (
                            <TabsConferenciaAtualHistorico
                                dataLimiteDevolucao={dataLimiteDevolucao} // Para Devolver para acertos
                                handleChangeDataLimiteDevolucao={handleChangeDataLimiteDevolucao} // Para Devolver para acertos
                                prestacao_conta_uuid={prestacao_conta_uuid} // Para ExibeAcertosEmLancamentosEDocumentosPorConta e CardsDevolucoesParaAcertoDaDre
                                analiseAtualUuid={analiseAtualUuid} // Para ExibeAcertosEmLancamentosEDocumentosPorConta
                                setAnaliseAtualUuid={setAnaliseAtualUuid} // Para CardsDevolucoesParaAcertoDaDre
                                msgNaoExistemSolicitacoesDeAcerto={msgNaoExistemSolicitacoesDeAcerto} // Para TabsConferenciaAtualHistorico
                                totalAnalisesDePcDevolvidas={totalAnalisesDePcDevolvidas} // Para TabsConferenciaAtualHistorico
                                setAnaliseAtualUuidComPCAnaliseAtualUuid={setAnaliseAtualUuidComPCAnaliseAtualUuid} // Para TabsConferenciaAtualHistorico
                                setPrimeiraAnalisePcDevolvida={setPrimeiraAnalisePcDevolvida} // Para TabsConferenciaAtualHistorico
                                editavel={editavel}
                                pcEmAnalise={pcEmAnalise}
                                prestacaoDeContas={prestacaoDeContas}
                                limpaStorage={limpaStorage}
                            />                            
                        )
                    }
                </div>
                <section>
                    <ModalErroDevolverParaAcerto
                        show={showModalErroDevolverParaAcerto}
                        handleClose={() => setShowModalErroDevolverParaAcerto(false)}
                        titulo='Devolução para acerto não permitida'
                        texto={textoErroDevolverParaAcerto}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="success"
                    />
                </section>
                <section>
                    <ModalConfirmaDevolverParaAcerto
                        show={showModalConfirmaDevolverParaAcerto}
                        handleClose={() => setShowModalConfirmaDevolverParaAcerto(false)}
                        onDevolverParaAcertoTrue={devolverParaAcertos}
                        titulo="Mudança de Status"
                        texto='<p>Ao notificar a Associação sobre as ”Devolução para Acertos" dessa prestação de contas, será reaberto o período para que a Associação possa realizar os ajustes pontuados até o prazo determinado.</p>
                                            <p>A prestação será movida para o <strong>status de ”Devolução para Acertos”</strong> e ficará nesse status até a Associação realizar um novo envio. Deseja continuar?</p>'
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar"
                    />
                </section>
                <section>
                    <ModalConciliacaoBancaria
                        show={showModalConciliacaoBancaria}
                        handleClose={() => setShowModalConciliacaoBancaria(false)}
                        onConfirmarDevolucao={handleConfirmarDevolucaoConciliacao}
                        titulo="Acertos que podem alterar a conciliação bancária"
                        texto="Foram indicados acertos na prestação de contas que podem alterar o saldo da conciliação bancária. Por favor, confira o extrato bancário da unidade para indicar a solicitação de correção de saldo, se necessário."
                        primeiroBotaoTexto="Cancelar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Confirmar devolução para acertos"
                    />
                </section>
                <section>
                    <ModalComprovanteSaldoConta
                        show={showModalLancamentosConciliacao}
                        handleClose={handleFecharModalLancamentosConciliacao}
                        onConfirmar={handleIrParaExtratoLancamentosConciliacao}
                        titulo="Pendências da conciliação bancária"
                        texto={textoModalLancamentosConciliacao}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Ir para Extrato Bancário"
                    />
                </section>
                <section>
                    <ModalComprovanteSaldoConta
                        show={showModalJustificativaSaldoConta}
                        handleClose={() => setShowModalJustificativaSaldoConta(false)}
                        onConfirmar={handleIrParaJustificativaSaldoConta}
                        titulo="Justificativa de saldo da conta"
                        texto={textoJustificativaSaldoConciliacao}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Ir para Extrato Bancário"
                    />
                </section>
                <section>
                    <ModalComprovanteSaldoConta
                        show={showModalComprovanteSaldoConta}
                        handleClose={() => setShowModalComprovanteSaldoConta(false)}
                        onConfirmar={handleConfirmarComprovanteSaldo}
                        titulo="Comprovante de saldo da conta"
                        texto={`A(s) conta(s) ${contasSemComprovanteTexto} não possuem comprovante de saldo. Favor solicitar o acerto para envio do comprovante para que a PC possa ser devolvida.`}
                        primeiroBotaoTexto="Fechar"
                        primeiroBotaoCss="outline-success"
                        segundoBotaoCss="success"
                        segundoBotaoTexto="Ir para Extrato Bancário"
                    />
                </section>
            </PaginasContainer>
        </>
    )
}

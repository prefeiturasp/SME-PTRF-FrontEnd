import React, {useCallback, useEffect, useState, useMemo} from "react";
import {useParams, useLocation, useHistory} from "react-router-dom";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {
    getConcluirAnalise,
    getAnalisesDePcDevolvidas,
    getUltimaAnalisePc,
    getLancamentosAjustes,
    getDocumentosAjustes,
    getExtratosBancariosAjustes,
    getInfoAta,
} from "../../../../../services/dres/PrestacaoDeContas.service";
import moment from "moment";
import {gerarUuid, trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import {TopoComBotoes} from "./TopoComBotoes";
import {ModalErroDevolverParaAcerto} from "../DevolucaoParaAcertos/ModalErroDevolverParaAcerto";
import TabsConferenciaAtualHistorico from "./TabsConferenciaAtualHistorico";
import {useCarregaPrestacaoDeContasPorUuid} from "../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import {ModalConfirmaDevolverParaAcerto} from "../DevolucaoParaAcertos/ModalConfirmaDevolverParaAcerto";
import Loading from "../../../../../utils/Loading";
import {isNaN} from "formik";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const ResumoDosAcertos = () => {

    const {prestacao_conta_uuid} = useParams()
    const props = useLocation();
    const history = useHistory();

    const prestacaoDeContas = useCarregaPrestacaoDeContasPorUuid(prestacao_conta_uuid)

    const [dataLimiteDevolucao, setDataLimiteDevolucao] = useState('')
    const [showModalErroDevolverParaAcerto, setShowModalErroDevolverParaAcerto] = useState(false)
    const [exibeMsg, setExibeMsg] = useState(false)
    const [textoErroDevolverParaAcerto, setTextoErroDevolverParaAcerto] = useState('')
    const [textoMsg, setTextoMsg] = useState('')
    const [analiseAtualUuid, setAnaliseAtualUuid] = useState('')
    const [analisesDePcDevolvidas, setAnalisesDePcDevolvidas] = useState([])
    const [btnDevolverParaAcertoDisabled, setBtnDevolverParaAcertoDisabled] = useState(false)
    const [showModalConfirmaDevolverParaAcerto, setShowModalConfirmaDevolverParaAcerto] = useState(false)
    const [loading, setLoading] = useState(true)
    const [totalExtratosAjustes, setTotalExtratosAjustes] = useState(undefined)
    const [totalLancamentosAjustes, setTotalLancamentosAjustes] = useState(undefined)
    const [totalDocumentosAjustes, setTotalDocumentosAjustes] = useState(undefined)
    const [forcaVerificaSeExibeMsg, setForcaVerificaSeExibeMsg] = useState('')
    const [pcEmAnalise, setPcEmAnalise] = useState(false)
    const [analisesDeContaDaPrestacao, setAnalisesDeContaDaPrestacao] = useState([])
    const [infoAta, setInfoAta] = useState([])
    const [editavel, setEditavel] = useState(false)

    const carregaInfoAta = useCallback(async () =>{
        if (prestacaoDeContas.uuid){
            let info_ata = await getInfoAta(prestacaoDeContas.uuid);
            return info_ata;
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
        if(props && props.state && props.state.infoAta){
            setInfoAta(props.state.infoAta)
        }
        else if(prestacaoDeContas){
            setInfoAta(carregaInfoAta())
        }

    }, [carregaInfoAta, props, prestacaoDeContas])

    useEffect(() => {
        if(props && props.state && props.state.editavel){
            setEditavel(props.state.editavel);
        }
        else if(prestacaoDeContas){
            setEditavel(verificaEditavel())
        }

    }, [verificaEditavel, props, prestacaoDeContas])

    const verificaPcEmAnalise = () => {
        if(prestacaoDeContas && prestacaoDeContas.status === "EM_ANALISE"){
            setPcEmAnalise(true);
        }
        else{
            setPcEmAnalise(false)
            setPrimeiraAnalisePcDevolvida()
        }
    }

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
        // Necessario alterar os estados dos totais para chamar novamente o método verificaSeExibeMsg setado com undefined
        setTotalExtratosAjustes(undefined)
        setTotalLancamentosAjustes(undefined)
        setTotalDocumentosAjustes(undefined)
        setForcaVerificaSeExibeMsg(gerarUuid())
    }, [prestacaoDeContas, editavel])

    useEffect(() => {
        setAnaliseAtualUuidComPCAnaliseAtualUuid()
    }, [setAnaliseAtualUuidComPCAnaliseAtualUuid])

    useEffect(() => {
        verificaPcEmAnalise()
    }, [prestacaoDeContas])

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
    }, [analisesDePcDevolvidas])

    const verificaQtdeLancamentosDocumentosAjustes = useCallback(async () => {
        setLoading(true)
        if (infoAta && infoAta.contas && infoAta.contas.length > 0 && analiseAtualUuid) {
            infoAta.contas.map(async (conta) => {
                let extratos_ajustes = await getExtratosBancariosAjustes(analiseAtualUuid, conta.conta_associacao.uuid);
                setTotalExtratosAjustes(extratos_ajustes.length)

                let lancamentos_ajustes = await getLancamentosAjustes(analiseAtualUuid, conta.conta_associacao.uuid)
                setTotalLancamentosAjustes(lanc => isNaN(lanc) ? 0 + lancamentos_ajustes.length : lanc + lancamentos_ajustes.length)
                let documentos_ajustes = await getDocumentosAjustes(analiseAtualUuid, conta.conta_associacao.uuid)
                setTotalDocumentosAjustes(documentos_ajustes.length)
            })
        }

        setLoading(false)
    }, [analiseAtualUuid, infoAta])

    useEffect(() => {
        verificaQtdeLancamentosDocumentosAjustes()
    }, [verificaQtdeLancamentosDocumentosAjustes, forcaVerificaSeExibeMsg])

    const verificaSeExibeMsg = useCallback(() => {
        setLoading(true)
        if (totalLancamentosAjustes !== undefined && totalLancamentosAjustes <= 0 && totalDocumentosAjustes !== undefined && totalDocumentosAjustes <= 0 && totalExtratosAjustes !== undefined && totalExtratosAjustes <= 0) {
            setExibeMsg(true)
            if (prestacaoDeContas && prestacaoDeContas.devolucoes_da_prestacao && prestacaoDeContas.devolucoes_da_prestacao.length > 0) {
                setTextoMsg('Não existem novas solicitações salvas desde o retorno da Associação. Consulte acima as solicitações anteriores')
            } else {
                setTextoMsg('Não existem solicitações para acerto salvas desde o envio da PC da Associação')
            }
        } else {
            setExibeMsg(false)
        }
        setLoading(false)
    }, [prestacaoDeContas, totalLancamentosAjustes, totalDocumentosAjustes, totalExtratosAjustes])

    useEffect(() => {
        verificaSeExibeMsg()
    }, [verificaSeExibeMsg])

    const handleChangeDataLimiteDevolucao = useCallback((name, value) => {
        setDataLimiteDevolucao(value)
    }, [])

    const onClickBtnVoltar = useCallback(() => {
        history.push(`/dre-detalhe-prestacao-de-contas/${prestacao_conta_uuid}#devolucao_para_acerto`)
    }, [prestacao_conta_uuid, history])

    const trataAnalisesDeContaDaPrestacao = useCallback(() => {
        let analises = [...analisesDeContaDaPrestacao]
        analises.forEach(item => {
            item.data_extrato = item.data_extrato ? moment(item.data_extrato).format("YYYY-MM-DD") : null;
            item.saldo_extrato = item.saldo_extrato ? trataNumericos(item.saldo_extrato) : 0;
        })
        return analises
    }, [analisesDeContaDaPrestacao])

    const devolverParaAcertos = useCallback(async () => {
        setBtnDevolverParaAcertoDisabled(true)
        setShowModalConfirmaDevolverParaAcerto(false)
        let analises = trataAnalisesDeContaDaPrestacao()
        let payload = {
            devolucao_tesouro: false,
            analises_de_conta_da_prestacao: analises,
            resultado_analise: "DEVOLVIDA",
            data_limite_ue: moment(dataLimiteDevolucao).format("YYYY-MM-DD"),
            devolucoes_ao_tesouro_da_prestacao: []
        }

        if(prestacaoDeContas.pode_reabrir === false){
            setShowModalErroDevolverParaAcerto(true);
            setTextoErroDevolverParaAcerto("Essa prestação de contas não pode ser devolvida, ou reaberta porque há prestação de contas dessa associação de um período posterior. Se necessário, reabra ou devolva primeiro a prestação de contas mais recente.")
            setBtnDevolverParaAcertoDisabled(false)
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


    const valorTemplate = (valor) => {
        let valor_formatado = Number(valor).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
        valor_formatado = valor_formatado.replace(/R/, "").replace(/\$/, "");
        return valor_formatado
    };

    return (
        <>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
                <div className="page-content-inner">
                    <TopoComBotoes
                        onClickBtnVoltar={onClickBtnVoltar}
                        setShowModalConfirmaDevolverParaAcerto={setShowModalConfirmaDevolverParaAcerto}
                        dataLimiteDevolucao={dataLimiteDevolucao}
                        // TODO verificar a necessidade desses props de lancamentos e documentos
                        /* qtdeAjustesLancamentos={props.state.totalLancamentosAjustes}
                        qtdeAjustesDocumentos={props.state.totalDocumentosAjustes} */
                        qtdeAjustesLancamentos={totalLancamentosAjustes}
                        qtdeAjustesDocumentos={totalDocumentosAjustes}
                        qtdeAjustesExtrato={totalExtratosAjustes}
                        btnDevolverParaAcertoDisabled={btnDevolverParaAcertoDisabled}
                        editavel={editavel}
                    />

                    {analiseAtualUuid && !loading ? (
                            <TabsConferenciaAtualHistorico
                                dataLimiteDevolucao={dataLimiteDevolucao} // Para Devolver para acertos
                                handleChangeDataLimiteDevolucao={handleChangeDataLimiteDevolucao} // Para Devolver para acertos
                                prestacao_conta_uuid={prestacao_conta_uuid} // Para ExibeAcertosEmLancamentosEDocumentosPorConta e CardsDevolucoesParaAcertoDaDre
                                analiseAtualUuid={analiseAtualUuid} // Para ExibeAcertosEmLancamentosEDocumentosPorConta
                                setAnaliseAtualUuid={setAnaliseAtualUuid} // Para CardsDevolucoesParaAcertoDaDre
                                exibeMsg={exibeMsg} // Para TabsConferenciaAtualHistorico
                                textoMsg={textoMsg} // Para TabsConferenciaAtualHistorico
                                totalAnalisesDePcDevolvidas={totalAnalisesDePcDevolvidas} // Para TabsConferenciaAtualHistorico
                                setAnaliseAtualUuidComPCAnaliseAtualUuid={setAnaliseAtualUuidComPCAnaliseAtualUuid} // Para TabsConferenciaAtualHistorico
                                setPrimeiraAnalisePcDevolvida={setPrimeiraAnalisePcDevolvida} // Para TabsConferenciaAtualHistorico
                                editavel={editavel}
                                pcEmAnalise={pcEmAnalise}
                            />
                        ) :
                            <Loading
                                corGrafico="black"
                                corFonte="dark"
                                marginTop="0"
                                marginBottom="0"
                            />
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
            </PaginasContainer>
        </>
    )
}
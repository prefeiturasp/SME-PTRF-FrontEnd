import React, {useCallback, useEffect, useState, useMemo} from "react";
import {useParams, useLocation, useHistory} from "react-router-dom";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getConcluirAnalise, getAnalisesDePcDevolvidas} from "../../../../../services/dres/PrestacaoDeContas.service";
import moment from "moment";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import {TopoComBotoes} from "./TopoComBotoes";
import {ModalErroDevolverParaAcerto} from "../DevolucaoParaAcertos/ModalErroDevolverParaAcerto";
import TabsConferenciaAtualHistorico from "./TabsConferenciaAtualHistorico";
import {useCarregaPrestacaoDeContasPorUuid} from "../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";
import {ModalConfirmaDevolverParaAcerto} from "../DevolucaoParaAcertos/ModalConfirmaDevolverParaAcerto";

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

    // Necessario para quando voltar da aba Histórico para Conferencia atual
    const setAnaliseAtualUuidComPCAnaliseAtualUuid = useCallback(()=>{
        setAnaliseAtualUuid(prestacaoDeContas && prestacaoDeContas.analise_atual && prestacaoDeContas.analise_atual.uuid ? prestacaoDeContas.analise_atual.uuid : '')
    }, [prestacaoDeContas])

    useEffect(()=>{
        setAnaliseAtualUuidComPCAnaliseAtualUuid()
    }, [setAnaliseAtualUuidComPCAnaliseAtualUuid])

    // Necessario para exibir ou não o botão Histórico da Tabs
    const totalAnalisesDePcDevolvidas = useMemo(() => analisesDePcDevolvidas.length, [analisesDePcDevolvidas]);
    useEffect(()=>{
        let mounted = true;
        const carregaAnalisesDePcDevolvidas = async () => {
            if (mounted) {
                let analises_pc_devolvidas = await getAnalisesDePcDevolvidas(prestacao_conta_uuid)
                setAnalisesDePcDevolvidas(analises_pc_devolvidas)
            }
        }
        carregaAnalisesDePcDevolvidas()
        return () =>{
            mounted = false;
        }
    }, [prestacao_conta_uuid])

    const setPrimeiraAnalisePcDevolvida = useCallback(() => {
        if (analisesDePcDevolvidas && analisesDePcDevolvidas.length > 0){
            let ultimo_indice_array = analisesDePcDevolvidas.length - 1
            setAnaliseAtualUuid(analisesDePcDevolvidas[ultimo_indice_array].uuid)
        }
    }, [analisesDePcDevolvidas])

    const verificaSeExibeMsg = useCallback(()=>{
        const totLancAjus = props.state.totalLancamentosAjustes
        const totDocumAjus = props.state.totalDocumentosAjustes
        if (totLancAjus <= 0 && totDocumAjus <= 0){
            setExibeMsg(true)
            if (prestacaoDeContas && prestacaoDeContas.devolucoes_da_prestacao && prestacaoDeContas.devolucoes_da_prestacao.length > 0 ){
                setTextoMsg('Não existem novas solicitações salvas desde o retorno da Associação. Consulte acima as solicitações anteriores')
            }else {
                setTextoMsg('Não existem solicitações para acerto salvas desde o envio da PC da Associação')
            }
        }else {
            setExibeMsg(false)
        }
    }, [props, prestacaoDeContas])

    useEffect(()=>{
        verificaSeExibeMsg()
    }, [verificaSeExibeMsg])

    const handleChangeDataLimiteDevolucao = useCallback((name, value) => {
        setDataLimiteDevolucao(value)
    }, [])

    const onClickBtnVoltar = useCallback(() => {
        history.push(`/dre-detalhe-prestacao-de-contas/${prestacao_conta_uuid}#devolucao_para_acerto`)
    }, [prestacao_conta_uuid, history])

    const trataAnalisesDeContaDaPrestacao = useCallback(() => {
        let analises = [...props.state.analisesDeContaDaPrestacao]
        analises.forEach(item => {
            item.data_extrato = item.data_extrato ? moment(item.data_extrato).format("YYYY-MM-DD") : null;
            item.saldo_extrato = item.saldo_extrato ? trataNumericos(item.saldo_extrato) : 0;
        })
        return analises
    }, [props.state.analisesDeContaDaPrestacao])

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
        try {
            await getConcluirAnalise(prestacao_conta_uuid, payload);
            console.log("Devolução para acertos concluída com sucesso!")
            onClickBtnVoltar();
        } catch (e) {
            console.log("Erro ao Devolver para Acerto ", e.response)
            if (e.response.data.mensagem) {
                setTextoErroDevolverParaAcerto(e.response.data.mensagem)
            } else {
                setTextoErroDevolverParaAcerto('Erro ao devolver para acerto!')
            }
            setShowModalErroDevolverParaAcerto(true)
            setBtnDevolverParaAcertoDisabled(false)
        }
    }, [dataLimiteDevolucao, trataAnalisesDeContaDaPrestacao, prestacao_conta_uuid, onClickBtnVoltar])

    return (
        <>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
                <div className="page-content-inner">
                    <TopoComBotoes
                        onClickBtnVoltar={onClickBtnVoltar}
                        setShowModalConfirmaDevolverParaAcerto={setShowModalConfirmaDevolverParaAcerto}
                        dataLimiteDevolucao={dataLimiteDevolucao}
                        qtdeAjustesLancamentos={props.state.totalLancamentosAjustes}
                        qtdeAjustesDocumentos={props.state.totalDocumentosAjustes}
                        btnDevolverParaAcertoDisabled={btnDevolverParaAcertoDisabled}
                    />
                    {analiseAtualUuid &&
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
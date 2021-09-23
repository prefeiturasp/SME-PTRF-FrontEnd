import React, {useCallback, useEffect, useState} from "react";
import {useParams, useLocation, useHistory} from "react-router-dom";
import {PaginasContainer} from "../../../../../paginas/PaginasContainer";
import {getConcluirAnalise} from "../../../../../services/dres/PrestacaoDeContas.service";
import moment from "moment";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import {TopoComBotoes} from "./TopoComBotoes";
import {ModalErroDevolverParaAcerto} from "../DevolucaoParaAcertos/ModalErroDevolverParaAcerto";
import {TabsConferenciaAtualHistorico} from "./TabsConferenciaAtualHistorico";
import {useCarregaPrestacaoDeContasPorUuid} from "../../../../../hooks/dres/PrestacaoDeContas/useCarregaPrestacaoDeContasPorUuid";

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
        }
    }, [dataLimiteDevolucao, trataAnalisesDeContaDaPrestacao, prestacao_conta_uuid, onClickBtnVoltar])

    return (
        <>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
                <div className="page-content-inner">
                    <TopoComBotoes
                        onClickBtnVoltar={onClickBtnVoltar}
                        devolverParaAcertos={devolverParaAcertos}
                        dataLimiteDevolucao={dataLimiteDevolucao}
                        qtdeAjustesLancamentos={props.state.totalLancamentosAjustes}
                        qtdeAjustesDocumentos={props.state.totalDocumentosAjustes}
                    />
                    {prestacaoDeContas && prestacaoDeContas.analise_atual && prestacaoDeContas.analise_atual.uuid &&
                        <TabsConferenciaAtualHistorico
                            dataLimiteDevolucao={dataLimiteDevolucao}
                            handleChangeDataLimiteDevolucao={handleChangeDataLimiteDevolucao}
                            prestacaoDeContas={prestacaoDeContas}
                            analiseAtualUuid={prestacaoDeContas.analise_atual.uuid}
                            exibeMsg={exibeMsg}
                            textoMsg={textoMsg}
                        />
                    }

                </div>
                <section>
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
                </section>
            </PaginasContainer>
        </>
    )
}
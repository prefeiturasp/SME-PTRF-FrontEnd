import React, {memo, useCallback, useEffect, useState, useMemo} from "react";
import {Link} from "react-router-dom";
import {DatePickerField} from "../../../../Globais/DatePickerField";
import './devolucao-para-acertos.scss'
import moment from "moment";
import {
    getConcluirAnalise,
    getLancamentosAjustes,
    getDocumentosAjustes,
    getUltimaAnalisePc,
    getAnaliseAjustesSaldoPorConta
} from "../../../../../services/dres/PrestacaoDeContas.service";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../../utils/Loading";
import {ModalErroDevolverParaAcerto} from "./ModalErroDevolverParaAcerto";
import {ModalConfirmaDevolverParaAcerto} from "./ModalConfirmaDevolverParaAcerto";
import { toastCustom } from "../../../../Globais/ToastCustom";
import ReactTooltip from "react-tooltip";

const DevolucaoParaAcertos = ({
    prestacaoDeContas, 
    analisesDeContaDaPrestacao, 
    carregaPrestacaoDeContas, 
    infoAta, 
    editavel=true, 
    setLoadingAcompanhamentoPC, 
    setAnalisesDeContaDaPrestacao,
    updateListaDeDocumentosParaConferencia=null,
    carregaLancamentosParaConferencia=null,
}) => {

    const [dataLimiteDevolucao, setDataLimiteDevolucao] = useState('')
    const [showModalErroDevolverParaAcerto, setShowModalErroDevolverParaAcerto] = useState(false)
    const [showModalConfirmaDevolverParaAcerto, setShowModalConfirmaDevolverParaAcerto] = useState(false)
    const [textoErroDevolverParaAcerto, setTextoErroDevolverParaAcerto] = useState('')
    const [lancamentosAjustes, setLancamentosAjustes] = useState([])
    const [documentosAjustes, setDocumentosAjustes] = useState([])
    const [loading, setLoading] = useState(true)
    const [btnDevolverParaAcertoDisabled, setBtnDevolverParaAcertoDisabled] = useState(false)

    const totalLancamentosAjustes = useMemo(() => lancamentosAjustes.length, [lancamentosAjustes]);
    const totalDocumentosAjustes = useMemo(() => documentosAjustes.length, [documentosAjustes]);
    
    const totalDeAnalises = () => {
        // Esta função é necessária para não liberar o botão "ver resumo" enquanto o usuario esta cadastrando a analise

        let analises = [...analisesDeContaDaPrestacao]
        let contador = 0;

        for(let i=0; i<=analises.length-1; i++){
            if(analises[i].uuid){
                contador = contador + 1
            }
        }

        return contador
    }

    const totalAnalisesDeContaDaPrestacao = totalDeAnalises();

    useEffect(()=>{

        let mounted = true;

        const verificaSeTemSolicitacaoAcertos = async () =>{
            setLoading(true);
            let analise_atual_uuid;
            if (editavel) {
                if (prestacaoDeContas && prestacaoDeContas.analise_atual && prestacaoDeContas.analise_atual.uuid && infoAta && infoAta.contas && infoAta.contas.length > 0) {
                    analise_atual_uuid = prestacaoDeContas.analise_atual.uuid
                }
            }else {
                if (prestacaoDeContas && prestacaoDeContas.uuid){
                    let ultima_analise =  await getUltimaAnalisePc(prestacaoDeContas.uuid)
                    if (ultima_analise && ultima_analise.uuid){
                        analise_atual_uuid = ultima_analise.uuid
                    }
                }
            }
            if (mounted) {
                if (infoAta && infoAta.contas && infoAta.contas.length > 0) {    
                    return await infoAta.contas.map(async (conta) => {
                        let analise_prestacao_contas_ajustes = await getAnaliseAjustesSaldoPorConta(conta.conta_associacao.uuid, prestacaoDeContas.uuid, analise_atual_uuid);
                        setAnalisesDeContaDaPrestacao([...analise_prestacao_contas_ajustes])
                        let lancamentos_ajustes = await getLancamentosAjustes(analise_atual_uuid, conta.conta_associacao.uuid)
                        setLancamentosAjustes([...lancamentos_ajustes])
                        let documentos_ajustes = await getDocumentosAjustes(analise_atual_uuid, conta.conta_associacao.uuid)
                        setDocumentosAjustes([...documentos_ajustes])
                        setLoading(false);
                    })
                }
            }
        }
        verificaSeTemSolicitacaoAcertos()
        
        return () =>{
            mounted = false;
        }

    }, [infoAta, prestacaoDeContas, editavel, updateListaDeDocumentosParaConferencia, carregaLancamentosParaConferencia])

    const handleChangeDataLimiteDevolucao = useCallback((name, value) => {
        setDataLimiteDevolucao(value)
    }, [])

    const trataAnalisesDeContaDaPrestacao = useCallback(() => {
        let analises = [...analisesDeContaDaPrestacao]

        analises.forEach(item => {
            item.data_extrato = item.data_extrato ?  moment(item.data_extrato).format("YYYY-MM-DD") : null;
            item.saldo_extrato = item.saldo_extrato ? trataNumericos(item.saldo_extrato) : 0;

        })
        return analises
    }, [analisesDeContaDaPrestacao])

    const devolverParaAcertos = useCallback(async () =>{
        setBtnDevolverParaAcertoDisabled(true)
        setShowModalConfirmaDevolverParaAcerto(false)
        let analises = trataAnalisesDeContaDaPrestacao()
        let payload={
            devolucao_tesouro: false,
            analises_de_conta_da_prestacao: analises,
            resultado_analise: "DEVOLVIDA",
            data_limite_ue: moment(dataLimiteDevolucao).format("YYYY-MM-DD"),
            devolucoes_ao_tesouro_da_prestacao:[]
        }

        if(prestacaoDeContas.pode_devolver === false){
            setShowModalErroDevolverParaAcerto(true);
            setTextoErroDevolverParaAcerto("Foram solicitados acertos que demandam exclusão dos documentos e fechamentos na conclusão do acerto. Para fazer a devolução dessa prestação de contas é necessário reabrir ou devolver primeiro a prestação de contas mais recente para que sejam gerados novos documentos.")
            setBtnDevolverParaAcertoDisabled(false)
        }
        else{
            try {
                setLoadingAcompanhamentoPC(true);
                await getConcluirAnalise(prestacaoDeContas.uuid, payload);
                console.log("Devolução para acertos concluída com sucesso!")
                await carregaPrestacaoDeContas();
                setLoadingAcompanhamentoPC(false);
                toastCustom.ToastCustomSuccess('Status alterado com sucesso', 'A prestação de conta foi alterada para “Devolvida para acertos”.')
            }catch (e){
                setLoadingAcompanhamentoPC(false);
                console.log("Erro ao Devolver para Acerto ", e.response)
                if (e.response.data.mensagem){
                    setTextoErroDevolverParaAcerto(e.response.data.mensagem)
                }else {
                    setTextoErroDevolverParaAcerto('Erro ao devolver para acerto!')
                }
            }
        }

    }, [dataLimiteDevolucao, carregaPrestacaoDeContas, prestacaoDeContas, trataAnalisesDeContaDaPrestacao])

    const handleDevolverParaAssociacao = () => {
        setShowModalConfirmaDevolverParaAcerto(true);
    };

    const possuiHistoricoDeDevolucoes = () => {
        return (prestacaoDeContas && prestacaoDeContas.devolucoes_da_prestacao && prestacaoDeContas.devolucoes_da_prestacao.length > 0);
    };
    
    const possuiAcertosSelecionados = useCallback( () => {
        return totalLancamentosAjustes > 0 || totalDocumentosAjustes > 0 || totalAnalisesDeContaDaPrestacao > 0
    }, [totalLancamentosAjustes, totalDocumentosAjustes, totalAnalisesDeContaDaPrestacao]);

    const podeDevolverParaAssociacao = () => {
        return dataLimiteDevolucao && !btnDevolverParaAcertoDisabled && editavel && possuiAcertosSelecionados()
    };

    return(
        <>
            <hr className='mt-4 mb-3'/>
            <h4  id='devolucao_para_acerto' className='mb-4'>Devolução para acertos</h4>
            {!loading  ? (
                    <>
                        <p className='mt-4'>Caso deseje enviar todos esses apontamentos a Associação, determine o prazo e clique em "Devolver para a Associação".</p>
                        <div className="d-flex mt-4">
                            <div className="flex-grow-1">
                                <span className='mr-2'>Prazo para reenvio:</span>
                                <DatePickerField
                                    value={dataLimiteDevolucao}
                                    onChange={handleChangeDataLimiteDevolucao}
                                    name='data_limite_devolucao'
                                    type="date"
                                    className="form-control datepicker-devolucao-para-acertos"
                                    wrapperClassName="container-datepicker-devolucao-para-acertos"
                                    disabled={!editavel}
                                />
                            </div>
                            <div>
                                <Link onClick={(possuiHistoricoDeDevolucoes() || possuiAcertosSelecionados()) ? null : (event) => event.preventDefault()}
                                        to={{
                                            pathname: `/dre-detalhe-prestacao-de-contas-resumo-acertos/${prestacaoDeContas.uuid}`,
                                            state: {
                                                analisesDeContaDaPrestacao: analisesDeContaDaPrestacao,
                                                editavel: editavel,
                                                infoAta: infoAta,
                                            }
                                        }}
                                        className="btn btn-outline-success mr-2"
                                        disabled={!(possuiHistoricoDeDevolucoes() || possuiAcertosSelecionados())}
                                        readOnly={!(possuiHistoricoDeDevolucoes() || possuiAcertosSelecionados())}
                                        title={possuiHistoricoDeDevolucoes() ? null: `Esta PC não possui histórico de devoluções.` }
                                >
                                    Ver resumo
                                </Link>
                            </div>
                            <div>
                                <button
                                    disabled={!podeDevolverParaAssociacao()}
                                    onClick={handleDevolverParaAssociacao}
                                    className="btn btn-success"
                                >
                                    <span data-tip={!possuiAcertosSelecionados() ? 'Não é permitido devolver PC sem acertos indicados.' : ''}>
                                        Devolver para Associação
                                    </span>                                         
                                    <ReactTooltip/>
                                </button>
                            </div>                            
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
                    </>
                ):
                <Loading
                    corGrafico="black"
                    corFonte="dark"
                    marginTop="0"
                    marginBottom="0"
                />
            }
        </>
    )
}

export default memo(DevolucaoParaAcertos)
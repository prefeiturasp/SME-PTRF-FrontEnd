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
    getAnaliseAjustesSaldoPorConta,
    getDespesasPeriodosAnterioresAjustes,
    getPrestacaoDeContasDetalhe
} from "../../../../../services/dres/PrestacaoDeContas.service";
import {trataNumericos} from "../../../../../utils/ValidacoesAdicionaisFormularios";
import Loading from "../../../../../utils/Loading";
import {ModalErroDevolverParaAcerto} from "./ModalErroDevolverParaAcerto";
import {ModalConfirmaDevolverParaAcerto} from "./ModalConfirmaDevolverParaAcerto";
import {ModalConciliacaoBancaria} from "./ModalConciliacaoBancaria";
import {ModalComprovanteSaldoConta} from "./ModalComprovanteSaldoConta";
import { toastCustom } from "../../../../Globais/ToastCustom";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { visoesService } from "../../../../../services/visoes.service";

const DevolucaoParaAcertos = ({
    prestacaoDeContas, 
    analisesDeContaDaPrestacao, 
    carregaPrestacaoDeContas, 
    infoAta, 
    editavel=true, 
    setLoadingAcompanhamentoPC, 
    setAnalisesDeContaDaPrestacao,
    updateListaDeDocumentosParaConferencia=null,
    carregaLancamentosParaConferencia=null
}) => {
    const flagAjustesDespesasAnterioresAtiva = visoesService.featureFlagAtiva('ajustes-despesas-anteriores')
    const [dataLimiteDevolucao, setDataLimiteDevolucao] = useState('')
    const [showModalErroDevolverParaAcerto, setShowModalErroDevolverParaAcerto] = useState(false)
    const [showModalConfirmaDevolverParaAcerto, setShowModalConfirmaDevolverParaAcerto] = useState(false)
    const [showModalConciliacaoBancaria, setShowModalConciliacaoBancaria] = useState(false)
    const [showModalComprovanteSaldoConta, setShowModalComprovanteSaldoConta] = useState(false)
    const [contasPendenciaConciliacao, setContasPendenciaConciliacao] = useState([])
    const [textoErroDevolverParaAcerto, setTextoErroDevolverParaAcerto] = useState('')
    const [lancamentosAjustes, setLancamentosAjustes] = useState([])
    const [documentosAjustes, setDocumentosAjustes] = useState([])
    const [despesasPeriodosAnterioresAjustes, setDespesasPeriodosAnterioresAjustes] = useState([])
    const [loading, setLoading] = useState(true)
    const [btnDevolverParaAcertoDisabled, setBtnDevolverParaAcertoDisabled] = useState(false)

    const totalLancamentosAjustes = useMemo(() => lancamentosAjustes.length, [lancamentosAjustes]);
    const totalDocumentosAjustes = useMemo(() => documentosAjustes.length, [documentosAjustes]);
    const totalDespesasPeriodosAnterioresAjustes = useMemo(() => despesasPeriodosAnterioresAjustes.length, [despesasPeriodosAnterioresAjustes]);

    
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
                        let lancamentos_ajustes = await getLancamentosAjustes(analise_atual_uuid, conta.conta_associacao.uuid)
                        setLancamentosAjustes([...lancamentos_ajustes])
                        
                        let documentos_ajustes = await getDocumentosAjustes(analise_atual_uuid, conta.conta_associacao.uuid)
                        setDocumentosAjustes([...documentos_ajustes])

                        const despesas_periodos_anteriores_ajustes = await getDespesasPeriodosAnterioresAjustes(analise_atual_uuid, conta.conta_associacao.uuid)
                        setDespesasPeriodosAnterioresAjustes(despesas_periodos_anteriores_ajustes)

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

    const handleDevolverParaAssociacao = async () => {
        setBtnDevolverParaAcertoDisabled(true)
        
        const prestacaoDeContasAtualizada = await getPrestacaoDeContasDetalhe(prestacaoDeContas.uuid)
        const acertosPodemAlterarSaldoConciliacao = prestacaoDeContasAtualizada?.analise_atual?.acertos_podem_alterar_saldo_conciliacao;
        const temPendenciaConciliacaoSemSolicitacaoDeAcertoEmConta = prestacaoDeContasAtualizada?.analise_atual?.tem_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta;
        
        const contasPendencia = prestacaoDeContasAtualizada?.analise_atual?.contas_pendencia_conciliacao_sem_solicitacao_de_acerto_em_conta || [];
        setContasPendenciaConciliacao(contasPendencia);
        
        if (acertosPodemAlterarSaldoConciliacao) {
            setShowModalConciliacaoBancaria(true)
            setBtnDevolverParaAcertoDisabled(false)
            return;
        }

        if (temPendenciaConciliacaoSemSolicitacaoDeAcertoEmConta) {
            setShowModalComprovanteSaldoConta(true)
            setBtnDevolverParaAcertoDisabled(false)
            return;
        }

        setShowModalConfirmaDevolverParaAcerto(true);
        setBtnDevolverParaAcertoDisabled(false)
    };

    const handleConfirmarDevolucaoConciliacao = useCallback(async () => {
        setShowModalConciliacaoBancaria(false)
        setShowModalConfirmaDevolverParaAcerto(true)
    }, []);

    const handleConfirmarComprovanteSaldo = useCallback(() => {
        setShowModalComprovanteSaldoConta(false)
        setTimeout(() => {
            const element = document.getElementById('collapse_sintese_por_realizacao_da_despesa');
            if (element) {
                element.classList.add('show');
                
                // Aguardar um momento para o collapse abrir completamente
                setTimeout(() => {
                    element.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'start',
                        inline: 'nearest'
                    });
                    
                    // Fallback: se o scrollIntoView não funcionar, usar scroll manual
                    const rect = element.getBoundingClientRect();
                    const scrollTop = window.pageYOffset + rect.top - 100;
                    window.scrollTo({
                        top: scrollTop,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        }, 100);
    }, []);

    const obterContasSemComprovanteSaldo = useCallback(() => {
        if (!contasPendenciaConciliacao || contasPendenciaConciliacao.length === 0) {
            return [];
        }

        return contasPendenciaConciliacao.map(conta => {
            const contaNome = infoAta.contas.find(conta => conta.uuid === conta.uuid)?.conta_associacao?.nome;
            return contaNome || conta.conta_associacao?.nome || 'Conta sem nome';
        });
    }, [contasPendenciaConciliacao]);

    const possuiHistoricoDeDevolucoes = () => {
        return (prestacaoDeContas && prestacaoDeContas.devolucoes_da_prestacao && prestacaoDeContas.devolucoes_da_prestacao.length > 0);
    };
    
    const possuiAcertosSelecionados = useCallback( () => {
        if(flagAjustesDespesasAnterioresAtiva){
            return totalLancamentosAjustes > 0 || totalDocumentosAjustes > 0 || totalAnalisesDeContaDaPrestacao > 0 || totalDespesasPeriodosAnterioresAjustes > 0
        } else {
            return totalLancamentosAjustes > 0 || totalDocumentosAjustes > 0 || totalAnalisesDeContaDaPrestacao > 0
        }
    }, [totalLancamentosAjustes, totalDocumentosAjustes, totalAnalisesDeContaDaPrestacao, totalDespesasPeriodosAnterioresAjustes, flagAjustesDespesasAnterioresAtiva]);

    const podeDevolverParaAssociacao = () => {
        return dataLimiteDevolucao  && editavel && possuiAcertosSelecionados()
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
                                        to={`/dre-detalhe-prestacao-de-contas-resumo-acertos/${prestacaoDeContas.uuid}`}
                                        state={{
                                            analisesDeContaDaPrestacao: analisesDeContaDaPrestacao,
                                            editavel: editavel,
                                            infoAta: infoAta,
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
                                    <span data-tooltip-content={!possuiAcertosSelecionados() ? 'Não é permitido devolver PC sem acertos indicados.' : ''}>
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
                                texto='<p>Ao notificar a Associação sobre as "Devolução para Acertos" dessa prestação de contas, será reaberto o período para que a Associação possa realizar os ajustes pontuados até o prazo determinado.</p>
                                            <p>A prestação será movida para o <strong>status de "Devolução para Acertos"</strong> e ficará nesse status até a Associação realizar um novo envio. Deseja continuar?</p>'
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
                                show={showModalComprovanteSaldoConta}
                                handleClose={() => setShowModalComprovanteSaldoConta(false)}
                                onConfirmar={handleConfirmarComprovanteSaldo}
                                titulo="Comprovante de saldo da conta"
                                texto={`A(s) conta(s) ${obterContasSemComprovanteSaldo().join(', ')} não possuem comprovante de saldo. Favor solicitar o acerto para envio do comprovante para que a PC possa ser devolvida.`}
                                primeiroBotaoTexto="Fechar"
                                primeiroBotaoCss="outline-success"
                                segundoBotaoCss="success"
                                segundoBotaoTexto="Ir para Extrato Bancário"
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
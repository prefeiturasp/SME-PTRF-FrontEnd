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
    getDespesasPeriodosAnterioresAjustes
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
import {useHandleDevolverParaAssociacao} from "../hooks/useHandleDevolverParaAssociacao";

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
    const [showModalLancamentosConciliacao, setShowModalLancamentosConciliacao] = useState(false)
    const [mostrarModalLancamentosSomenteSolicitacoes, setMostrarModalLancamentosSomenteSolicitacoes] = useState(false)
    const [contasPendenciaConciliacao, setContasPendenciaConciliacao] = useState([])
    const [contasPendenciaLancamentosConciliacao, setContasPendenciaLancamentosConciliacao] = useState([])
    const [showModalJustificativaSaldoConta, setShowModalJustificativaSaldoConta] = useState(false)
    const [contasSolicitarCorrecaoJustificativaConciliacao, setContasSolicitarCorrecaoJustificativaConciliacao] = useState([])
    const [textoErroDevolverParaAcerto, setTextoErroDevolverParaAcerto] = useState('')
    const [lancamentosAjustes, setLancamentosAjustes] = useState([])
    const [documentosAjustes, setDocumentosAjustes] = useState([])
    const [despesasPeriodosAnterioresAjustes, setDespesasPeriodosAnterioresAjustes] = useState([])
    const [loading, setLoading] = useState(true)
    const [btnDevolverParaAcertoDisabled, setBtnDevolverParaAcertoDisabled] = useState(false)

    const totalLancamentosAjustes = useMemo(() => lancamentosAjustes.length, [lancamentosAjustes]);
    const totalDocumentosAjustes = useMemo(() => documentosAjustes.length, [documentosAjustes]);
    const totalDespesasPeriodosAnterioresAjustes = useMemo(() => despesasPeriodosAnterioresAjustes.length, [despesasPeriodosAnterioresAjustes]);

    const handleDevolverParaAssociacao = useHandleDevolverParaAssociacao({
        prestacaoDeContas,
        setContasPendenciaConciliacao,
        setShowModalComprovanteSaldoConta,
        setShowModalConciliacaoBancaria,
        setShowModalConfirmaDevolverParaAcerto,
        setBtnDevolverParaAcertoDisabled,
        setContasPendenciaLancamentosConciliacao,
        setShowModalLancamentosConciliacao,
        setMostrarModalLancamentosSomenteSolicitacoes,
        setShowModalJustificativaSaldoConta,
        setContasSolicitarCorrecaoJustificativaConciliacao
    });

    
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

    useEffect(() => {
        if (!loading && window && window.location && window.location.hash === '#collapse_sintese_por_realizacao_da_despesa') {
            let tentativas = 0;
            const tentarRolagem = () => {
                const elemento = document.getElementById('collapse_sintese_por_realizacao_da_despesa');
                if (elemento) {
                    elemento.classList.add('show');
                    setTimeout(() => {
                        elemento.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start',
                            inline: 'nearest'
                        });
                        const retangulo = elemento.getBoundingClientRect();
                        const deslocamentoTopo = window.pageYOffset + retangulo.top - 100;
                        window.scrollTo({
                            top: deslocamentoTopo,
                            behavior: 'smooth'
                        });
                    }, 50);
                } else if (tentativas < 10) {
                    tentativas = tentativas + 1;
                    setTimeout(tentarRolagem, 100);
                }
            };
            setTimeout(tentarRolagem, 100);
        }
    }, [loading])

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
    const handleConfirmarDevolucaoConciliacao = useCallback(async () => {
        setShowModalConciliacaoBancaria(false)
        setShowModalConfirmaDevolverParaAcerto(true)
    }, []);

    const rolarParaExtratoBancario = useCallback(() => {
        setTimeout(() => {
            const elemento = document.getElementById('collapse_sintese_por_realizacao_da_despesa');
            if (!elemento) {
                return;
            }

            elemento.classList.add('show');
            setTimeout(() => {
                elemento.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start',
                    inline: 'nearest'
                });
                const retangulo = elemento.getBoundingClientRect();
                const deslocamentoTopo = window.pageYOffset + retangulo.top - 100;
                window.scrollTo({
                    top: deslocamentoTopo,
                    behavior: 'smooth'
                });
            }, 300);
        }, 100);
    }, []);

    const handleConfirmarComprovanteSaldo = useCallback(() => {
        setShowModalComprovanteSaldoConta(false)
        rolarParaExtratoBancario();
    }, [rolarParaExtratoBancario]);

    const handleIrParaJustificativaSaldoConta = useCallback(() => {
        setShowModalJustificativaSaldoConta(false);
        rolarParaExtratoBancario();
    }, [rolarParaExtratoBancario]);

    const handleIrParaExtratoLancamentosConciliacao = useCallback(() => {
        setShowModalLancamentosConciliacao(false);
        setMostrarModalLancamentosSomenteSolicitacoes(false);
        rolarParaExtratoBancario();
    }, [rolarParaExtratoBancario]);

    const handleFecharModalLancamentosConciliacao = useCallback(() => {
        setShowModalLancamentosConciliacao(false);
        setMostrarModalLancamentosSomenteSolicitacoes(false);
    }, []);

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
    }, [contasPendenciaConciliacao, obterNomeConta]);

    const obterContasLancamentosConciliacao = useCallback(() => {
        if (!contasPendenciaLancamentosConciliacao || contasPendenciaLancamentosConciliacao.length === 0) {
            return [];
        }

        return contasPendenciaLancamentosConciliacao.map(obterNomeConta);
    }, [contasPendenciaLancamentosConciliacao, obterNomeConta]);

    const obterContasJustificativaConciliacao = useCallback(() => {
        if (!contasSolicitarCorrecaoJustificativaConciliacao || contasSolicitarCorrecaoJustificativaConciliacao.length === 0) {
            return [];
        }

        return contasSolicitarCorrecaoJustificativaConciliacao.map(obterNomeConta);
    }, [contasSolicitarCorrecaoJustificativaConciliacao, obterNomeConta]);

    const formatarListaContas = useCallback((contas) => {
        if (!contas || contas.length === 0) {
            return 'nenhuma conta identificada';
        }
        return contas.join(', ');
    }, []);

    const contasSemComprovanteTexto = useMemo(() => {
        const contas = obterContasSemComprovanteSaldo();
        return formatarListaContas(contas);
    }, [formatarListaContas, obterContasSemComprovanteSaldo]);

    const contasLancamentosConciliacaoTexto = useMemo(() => {
        const contas = obterContasLancamentosConciliacao();
        return formatarListaContas(contas);
    }, [formatarListaContas, obterContasLancamentosConciliacao]);

    const contasJustificativaConciliacao = useMemo(() => {
        return obterContasJustificativaConciliacao();
    }, [obterContasJustificativaConciliacao]);

    const contasJustificativaConciliacaoTexto = useMemo(() => {
        return formatarListaContas(contasJustificativaConciliacao);
    }, [formatarListaContas, contasJustificativaConciliacao]);

    const textoSolicitacoesLancamentosConciliacao = useMemo(() => {
        return `<p><strong>Acertos que alteram a conciliação bancária</strong></p><p>Foram indicados acertos de inclusão/exclusão de lançamento na(s) conta(s) ${contasLancamentosConciliacaoTexto} que alteram o saldo da conciliação bancária. Favor solicitar o acerto de saldo para que a PC possa ser devolvida.</p>`;
    }, [contasLancamentosConciliacaoTexto]);

    const textoComprovanteSaldoConciliacao = useMemo(() => {
        return `<p><strong>Comprovante de saldo da conta</strong></p><p>A(s) conta(s) ${contasSemComprovanteTexto} não possuem comprovante de saldo. Favor solicitar o acerto para envio do comprovante para que a PC possa ser devolvida.</p>`;
    }, [contasSemComprovanteTexto]);

    const textoJustificativaSaldoConciliacao = useMemo(() => {
        return `<p><strong>Justificativa de saldo da conta</strong></p><p>A(s) conta(s) ${contasJustificativaConciliacaoTexto} não possuem justificativa de diferença entre saldo reprogramado e saldo bancário. Favor solicitar o acerto para inclusão da justificativa para que a PC possa ser devolvida.</p>`;
    }, [contasJustificativaConciliacaoTexto]);

    const textoModalLancamentosConciliacao = useMemo(() => {
        if (mostrarModalLancamentosSomenteSolicitacoes) {
            return textoSolicitacoesLancamentosConciliacao;
        }
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
        mostrarModalLancamentosSomenteSolicitacoes,
        textoSolicitacoesLancamentosConciliacao,
        textoComprovanteSaldoConciliacao,
        textoJustificativaSaldoConciliacao,
        contasPendenciaLancamentosConciliacao,
        contasPendenciaConciliacao,
        contasJustificativaConciliacao
    ]);

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

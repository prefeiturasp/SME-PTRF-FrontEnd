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

const TITULO_ACERTOS_CONCILIACAO = 'Acertos que alteram a conciliação bancária';
const TITULO_COMPROVANTE_SALDO = 'Comprovante de saldo da conta';
const TITULO_JUSTIFICATIVA_SALDO = 'Justificativa de saldo da conta';

const DevolucaoParaAcertos = ({
    prestacaoDeContas,
    analisesDeContaDaPrestacao,
    analisesDeContaCarregadas=true,
    carregaPrestacaoDeContas,
    infoAta,
    editavel=true,
    setLoadingAcompanhamentoPC,
    setAnalisesDeContaDaPrestacao,
    updateListaDeDocumentosParaConferencia=null,
    carregaLancamentosParaConferencia=null,
    carregandoLancamentosParaConferencia=false
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

    const dependenciasCarregadas = !!prestacaoDeContas?.uuid && Array.isArray(infoAta?.contas) && analisesDeContaCarregadas;
    const aguardandoDependencias = !dependenciasCarregadas || carregandoLancamentosParaConferencia;
    const carregandoDevolucao = loading || aguardandoDependencias;
    const mensagemLoadingDevolucao = aguardandoDependencias ? 'Aguardando...' : 'Carregando...';

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

    const fetchContaAjustes = async (analiseUuid, contaUuid, onError) => {
        try {
            const [lancamentos, documentos, despesas] = await Promise.all([
                getLancamentosAjustes(analiseUuid, contaUuid),
                getDocumentosAjustes(analiseUuid, contaUuid),
                getDespesasPeriodosAnterioresAjustes(analiseUuid, contaUuid)
            ]);

            return {
                lancamentos_ajustes: lancamentos || [],
                documentos_ajustes: documentos || [],
                despesas_periodos_anteriores_ajustes: despesas || []
            };
        } catch (err) {
            console.error(err);
            const erroMsg = err?.response?.data?.detail || err?.message || String(err);
            onError(erroMsg);
            return { lancamentos_ajustes: [], documentos_ajustes: [], despesas_periodos_anteriores_ajustes: [] };
        }
    };

    const obterAnaliseUuid = useCallback(async () => {
        if (editavel) {
            return (prestacaoDeContas?.analise_atual?.uuid && infoAta?.contas?.length > 0)
                ? prestacaoDeContas.analise_atual.uuid
                : null;
        }

        if (!prestacaoDeContas?.uuid) return null;

        try {
            const ultimaAnalise = await getUltimaAnalisePc(prestacaoDeContas.uuid);
            return ultimaAnalise?.uuid || null;
        } catch (e) {
            console.error("Erro ao carregar a última análise:", e);
            toastCustom.ToastCustomError('Erro ao carregar acertos', 'Não foi possível carregar a última análise da prestação de contas.');
            return null;
        }
    }, [editavel, prestacaoDeContas, infoAta]);

    useEffect(() => {
        if (aguardandoDependencias) return;

        let mounted = true;

        const carregarSolicitacoesAcertos = async () => {
            setLoading(true);

            try {
                const analiseAtualUuid = await obterAnaliseUuid();
                const temContas = infoAta?.contas?.length > 0;

                if (!analiseAtualUuid || !temContas || !mounted) return;

                const errosAjustes = [];
                const registrarErro = (msg) => errosAjustes.push(msg);

                const resultados = await Promise.all(
                    infoAta.contas.map(conta =>
                        fetchContaAjustes(analiseAtualUuid, conta.conta_associacao.uuid, registrarErro)
                    )
                );

                if (!mounted) return;

                if (errosAjustes.length > 0) {
                    const detalhesErro = [...new Set(errosAjustes)].join(' | ');
                    toastCustom.ToastCustomError('Erro ao carregar acertos', `Não foi possível carregar algumas solicitações de acertos. ${detalhesErro}`);
                }

                setLancamentosAjustes(resultados.flatMap(r => r.lancamentos_ajustes));
                setDocumentosAjustes(resultados.flatMap(r => r.documentos_ajustes));
                setDespesasPeriodosAnterioresAjustes(resultados.flatMap(r => r.despesas_periodos_anteriores_ajustes));

            } catch (e) {
                console.error("Erro ao verificar solicitações de acertos:", e);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        void carregarSolicitacoesAcertos();

        return () => {
            mounted = false;
        }
    }, [infoAta, prestacaoDeContas, obterAnaliseUuid, updateListaDeDocumentosParaConferencia, carregaLancamentosParaConferencia, aguardandoDependencias]);

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

    const descricaoSolicitacoesLancamentosConciliacao = useMemo(() => {
        return `Foram indicados acertos de inclusão/exclusão de lançamento na(s) conta(s) ${contasLancamentosConciliacaoTexto} que alteram o saldo da conciliação bancária. Favor solicitar o acerto de saldo para que a PC possa ser devolvida.`;
    }, [contasLancamentosConciliacaoTexto]);

    const descricaoComprovanteSaldoConciliacao = useMemo(() => {
        return `A(s) conta(s) ${contasSemComprovanteTexto} não possuem comprovante de saldo. Favor solicitar o acerto para envio do comprovante para que a PC possa ser devolvida.`;
    }, [contasSemComprovanteTexto]);

    const descricaoJustificativaSaldoConciliacao = useMemo(() => {
        return `A(s) conta(s) ${contasJustificativaConciliacaoTexto} não possuem justificativa de diferença entre saldo reprogramado e saldo bancário. Favor solicitar o acerto para inclusão da justificativa para que a PC possa ser devolvida.`;
    }, [contasJustificativaConciliacaoTexto]);

    const blocoSolicitacoesLancamentosConciliacao = useMemo(() => {
        return `<p><strong>${TITULO_ACERTOS_CONCILIACAO}</strong></p><p>${descricaoSolicitacoesLancamentosConciliacao}</p>`;
    }, [descricaoSolicitacoesLancamentosConciliacao]);

    const blocoComprovanteSaldoConciliacao = useMemo(() => {
        return `<p><strong>${TITULO_COMPROVANTE_SALDO}</strong></p><p>${descricaoComprovanteSaldoConciliacao}</p>`;
    }, [descricaoComprovanteSaldoConciliacao]);

    const blocoJustificativaSaldoConciliacao = useMemo(() => {
        return `<p><strong>${TITULO_JUSTIFICATIVA_SALDO}</strong></p><p>${descricaoJustificativaSaldoConciliacao}</p>`;
    }, [descricaoJustificativaSaldoConciliacao]);

    const textoModalLancamentosConciliacao = useMemo(() => {
        if (mostrarModalLancamentosSomenteSolicitacoes) {
            return blocoSolicitacoesLancamentosConciliacao;
        }
        const blocos = [];
        if (contasPendenciaLancamentosConciliacao.length > 0) {
            blocos.push(blocoSolicitacoesLancamentosConciliacao);
        }
        if (contasPendenciaConciliacao.length > 0) {
            blocos.push(blocoComprovanteSaldoConciliacao);
        }
        if (contasJustificativaConciliacao.length > 0) {
            blocos.push(blocoJustificativaSaldoConciliacao);
        }
        if (blocos.length === 0) {
            return blocoSolicitacoesLancamentosConciliacao;
        }
        return blocos.join('');
    }, [
        mostrarModalLancamentosSomenteSolicitacoes,
        blocoSolicitacoesLancamentosConciliacao,
        blocoComprovanteSaldoConciliacao,
        blocoJustificativaSaldoConciliacao,
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
            {!carregandoDevolucao ? (
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
                                    <span
                                        data-tooltip-id="btn-devolver-para-associacao"
                                        data-tooltip-html={!possuiAcertosSelecionados() ? 'Não é permitido devolver PC sem acertos indicados.' : ''}>
                                        Devolver para Associação
                                    </span>
                                    <ReactTooltip id="btn-devolver-para-associacao"/>
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
                                texto={descricaoJustificativaSaldoConciliacao}
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
                                texto={descricaoComprovanteSaldoConciliacao}
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
                    mensagem={mensagemLoadingDevolucao}
                />
            }
        </>
    )
}

export default memo(DevolucaoParaAcertos)

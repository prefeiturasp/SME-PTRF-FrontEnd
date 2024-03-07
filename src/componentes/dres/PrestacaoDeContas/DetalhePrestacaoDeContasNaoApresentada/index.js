import React, {useCallback, useEffect, useState} from "react";
import {PaginasContainer} from "../../../../paginas/PaginasContainer";
import Cabecalho from "../DetalhePrestacaoDeContas/Cabecalho";
import {BotoesAvancarRetroceder} from "../DetalhePrestacaoDeContas/BotoesAvancarRetroceder";
import {TrilhaDeStatus} from "../DetalhePrestacaoDeContas/TrilhaDeStatus";
import {getTabelasPrestacoesDeContas} from "../../../../services/dres/PrestacaoDeContas.service";
import {FormRecebimentoPelaDiretoria} from "../DetalhePrestacaoDeContas/FormRecebimentoPelaDiretoria";
import {RetornaSeTemPermissaoEdicaoAcompanhamentoDePc} from "../RetornaSeTemPermissaoEdicaoAcompanhamentoDePc";
import {RetornaSeFlagAtiva} from "./RetornaSeFlagAtiva";
import ComentariosDeAnalise from "../DetalhePrestacaoDeContas/ComentariosDeAnalise";
import {BarraInfo} from "./components/BarraInfo";
import {ModalConcluirPcNaoApresentada} from "./components/ModalConcluirPcNaoApresentada";
import moment from "moment";
import {usePostPrestacaoContaReprovadaNaoApresentacao} from "./hooks/usePostPrestacaoContaReprovadaNaoApresentacao";

export const DetalhePrestacaoDeContasNaoApresentada = () =>{

    const TEMPERMISSAO = RetornaSeTemPermissaoEdicaoAcompanhamentoDePc()

    const FLAG_ATIVA = RetornaSeFlagAtiva()

    const prestacaoDeContas = JSON.parse(localStorage.getItem('prestacao_de_contas_nao_apresentada'));

    const {mutationPostPrestacaoContaReprovadaNaoApresentacao} = usePostPrestacaoContaReprovadaNaoApresentacao()

    const initialFormRecebimentoPelaDiretoria = {
        tecnico_atribuido: "",
        data_recebimento: "",
        status: "NAO_APRESENTADA",
    };

    const [stateFormRecebimentoPelaDiretoria] = useState(initialFormRecebimentoPelaDiretoria);
    const [tabelaPrestacoes, setTabelaPrestacoes] = useState({});
    const [associacaoUuid, setAssociacaoUuid] = useState('');
    const [periodoUuid, setPeriodoUuid] = useState('');
    const [showModalConcluirPcNaoApresentada, setShowModalConcluirPcNaoApresentada] = useState(false);

    useEffect(()=>{
        carregaTabelaPrestacaoDeContas();
    }, []);

    const carregaTabelaPrestacaoDeContas = async () => {
        let tabela_prestacoes = await getTabelasPrestacoesDeContas();
        setTabelaPrestacoes(tabela_prestacoes);
    };

    const getAssociacaoUuid = useCallback(()=>{
        if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid){
            setAssociacaoUuid(prestacaoDeContas.associacao.uuid)
        }
    }, [prestacaoDeContas])

    useEffect(()=>{
        getAssociacaoUuid()
    }, [getAssociacaoUuid])

    const getPeriodoUuid = useCallback(()=>{
        if (prestacaoDeContas && prestacaoDeContas.periodo_uuid ){
            setPeriodoUuid(prestacaoDeContas.periodo_uuid)
        }
    }, [prestacaoDeContas])

    useEffect(()=>{
        getPeriodoUuid()
    }, [getPeriodoUuid])

    const onConcluirPcNaoApresentada = () => {
        setShowModalConcluirPcNaoApresentada(false);
        const currentDate = moment(new Date()).format('YYYY-MM-DDTHH:mm:ss');

        let payload = {
            periodo: periodoUuid,
            associacao: associacaoUuid,
            data_de_reprovacao: currentDate,
        }
        mutationPostPrestacaoContaReprovadaNaoApresentacao.mutate({payload: payload})
    };

    return(
        <PaginasContainer>
            <h1 data-qa="titulo-acompanhamento-pcs" className="titulo-itens-painel mt-5">Acompanhamento das Prestações de Contas</h1>
            <div className="page-content-inner">
                <>
                    {prestacaoDeContas &&
                        <>
                            <Cabecalho
                                prestacaoDeContas={prestacaoDeContas}
                            />
                            {FLAG_ATIVA &&
                                <BarraInfo/>
                            }
                            <BotoesAvancarRetroceder
                                prestacaoDeContas={prestacaoDeContas}
                                textoBtnAvancar={"Receber"}
                                textoBtnRetroceder={"Reabrir PC"}
                                metodoAvancar={undefined}
                                metodoRetroceder={undefined}
                                disabledBtnAvancar={true}
                                disabledBtnRetroceder={true}
                                tooltipRetroceder='Você não pode reabrir a PC pois essa PC não foi apresentada.'
                                tooltipAvancar='Você não pode receber pois essa PC não foi apresentada.'
                                setShowModalConcluirPcNaoApresentada={setShowModalConcluirPcNaoApresentada}
                            />
                            <TrilhaDeStatus
                                prestacaoDeContas={prestacaoDeContas}
                            />
                            <FormRecebimentoPelaDiretoria
                                handleChangeFormRecebimentoPelaDiretoria={undefined}
                                stateFormRecebimentoPelaDiretoria={stateFormRecebimentoPelaDiretoria}
                                tabelaPrestacoes={tabelaPrestacoes}
                                disabledNome={true}
                                disabledData={true}
                                disabledStatus={true}
                                exibeMotivo={false}
                                exibeRecomendacoes={false}
                            />
                            {associacaoUuid && periodoUuid &&
                                <ComentariosDeAnalise
                                    associacaoUuid={associacaoUuid}
                                    periodoUuid={periodoUuid}
                                    editavel={TEMPERMISSAO}
                                />
                            }
                        </>
                    }
                </>
            </div>
            <section>
                <ModalConcluirPcNaoApresentada
                    show={showModalConcluirPcNaoApresentada}
                    handleClose={()=>setShowModalConcluirPcNaoApresentada(false)}
                    onConcluirPcNaoApresentada={onConcluirPcNaoApresentada}
                    titulo="Concluir análise"
                    texto="<div class='text-center'><p class='mb-0'><strong>Prestação de contas não apresentada pela UE.</strong></p><p>Tem certeza que deseja concluir análise mesmo assim?</p></div>"
                    primeiroBotaoTexto="Cancelar"
                    primeiroBotaoCss="outline-success"
                    segundoBotaoCss="success"
                    segundoBotaoTexto="Concluir análise"
                />
            </section>
        </PaginasContainer>
    )
};
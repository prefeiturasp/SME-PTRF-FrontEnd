import React, {useEffect, useState, memo, useCallback} from "react";
import {getLancamentosParaConferencia, getUltimaAnalisePc, getContasDaAssociacao} from "../../../../../services/dres/PrestacaoDeContas.service";
import {TabsConferenciaDeLancamentos} from "./TabsConferenciaDeLancamentos";
import {visoesService} from "../../../../../services/visoes.service";
import {mantemEstadoAcompanhamentoDePc as meapcservice} from "../../../../../services/mantemEstadoAcompanhamentoDePc.service";

const ConferenciaDeLancamentos = ({prestacaoDeContas, editavel=true}) =>{
    const [lancamentosParaConferencia, setLancamentosParaConferencia] = useState([])
    const [loadingLancamentosParaConferencia, setLoadingLancamentosParaConferencia] = useState(true)
    const [contaUuid, setContaUuid] = useState('')
    const [clickBtnEscolheConta, setClickBtnEscolheConta] = useState('');
    const [contasAssociacao, setContasAssociacao] = useState([])

    // Manter o estado do Acompanhamento de PC
    let dados_acompanhamento_de_pc_usuario_logado = meapcservice.getAcompanhamentoDePcUsuarioLogado()

    const verificaSeExcluiObjetoAcompanhamentoPcUsuarioLogado = useCallback(()=>{
        if (dados_acompanhamento_de_pc_usuario_logado.prestacao_de_conta_uuid !== prestacaoDeContas.uuid){
            meapcservice.limpaAcompanhamentoDePcUsuarioLogado(visoesService.getUsuarioLogin())
        }
    }, [prestacaoDeContas, dados_acompanhamento_de_pc_usuario_logado])

    useEffect(()=>{
        verificaSeExcluiObjetoAcompanhamentoPcUsuarioLogado()
    }, [verificaSeExcluiObjetoAcompanhamentoPcUsuarioLogado])

    useEffect(()=>{
        if (prestacaoDeContas && prestacaoDeContas.associacao && prestacaoDeContas.associacao.uuid){
            try {
                const buscaContasDaAssociacao = async ()=>{
                    let contas = await getContasDaAssociacao(prestacaoDeContas.associacao.uuid)
                    setContasAssociacao(contas)
                }
                buscaContasDaAssociacao()
            }catch (e) {
                console.log("Erro ao buscar contas pela associacao.uuid em ConferenciaDeLancamentos")
            }
        }
    }, [prestacaoDeContas])

    const preCarregaLancamentosEToggle = useCallback(() =>{

        let dados_acompanhamento_de_pc_usuario_logado = meapcservice.getAcompanhamentoDePcUsuarioLogado()

        let filtrar_por_acao = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_acao
        let filtrar_por_lancamento = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.filtrar_por_lancamento
        let paginacao_atual = dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.paginacao_atual

        if (dados_acompanhamento_de_pc_usuario_logado && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos && dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.conta_uuid){
            carregaLancamentosParaConferencia(prestacaoDeContas, dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.conta_uuid, filtrar_por_acao, filtrar_por_lancamento, paginacao_atual)
            toggleBtnEscolheConta(dados_acompanhamento_de_pc_usuario_logado.conferencia_de_lancamentos.conta_uuid)
        }else if (contasAssociacao.length > 0){
            carregaLancamentosParaConferencia(prestacaoDeContas, contasAssociacao[0].uuid)
            toggleBtnEscolheConta(contasAssociacao[0].uuid)
        }

    }, [prestacaoDeContas, contasAssociacao])

    useEffect(()=>{
        preCarregaLancamentosEToggle()
    }, [preCarregaLancamentosEToggle])

    const toggleBtnEscolheConta = (conta_uuid) => {
        setClickBtnEscolheConta(conta_uuid);
    };

    const salvaObjetoAcompanhamentoDePcPorUsuarioLocalStorage = (prestacao_de_contas, conta_uuid, filtrar_por_acao, filtrar_por_lancamento, paginacao_atual) =>{
        let objetoAcompanhamentoDePcPorUsuario = {
            prestacao_de_conta_uuid: prestacaoDeContas.uuid,
            conferencia_de_lancamentos: {
                conta_uuid:  conta_uuid,
                filtrar_por_acao: filtrar_por_acao,
                filtrar_por_lancamento: filtrar_por_lancamento,
                paginacao_atual: paginacao_atual,
            },
        }
        meapcservice.setAcompanhamentoDePcPorUsuario(visoesService.getUsuarioLogin(), objetoAcompanhamentoDePcPorUsuario)
    }

    const carregaLancamentosParaConferencia = async (prestacao_de_contas, conta_uuid, filtrar_por_acao=null, filtrar_por_lancamento=null, paginacao_atual, ordenar_por_imposto=null) =>{

        salvaObjetoAcompanhamentoDePcPorUsuarioLocalStorage(prestacao_de_contas, conta_uuid, filtrar_por_acao, filtrar_por_lancamento, paginacao_atual)

        setContaUuid(conta_uuid)
        setLoadingLancamentosParaConferencia(true)

        let lancamentos;

        if (editavel){
            if (prestacao_de_contas && prestacao_de_contas.uuid && prestacao_de_contas.analise_atual && prestacao_de_contas.analise_atual.uuid && conta_uuid){
                lancamentos =  await getLancamentosParaConferencia(prestacao_de_contas.uuid, prestacao_de_contas.analise_atual.uuid, conta_uuid, filtrar_por_acao, filtrar_por_lancamento, ordenar_por_imposto)
            }
        }else {
            if (prestacao_de_contas && prestacao_de_contas.uuid){
                let ultima_analise =  await getUltimaAnalisePc(prestacao_de_contas.uuid)

                if (ultima_analise && ultima_analise.uuid){
                    lancamentos =  await getLancamentosParaConferencia(prestacao_de_contas.uuid, ultima_analise.uuid, conta_uuid, filtrar_por_acao, filtrar_por_lancamento, ordenar_por_imposto)
                }
            }
        }

        // Adicionando a propriedade selecionando todos os itens
        if (lancamentos && lancamentos.length > 0){
            let unis = lancamentos.map((lancamento)=>{
                return {
                    ...lancamento,
                    selecionado: false
                }
            })
            setLancamentosParaConferencia(unis)
        }else {
            setLancamentosParaConferencia([])
        }
        setLoadingLancamentosParaConferencia(false)
    }

    const [stateCheckBoxOrdenarPorImposto, setStateCheckBoxOrdenarPorImposto] = useState(false);

    const handleChangeCheckBoxOrdenarPorImposto = (checked) =>{
        setStateCheckBoxOrdenarPorImposto(checked)
        carregaLancamentosParaConferencia(prestacaoDeContas, contaUuid, null, null, null, checked)
    }

    return(
        <>
            <hr id='conferencia_de_lancamentos' className='mt-4 mb-3'/>
            <h4 className='mb-4'>Conferência de lançamentos</h4>

            {contasAssociacao && contasAssociacao.length > 0 &&
                <TabsConferenciaDeLancamentos
                    contasAssociacao={contasAssociacao}
                    toggleBtnEscolheConta={toggleBtnEscolheConta}
                    clickBtnEscolheConta={clickBtnEscolheConta}
                    carregaLancamentosParaConferencia={carregaLancamentosParaConferencia}
                    prestacaoDeContas={prestacaoDeContas}
                    setLancamentosParaConferencia={setLancamentosParaConferencia}
                    lancamentosParaConferencia={lancamentosParaConferencia}
                    loadingLancamentosParaConferencia={loadingLancamentosParaConferencia}
                    contaUuid={contaUuid}
                    editavel={editavel}
                    handleChangeCheckBoxOrdenarPorImposto={handleChangeCheckBoxOrdenarPorImposto}
                    stateCheckBoxOrdenarPorImposto={stateCheckBoxOrdenarPorImposto}
                    setStateCheckBoxOrdenarPorImposto={setStateCheckBoxOrdenarPorImposto}
                />
            }
        </>
    )
}
export default memo(ConferenciaDeLancamentos)
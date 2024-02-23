import React, {createContext, useEffect, useState, memo, useCallback, useRef} from "react";
import { TabsConferenciaDeLancamentos } from "./TabsConferenciaDeLancamentos";
import { visoesService } from "../../../../../services/visoes.service";
import {mantemEstadoAcompanhamentoDePc as meapcservice} from "../../../../../services/mantemEstadoAcompanhamentoDePc.service";
import { useGetDespesasPeriodosAnterioresParaConferencia } from "./hooks/useGetDespesasPeriodosAnterioresParaConferencia";
import Loading from "../../../../../utils/Loading";
import { useGetContasComMovimentoDespesasPeriodosAnteriores } from "./hooks/useGetContasComMovimentoDespesasPeriodosAnteriores";
import { ConferenciaDespesasPeriodosAnterioresProvider } from "./context/ConferenciaDespesasPeriodosAnteriores";

export const ConferenciaDespesasPeriodosAnterioresContext = createContext(1);

const ConferenciaDespesasPeriodosAnteriores = ({
    prestacaoDeContas, 
    onCarregaLancamentosParaConferencia = null, 
    editavel = true
}) => {
    const isFirstRender = useRef(true);
    const [stateCheckBoxOrdenarPorImposto, setStateCheckBoxOrdenarPorImposto] = useState(false);
    const [componentState, setComponentState] = useState(null);
    const [lancamentosParaConferencia, setLancamentosParaConferencia] = useState([]);

    const {data, isLoading, isFetching, refetch} = useGetDespesasPeriodosAnterioresParaConferencia(setLancamentosParaConferencia, componentState || {});
    const {data: contasAssociacao, isLoading: isLoadingContas} = useGetContasComMovimentoDespesasPeriodosAnteriores(prestacaoDeContas.uuid);

    useEffect(() => {
        if (componentState !== null) {
            refetch();
            salvaObjetoAcompanhamentoDePcPorUsuarioLocalStorage(componentState)
        }
      }, [componentState, refetch]);

    const carregamentoInicial = useCallback(() => {
        if (contasAssociacao.length > 0){
            const dados_acompanhamento_de_pc_usuario_logado = meapcservice.getAcompanhamentoDePcUsuarioLogado();
            let params = dados_acompanhamento_de_pc_usuario_logado?.conferencia_despesas_periodos_anteriores;
            let pc = dados_acompanhamento_de_pc_usuario_logado?.prestacao_de_conta_uuid;

            setComponentState({
                ...params,
                conta_uuid: params.conta_uuid ? params.conta_uuid : contasAssociacao[0].uuid,
                prestacaoDeContasUUID: prestacaoDeContas.uuid, 
                analiseUUID: prestacaoDeContas.analise_atual.uuid
            });

            if (pc !== prestacaoDeContas.uuid){
                meapcservice.limpaAcompanhamentoDePcUsuarioLogado(visoesService.getUsuarioLogin())
            }
    
        }
    }, [contasAssociacao])
    
    useEffect(() => {
        if (!isFirstRender.current) {
            carregamentoInicial();
        } else {
            isFirstRender.current = false;
        }
    }, [carregamentoInicial]);

    const salvaObjetoAcompanhamentoDePcPorUsuarioLocalStorage = (updatedParams) => {
        const objetoAcompanhamentoDePcPorUsuario = {
            prestacao_de_conta_uuid: prestacaoDeContas.uuid,
            conferencia_despesas_periodos_anteriores: updatedParams
        };
        meapcservice.setAcompanhamentoDePcPorUsuario(visoesService.getUsuarioLogin(), objetoAcompanhamentoDePcPorUsuario);
    };

    const handleChangeCheckBoxOrdenarPorImposto = (checked) => {
        setStateCheckBoxOrdenarPorImposto(checked);
        setComponentState(prev => ({...prev, ordenar_por_imposto: checked}));
    }

    const onTabClick = (conta_uuid) => {
        setStateCheckBoxOrdenarPorImposto(false);
        setComponentState(prev => ({...prev, conta_uuid: conta_uuid, ordenar_por_imposto: false}));
    };

    const handleSelectedItems = (items) => {
        const modifiedItems = data.map((item) => ({
            ...item,
            selecionado: items.includes(item.documento_mestre.uuid),
        }));

        setLancamentosParaConferencia(modifiedItems);
    };

    const handleSubmitFiltros = (filtros) => {
        setComponentState(prev => ({ ...prev, ...filtros}));
    };

    const onChangeOrdenamento = (ordernamentos) => {
        setComponentState(prev => ({ ...prev, ordenamento_tabela_lancamentos: ordernamentos}));
    };

    const onChangePage = (pagina) => {
        setComponentState(prev => ({ ...prev, paginacao_atual: pagina}));
    };

    if (isLoading) {
        return (
            <Loading
                corGrafico="black"
                corFonte="dark"
                marginTop="0"
                marginBottom="0"
            />
        )
    }

    if (!isLoadingContas && contasAssociacao.length === 0) return null;

    return(
        <ConferenciaDespesasPeriodosAnterioresProvider
            prestacaoDeContas={prestacaoDeContas}
            contasAssociacao={contasAssociacao}
            editavel={editavel}
            componentState={componentState}
            isLoadingDespesas={isFetching}
            lancamentosParaConferencia={lancamentosParaConferencia}
            stateCheckBoxOrdenarPorImposto={stateCheckBoxOrdenarPorImposto}
            handleChangeCheckBoxOrdenarPorImposto={handleChangeCheckBoxOrdenarPorImposto}
            onTabClick={onTabClick}
            setLancamentosParaConferencia={handleSelectedItems}
            setStateCheckBoxOrdenarPorImposto={setStateCheckBoxOrdenarPorImposto}
            onHandleSubmitFiltros={handleSubmitFiltros}
            onChangeOrdenamento={onChangeOrdenamento}
            onChangePage={onChangePage}
        >
            <hr id='conferencia_despesas_periodos_anteriores' className='mt-4 mb-3'/>
            <h4 className='mb-4'>Despesas de períodos anteriores</h4>

            {
                isLoadingContas ? (
                    <Loading
                        corGrafico="black"
                        corFonte="dark"
                        marginTop="0"
                        marginBottom="0"
                    />
                ) : (
                    <TabsConferenciaDeLancamentos />    
                )
            }
        </ConferenciaDespesasPeriodosAnterioresProvider>
    )
}
export default memo(ConferenciaDespesasPeriodosAnteriores)
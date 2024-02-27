import React, {createContext, useEffect, useState, memo, useCallback, useMemo} from "react";
import { visoesService } from "../../../../../services/visoes.service";
import { mantemEstadoAcompanhamentoDePc as meapcservice } from "../../../../../services/mantemEstadoAcompanhamentoDePc.service";
import { useGetContasComMovimentoDespesasPeriodosAnteriores } from "./hooks/useGetContasComMovimentoDespesasPeriodosAnteriores";
import Tabs from "../../../../Globais/UI/Tabs";
import TabelaConferenciaDeLancamentos from "./TabelaConferenciaDeLancamentos/index";

export const ConferenciaDespesasPeriodosAnterioresContext = createContext(1);

const ConferenciaDespesasPeriodosAnteriores = ({
    prestacaoDeContas, 
    onCarregaLancamentosParaConferencia = null, 
    editavel = true
}) => {
    const {data: contasAssociacao, isLoading: isLoadingContas} = useGetContasComMovimentoDespesasPeriodosAnteriores(prestacaoDeContas.uuid);
    const [filters, setFilters] = useState(null);


    useEffect(() => {
        if (filters !== null) {
            atualizaStorageFilters(filters);
            onCarregaLancamentosParaConferencia && onCarregaLancamentosParaConferencia();
        }
    }, [filters]);
    
    const atualizaStorageFilters = (updatedParams) => {
        const objetoAcompanhamentoDePcPorUsuario = {
            prestacao_de_conta_uuid: prestacaoDeContas.uuid,           
            conferencia_despesas_periodos_anteriores: updatedParams
        };
        meapcservice.setAcompanhamentoDePcPorUsuario(visoesService.getUsuarioLogin(), objetoAcompanhamentoDePcPorUsuario);
    };

    const carregamentoInicial = useCallback(() => {
        if (contasAssociacao.length > 0){
            const dados_acompanhamento_de_pc_usuario_logado = meapcservice.getAcompanhamentoDePcUsuarioLogado();
            const params = dados_acompanhamento_de_pc_usuario_logado?.conferencia_despesas_periodos_anteriores;
            const pc = dados_acompanhamento_de_pc_usuario_logado?.prestacao_de_conta_uuid;
            const conta_uuid = params && params.conta_uuid ? params.conta_uuid : contasAssociacao[0].uuid;
            setFilters({
                conta_uuid: conta_uuid,
                ...params
            });

            if (pc !== prestacaoDeContas.uuid){
                meapcservice.limpaAcompanhamentoDePcUsuarioLogado(visoesService.getUsuarioLogin())
            }
        }
    }, [contasAssociacao, prestacaoDeContas.uuid]);
    
    const handleTabClick = (tabId) => {
        setFilters(prev => ({...prev, conta_uuid: tabId, ordenar_por_imposto: false, paginacao_atual: 0}));
    };

    const onChangeFilters = (newFilters) => {
        setFilters(prev => ({...prev, ...newFilters}));
    };

    useEffect(() => {
        carregamentoInicial();
    }, [carregamentoInicial]);

    const memoizedContasComMovimentoQuery = useMemo(() => {
        return { contasAssociacao, isLoadingContas };
    }, [contasAssociacao, isLoadingContas]);

    // O componente só deve ser mostrado se houver alguma despesa. 
    // Sendo assim, antes de renderizar o componente, checamos se tem contas com movimentação.
    if (memoizedContasComMovimentoQuery.isLoadingContas || memoizedContasComMovimentoQuery.contasAssociacao.length === 0 || !filters) {
        return null;
    }
    
    return(
        <>
        <hr id='conferencia_despesas_periodos_anteriores' className='mt-4 mb-3'/>
        <h4 className='mb-4'>Despesas de períodos anteriores</h4>
        <Tabs 
            tabs={memoizedContasComMovimentoQuery.contasAssociacao.map((conta) => {return {...conta, label: `Conta ${conta.tipo_conta.nome}`}})} 
            initialActiveTab={filters.conta_uuid} 
            onTabClick={handleTabClick} 
            identifier='nav-conferencia-de-despesas-periodos-anteriores'
        />

        <div className="tab-content" id="nav-conferencia-de-lancamentos-tabContent">
            <div
                className="tab-pane fade show active"
                role="tabpanel"
            >
                <TabelaConferenciaDeLancamentos 
                    contaUUID={filters.conta_uuid}
                    prestacaoDeContas={prestacaoDeContas}
                    editavel={editavel}
                    filters={filters}
                    onChangeFilters={onChangeFilters}
                />
            </div>
        </div>
        </>
    )
}
export default memo(ConferenciaDespesasPeriodosAnteriores)
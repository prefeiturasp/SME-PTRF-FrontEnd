import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { getTabelasRepassePorAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";
import { RepassesContext } from "../context/Repasse";


export const useGetTabelasPorAssociacao = () => {
    const {stateFormModal} = useContext(RepassesContext)

    const { status, isFetching, isError, data, refetch } = useQuery({
        queryKey: ['tabelas-repasse-associacao-list', stateFormModal.associacao],
        queryFn: ()=> getTabelasRepassePorAssociacao(stateFormModal.associacao),
        keepPreviousData: true,
        enabled: !!stateFormModal.associacao,
        staleTime: 1000 * 60 * 1 // 1 minutos
    });

    return {isLoading: status === 'loading', isFetching, isError, data, refetch}
}
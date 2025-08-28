import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { getTabelasRepassePorAssociacao } from "../../../../../../services/sme/Parametrizacoes.service";
import { RepassesContext } from "../context/Repasse";


export const useGetTabelasPorAssociacao = () => {
    const {stateFormModal} = useContext(RepassesContext)

    const { isLoading, isFetching, isError, data, refetch } = useQuery(
        ['tabelas-repasse-associacao-list', stateFormModal.associacao],
        ()=> getTabelasRepassePorAssociacao(stateFormModal.associacao),
        {
            keepPreviousData: true,
            enabled: !!stateFormModal.associacao,
            staleTime: 1000 * 60 * 1 // 1 minutos
        }
    );

    return {isLoading, isFetching, isError, data, refetch}
}
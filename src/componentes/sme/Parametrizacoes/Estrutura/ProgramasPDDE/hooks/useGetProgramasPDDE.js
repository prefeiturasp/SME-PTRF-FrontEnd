import { useQuery } from "@tanstack/react-query";
import { getProgramasPDDE } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetProgramasPDDE = (filtros, currentPage, rowsPerPage) => {
    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['programas-pdde', 'lista', filtros, currentPage, rowsPerPage],
        queryFn: () => getProgramasPDDE({nome: filtros.filtrar_por_nome}, currentPage, rowsPerPage),
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    return {isLoading: isFetching, isError, data, error, refetch}
}

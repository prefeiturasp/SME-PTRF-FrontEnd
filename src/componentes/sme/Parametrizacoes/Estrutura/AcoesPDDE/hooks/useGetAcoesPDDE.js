import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDE } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetAcoesPDDE = (filtros, currentPage, rowsPerPage) => {
    const { status, isError, data = [], error, refetch } = useQuery({
        queryKey: ['acoes', filtros, currentPage],
        queryFn: ()=> getAcoesPDDE(filtros.filtrar_por_nome, filtros.filtrar_por_categoria, currentPage, rowsPerPage),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    return {isLoading: status === 'loading', isError, data, error, refetch}
}
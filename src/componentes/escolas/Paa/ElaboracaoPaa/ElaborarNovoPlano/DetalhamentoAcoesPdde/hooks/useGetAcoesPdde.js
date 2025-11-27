import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDE } from "../../../../../../../services/escolas/Paa.service";

export const useGetAcoesPdde = (currentPage, rowsPerPage) => {
    const { status, isError, data = [], count = 0, error, refetch } = useQuery({
        queryKey: ['acoes', currentPage],
        queryFn: ()=> getAcoesPDDE(currentPage, rowsPerPage),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    return {isLoading: status === "loading", isError, data, count: data.count, error, refetch}
}

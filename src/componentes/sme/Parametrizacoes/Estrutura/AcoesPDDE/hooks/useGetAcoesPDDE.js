import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDE } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetAcoesPDDE = (filtros, currentPage, rowsPerPage) => {
    const { isLoading, isError, data = [], error, refetch } = useQuery(
        ['acoes', filtros, currentPage],
        ()=> getAcoesPDDE(filtros.filtrar_por_nome, filtros.filtrar_por_categoria, currentPage, rowsPerPage),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );
    return {isLoading, isError, data, error, refetch}
}
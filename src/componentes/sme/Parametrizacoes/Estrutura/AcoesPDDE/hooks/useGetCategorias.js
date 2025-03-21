import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetCategorias = () => {
    const { isLoading, isError, data = [], error, refetch } = useQuery(
        ['categorias'],
        ()=> getAcoesPDDECategorias(),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );
    return {isLoading, isError, data, error, refetch}
}
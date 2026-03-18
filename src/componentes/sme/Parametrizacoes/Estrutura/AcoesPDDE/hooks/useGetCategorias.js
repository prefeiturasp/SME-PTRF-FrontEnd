import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetCategorias = () => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['categorias'],
        queryFn: ()=> getAcoesPDDECategorias(),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    return {isLoading: isFetching, isError, data, error, refetch}
}
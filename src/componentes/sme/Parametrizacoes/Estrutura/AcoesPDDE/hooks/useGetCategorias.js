import { useQuery } from "@tanstack/react-query";
import { getAcoesPDDECategorias } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetCategorias = () => {
    const { status, isError, data = [], error, refetch } = useQuery({
        queryKey: ['categorias'],
        queryFn: ()=> getAcoesPDDECategorias(),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    return {isLoading: status === 'loading', isError, data, error, refetch}
}
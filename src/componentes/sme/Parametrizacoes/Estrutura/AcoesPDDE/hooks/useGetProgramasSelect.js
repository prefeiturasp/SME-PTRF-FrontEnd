import { useQuery } from "@tanstack/react-query";
import { getProgramasPDDESelect } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetProgramasSelect = () => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['programas-pdde', 'select'],
        queryFn: () => getProgramasPDDESelect(),
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });
    return {isLoading: isFetching, isError, data, error, refetch}
}

import { getOpcoesStatusValoresReprogramados } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetStatusValoresReprogramadosAssociacaoFormulario = () => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['opcoes-status-valores-reprogramados-associacoes-parametrizacoes'],
        queryFn: () => getOpcoesStatusValoresReprogramados(),
        keepPreviousData: false,
        staleTime: 5000,
        refetchOnWindowFocus: false,
        retry: 0,
    });

    return {isLoading: isFetching, isError, data, error, refetch}

}

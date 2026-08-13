import { getParametrizacoesAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useGetAssociacaoListagem = ({ filters }) => {
    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['listagem-associacoes-parametrizacoes', filters],
        queryFn: ()=> {
            return getParametrizacoesAssociacoes(
                filters.page,
                filters.tipo_ue,
                filters.dre,
                filters.associacao,
                filters.informacao,
                filters.recurso_uuid
            )
        },
        keepPreviousData: false,
        staleTime: 5000,
        refetchOnWindowFocus: false,
        retry: 0,
    });

    const count = useMemo(() => data.count, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, count}

}

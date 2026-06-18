import { getComissoes } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useComissoesContext } from "./useComissoesContext";

export const useGetComissoes = () => {

    const { filter } = useComissoesContext();

    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['comissoes', filter, filter?.page],
        queryFn: ()=> {
            return getComissoes({ ...filter }, filter?.page)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    const total = useMemo(() => data.count, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, total, count}

}
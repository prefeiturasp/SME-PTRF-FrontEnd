import { getDetalhesTiposCredito } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useDetalhesTiposCreditoContext } from "./useDetalhesTiposCreditoContext"; 

export const useGetDetalhesTiposCredito = () => {

    const { filter } = useDetalhesTiposCreditoContext();

    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['detalhes-tipos-credito', filter, filter.page, filter?.recurso_uuid],
        queryFn: () => {
            if (filter?.is_required_recurso_uuid && !filter?.recurso_uuid) {
                return Promise.resolve({count: 0, results: []});
            }

            return getDetalhesTiposCredito({...filter, recurso_uuid: filter?.recurso_uuid}, filter.page)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    const total = useMemo(() => data.count, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, total, count}

}
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getParametrizacoesAcoesAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetAcoesAssociacoes = ({ filters }) => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['acoes-associacoes-parametrizacoes', filters],
        queryFn: ()=> {
            if (filters?.is_required_recurso_uuid && !filters?.recurso_uuid) {
                return Promise.resolve({ count: 0, results: [], isLoading: false });
            }

            return getParametrizacoesAcoesAssociacoes(filters.page, filters.filtrar_por_nome_cod_eol, filters.filtrar_por_acao, filters.filtrar_por_status, filters.filtro_informacoes, filters.recurso_uuid);
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: false,
    });

    const count = useMemo(() => data.count, [data]);
    const results = useMemo(() => data?.results || [], [data]);

    return {isLoading: isFetching, isError, data, error, refetch, count, results};
}
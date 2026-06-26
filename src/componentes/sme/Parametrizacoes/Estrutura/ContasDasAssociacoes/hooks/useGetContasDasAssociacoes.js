import {getContasAssociacoesFiltros} from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {useContasDasAssociacoesContext} from "../hooks/useContasDasAssociacoesContext";

export const useGetContasDasAssociacoes = () => {

    const {filter} = useContasDasAssociacoesContext();

    const {isFetching, isError, data = {count: 0, results: []}, error, refetch} = useQuery({
        queryKey: ['contas-associacoes', filter?.recurso_uuid, filter?.associacao_nome, filter?.tipo_conta_uuid, filter?.status, filter?.page],
        queryFn: () => {
            if (filter?.is_required_recurso_uuid && !filter?.recurso_uuid) {
                return Promise.resolve({count: 0, results: []});
            }

            return getContasAssociacoesFiltros(filter?.page, filter.associacao_nome, filter?.tipo_conta_uuid, filter?.status, filter?.recurso_uuid)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: false, // Caso saia da aba e voltar ele refaz a requisição
    });

    const total = useMemo(() => data.count, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, total, count}

}
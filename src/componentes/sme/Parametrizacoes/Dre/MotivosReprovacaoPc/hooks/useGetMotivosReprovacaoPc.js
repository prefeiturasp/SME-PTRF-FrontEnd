import { getMotivosReprovacaoPc } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useMotivosReprovacaoPcContext } from "./useMotivoReprovacaoContext";

export const useGetMotivosReprovacaoPc = (params) => {

    const {filter, currentPage} = useMotivosReprovacaoPcContext();

    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['motivos-reprovacao-pc', filter, currentPage, params?.recurso_uuid],
        queryFn: ()=> {
            if (params?.is_required_recurso_uuid && !params?.recurso_uuid) {
                return Promise.resolve({count: 0, results: []});
            }

            return getMotivosReprovacaoPc({...filter, recurso_uuid: params?.recurso_uuid}, currentPage)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    const total = useMemo(() => data.count, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, total, count}

}
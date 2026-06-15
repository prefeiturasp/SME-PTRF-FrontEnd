import { getMotivosAprovacaoPcRessalva } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";

export const useGetMotivosAprovacaoPcRessalva = () => {

    const {filter} = useContext(MotivosAprovacaoPcRessalvaContext)

    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['motivos-aprovacao-pc-ressalva', filter],
        queryFn: ()=> {
            if (filter?.is_required_recurso_uuid && !filter?.recurso) {
                return {count: 0, results: []}
            }

            return getMotivosAprovacaoPcRessalva(filter, filter.page)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    const totalMotivosAprovacaoPcRessalva = useMemo(() => data.count, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, totalMotivosAprovacaoPcRessalva, count}

}
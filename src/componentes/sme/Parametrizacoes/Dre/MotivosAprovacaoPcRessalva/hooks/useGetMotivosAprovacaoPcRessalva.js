import { getMotivosAprovacaoPcRessalva } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { MotivosAprovacaoPcRessalvaContext } from "../context/MotivosAprovacaoPcRessalva";

export const useGetMotivosAprovacaoPcRessalva = () => {

    const {filter, currentPage} = useContext(MotivosAprovacaoPcRessalvaContext)

    const { isLoading, isError, data = {count: 0, results: []}, error, refetch } = useQuery(
        ['motivos-aprovacao-pc-ressalva', filter, currentPage],
        ()=> getMotivosAprovacaoPcRessalva(filter, currentPage),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    const totalMotivosAprovacaoPcRessalva = useMemo(() => data.count, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading, isError, data, error, refetch, totalMotivosAprovacaoPcRessalva, count}

}
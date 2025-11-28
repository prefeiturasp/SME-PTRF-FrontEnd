import { getMotivosDevolucaoTesouro } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";

export const useGetMotivosDevolucaoTesouro = () => {

    const {filter, currentPage} = useContext(MotivosDevolucaoTesouroContext)

    const { status, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['motivos-devolucao-tesouro-list', filter, currentPage],
        queryFn: ()=> getMotivosDevolucaoTesouro(filter, currentPage),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    const totalMotivosDevolucaoTesouro = useMemo(() => data.count, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading: status === 'loading', isError, data, error, refetch, totalMotivosDevolucaoTesouro, count}

}
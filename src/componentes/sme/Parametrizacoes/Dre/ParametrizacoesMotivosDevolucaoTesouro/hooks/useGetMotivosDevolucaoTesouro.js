import { getMotivosDevolucaoTesouro } from "../../../../../../services/MotivosDevolucaoTesouro.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { MotivosDevolucaoTesouroContext } from "../context/MotivosDevolucaoTesouro";

export const useGetMotivosDevolucaoTesouro = () => {

    const {filter, currentPage} = useContext(MotivosDevolucaoTesouroContext)

    const { isLoading, isError, data = {count: 0, results: []}, error, refetch } = useQuery(
        ['motivos-devolucao-tesouro-list', filter, currentPage],
        ()=> getMotivosDevolucaoTesouro(filter, currentPage),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    const totalMotivosDevolucaoTesouro = useMemo(() => data.count, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading, isError, data, error, refetch, totalMotivosDevolucaoTesouro, count}

}
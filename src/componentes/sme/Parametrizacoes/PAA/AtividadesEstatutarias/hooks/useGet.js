import { getAtividadesEstatutarias } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { AtividadesEstatutariasContext } from "../context/index";

export const useGet = () => {

    const {filter, currentPage, rowsPerPage} = useContext(AtividadesEstatutariasContext)

    const { status, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['atividades-estatutarias', filter, currentPage, rowsPerPage],
        queryFn: ()=> getAtividadesEstatutarias({...filter, pagination: 'false'}),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true,
    });

    const count = useMemo(() => data.count, [data]);
    const total = useMemo(() => data.results.length, [data]);

    return {isLoading: status === 'loading', isError, data, error, refetch, count, total}

}
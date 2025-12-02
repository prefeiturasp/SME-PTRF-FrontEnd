import { getRepasses } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { RepassesContext } from "../context/Repasse";

export const useGetRepasses = () => {

    const {filter, currentPage} = useContext(RepassesContext)

    const { status, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['repasses-list', filter, currentPage],
        queryFn: ()=> getRepasses(filter, currentPage),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    const totalRepasses = useMemo(() => data.length, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading: status === 'loading', isError, data, error, refetch, totalRepasses, count}

}
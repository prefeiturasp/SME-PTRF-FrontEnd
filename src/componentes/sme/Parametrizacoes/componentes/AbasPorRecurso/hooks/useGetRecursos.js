import { getRecursos } from "../../../../../../services/AlterarRecurso.service";
import {useQuery} from "@tanstack/react-query";

export const useGetRecursos = () => {

    const { isFetching, isError, data = [], error, fetchStatus} = useQuery({
        queryKey: ['recursos'],
        queryFn: () => getRecursos(),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return {isLoading: isFetching, isError, data, error, fetchStatus}

}
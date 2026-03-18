import {getMandatoMaisRecente} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";

export const useGetMandatoMaisRecente = () => {

    const { isFetching, isError, data = [], error, fetchStatus} = useQuery({
        queryKey: ['mandato-mais-recente'],
        queryFn: ()=> getMandatoMaisRecente(),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return {isLoading: isFetching, isError, data, error, fetchStatus}

}
import {getMandatoMaisRecente} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";

export const useGetMandatoMaisRecente = () => {

    const { status, isError, data = [], error, fetchStatus} = useQuery({
        queryKey: ['mandato-mais-recente'],
        queryFn: ()=> getMandatoMaisRecente(),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return {isLoading: status === 'loading', isError, data, error, fetchStatus, status}

}
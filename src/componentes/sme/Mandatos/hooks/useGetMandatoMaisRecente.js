import {getMandatoMaisRecente} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";

export const useGetMandatoMaisRecente = () => {

    const { isLoading, isError, data = [], error, fetchStatus , status} = useQuery(
        ['mandato-mais-recente'],
        ()=> getMandatoMaisRecente(),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    return {isLoading, isError, data, error, fetchStatus, status}

}
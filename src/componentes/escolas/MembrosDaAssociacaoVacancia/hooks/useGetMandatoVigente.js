import {getMandatoVigente} from "../../../../services/MandatosVacancia.service";
import {useQuery} from "@tanstack/react-query";

export const useGetMandatoVigente = () => {

    const { isFetching, isError, data = {uuid: null } } = useQuery({
        queryKey: ['mandato-vigente-vacancia'],
        queryFn: ()=> getMandatoVigente(),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });


    return {isLoading: isFetching, isError, data}

}
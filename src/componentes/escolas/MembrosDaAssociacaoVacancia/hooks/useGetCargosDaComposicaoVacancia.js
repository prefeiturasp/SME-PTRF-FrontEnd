import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { getCargosDaComposicaoVacancia } from "../../../../services/MandatosVacancia.service";


export const useGetCargosDaComposicaoVacancia = (composicao_uuid, data = moment().format('YYYY-MM-DD') ) => {
    const { isFetching, isError, data: cargos, error } = useQuery({
        queryKey: ['cargos-da-composicao-vacancia', composicao_uuid, data],
        queryFn: ()=> getCargosDaComposicaoVacancia(composicao_uuid, data),
        enabled: !!composicao_uuid,
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return { isLoading: isFetching, isError, data: cargos, error }
}
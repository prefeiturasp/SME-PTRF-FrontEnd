import { getComposicaoVigenteVacancia } from "../../../../services/MandatosVacancia.service";
import { useQuery } from "@tanstack/react-query";
import { visoesService } from "../../../../services/visoes.service";

export const useGetComposicaoVigenteVacancia = (mandato_uuid) => {
    const associacao_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')

    const { isFetching, isError, data = {uuid: null}, error } = useQuery({
        queryKey: ['composicao-vigente-vacancia', associacao_uuid, mandato_uuid],
        queryFn: ()=> getComposicaoVigenteVacancia(associacao_uuid, mandato_uuid),
        enabled: !!mandato_uuid,
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    })

    return { isLoading: isFetching, isError, data, error}
}
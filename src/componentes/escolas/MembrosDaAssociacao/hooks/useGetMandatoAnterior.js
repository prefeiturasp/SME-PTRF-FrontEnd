import {getMandatoAnterior} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";
import {useContext, useMemo} from "react";
import {MembrosDaAssociacaoContext} from "../context/MembrosDaAssociacao";
import {visoesService} from "../../../../services/visoes.service";

export const useGetMandatoAnterior = () => {

    const {mandatoUuid} = useContext(MembrosDaAssociacaoContext)
    const associacao_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')

    const {isLoading, isError, data = {uuid: null, composicoes: [] }, error} = useQuery({
        queryKey: ['retrieve-mandato-com-composicoes', mandatoUuid, associacao_uuid],
        queryFn: ()=> getMandatoAnterior(mandatoUuid, associacao_uuid),
        // The query will not execute until the mandatoUuid exists
        enabled: !!mandatoUuid, // Só excecuta a query caso exista o mandatoUuid
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    })

    const count = useMemo(() => data.composicoes.length, [data]);

    return {isLoading, isError, data, error, count}
}
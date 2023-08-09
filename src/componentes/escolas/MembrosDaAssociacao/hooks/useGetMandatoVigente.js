import {getMandatoVigente} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {visoesService} from "../../../../services/visoes.service";

export const useGetMandatoVigente = () => {

    const associacao_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')

    const { isLoading, isError, data = {uuid: null, composicoes: [] }, error } = useQuery(
        ['mandato-vigente', associacao_uuid],
        ()=> getMandatoVigente(associacao_uuid),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    const count = useMemo(() => data.composicoes.length, [data]);

    return {isLoading, isError, data, error, count}

}
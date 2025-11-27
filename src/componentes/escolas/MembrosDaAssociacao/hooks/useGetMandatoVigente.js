import {getMandatoVigente} from "../../../../services/Mandatos.service";
import {useQuery} from "@tanstack/react-query";
import {useMemo} from "react";
import {visoesService} from "../../../../services/visoes.service";

export const useGetMandatoVigente = () => {

    const associacao_uuid = visoesService.getItemUsuarioLogado('associacao_selecionada.uuid')

    const { status, isError, data = {uuid: null, composicoes: [] }, error } = useQuery({
        queryKey: ['mandato-vigente', associacao_uuid],
        queryFn: ()=> getMandatoVigente(associacao_uuid),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição

    });

    const count = useMemo(() => data.composicoes.length, [data]);

    return {isLoading: status === 'loading', isError, data, error, count}

}
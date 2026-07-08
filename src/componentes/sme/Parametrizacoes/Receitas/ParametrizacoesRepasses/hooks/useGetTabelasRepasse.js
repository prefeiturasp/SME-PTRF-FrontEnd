import { getTabelasRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";

export const useGetTabelasRepasse = ({ filters, solicitacao_sme }) => {
    
    const { isFetching, isError, data, refetch } = useQuery({
        queryKey: ['tabelas-repasse-list', filters?.recurso_uuid],
        queryFn: () => getTabelasRepasse({
            recurso_uuid: filters?.recurso_uuid,
            solicitacao_sme
        }),
        keepPreviousData: true,
        staleTime: 1000 * 60 * 60, // 1 hora - dados permanecem frescos por 1 hora
        refetchOnWindowFocus: false, // Não refaz requisição ao voltar à aba
        enabled: filters.recurso_uuid !== '', // Evita requisição quando recurso_uuid está vazio
    });

    return {isLoading: isFetching, isError, data, refetch}
}
import { getTabelasRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";

export const useGetTabelasRepasse = ({ filters }) => {

    const { isFetching, isError, data, refetch } = useQuery({
        queryKey: ['tabelas-repasse-list', filters?.recurso_uuid],
        queryFn: () => getTabelasRepasse(filters?.recurso_uuid),
        keepPreviousData: true,
        staleTime: 1000 * 60 * 60, // 1 hora - dados permanecem frescos por 1 hora
        refetchOnWindowFocus: false, // Não refaz requisição ao voltar à aba
    });

    return {isLoading: isFetching, isError, data, refetch}
}
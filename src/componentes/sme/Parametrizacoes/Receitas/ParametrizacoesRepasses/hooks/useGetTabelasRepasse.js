import { getTabelasRepasse } from "../../../../../../services/sme/Parametrizacoes.service";
import {useQuery} from "@tanstack/react-query";

export const useGetTabelasRepasse = ({ filters }) => {

    const { isFetching, isError, data, refetch } = useQuery({
        queryKey: ['tabelas-repasse-list', filters?.recurso_uuid],
        queryFn: () => getTabelasRepasse(filters?.recurso_uuid),
        keepPreviousData: true,
    });

    return {isLoading: isFetching, isError, data, refetch}
}
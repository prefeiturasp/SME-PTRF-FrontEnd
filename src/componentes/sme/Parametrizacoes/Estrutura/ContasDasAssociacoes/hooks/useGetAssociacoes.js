import { useQuery } from "@tanstack/react-query";
import { getAssociacoes } from "../../../../../../services/sme/Parametrizacoes.service";

export const useGetAssociacoes = ({ filters }) => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['associacoes-parametrizacoes-contas', filters?.recurso_uuid],
        queryFn: () => {
            if (filters?.is_required_recurso_uuid && !filters?.recurso_uuid) {
                return Promise.resolve([]);
            }

            return getAssociacoes(filters.recurso_uuid);
        },
        keepPreviousData: true,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });

    return {isLoading: isFetching, isError, data, error, refetch};
}

import { getAssociacaoPorUuid } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetByUUIDAssociacaoFormulario = ({ uuid, initializerStateForm }) => {
    const { isFetching, isError, data = null, error, refetch } = useQuery({
        queryKey: ['by-uuid-associacoes-parametrizacoes', uuid],
        queryFn: async () => {
            let response = null

            if (uuid) {
                response = await getAssociacaoPorUuid(uuid);
            }

            initializerStateForm(response);

            return response;
        },
        keepPreviousData: false,
        staleTime: 5000,
        refetchOnWindowFocus: false,
        retry: 0,
    });

    return {isLoading: isFetching, isError, data, error, refetch}

}

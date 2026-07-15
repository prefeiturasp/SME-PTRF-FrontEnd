import { useQuery } from "@tanstack/react-query";
import { getComissaoResponsavelPC } from "../../../../services/dres/Comissoes.service";

export const useGetComissaoResponsavelPC = ({ recurso_uuid }) => {
    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['comissao-responsavel-pc', recurso_uuid],
        queryFn: ()=> {
            if (!recurso_uuid) {
                return Promise.resolve({});
            }

            return getComissaoResponsavelPC(recurso_uuid)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: false, // Caso saia da aba e voltar ele refaz a requisição
        retry: 0,
    });

    return {isLoading: isFetching, isError, data, error, refetch}
}
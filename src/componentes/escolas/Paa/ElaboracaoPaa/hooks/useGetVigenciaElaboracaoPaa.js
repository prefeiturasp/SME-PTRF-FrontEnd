import { useQuery } from "@tanstack/react-query";
import { buscarVigenciaCompleta } from "../utils/buscarVigenciaCompleta";

export const useGetVigenciaElaboracaoPaa = (associacaoUuid) => {
    const { data, isFetching, isError } = useQuery({
        queryKey: ["vigenciaElaboracaoPaa", associacaoUuid],
        queryFn: () => buscarVigenciaCompleta(associacaoUuid),
        enabled: !!associacaoUuid,
        staleTime: 0,
        gcTime: 0,
        refetchOnWindowFocus: false,
    });
    return { vigencia: data, isLoading: isFetching, isError };
};

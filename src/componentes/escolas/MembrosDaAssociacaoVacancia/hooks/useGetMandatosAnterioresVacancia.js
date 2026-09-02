import { useQuery } from "@tanstack/react-query";
import { getMandatosAnterioresVacancia } from "../../../../services/MandatosVacancia.service";

export const useGetMandatosAnterioresVacancia = () => {
    const { isFetching, isError, data = [], error } = useQuery({
        queryKey: ['mandatos-anteriores-vacancia'],
        queryFn: () => getMandatosAnterioresVacancia(),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return { isLoading: isFetching, isError, data, error }
}

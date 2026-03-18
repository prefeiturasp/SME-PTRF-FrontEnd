import { getObjetivosTabelasPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTabelas = () => {

    const { isFetching, isError, data = {}, error, refetch } = useQuery({
        queryKey: ['objetivos-tabelas-paa'],
        queryFn: ()=> getObjetivosTabelasPaa(),
        keepPreviousData: true,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
    });

    return { isLoading: isFetching, isError, data, error, refetch}
}
import { getAtividadesEstatutariasTabelas } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTabelas = () => {

    const { isLoading, isError, data = {}, error, refetch } = useQuery(
        ['atividades-estatutarias-tabelas'],
        ()=> getAtividadesEstatutariasTabelas(),
        {
            keepPreviousData: true,
            staleTime: 1000 * 60 * 60,
            refetchOnWindowFocus: false,
        }
    );

    return {isLoading, isError, data, error, refetch}

}
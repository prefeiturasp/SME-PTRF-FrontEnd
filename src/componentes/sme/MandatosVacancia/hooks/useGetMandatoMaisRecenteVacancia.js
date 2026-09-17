import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getMandatoMaisRecenteVacancia } from "../../../../services/MandatosVacancia.service";

export const useGetMandatoMaisRecenteVacancia = () => {
    const { isFetching, isError, data, error } = useQuery({
        queryKey: ['mandato-mais-recente-vacancia'],
        queryFn: () => getMandatoMaisRecenteVacancia(),
        placeholderData: keepPreviousData,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });

    return { isLoading: isFetching, isError, data, error }
}

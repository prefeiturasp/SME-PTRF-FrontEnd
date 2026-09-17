import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getMandatosVacancia } from '../../../../services/MandatosVacancia.service';

export const useGetMandatosVacancia = (referencia, currentPage) => {
    const { isLoading, isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['mandatos-vacancia-list', referencia, currentPage],
        queryFn: () => getMandatosVacancia(referencia, currentPage),
        placeholderData: keepPreviousData,
        staleTime: 5000,
        refetchOnWindowFocus: false,
    });

    return { isLoading, isFetching, isError, data, error, refetch }
}
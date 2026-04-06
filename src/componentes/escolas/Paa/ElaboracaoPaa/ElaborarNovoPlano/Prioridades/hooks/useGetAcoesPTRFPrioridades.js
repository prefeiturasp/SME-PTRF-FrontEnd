import { useQuery } from "@tanstack/react-query";
import { getAcoesPTRFPrioridades } from "../../../../../../../services/escolas/Paa.service";

export const useGetAcoesPTRFPrioridades = ({paa_uuid, options={}}) => {
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["acoes-associacao-prioridades"],
    queryFn: () => getAcoesPTRFPrioridades(paa_uuid),
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: true,
    ...options
  });
  return { isLoading: isFetching, isError, data: data, error, refetch, isFetching };
};

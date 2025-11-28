import { useQuery } from "@tanstack/react-query";
import { getStatusGeracaoDocumentoPaa } from "../../../../../../../services/escolas/Paa.service";

export const useGetStatusGeracaoDocumentoPaa = (uuid) => {
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["statusGeracaoDocumento", uuid],
    queryFn: () => getStatusGeracaoDocumentoPaa(uuid),
    keepPreviousData: false,
    staleTime: 0,
    cacheTime: 0,
    refetchOnWindowFocus: false,
    enabled: !!uuid,
  });

  return { 
    isFetching, isError, error, data, refetch};
};

import { getReceitasPrevistasOutrosRecursosPeriodo } from "../../../../../../../services/escolas/Paa.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTodos = () => {
  const getPaaUUID = () => localStorage.getItem("PAA");
  const { isFetching, isError, data, error, refetch } = useQuery({
    queryKey: ["receitas-previstas-outros-recursos-periodo"],
    queryFn: () =>
      getReceitasPrevistasOutrosRecursosPeriodo(getPaaUUID(), {
        pagination: "false",
      }),
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: true,
  });
  return { isLoading: isFetching, isError, data, error, refetch };
};

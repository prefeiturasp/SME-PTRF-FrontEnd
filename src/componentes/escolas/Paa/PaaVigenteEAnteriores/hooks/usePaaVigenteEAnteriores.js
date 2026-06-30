import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPaaVigenteEAnteriores } from "../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const usePaaVigenteEAnteriores = (associacaoUuid) => {
  const {
    data = {},
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["paaVigenteEAnteriores", associacaoUuid],
    queryFn: () => getPaaVigenteEAnteriores(associacaoUuid),
    enabled: !!associacaoUuid,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0,
  });
  useEffect(() => {
    if (isError) {
      toastCustom.ToastCustomError(
        "Não foi possível carregar o PAA",
        error?.response?.data?.mensagem || "Falha ao carregar o PAA.",
      );
    }
  }, [isError, error]);

  return {
    data,
    isLoading: isPending,
    isError,
    error,
    refetch,
  };
};

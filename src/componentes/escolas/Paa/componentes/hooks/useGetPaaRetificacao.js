import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPaaRetificacao } from "../../../../../services/escolas/Paa.service";
import { useNavigate } from "react-router-dom";
import { toastCustom } from "../../../../Globais/ToastCustom";

export const useGetPaaRetificacao = (paaUuid) => {
  const navigate = useNavigate();

  const query = useQuery({
    queryKey: ["retrieve-paa-retificacao", paaUuid],
    queryFn: () => getPaaRetificacao(paaUuid),
    keepPreviousData: true,
    staleTime: 60000,
    gcTime: 60000,
    enabled: !!paaUuid,
    retry: false,
  });

  const { isError, error, isSuccess, data} = query;

  useEffect(() => {
    if (isError) {
      // Mensagem de Erro ao tentar carregar PAA Retificado
      toastCustom.ToastCustomError(
        "Não foi possível carregar o PAA de Retificação",
        error?.response?.data?.mensagem || "Verifique se ele existe ou tente novamente.",
      );

      // Adiciona redirecionamento para tela de PAA quando o paa não for encontrado como Retificação
      if (error.status === 404) {
        setTimeout(() => {
          toastCustom.ToastCustomSuccess("Redirecionando para tela de PAA");
        }, 1000)
        setTimeout(() => {
          navigate("/paa");
        }, 3000)
      }
    }
  }, [isError, error, navigate]);

  useEffect(() => {
      if (isSuccess) {
        const response = data;
        localStorage.setItem("PAA", response.uuid);
        localStorage.setItem("DADOS_PAA", JSON.stringify(response));
      }
    }, [isSuccess, data]);

  return query;
};

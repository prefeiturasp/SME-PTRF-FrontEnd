import { useQuery } from "@tanstack/react-query";
import { getEspecificacoesCapital, getEspecificacoesCusteio } from "../../../../../../../services/escolas/Despesas.service";

export const useGetEspecificacoes = (tipo, tipo_custeio = "") => {
  const {
    status,
    isError,
    data = [],
    error,
    refetch,
  } = useQuery({
    queryKey: ["especificacoes", tipo, tipo_custeio], 
    queryFn: () => {
      if (tipo === 'CAPITAL') {
        return getEspecificacoesCapital();
      } else if (tipo === 'CUSTEIO') {
        return getEspecificacoesCusteio(tipo_custeio);
      } else {
        throw new Error('Tipo inválido');
      }
    }, 
    keepPreviousData: true,
    staleTime: 5000,
    refetchOnWindowFocus: true,
    enabled: tipo === 'CAPITAL' || (tipo === 'CUSTEIO' && !!tipo_custeio), // Só executa se tipo for CAPITAL ou se for CUSTEIO com tipo_custeio preenchido
  });
  
  return { isLoading: status === "loading", isError, especificacoes: data, error, refetch };
};

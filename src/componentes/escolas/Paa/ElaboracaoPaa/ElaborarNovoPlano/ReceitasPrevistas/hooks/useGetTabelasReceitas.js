import { useQuery } from "@tanstack/react-query";
import { getTabelasReceita } from "../../../../../../../services/escolas/Receitas.service";

export const useGetTabelasReceitas = () => {
    const { isLoading, isError, data  = {data: {acoes_associacao: []}}, error, refetch } = useQuery(
        ['tabelas-receitas'],
        ()=> getTabelasReceita(),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    ); 
    return {isLoading, isError, data: data.data, error, refetch}

}
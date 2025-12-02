import {getPrestacaoContaReprovadaNaoApresentacao} from "../../../../../services/dres/PrestacaoDeContasReprovadaNaoApresentacao.service";
import {useQuery} from "@tanstack/react-query";

export const useGetPrestacaoContaReprovadaNaoApresentacao = (prestacao_conta_uuid) => {

    const { status, isError, data, error } = useQuery({
        queryKey: ['retrieve-prestacao-conta-reprovada-nao-apresentacao', prestacao_conta_uuid],
        queryFn: ()=> getPrestacaoContaReprovadaNaoApresentacao(prestacao_conta_uuid),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    return {isLoading: status === 'loading', isError, data, error}
  
}
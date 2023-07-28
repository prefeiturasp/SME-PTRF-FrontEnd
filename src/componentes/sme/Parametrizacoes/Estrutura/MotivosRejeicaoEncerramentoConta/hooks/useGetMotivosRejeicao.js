import { getMotivosRejeicaoEncerramentoConta} from "../../../../../../services/MotivosRejeicaoEncerramentoConta.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { MotivosRejeicaoContext } from "../context/MotivosRejeicao";

export const useGetMotivosRejeicao = () => {

    const {filter, currentPage} = useContext(MotivosRejeicaoContext)

    const { isLoading, isError, data = {count: 0, results: []}, error, refetch } = useQuery(
        ['motivos-rejeicao-list', filter, currentPage],
        ()=> getMotivosRejeicaoEncerramentoConta(filter, currentPage),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
        }
    );

    const totalMotivosRejeicao = useMemo(() => data.results.length, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading, isError, data, error, refetch, totalMotivosRejeicao, count}

}
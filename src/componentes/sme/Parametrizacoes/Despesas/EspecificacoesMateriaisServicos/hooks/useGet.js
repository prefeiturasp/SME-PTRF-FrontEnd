import { getEspecificacoesMateriaisServicos } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { MateriaisServicosContext } from "../context/MateriaisServicos";

export const useGet = () => {

    const {filter, currentPage} = useContext(MateriaisServicosContext)

    const { isLoading, isError, data = {count: 0, results: []}, error, refetch } = useQuery(
        ['especificacoes-materiais-servicos-list', filter, currentPage],
        ()=> getEspecificacoesMateriaisServicos(filter, currentPage),
        {
            keepPreviousData: true,
            staleTime: 5000,
            refetchOnWindowFocus: true,
        }
    );

    const total = useMemo(() => data.results.length, [data]);
    const count = useMemo(() => data.count, [data]);

    return {isLoading, isError, data, error, refetch, total, count}
}

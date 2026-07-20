import { getListaDeAcertosLancamentos, getAcertosLancamentosFiltrados } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { AcertosLancamentosContext } from "../context/AcertosLancamentos";

export const useGetAcertosLancamentos = () => {

    const { filter, currentPage } = useContext(AcertosLancamentosContext);

    // Verificar se há filtros aplicados
    const temFiltros = filter.filtrar_por_nome || 
                       filter.filtrar_por_categoria.length > 0 || 
                       filter.filtrar_por_ativo;

    const queryFn = async () => {
        if (temFiltros) {
            return await getAcertosLancamentosFiltrados(
                filter.filtrar_por_nome,
                filter.filtrar_por_categoria,
                filter.filtrar_por_ativo,
                filter.recurso_uuid
            );
        } else {
            return await getListaDeAcertosLancamentos(filter.recurso_uuid);
        }
    };

    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['acertos-lancamentos-list', filter, currentPage],
        queryFn: queryFn,
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true,
        enabled: filter.recurso_uuid !== '', // Habilita a query apenas se recurso_uuid não for vazio
    });

    const totalAcertos = useMemo(() => (data || []).length, [data]);

    return { isLoading: isFetching, isError, data: data || [], error, refetch, totalAcertos }
}

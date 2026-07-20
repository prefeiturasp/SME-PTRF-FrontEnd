import { getListaDeAcertosDocumentos, getAcertosDocumentosFiltrados } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { AcertosDocumentosContext } from "../context/AcertosDocumentos";

export const useGetAcertosDocumentos = () => {

    const { filter, currentPage } = useContext(AcertosDocumentosContext);

    // Verificar se há filtros aplicados
    const temFiltros = filter.filtrar_por_nome || 
                       filter.filtrar_por_categoria.length > 0 || 
                       filter.filtrar_por_ativo || 
                       filter.filtrar_por_documento_relacionado.length > 0;

    const queryFn = async () => {
        if (temFiltros) {
            return await getAcertosDocumentosFiltrados(
                filter.filtrar_por_nome,
                filter.filtrar_por_categoria,
                filter.filtrar_por_ativo,
                filter.filtrar_por_documento_relacionado.join(','),
                filter.recurso_uuid,
            );
        } else {
            return await getListaDeAcertosDocumentos(filter.recurso_uuid);
        }
    };

    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['acertos-documentos-list', filter, currentPage],
        queryFn: queryFn,
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true,
        enabled: filter.recurso_uuid !== '', // Evita requisição quando recurso_uuid está vazio
    });

    const totalAcertos = useMemo(() => (data || []).length, [data]);

    return { isLoading: isFetching, isError, data: data || [], error, refetch, totalAcertos }
}

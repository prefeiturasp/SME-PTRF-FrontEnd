import { getTabelaDocumento } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTabelasAcertosDocumentos = () => {

    const { isFetching, isError, data = { categorias: [], documentos: [] }, error } = useQuery({
        queryKey: ['acertos-documentos-tabelas'],
        queryFn: () => getTabelaDocumento(),
        keepPreviousData: true,
        staleTime: 30000, // 30 segundos
        refetchOnWindowFocus: false,
    });

    // Mapear documentos para garantir que têm IDs como string
    const processedData = {
        categorias: data.categorias || [],
        documentos: (data.documentos || []).map(doc => ({
            ...doc,
            id: String(doc.id)
        }))
    };

    return { isLoading: isFetching, isError, data: processedData, error }
}

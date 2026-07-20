import { getTabelaCategoria } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";

export const useGetTabelasAcertosLancamentos = (recurso_uuid) => {

    const { isFetching, isError, data = { categorias: [] }, error } = useQuery({
        queryKey: ['acertos-lancamentos-tabelas', recurso_uuid],
        queryFn: () => getTabelaCategoria(recurso_uuid),
        keepPreviousData: true,
        staleTime: 30000, // 30 segundos
        refetchOnWindowFocus: false,
        enabled: recurso_uuid !== '', // Habilita a query apenas se recurso_uuid não for vazio
    });

    const processedData = {
        categorias: data.categorias || [],
    };

    return { isLoading: isFetching, isError, data: processedData, error }
}

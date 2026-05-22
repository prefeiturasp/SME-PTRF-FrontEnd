import { getTiposDeCredito } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

const tratarFiltros = (valoresFiltros) => {
    const { e_repasse, e_estorno, e_devolucao, e_rendimento, tipo, unidades__uuid, classificacao, ...restoFiltros } = valoresFiltros;

    let filtrosTratados = { ...restoFiltros };

    if (unidades__uuid && typeof unidades__uuid === "object" && Object.keys(unidades__uuid).length > 0 && unidades__uuid.uuid) {
      filtrosTratados.unidades__uuid = unidades__uuid.unidade.uuid;
    }

    if (tipo === "e_repasse") {
        filtrosTratados.e_repasse = 1;
    } else if (tipo === "e_estorno") {
        filtrosTratados.e_estorno = 1;
    } else if (tipo === "e_devolucao") {
        filtrosTratados.e_devolucao = 1;
    } else if (tipo === "e_rendimento") {
        filtrosTratados.e_rendimento = 1;
    }

    if (classificacao === "aceita_capital") {
      filtrosTratados.aceita_capital = 1;
    } else if (classificacao === "aceita_custeio") {
      filtrosTratados.aceita_custeio = 1;
    } else if (classificacao === "aceita_livre") {
      filtrosTratados.aceita_livre = 1;
    }

    filtrosTratados.uso_associacao = 0

    return filtrosTratados;
};

export const useGetTiposCredito = (params) => {
    const { isFetching, isError, data = {count: 0, results: []}, error, refetch } = useQuery({
        queryKey: ['tipos-creditos', params?.filters, params?.currentPage, params?.filters?.recurso_uuid],
        queryFn: ()=> {
            if (!params?.filters?.recurso_uuid) {
                return Promise.resolve({count: 0, results: []});
            }
            
            return getTiposDeCredito(tratarFiltros({...params?.filters, recurso_uuid: params?.filters?.recurso_uuid}), params?.currentPage)
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição
    });

    const total = useMemo(() => data.count, [data]);
    const count = useMemo(() => data.count, [data]);
    const results = useMemo(() => data.results, [data]);

    return {isLoading: isFetching, isError, data, error, refetch, total, count, results}

}
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getPaaVigente } from "../../../../../services/sme/Parametrizacoes.service";

export const useGetPaaVigente = (associacao_uuid) => {
    const { isLoading, isError, data = null, error, refetch, isNotFoundError, isServerError } = useQuery(
        ['paa_vigente'],
        ()=> getPaaVigente(associacao_uuid),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            refetchOnWindowFocus: true, // Caso saia da aba e voltar ele refaz a requisição,
            retry: false
        },
    );
    return {isLoading, isError, data, error, refetch, isNotFoundError, isServerError}
}
import { getMotivosEstorno } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useMotivosEstornoContext } from "./useMotivosEstornoContext";

export const useGetMotivosEstorno = () => {
    const { filter } = useMotivosEstornoContext();

    const {
        isFetching,
        isError,
        data = [],
        error,
        refetch,
    } = useQuery({
        queryKey: [
            "motivos-estorno",
            filter?.recurso_uuid,
            filter?.motivo,
            filter?.page,
        ],
        queryFn: () => {
            if (filter?.is_required_recurso_uuid && !filter?.recurso_uuid) {
                return Promise.resolve([]);
            }

            return getMotivosEstorno(filter);
        },
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
    });

    const count = useMemo(() => data.length, [data]);

    return { isLoading: isFetching, isError, data, error, refetch, count };
};

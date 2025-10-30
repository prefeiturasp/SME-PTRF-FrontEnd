import { getAcoesPTRFPaa } from "../../../../../../services/sme/Parametrizacoes.service";
import { useQuery } from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { AcoesPTRFPaaContext } from "../context/index";

export const useGet = () => {

    const {filter, currentPage, rowsPerPage} = useContext(AcoesPTRFPaaContext)

    const { isLoading, isError, data = [], error, refetch } = useQuery(
        ['acoes-ptrf-paa', filter, currentPage, rowsPerPage],
        ()=> getAcoesPTRFPaa(filter, currentPage, rowsPerPage),
        {
            keepPreviousData: true,
            staleTime: 5000,
            refetchOnWindowFocus: true,
        }
    );

    const count = useMemo(() => data.length, [data]);
    const total = useMemo(() => data.length, [data]);

    return {isLoading, isError, data, error, refetch, count, total}

}
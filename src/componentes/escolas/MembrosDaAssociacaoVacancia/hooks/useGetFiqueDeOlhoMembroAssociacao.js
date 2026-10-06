import { useQuery } from "@tanstack/react-query";
import { getFiqueDeOlho } from "../../../../services/FiqueDeOlho.service.js";
import { useRecursoSelecionadoContext } from "../../../../context/RecursoSelecionado/index.js";
import { TEXTOS_FIQUE_DE_OLHO } from "../../../../constantes/textosFiqueDeOlho.js";

export const useGetFiqueDeOlhoMembroAssociacao = () => {
    const { recursoSelecionado } = useRecursoSelecionadoContext();
    const recurso_uuid = recursoSelecionado?.uuid;

     const { isFetching, isError, data = [], error } = useQuery({
        queryKey: ["fiqueDeOlhoMembrosAssociacao", recurso_uuid],
        queryFn: () => getFiqueDeOlho(TEXTOS_FIQUE_DE_OLHO.UE_HISTORICO_MEMBROS, recurso_uuid),
        enabled: !!recurso_uuid,
        staleTime: 5 * 60 * 1000,
        keepPreviousData: true,
        refetchOnWindowFocus: true,
    });
    return { isFetching, isError, data, error };
};

import {useQuery} from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { GestaoDeUsuariosAdicionarUnidadeContext } from "../context/GestaoUsuariosAdicionarUnidadeProvider";
import { getUnidadesDisponiveisInclusao } from "../../../../services/GestaoDeUsuarios.service";

export const useUnidadesDisponiveisInclusao = (usuario) => {
    const { search, submitFiltro, currentPage } = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
    
    const { status, isError, data = {count: 0, results: []}, error, refetch, isFetching } = useQuery({
        queryKey: ['unidades-disponiveis-inclusao', currentPage],
        queryFn: () => getUnidadesDisponiveisInclusao(usuario.username, search, currentPage),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        enabled: !!usuario && submitFiltro, // Só excecuta a query caso exista o usuario
        refetchOnWindowFocus: false,
    });

    const count = useMemo(() => data.count, [data]);
    return {isLoading: status === 'loading', isError, isFetching, data, error, count};
}
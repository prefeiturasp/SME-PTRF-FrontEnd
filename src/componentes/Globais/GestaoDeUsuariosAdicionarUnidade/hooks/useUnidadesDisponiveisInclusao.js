import {useQuery} from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { GestaoDeUsuariosAdicionarUnidadeContext } from "../context/GestaoUsuariosAdicionarUnidadeProvider";
import { getUnidadesDisponiveisInclusao } from "../../../../services/GestaoDeUsuarios.service";

export const useUnidadesDisponiveisInclusao = (usuario) => {
    const { search, submitFiltro, currentPage } = useContext(GestaoDeUsuariosAdicionarUnidadeContext);
    
    const { isLoading, isError, data = {count: 0, results: []}, error, refetch, isFetching } = useQuery(
        ['unidades-disponiveis-inclusao', currentPage],
        () => getUnidadesDisponiveisInclusao(usuario.username, search, currentPage),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            enabled: !!usuario && submitFiltro, // Só excecuta a query caso exista o usuario
            refetchOnWindowFocus: false,
        }
    );

    const count = useMemo(() => data.count, [data]);
    return {isLoading, isError, isFetching, data, error, count};
}
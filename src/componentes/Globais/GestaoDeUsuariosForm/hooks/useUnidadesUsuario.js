import {useQuery} from "@tanstack/react-query";
import { useMemo } from "react";
import { getUnidadesUsuario } from "../../../../services/GestaoDeUsuarios.service";

export const useUnidadesUsuario = (usuario, visao_base, uuid_unidade) => {

    const { isFetching, isError, data = [], error, refetch } = useQuery({
        queryKey: ['unidades-usuario-list'],
        queryFn: () => getUnidadesUsuario(usuario.username, visao_base, uuid_unidade),
        keepPreviousData: true,
        staleTime: 5000, // 5 segundos
        enabled: !!usuario && visao_base!=='UE', // Só excecuta a query caso exista o usuario
    });
    
    const count = useMemo(() => data.length, [data]);
    return {isLoading: isFetching, isError, data, error, count, refetch};
}
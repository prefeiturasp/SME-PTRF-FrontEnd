import {useQuery} from "@tanstack/react-query";
import { useContext, useMemo } from "react";
import { UnidadesUsuarioContext } from "../context/UnidadesUsuarioProvider";
import { getUnidadesUsuario } from "../../../../services/GestaoDeUsuarios.service";

export const useUnidadesUsuario = (usuario, visao_base, uuid_unidade) => {

    const { isLoading, isError, data = [], error, refetch } = useQuery(
        ['unidades-usuario-list'],
        () => getUnidadesUsuario(usuario.username, visao_base, uuid_unidade),
        {
            keepPreviousData: true,
            staleTime: 5000, // 5 segundos
            enabled: !!usuario && visao_base!=='UE', // Só excecuta a query caso exista o usuario
        }
    );
    
    const count = useMemo(() => data.length, [data]);
    return {isLoading, isError, data, error, count, refetch};
}
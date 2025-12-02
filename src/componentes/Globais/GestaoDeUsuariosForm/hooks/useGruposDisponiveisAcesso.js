
import {useQuery} from '@tanstack/react-query';
import {useMemo} from "react";
import {getGruposDisponiveisAcessoUsuario} from '../../../../services/GestaoDeUsuarios.service';

export const useGruposDisponiveisAcesso = (usuario, visao_base, uuid_unidade)  => {
  const { status, isError, data = [], error, refetch } = useQuery({
    queryKey: ['grupos-disponiveis-acesso-usuario'],
    queryFn: () => getGruposDisponiveisAcessoUsuario(usuario.username, visao_base, uuid_unidade),
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
    enabled: !!usuario, // Só excecuta a query caso exista o usuario
  });

  const count = useMemo(() => data.length, [data]);
  return {isLoading: status === 'loading', isError, data, error, count, refetch};
};

import {getGrupos} from '../../../../services/GestaoDeUsuarios.service';
import {useQuery} from '@tanstack/react-query';

export const useGruposAcesso = ()  => {
  async function getGruposAcesso() {
    try {
      return await getGrupos();
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return useQuery(['grupos-acesso-list'], getGruposAcesso, {
    keepPreviousData: true,
  });
};

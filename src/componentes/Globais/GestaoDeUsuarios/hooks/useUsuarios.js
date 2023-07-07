import {getUsuarios} from '../../../../services/GestaoDeUsuarios.service';
import {useQuery} from '@tanstack/react-query';

export const useUsuarios = ()  => {
  async function getUsuariosList() {
    try {
      const response = await getUsuarios();
      console.log('response:', response)
      return response
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return useQuery(['usuarios-list'], getUsuariosList, {
    keepPreviousData: true,
  });
};

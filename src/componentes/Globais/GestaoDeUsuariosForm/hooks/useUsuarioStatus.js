
import {useQuery} from '@tanstack/react-query';
import {getUsuarioStatus} from "../../../../services/GestaoDeUsuarios.service";

export const useUsuarioStatus = (username, e_servidor, uuid_unidade)  => {
  async function getUsuarioStatusFromApi() {
    if (!username || !e_servidor || !uuid_unidade) return null;
    try {
      const result = await getUsuarioStatus(username, e_servidor, uuid_unidade)
      console.log('Usuario Status: ', result)
      return result;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return useQuery(['usuario-status', username, e_servidor, uuid_unidade], getUsuarioStatusFromApi, {
    staleTime: 5000, // 5 segundos
  });
};

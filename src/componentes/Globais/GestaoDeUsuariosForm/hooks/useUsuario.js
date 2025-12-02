
import {useQuery} from '@tanstack/react-query';
import {getUsuarioById} from "../../../../services/GestaoDeUsuarios.service";

export const useUsuario = (id)  => {
  async function getUsuario() {
    if (!id) return null;
    try {
      const result = await getUsuarioById(id)
      return result;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  return useQuery({
    queryKey: ['usuario-form', id],
    queryFn: getUsuario,
    keepPreviousData: true,
    staleTime: 5000, // 5 segundos
  });
};

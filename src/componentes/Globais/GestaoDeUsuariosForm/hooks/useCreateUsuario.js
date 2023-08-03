
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {postUsuario} from "../../../../services/GestaoDeUsuarios.service";

export const useCreateUsuario = (payload)  => {
  async function createUsuario(payload) {
    if (!payload) return null;
    try {
      const result = await postUsuario(payload)
      return result;
    } catch (error) {
      throw new Error(String(error));
    }
  }

  const queryClient = useQueryClient();

  return useMutation(payload => {
    return createUsuario(payload)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries("usuarios-list");
    },
  })
};

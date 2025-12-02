
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {putUsuario} from "../../../../services/GestaoDeUsuarios.service";

export const useUpdateUsuario = (id, payload)  => {
  async function updateUsuario(id, payload) {
    if (!payload) return null;
    try {
      const result = await putUsuario(id, payload)
      return result;
    } catch (error) {
        console.log('Erro em updateUsuario: ', error)
      throw new Error(String(error));
    }
  }

  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({id, payload}) => {
      return updateUsuario(id, payload)
    },
    onSuccess: () => {
      queryClient.invalidateQueries("usuarios-list");
      console.log('Usuario atualizado com sucesso!')
    },
    onError: (error) => {
      console.log('Erro ao atualizar o usuario: ', error)
    }
  })
};

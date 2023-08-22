
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {removerAcessosUnidadeBase} from "../../../../services/GestaoDeUsuarios.service";

export const useRemoveAcessosUsuario = (id, uuidUnidadeBase)  => {
  async function updateUsuario(id, uuidUnidadeBase, payload) {
    if (!payload) return null;
    try {
      const result = await removerAcessosUnidadeBase(id, uuidUnidadeBase)
      return result;
    } catch (error) {
        console.log('Erro ao remover acessos à unidade base e subordinadas: ', error)
      throw new Error(String(error));
    }
  }

  const queryClient = useQueryClient();

  return useMutation( ({id, uuidUnidadeBase}) => {
    return updateUsuario(id, uuidUnidadeBase)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios-list", "usuario-form"]);
      console.log('Acessos removidos com sucesso!')
    },
    onError: (error) => {
      console.log('Erro ao remover acessos do usuario: ', error)
    }
  })
};

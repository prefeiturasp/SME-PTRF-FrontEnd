
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {removerAcessosUnidadeBase} from "../../../../services/GestaoDeUsuarios.service";

export const useRemoveAcessosUsuario = (callOnSuccess, callOnError)  => {
  async function removeAcessoUsuario(id, uuidUnidadeBase) {
    if (!id || !uuidUnidadeBase) return null;
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
    return removeAcessoUsuario(id, uuidUnidadeBase)
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries(["usuarios-list", "usuario-form"]);
      console.log('Acessos removidos com sucesso!')
      callOnSuccess();
    },
    onError: (error) => {
      console.log('Erro ao remover acessos do usuario: ', error)
      callOnError();
    }
  })
};

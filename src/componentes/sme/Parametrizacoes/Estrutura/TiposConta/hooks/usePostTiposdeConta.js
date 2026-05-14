import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toastCustom } from "../../../../../Globais/ToastCustom";
import { postTipoConta } from "../../../../../../services/sme/Parametrizacoes.service"; 

export const usePostTipoConta = (setShowModalForm) => {
  const queryClient = useQueryClient()

  const mutationPost = useMutation({
    mutationFn: ({payload}) => {
      return postTipoConta(payload)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['tiposConta']).then()
      setShowModalForm(false)
      toastCustom.ToastCustomSuccess(
        'Inclusão do tipo de conta realizada com sucesso.', 
        'O tipo de conta foi adicionado ao sistema com sucesso.'
      )
    },
    onError: (e) => {
      if (e.response.data && e.response.data.non_field_errors) {
        toastCustom.ToastCustomError('Erro ao criar tipo de conta.', e.response.data.non_field_errors)
      } else {
        toastCustom.ToastCustomError('Erro ao criar tipo de conta.', 'Houve um erro ao tentar criar o tipo de conta.')
      }
    },
  })
  return {mutationPost}
}
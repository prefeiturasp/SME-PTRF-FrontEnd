import { useDispatch } from "react-redux";
import { criarDespesa, alterarDespesa } from "../../../../../services/escolas/Despesas.service";
import { useMutationConfirmavel } from "../../../../../hooks/Globais/useMutationConfirmavel";
import HTTP_STATUS from "http-status-codes";

export const useMutationDespesaConfirmavel = (onSuccess, onError, setLoading, setBtnSubmitDisable) => {
  const dispatch = useDispatch();

  const mutationCreate = useMutationConfirmavel({
    mutationFn: async ({ payload }) => {
      const jaConfirmado = payload?.confirmar_limpeza_prioridades_paa === true;
      
      if (jaConfirmado) {
        if (setLoading) setLoading(true);
        if (setBtnSubmitDisable) setBtnSubmitDisable(true);
      }
      
      const response = await criarDespesa(payload);
      if (response.status !== HTTP_STATUS.CREATED) {
        throw { response };
      }
      return response;
    },
    dispatch,
    errorField: "confirmar",
    confirmField: "confirmar_limpeza_prioridades_paa",
    modalConfig: {
      title: "Alteração das prioridades cadastradas",
      isDanger: true,
      onCancel: () => {
        if (setLoading) setLoading(false);
        if (setBtnSubmitDisable) setBtnSubmitDisable(false);
      },
      onConfirm: () => {
        if (setLoading) setLoading(true);
        if (setBtnSubmitDisable) setBtnSubmitDisable(true);
      },
    },
    mutationOptions: {
      onSuccess: (response) => {
        onSuccess && onSuccess(response);
      },
      onError: (error, variables) => {
        if (!error?.response?.data?.confirmar) {
          onError && onError(error.response || error);
        } else {
          // Se for erro de confirmação, não ativa loading ainda
          // O loading será ativado apenas quando o usuário confirmar
          // Não precisa desativar porque nunca foi ativado na primeira chamada
        }
      },
    },
  });

  const mutationUpdate = useMutationConfirmavel({
    mutationFn: async ({ payload, idDespesa }) => {
      const jaConfirmado = payload?.confirmar_limpeza_prioridades_paa === true;
      
      if (jaConfirmado) {
        if (setLoading) setLoading(true);
        if (setBtnSubmitDisable) setBtnSubmitDisable(true);
      }
      
      const response = await alterarDespesa(payload, idDespesa);
      if (response.status !== 200) {
        throw { response };
      }
      return response;
    },
    dispatch,
    errorField: "confirmar",
    confirmField: "confirmar_limpeza_prioridades_paa",
    modalConfig: {
      title: "Alteração das prioridades cadastradas",
      isDanger: true,
      onCancel: () => {
        if (setLoading) setLoading(false);
        if (setBtnSubmitDisable) setBtnSubmitDisable(false);
      },
      onConfirm: () => {
        if (setLoading) setLoading(true);
        if (setBtnSubmitDisable) setBtnSubmitDisable(true);
      },
    },
    mutationOptions: {
      onSuccess: (response) => {
        onSuccess && onSuccess(response);
      },
      onError: (error) => {
        if (!error?.response?.data?.confirmar) {
          onError && onError(error.response || error);
        } else {
          // Se for erro de confirmação, não ativa loading ainda
          // O loading será ativado apenas quando o usuário confirmar
          // Não precisa desativar porque nunca foi ativado na primeira chamada
        }
      },
    },
  });

  return { mutationCreate, mutationUpdate };
};

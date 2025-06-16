import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  postAtivarAtualizacaoSaldoPAA,
  postDesativarAtualizacaoSaldoPAA
} from "../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../Globais/ToastCustom";

export const useAtivarSaldoPAA = (onSuccess, onError) => {
  const mutationPost = useMutation({
    mutationFn: ({ uuid }) => postAtivarAtualizacaoSaldoPAA(uuid),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("As atualizações de saldo estão desbloqueadas.");
      onSuccess && onSuccess(data);
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao ativar o saldo.");
      onError && onError(e);
    },
  });

  return { mutationPost };
};

export const useDesativarSaldoPAA = (onSuccess, onError) => {
  const mutationPost = useMutation({
    mutationFn: ({ uuid }) => postDesativarAtualizacaoSaldoPAA(uuid),
    onSuccess: (data) => {
      toastCustom.ToastCustomSuccess("As atualizações de saldo estão bloqueadas.");
      onSuccess && onSuccess(data);
    },
    onError: (e) => {
      toastCustom.ToastCustomError("Houve um erro ao desativar o saldo.");
      onError && onError(e);
      console.error(e)
    },
  });

  return { mutationPost };
};
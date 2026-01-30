import { useMutation } from "@tanstack/react-query";
import { CustomModalConfirm } from "../../componentes/Globais/Modal/CustomModalConfirm";

export function useMutationConfirmavel({
  mutationFn,
  dispatch,
  modalConfig = {},
  mutationOptions = {},
  errorField = "confirmar",
  confirmField = "confirmar",
}) {
  const mutation = useMutation({
    mutationFn,
    ...mutationOptions,

    onError: (error, variables, context) => {
      const mensagem = error?.response?.data?.[errorField]?.[0];

      if (!mensagem) {
        mutationOptions?.onError?.(error, variables, context);
        return;
      }

      const normalizedVariables =
        typeof variables === "string"
          ? { uuid: variables }
          : (variables ?? {});

      const jaConfirmado = normalizedVariables?.payload
        ? normalizedVariables.payload?.[confirmField]
        : normalizedVariables?.[confirmField];

      if (jaConfirmado) {
        mutationOptions?.onError?.(error, variables, context);
        return;
      }

      const onConfirmOriginal = modalConfig.onConfirm;
      
      CustomModalConfirm({
        dispatch,
        title: "Confirmação necessária",
        message: mensagem,
        ...modalConfig,

        onConfirm: () => {
          // Chama o onConfirm do modalConfig se existir (para ativar loading, etc)
          if (onConfirmOriginal) {
            onConfirmOriginal();
          }
          
          const nextVariables = normalizedVariables?.payload
            ? {
                ...normalizedVariables,
                payload: {
                  ...normalizedVariables.payload,
                  [confirmField]: true,
                },
              }
            : {
                ...normalizedVariables,
                [confirmField]: true,
              };

          mutation.mutate(nextVariables);
        },
      });
    },
  });

  return mutation;
}

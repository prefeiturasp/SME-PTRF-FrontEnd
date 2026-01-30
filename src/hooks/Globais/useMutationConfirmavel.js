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

      const jaConfirmado = variables?.payload
        ? variables.payload?.[confirmField]
        : variables?.[confirmField];

      if (jaConfirmado) {
        mutationOptions?.onError?.(error, variables, context);
        return;
      }

      CustomModalConfirm({
        dispatch,
        title: "Confirmação necessária",
        message: mensagem,
        ...modalConfig,

        onConfirm: () => {
          const normalizedVariables =
            typeof variables === "string"
              ? { uuid: variables }
              : (variables ?? {});

          const nextVariables = normalizedVariables.payload
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

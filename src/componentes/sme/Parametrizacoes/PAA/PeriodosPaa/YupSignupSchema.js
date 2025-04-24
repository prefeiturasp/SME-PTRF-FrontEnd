import * as yup from "yup";

export const YupSignupSchema = () =>
    yup.object().shape({
      referencia: yup.string().required("Referência é obrigatória"),
  
      data_inicial: yup
        .date()
        .required("Data inicial é obrigatória")
        .nullable(),
  
      data_final: yup
        .date()
        .required("Data final é obrigatória")
        .when(
          "data_inicial",
          (data_inicial, schema) =>
            data_inicial
              ? schema.min(
                  data_inicial,
                  "Data final deve ser maior que a data inicial."
                )
              : schema
        ),
    });
  
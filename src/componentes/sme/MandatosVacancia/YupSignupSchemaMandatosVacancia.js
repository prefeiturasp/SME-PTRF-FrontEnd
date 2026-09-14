import * as yup from "yup";

export const YupSignupSchemaMandatosVacancia = yup.object().shape({
    referencia_mandato: yup.string().required("Referência do mandato é obrigatório"),
    data_inicial: yup.date().required("Data inicial é obrigatória").nullable(),
    data_final: yup.date().required("Data final é obrigatória").nullable()
        .when("data_inicial", (data_inicial, schema) =>
            data_inicial ? schema.min(data_inicial, "A data final não pode ser menor que a data inicial") : schema
        ),
});

import * as yup from "yup";

export const YupSignupSchemaMandatos  = yup.object().shape({
    referencia: yup.string().required("Referência do mandato é obrigatório"),
    data_inicial: yup.date().required("Data Inicial é obrigatória").nullable(),
    //data_final: yup.date().required("Data Final é obrigatória").nullable(),

    data_final: yup.date().required("Data Inicial é obrigatória").nullable()
        .when("data_inicial", (data_inicial, YupSignupSchemaPeriodos) => data_inicial ? YupSignupSchemaPeriodos.min(data_inicial, "A data final não pode ser menor que a data inicial") : YupSignupSchemaPeriodos)

});
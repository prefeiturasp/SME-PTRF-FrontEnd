import * as yup from "yup";

export const YupSignupSchemaArquivosDeCarga  = yup.object().shape({
    identificador: yup.string().required("Identificador é obrigatório"),
    valida_conteudo: yup.boolean(),
    conteudo: yup.mixed()
    .when('valida_conteudo', {
        is: true,
        then: yup.mixed().required("Arquivo de Carga é obrigatório")
        .test(
            "fileFormat",
            "Arquivo de Carga é obrigatório e só permitido arquivos.csv",
            (value) => value && 'application/vnd.ms-excel'.includes(value.type)
        )
    })
});

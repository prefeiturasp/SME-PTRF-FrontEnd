import * as yup from "yup";

export const YupSignupSchemaArquivosDeCarga  = yup.object().shape({
    identificador: yup.string().required("Identificador é obrigatório"),
    conteudo: yup.mixed().required("Arquivo de carga é obrigatório")
    // .test(
    //     "fileSize",
    //     "File too large",
    //     value => value && value.size <= FILE_SIZE
    // )
    .test(
        "fileFormat",
        "Permitido apenas arquivos .csv",
        value => value && 'application/vnd.ms-excel'.includes(value.type)
    )
});

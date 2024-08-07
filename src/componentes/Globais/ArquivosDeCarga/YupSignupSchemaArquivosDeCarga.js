import * as yup from "yup";

export const YupSignupSchemaArquivosDeCarga = (verificaSeArquivoRequerPeriodo, arquivoRequerTipoDeConta, edicao) => {
    return yup.object().shape({
    identificador: yup.string().required("Identificador é obrigatório"),
    valida_conteudo: yup.boolean(),
    conteudo: edicao === 'edit' ? '' : yup.mixed()
    .when('valida_conteudo', {
        is: true,
        then: yup.mixed().required("Arquivo de Carga é obrigatório")
        .test(
            "fileFormat",
            "Arquivo de Carga é obrigatório e só permitido arquivos.csv",
            (value) => value &&
                (
                    'application/vnd.ms-excel'.includes(value.type) ||
                    'text/plain'.includes(value.type) ||
                    'text/x-csv'.includes(value.type) ||
                    'application/csv'.includes(value.type) ||
                    'application/x-csv'.includes(value.type) ||
                    'text/csv'.includes(value.type) ||
                    'text/comma-separated-values'.includes(value.type) ||
                    'text/x-comma-separated-values'.includes(value.type) ||
                    'text/tab-separated-values'.includes(value.type)
                )
        )
    }),
    periodo: yup.string().when('valida_conteudo', {
        is: verificaSeArquivoRequerPeriodo,
        then: yup.string().required('Período é obrigatório'),
        otherwise: yup.string()
    }),
    tipo_de_conta: yup.string().when('valida_conteudo', {
        is: arquivoRequerTipoDeConta,
        then: yup.string().required('Tipo de conta é obrigatório'),
        otherwise: yup.string()
    }),
});
}

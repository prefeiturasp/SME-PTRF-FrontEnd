import * as yup from "yup";

export const YupSignupSchemaArquivosDeCarga = (verificaSeArquivoRequerPeriodo, arquivoRequerTipoDeConta, edicao) => {
    return yup.object().shape({
    identificador: yup.string().required("Identificador é obrigatório"),
    tipo_delimitador: yup.string().required("Tipo delimitador é obrigatório"),
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
    periodo: verificaSeArquivoRequerPeriodo === true ?
        yup.string().required('Período é obrigatório') : yup.string().nullable().optional(),
    tipo_de_conta: arquivoRequerTipoDeConta === true ?
        yup.string().required('Tipo de conta é obrigatório') : yup.string().nullable().optional()
});
}

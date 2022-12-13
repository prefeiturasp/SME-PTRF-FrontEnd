import * as yup from "yup";

export const YupSubmitDocumentosAcertos = yup.object().shape({
    detalhamento: yup.string().required("É necessário informar o campo de detalhamento do acerto."),
});
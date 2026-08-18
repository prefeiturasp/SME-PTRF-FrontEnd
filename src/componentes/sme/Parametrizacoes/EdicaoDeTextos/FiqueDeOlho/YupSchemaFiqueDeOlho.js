import * as yup from "yup";

export const YupSchemaFiqueDeOlho  = yup.object().shape({
    texto: yup.string().required("Texto é obrigatório."),
    tipo_texto: yup.string().required("Tipo de texto é obrigatório."),
    recurso_uuid: yup.string().required("Recurso é obrigatório"),
});

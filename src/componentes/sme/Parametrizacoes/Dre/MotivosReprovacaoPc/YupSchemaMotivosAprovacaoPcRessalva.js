import * as yup from "yup";

export const YupSchemaMotivosAprovacaoPcRessalva  = yup.object().shape({
    motivo: yup.string().required("Motivo é obrigatório."),
    recurso_uuid: yup.string().required("Recurso é obrigatório"),
});
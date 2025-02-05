import * as yup from "yup";

export const YupSchemaMotivosAprovacaoPcRessalva  = yup.object().shape({
    motivo: yup.string().required("Motivo é obrigatório."),
});
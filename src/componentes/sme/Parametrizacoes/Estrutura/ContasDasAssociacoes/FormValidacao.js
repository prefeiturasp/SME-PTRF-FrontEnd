import * as yup from "yup";

export const YupSchemaContasAssociacoes  = yup.object().shape({
    associacao_nome: yup.string().required("Associação é obrigatório"),
    tipo_conta: yup.string().test('test-name', 'Tipo de conta é obrigatório',
      function (value) {
        return !(value === undefined || value === null || value === "");

      }),
    status: yup.string().test('test-name', 'Status é obrigatório',
      function (value) {
        return !(value === undefined || value === null || value === "");

      }),
  
});

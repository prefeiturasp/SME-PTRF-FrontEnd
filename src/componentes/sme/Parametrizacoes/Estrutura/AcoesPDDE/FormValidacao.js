import * as yup from "yup";

export const FormAcoesPDDEValidacao = yup.object().shape({
      nome: yup.string().required("Nome é obrigatório"),
      categoria: yup.string().test('test-name', 'Categoria é obrigatória',
        function (value) {
          return !(value === undefined || value === null || value === "");
      }),
  });
  
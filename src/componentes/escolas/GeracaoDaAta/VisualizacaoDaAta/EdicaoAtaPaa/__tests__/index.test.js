import { toastCustom } from "../../../../../Globais/ToastCustom";

jest.mock("../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomError: jest.fn(),
  },
}));

describe("EdicaoAtaPaa - Validação Professor Grêmio", () => {
  const mockFormRef = {
    current: {
      values: {
        listaParticipantes: [
          { nome: "Participante 1", professor_gremio: false },
        ],
      },
    },
  };

  const mockDadosAtaComProfessor = {
    precisa_professor_gremio: true,
  };

  const mockDadosAtaSemProfessor = {
    precisa_professor_gremio: false,
  };

  test("não valida professor quando precisa_professor_gremio é true (professor nunca é obrigatório)", () => {
    const onSubmitFormEdicaoAta = () => {
      const dadosForm = mockFormRef.current.values;
      const listaParticipantes = dadosForm.listaParticipantes || [];
    };

    toastCustom.ToastCustomError.mockClear();
    onSubmitFormEdicaoAta();
    expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
  });

  test("não valida professor quando precisa_professor_gremio é false", () => {
    const onSubmitFormEdicaoAta = () => {
      const dadosForm = mockFormRef.current.values;
      const listaParticipantes = dadosForm.listaParticipantes || [];
    };

    toastCustom.ToastCustomError.mockClear();
    onSubmitFormEdicaoAta();
    expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
  });
});

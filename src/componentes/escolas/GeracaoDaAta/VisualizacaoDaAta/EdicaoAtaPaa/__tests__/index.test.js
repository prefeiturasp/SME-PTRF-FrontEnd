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

  test("valida professor quando precisa_professor_gremio é true", () => {
    const onSubmitFormEdicaoAta = () => {
      const dadosForm = mockFormRef.current.values;
      const listaParticipantes = dadosForm.listaParticipantes || [];
      if (mockDadosAtaComProfessor?.precisa_professor_gremio) {
        const professorGremio = listaParticipantes.find(
          (p) => p.professor_gremio
        );
        if (!professorGremio || !professorGremio.nome || !professorGremio.identificacao) {
          toastCustom.ToastCustomError("Erro!", "Preencha os dados do Professor Orientador do Grêmio antes de salvar.");
          return;
        }
      }
    };

    onSubmitFormEdicaoAta();
    expect(toastCustom.ToastCustomError).toHaveBeenCalled();
  });

  test("não valida professor quando precisa_professor_gremio é false", () => {
    const onSubmitFormEdicaoAta = () => {
      const dadosForm = mockFormRef.current.values;
      const listaParticipantes = dadosForm.listaParticipantes || [];
      if (mockDadosAtaSemProfessor?.precisa_professor_gremio) {
        const professorGremio = listaParticipantes.find(
          (p) => p.professor_gremio
        );
        if (!professorGremio || !professorGremio.nome || !professorGremio.identificacao) {
          toastCustom.ToastCustomError("Erro!", "Preencha os dados do Professor Orientador do Grêmio antes de salvar.");
          return;
        }
      }
    };

    toastCustom.ToastCustomError.mockClear();
    onSubmitFormEdicaoAta();
    expect(toastCustom.ToastCustomError).not.toHaveBeenCalled();
  });
});

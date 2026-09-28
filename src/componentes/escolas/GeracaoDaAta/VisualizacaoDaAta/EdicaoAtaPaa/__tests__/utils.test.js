import {
  adicionaProfessorGremioNaLista,
  formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes,
} from "../utils";

describe("adicionaProfessorGremioNaLista", () => {
  const listaBase = [
    { id: 1, nome: "Participante 1", professor_gremio: false },
    { id: 2, nome: "Participante 2", professor_gremio: false },
  ];

  const professorDefaults = {
    nome: "Professor Teste",
    cargo: "Professor",
    identificacao: "1234567",
    presente: true,
  };

  test("adiciona professor quando precisaProfessorGremio é true e não existe professor", () => {
    const resultado = adicionaProfessorGremioNaLista(
      listaBase,
      "uuid-ata",
      professorDefaults,
      true
    );

    expect(resultado).toHaveLength(3);
    expect(resultado[2]).toMatchObject({
      professor_gremio: true,
      nome: "Professor Teste",
      cargo: "Professor",
      identificacao: "1234567",
    });
  });

  test("remove professor quando precisaProfessorGremio é false", () => {
    const listaComProfessor = [
      ...listaBase,
      { id: 3, nome: "Professor", professor_gremio: true },
    ];

    const resultado = adicionaProfessorGremioNaLista(
      listaComProfessor,
      "uuid-ata",
      professorDefaults,
      false
    );

    expect(resultado).toHaveLength(2);
    expect(resultado.some((p) => p.professor_gremio)).toBe(false);
  });

  test("mantém professor existente quando precisaProfessorGremio é true", () => {
    const listaComProfessor = [
      ...listaBase,
      { id: 3, nome: "Professor", professor_gremio: true, presente: false },
    ];

    const resultado = adicionaProfessorGremioNaLista(
      listaComProfessor,
      "uuid-ata",
      professorDefaults,
      true
    );

    expect(resultado).toHaveLength(3);
    expect(resultado[2]).toMatchObject({
      professor_gremio: true,
      nome: "Professor",
    });
    expect(resultado[2].id).toBe(3);
    expect(resultado[2].presente).toBe(false);
  });

  test("retorna lista vazia quando precisaProfessorGremio é false e lista só tem professor", () => {
    const listaSóProfessor = [
      { id: 1, nome: "Professor", professor_gremio: true },
    ];

    const resultado = adicionaProfessorGremioNaLista(
      listaSóProfessor,
      "uuid-ata",
      professorDefaults,
      false
    );

    expect(resultado).toHaveLength(0);
  });
});

describe("formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes", () => {
  const cargoOcupado = {
    id: 1,
    cargo_associacao_label: "Presidente da diretoria executiva",
    data_inicio_no_cargo: "2026-01-10",
    vago: false,
    ocupante_do_cargo: {
      nome: "Maria Silva",
      codigo_identificacao: "1234567",
    },
  };

  const cargoVago = {
    id: 2,
    cargo_associacao_label: "Vice-presidente da diretoria executiva",
    data_inicio_no_cargo: "2026-09-25",
    vago: true,
    ocupante_do_cargo: null,
  };

  test("deve formatar cargo ocupado como participante presente", () => {
    const resultado =
      formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
        presidente: cargoOcupado,
      });

    expect(resultado).toEqual([
      {
        id: 1,
        cargo: "Presidente da diretoria executiva",
        data_inicio_no_cargo: "10/01/2026",
        identificacao: "1234567",
        membro: true,
        nome: "Maria Silva",
        presente: true,
        vago: false,
        presidente_da_reuniao: false,
        secretario_da_reuniao: false,
        professor_gremio: false,
      },
    ]);
  });

  test("deve formatar cargo vago como ausente e com nome e identificação vazios", () => {
    const resultado =
      formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
        vice_presidente: cargoVago,
      });

    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toMatchObject({
      id: 2,
      cargo: "Vice-presidente da diretoria executiva",
      data_inicio_no_cargo: "25/09/2026",
      identificacao: "",
      nome: "",
      presente: false,
      vago: true,
    });
  });

  test("deve manter a ordem dos cargos e ignorar cargos nulos ou indefinidos", () => {
    const resultado =
      formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
        presidente: cargoOcupado,
        secretario: null,
        tesoureiro: undefined,
        vice_presidente: cargoVago,
      });

    expect(resultado.map((participante) => participante.id)).toEqual([1, 2]);
  });

  test("deve manter data de início indefinida quando não informada", () => {
    const resultado =
      formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes({
        presidente: { ...cargoOcupado, data_inicio_no_cargo: undefined },
      });

    expect(resultado[0].data_inicio_no_cargo).toBeUndefined();
  });

  test.each([undefined, null, {}])(
    "retorna lista vazia quando a composição é %p",
    (composicao) => {
      expect(
        formatarListaCargoComposicaoVacanciaParaFormatoDaListaParticipantes(
          composicao,
        ),
      ).toEqual([]);
    },
  );
});

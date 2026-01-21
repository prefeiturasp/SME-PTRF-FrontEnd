import { adicionaProfessorGremioNaLista } from "../utils";

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

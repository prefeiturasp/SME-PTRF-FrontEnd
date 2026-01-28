const filtrarProfessorGremioNaoPreenchido = (lista) => {
    if (!lista || !Array.isArray(lista)) return lista;
    return lista.filter(presente => {
        if (!presente.professor_gremio) return true;
        return (presente.nome && presente.nome.trim() !== '') || 
               (presente.identificacao && presente.identificacao.trim() !== '');
    });
};

describe("filtrarProfessorGremioNaoPreenchido", () => {
  it("retorna lista vazia quando lista é null", () => {
    expect(filtrarProfessorGremioNaoPreenchido(null)).toBe(null);
  });

  it("retorna lista quando não é array", () => {
    expect(filtrarProfessorGremioNaoPreenchido({})).toEqual({});
  });

  it("mantém participantes que não são professor do grêmio", () => {
    const lista = [
      { nome: "João", professor_gremio: false },
      { nome: "Maria", professor_gremio: false }
    ];
    const resultado = filtrarProfessorGremioNaoPreenchido(lista);
    expect(resultado).toHaveLength(2);
  });

  it("filtra professor do grêmio sem nome e sem identificação", () => {
    const lista = [
      { nome: "João", professor_gremio: false },
      { nome: "", identificacao: "", professor_gremio: true },
      { nome: "Maria", professor_gremio: false }
    ];
    const resultado = filtrarProfessorGremioNaoPreenchido(lista);
    expect(resultado).toHaveLength(2);
    expect(resultado.some(p => p.professor_gremio)).toBe(false);
  });

  it("mantém professor do grêmio com nome preenchido", () => {
    const lista = [
      { nome: "Professor Teste", identificacao: "", professor_gremio: true }
    ];
    const resultado = filtrarProfessorGremioNaoPreenchido(lista);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].professor_gremio).toBe(true);
  });

  it("mantém professor do grêmio com identificação preenchida", () => {
    const lista = [
      { nome: "", identificacao: "1234567", professor_gremio: true }
    ];
    const resultado = filtrarProfessorGremioNaoPreenchido(lista);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].professor_gremio).toBe(true);
  });
});

import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ListaPresentes } from "../index"; 

describe("Componente <ListaPresentes />", () => {
  const mockMembros = [
    { uuid: "m1", nome: "Ana Silva", cargo: "Diretora Executiva" },
    { uuid: "m2", nome: "", cargo: "Conselheiro" },
    { uuid: "m3", nome: "Carlos Souza" },
  ];

  const mockNaoMembros = [
    { uuid: "nm1", nome: "Bruno Costa", cargo: "Secretário", professor_gremio: false },
    { uuid: "nm2", nome: "Diana Prince", cargo: "Coordenadora", professor_gremio: true },
    { uuid: "nm3", nome: "Everton Santos" },
  ];

  it("deve renderizar a estrutura inicial com os títulos das tabelas corretamente", () => {
    render(<ListaPresentes listaPresentesMembros={[]} listaPresentesNaoMembros={[]} />);

    expect(screen.getByRole("heading", { level: 4, name: /lista de presentes/i })).toBeInTheDocument();
    expect(screen.getByText(/membros da diretoria executiva e do conselho fiscal/i)).toBeInTheDocument();
    expect(screen.getByText(/demais presentes/i)).toBeInTheDocument();

    const cabecalhosNomeCargo = screen.getAllByRole("columnheader", { name: /nome e cargo/i });
    const cabecalhosAssinatura = screen.getAllByRole("columnheader", { name: /assinatura/i });

    expect(cabecalhosNomeCargo).toHaveLength(2);
    expect(cabecalhosAssinatura).toHaveLength(2);
  });

  it("deve renderizar as tabelas vazias sem quebrar o componente quando os arrays forem vazios", () => {
    render(<ListaPresentes listaPresentesMembros={[]} listaPresentesNaoMembros={[]} />);

    const tabelas = screen.getAllByRole("table");
    expect(tabelas).toHaveLength(2);

    const tbodies = document.querySelectorAll("tbody");
    expect(tbodies[0].children).toHaveLength(0);
    expect(tbodies[1].children).toHaveLength(0);
  });

  it("deve renderizar a lista de membros corretamente com todas as variações (nome, cargo ausente, sem nome)", () => {
    render(<ListaPresentes listaPresentesMembros={mockMembros} listaPresentesNaoMembros={[]} />);

    expect(screen.getByText(/ana silva/i)).toBeInTheDocument();
    expect(screen.getByText(/diretora executiva/i)).toBeInTheDocument();

    expect(screen.getByText("-")).toBeInTheDocument();
    expect(screen.getByText(/conselheiro/i)).toBeInTheDocument();

    expect(screen.getByText(/carlos souza/i)).toBeInTheDocument();
  });

  it("deve renderizar a lista de não-membros testando as condicionais de cargo e professor do grêmio", () => {
    render(<ListaPresentes listaPresentesMembros={[]} listaPresentesNaoMembros={mockNaoMembros} />);

    expect(screen.getByText(/bruno costa/i)).toBeInTheDocument();
    expect(screen.getByText(/secretário/i)).toBeInTheDocument();
    expect(screen.queryByText(/secretário - professor do grêmio/i)).not.toBeInTheDocument();

    expect(screen.getByText(/diana prince/i)).toBeInTheDocument();
    expect(screen.getByText(/coordenadora - professor do grêmio/i)).toBeInTheDocument();

    expect(screen.getByText(/everton santos/i)).toBeInTheDocument();
  });

  it("deve usar chaves alternativas (identificacao ou index) na renderização se o uuid não estiver presente", () => {
    const listaSemUuid = [
      { identificacao: "id-123", nome: "João Teste", cargo: "Auditor" }
    ];

    const { container } = render(
      <ListaPresentes listaPresentesMembros={listaSemUuid} listaPresentesNaoMembros={[]} />
    );

    expect(screen.getByText(/joão teste/i)).toBeInTheDocument();
    expect(container).toBeDefined();
  });
});
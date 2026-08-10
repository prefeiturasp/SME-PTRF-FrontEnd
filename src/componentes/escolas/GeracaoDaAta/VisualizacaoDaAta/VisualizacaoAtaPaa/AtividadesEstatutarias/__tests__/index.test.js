import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AtividadesEstatutarias } from "../index";

jest.mock("../../../../../Paa/componentes/TagRetificacao", () => ({
  TagRetificacao: () => <span data-testid="tag-retificacao">Tag Retificação</span>,
}));

describe("AtividadesEstatutarias Component", () => {
  const mockFormatarMesAno = jest.fn((data) => `Formated_Month_${data}`);
  const mockFormatarData = jest.fn((data) => `Formated_Date_${data}`);

  const atividadesMock = [
    {
      uuid: "1",
      tipoAtividade: "Reunião Ordinária",
      data: "2026-06-01",
      descricao: "Discussão do orçamento",
      isGlobal: false,
      vinculoUuid: null,
      alteracao: true,
    },
    {
      uuid: "2",
      tipoAtividade: "",
      data: "2026-06-02",
      descricao: "",
      isGlobal: true,
      vinculoUuid: null,
      mesLabel: "Junho/2026",
      alteracao: true,
    },
    {
      uuid: "3",
      tipoAtividade: "Assembleia",
      data: "2026-06-03",
      descricao: "Votação de pautas",
      isGlobal: true,
      vinculoUuid: "vinculo-123",
      alteracao: false,
    },
    {
      uuid: "4",
      tipoAtividade: "Outro",
      data: "2026-06-04",
      descricao: "Teste nulo",
      isGlobal: true,
      vinculoUuid: null,
      mesLabel: "",
      alteracao: true,
    },
  ];

  const defaultProps = {
    atividades: atividadesMock,
    isLoadingAtividades: false,
    paaRetificacao: false,
    isLoading: false,
    formatarMesAno: mockFormatarMesAno,
    formatarData: mockFormatarData,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o título principal e os cabeçalhos da tabela corretamente", () => {
    render(<AtividadesEstatutarias {...defaultProps} />);

    expect(screen.getByRole("heading", { name: /atividades estatutárias/i })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Tipo de Atividades" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Data" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Atividades Estatutárias Previstas" })).toBeInTheDocument();
    expect(screen.getByRole("columnheader", { name: "Mês/Ano" })).toBeInTheDocument();
  });

  it("deve exibir a TagRetificacao quando paaRetificacao for verdadeiro e isLoading for falso", () => {
    render(<AtividadesEstatutarias {...defaultProps} paaRetificacao={true} isLoading={false} />);

    expect(screen.getByTestId("tag-retificacao")).toBeInTheDocument();
  });

  it("não deve exibir a TagRetificacao se isLoading for verdadeiro, mesmo com paaRetificacao ativo", () => {
    render(<AtividadesEstatutarias {...defaultProps} paaRetificacao={true} isLoading={true} />);

    expect(screen.queryByTestId("tag-retificacao")).not.toBeInTheDocument();
  });

  it("deve renderizar TODAS as atividades quando as condições padrão forem atendidas", () => {
    render(<AtividadesEstatutarias {...defaultProps} />);

    const rows = screen.getAllByRole("row");

    expect(rows).toHaveLength(5);
    expect(screen.getByText("Reunião Ordinária")).toBeInTheDocument();
    expect(mockFormatarData).toHaveBeenCalledWith("2026-06-01");
    expect(mockFormatarMesAno).toHaveBeenCalledWith("2026-06-01");
    expect(screen.getByText("Junho/2026")).toBeInTheDocument();
  });

  it("deve renderizar todas as atividades e exibir a tag de retificação quando paaRetificacao for verdadeiro e houver alterações", () => {
    render(<AtividadesEstatutarias {...defaultProps} paaRetificacao={true} />);

    expect(screen.getByTestId("tag-retificacao")).toBeInTheDocument();
    expect(screen.getByText("Assembleia")).toBeInTheDocument();
    expect(screen.getByText("Reunião Ordinária")).toBeInTheDocument();

    const rows = screen.getAllByRole("row");
    expect(rows).toHaveLength(5);
  });

  it("deve retornar null (não renderizar nada) se não houver atividades válidas para exibir", () => {
    const { container } = render(
      <AtividadesEstatutarias {...defaultProps} atividades={[]} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("deve retornar null se isLoadingAtividades for verdadeiro", () => {
    const { container } = render(
      <AtividadesEstatutarias {...defaultProps} isLoadingAtividades={true} />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("deve garantir que a TagRetificacao seja exibida se for retificação e ocultada caso contrário", () => {
    // Caso 1: Com retificação ativa
    const { rerender } = render(<AtividadesEstatutarias {...defaultProps} paaRetificacao={true} />);
    expect(screen.getByTestId("tag-retificacao")).toBeInTheDocument();
    rerender(<AtividadesEstatutarias {...defaultProps} paaRetificacao={false} />);
    expect(screen.queryByTestId("tag-retificacao")).not.toBeInTheDocument();
  });
  it("deve usar o índice do map como key alternativa se o uuid da atividade não for fornecido", () => {
    const atividadeSemUuid = [
      {
        tipoAtividade: "Sem UUID",
        data: "2026-06-05",
        descricao: "Teste de Fallback Key",
        isGlobal: false,
        alteracao: true,
      },
    ];

    render(<AtividadesEstatutarias {...defaultProps} atividades={atividadeSemUuid} />);
    expect(screen.getByText("Sem UUID")).toBeInTheDocument();
  });

});

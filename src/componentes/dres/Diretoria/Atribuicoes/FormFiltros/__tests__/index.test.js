import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Filtros } from "../index";

describe("Filtros Atribuições DRE", () => {
  const defaultProps = {
    estadoFiltros: {
      filtrar_por_termo: "",
      filtrar_por_rf: "",
      filtrar_por_tecnico: "",
      filtar_por_tipo_unidade: "",
    },
    mudancasFiltros: jest.fn(),
    enviarFiltrosAssociacao: jest.fn((e) => e.preventDefault()),
    limparFiltros: jest.fn(),
    tabelaAssociacoes: {
      tipos_unidade: [
        { id: 1, nome: "Tipo A" },
        { id: 2, nome: "Tipo B" },
      ],
    },
    tecnicosList: [
      { uuid: "1", nome: "Tecnico 1" },
      { uuid: "2", nome: "Tecnico 2" },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar todos os campos do formulário", () => {
    render(<Filtros {...defaultProps} />);

    expect(
      screen.getByLabelText(/filtrar por um unidade educacional/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/filtrar por código eol/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/filtrar por técnico/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/filtrar por tipo de unidade/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /filtrar/i })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /cancelar/i })
    ).toBeInTheDocument();
  });

  it("deve exibir opções de técnicos e tipos de unidade", () => {
    render(<Filtros {...defaultProps} />);

    expect(screen.getByText("Tecnico 1")).toBeInTheDocument();
    expect(screen.getByText("Tecnico 2")).toBeInTheDocument();

    expect(screen.getByText("Tipo A")).toBeInTheDocument();
    expect(screen.getByText("Tipo B")).toBeInTheDocument();
  });

  it("deve chamar mudancasFiltros ao digitar nos inputs", async () => {
    const user = userEvent.setup();
    render(<Filtros {...defaultProps} />);

    const termoInput = screen.getByLabelText(
      /filtrar por um unidade educacional/i
    );

    await user.type(termoInput, "abc");

    expect(defaultProps.mudancasFiltros).toHaveBeenCalled();
  });

  it("deve chamar mudancasFiltros ao selecionar técnico", async () => {
    const user = userEvent.setup();
    render(<Filtros {...defaultProps} />);

    const select = screen.getByLabelText(/filtrar por técnico/i);

    await user.selectOptions(select, "1");

    expect(defaultProps.mudancasFiltros).toHaveBeenCalled();
  });

  it("deve chamar mudancasFiltros ao selecionar tipo de unidade", async () => {
    const user = userEvent.setup();
    render(<Filtros {...defaultProps} />);

    const select = screen.getByLabelText(/filtrar por tipo de unidade/i);

    await user.selectOptions(select, "1");

    expect(defaultProps.mudancasFiltros).toHaveBeenCalled();
  });

  it("deve chamar enviarFiltrosAssociacao ao submeter o formulário", async () => {
    const user = userEvent.setup();
    render(<Filtros {...defaultProps} />);

    const submitButton = screen.getByRole("button", { name: /filtrar/i });

    await user.click(submitButton);

    expect(defaultProps.enviarFiltrosAssociacao).toHaveBeenCalled();
  });

  it("deve chamar limparFiltros ao clicar no botão cancelar", async () => {
    const user = userEvent.setup();
    render(<Filtros {...defaultProps} />);

    const cancelButton = screen.getByRole("button", { name: /cancelar/i });

    await user.click(cancelButton);

    expect(defaultProps.limparFiltros).toHaveBeenCalled();
  });

  it("deve manter valores controlados nos inputs", () => {
    render(
      <Filtros
        {...defaultProps}
        estadoFiltros={{
          filtrar_por_termo: "teste",
          filtrar_por_rf: "123",
          filtrar_por_tecnico: "1",
          filtar_por_tipo_unidade: "2",
        }}
      />
    );

    expect(screen.getByDisplayValue("teste")).toBeInTheDocument();
    expect(screen.getByDisplayValue("123")).toBeInTheDocument();
  });

  it("não deve quebrar quando listas estão vazias", () => {
    render(
      <Filtros
        {...defaultProps}
        tecnicosList={[]}
        tabelaAssociacoes={{ tipos_unidade: [] }}
      />
    );

    expect(
      screen.getByLabelText(/filtrar por técnico/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/filtrar por tipo de unidade/i)
    ).toBeInTheDocument();
  });
});
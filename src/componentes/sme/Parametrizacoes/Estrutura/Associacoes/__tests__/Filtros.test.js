import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { Filtros } from "../components/Filtros";
import { mockTabelaAssociacoes } from "../__fixtures__/mockData";
import { useAssociacaoListagemContext } from "../hooks/useAssociacoesListagemContext";

jest.mock("../hooks/useAssociacoesListagemContext", () => ({
  useAssociacaoListagemContext: jest.fn(),
}));

jest.mock("../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: () => ({
    recursos: [{ uuid: "recurso-1", nome: "PTRF" }],
  }),
}));

jest.mock("antd", () => {
  const Select = ({ children, id, onChange }) => (
    <button
      id={id}
      type="button"
      onClick={() => onChange(["ENCERRADAS", "NAO_ENCERRADAS"])}
    >
      {children}
    </button>
  );
  Select.Option = ({ children, value }) => <option value={value}>{children}</option>;
  return { Select };
});

jest.mock("../../../../../../utils/Loading", () => () => <div data-testid="loading" />);

describe("Componente Filtros", () => {
  const setDraftFilter = jest.fn();
  const handleApplyFilter = jest.fn();
  const handleClearFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useAssociacaoListagemContext.mockReturnValue({
      isLoadingTabelaAssociacaoListagem: false,
      dataTabelaAssociacaoListagem: mockTabelaAssociacoes,
      draftFilter: {
        recurso_uuid: "",
        associacao: "",
        dre: "",
        tipo_ue: "",
        informacao: [],
      },
      setDraftFilter,
      handleApplyFilter,
      handleClearFilter,
    });
  });

  it("renderiza os campos e as opcoes de filtro", () => {
    render(<Filtros />);

    expect(screen.getByLabelText("Filtrar por associação")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar por DRE")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar pelo tipo de UE")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar por Recurso")).toBeInTheDocument();
    expect(screen.getByLabelText("Filtrar por informações")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "PTRF" })).toBeInTheDocument();
  });

  it("atualiza o filtro em rascunho ao alterar um campo", () => {
    render(<Filtros />);

    fireEvent.change(screen.getByLabelText("Filtrar por associação"), {
      target: { value: "Associação 1" },
    });

    const updater = setDraftFilter.mock.calls[0][0];
    expect(updater({ associacao: "" })).toEqual({ associacao: "Associação 1" });
  });

  it("atualiza os filtros de DRE, tipo de UE e recurso", () => {
    render(<Filtros />);

    fireEvent.change(screen.getByLabelText("Filtrar por DRE"), {
      target: { value: mockTabelaAssociacoes.dres[0].uuid },
    });
    fireEvent.change(screen.getByLabelText("Filtrar pelo tipo de UE"), {
      target: { value: "ADM" },
    });
    fireEvent.change(screen.getByLabelText("Filtrar por Recurso"), {
      target: { value: "recurso-1" },
    });

    expect(setDraftFilter.mock.calls[0][0]({ dre: "" })).toEqual({
      dre: mockTabelaAssociacoes.dres[0].uuid,
    });
    expect(setDraftFilter.mock.calls[1][0]({ tipo_ue: "" })).toEqual({ tipo_ue: "ADM" });
    expect(setDraftFilter.mock.calls[2][0]({ recurso_uuid: "" })).toEqual({ recurso_uuid: "recurso-1" });
  });

  it("aplica e limpa os filtros pelas acoes do formulario", () => {
    render(<Filtros />);

    fireEvent.click(screen.getByRole("button", { name: "Limpar" }));
    fireEvent.click(screen.getByRole("button", { name: "Filtrar" }));

    expect(handleClearFilter).toHaveBeenCalledTimes(1);
    expect(handleApplyFilter).toHaveBeenCalledTimes(1);
  });

  it("atualiza as informacoes selecionadas", () => {
    render(<Filtros />);

    fireEvent.click(screen.getByLabelText("Filtrar por informações"));

    const updater = setDraftFilter.mock.calls[0][0];
    expect(updater({ informacao: [] })).toEqual({
      informacao: ["ENCERRADAS", "NAO_ENCERRADAS"],
    });
  });

  it("exibe carregamento enquanto as opcoes da tabela sao buscadas", () => {
    useAssociacaoListagemContext.mockReturnValue({
      isLoadingTabelaAssociacaoListagem: true,
    });

    render(<Filtros />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });
});

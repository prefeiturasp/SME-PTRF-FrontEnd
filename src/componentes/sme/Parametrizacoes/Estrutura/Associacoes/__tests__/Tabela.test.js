import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TabelaAssociacoes } from "../components/TabelaAssociacoes";
import { mockListaAssociacoes } from "../__fixtures__/mockData";
import { useAssociacaoListagemContext } from "../hooks/useAssociacoesListagemContext";
import { useNavigate } from "react-router-dom";

jest.mock("../hooks/useAssociacoesListagemContext", () => ({
  useAssociacaoListagemContext: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  useNavigate: jest.fn(),
}));

jest.mock("../../../../../Globais/TableTags", () => ({
  TableTags: () => null,
}));

jest.mock("../../../../../Globais/ModalLegendaInformacao/LegendaInformacao", () => ({
  LegendaInformacao: () => null,
}));

jest.mock("../../../../../Globais/UI/Button", () => ({
  EditIconButton: ({ onClick, ...props }) => <button onClick={onClick} {...props}>Editar</button>,
}));

jest.mock("primereact/datatable", () => ({
  DataTable: ({ children }) => <table><tbody>{children}</tbody></table>,
}));

jest.mock("primereact/column", () => ({
  Column: ({ field, body }) => (
    <tr>
      <td>{field === "unidade.nome_com_tipo" ? mockListaAssociacoes.results[0].unidade.nome_com_tipo : mockListaAssociacoes.results[0][field]}</td>
      <td>{body ? body(mockListaAssociacoes.results[0]) : null}</td>
    </tr>
  ),
}));

jest.mock("primereact/paginator", () => ({
  Paginator: ({ first, onPageChange }) => (
    <button data-testid="paginator" onClick={() => onPageChange({ page: 1 })}>
      Pagina inicial {first}
    </button>
  ),
}));

jest.mock("../../../../../../utils/Loading", () => () => <div data-testid="loading" />);

describe("TabelaAssociacoes", () => {
  const navigate = jest.fn();
  const setFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNavigate.mockReturnValue(navigate);
    useAssociacaoListagemContext.mockReturnValue({
      isLoadingAssociacaoListagem: false,
      dataAssociacaoListagem: mockListaAssociacoes,
      countAssociacaoListagem: mockListaAssociacoes.count,
      filter: { page: 1 },
      setFilter,
    });
  });

  it("exibe as associacoes recebidas do contexto", () => {
    render(<TabelaAssociacoes />);

    expect(screen.getByText(mockListaAssociacoes.results[0].nome)).toBeInTheDocument();
    expect(screen.getByText(mockListaAssociacoes.results[0].unidade.nome_com_tipo)).toBeInTheDocument();
    expect(screen.getByText((_, element) => element.textContent === "Exibindo 22 associações")).toBeInTheDocument();
  });

  it("navega para a edicao ao acionar uma associacao", () => {
    render(<TabelaAssociacoes />);

    fireEvent.click(screen.getAllByTestId("btn-editar-fique-de-olho")[0]);

    expect(navigate).toHaveBeenCalledWith(
      `/formulario-associacao/${mockListaAssociacoes.results[0].uuid}`
    );
  });

  it("atualiza a pagina da listagem", () => {
    render(<TabelaAssociacoes />);

    fireEvent.click(screen.getByTestId("paginator"));

    const updater = setFilter.mock.calls[0][0];
    expect(updater({ page: 1, associacao: "" })).toEqual({ page: 2, associacao: "" });
  });

  it("exibe carregamento enquanto a listagem e buscada", () => {
    useAssociacaoListagemContext.mockReturnValue({
      isLoadingAssociacaoListagem: true,
      dataAssociacaoListagem: { results: [] },
      countAssociacaoListagem: 0,
      filter: { page: 1 },
      setFilter,
    });

    render(<TabelaAssociacoes />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });
});

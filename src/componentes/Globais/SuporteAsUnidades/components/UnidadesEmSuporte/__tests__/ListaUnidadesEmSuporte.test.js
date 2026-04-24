import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { UnidadesEmSuporte } from "../ListaUnidadesEmSuporte";

jest.mock("react-redux", () => ({
  useDispatch: () => jest.fn(),
}));

jest.mock("../../../../../../services/auth.service", () => ({
  authService: {
    logoutToSuporte: jest.fn(),
  },
  getUsuarioLogado: () => ({
    login: "usuario_teste",
  }),
}));

jest.mock("../hooks/useUnidadesEmSuporte");
jest.mock("../hooks/useRemoverSuporte");

jest.mock("../../../../ModalLegendaInformacao/LegendaInformacao", () => ({
  LegendaInformacao: () => <div data-testid="legenda" />,
}));

jest.mock("../../../../TableTags", () => ({
  TableTags: () => <div data-testid="tags" />,
}));

jest.mock("../../../../../../utils/Loading", () => () => (
  <div data-testid="loading">Loading...</div>
));

jest.mock("../../../../Modal/ModalConfirm", () => ({
  ModalConfirm: jest.fn(),
}));

jest.mock("primereact/datatable", () => ({
  DataTable: ({ value, children }) => (
    <table data-testid="datatable">
      <tbody>
        {value?.map((row, index) => (
          <tr key={index}>
            {children.map((col, i) => (
              <td key={i}>
                {col.props.body
                  ? col.props.body(row)
                  : row[col.props.field]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  ),
}));

jest.mock("primereact/column", () => ({
  Column: (props) => props,
}));

jest.mock("primereact/paginator", () => ({
  Paginator: ({ onPageChange }) => (
    <button
      onClick={() => onPageChange({ first: 10, page: 1 })}
      data-testid="next-page"
    >
      Next
    </button>
  ),
}));

import { useUnidadesEmSuporte } from "../hooks/useUnidadesEmSuporte";
import { useRemoverSuporte } from "../hooks/useRemoverSuporte";
import { ModalConfirm } from "../../../../Modal/ModalConfirm";
import { authService } from "../../../../../../services/auth.service";

describe("UnidadesEmSuporte", () => {
  const mockMutate = jest.fn();
  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useRemoverSuporte.mockReturnValue({
      mutationRemoverSuporte: {
        mutate: mockMutate,
        isPending: false,
      },
      mutationRemoverSuporteEmLote: {
        mutateAsync: mockMutateAsync,
        isPending: false,
      },
    });
  });

  it("deve exibir loading quando estiver carregando", () => {
    useUnidadesEmSuporte.mockReturnValue({
      data: null,
      count: 0,
      isLoading: true,
      isError: false,
    });

    render(<UnidadesEmSuporte />);

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("não deve renderizar nada quando count = 0", () => {
    useUnidadesEmSuporte.mockReturnValue({
      data: { results: [] },
      count: 0,
      isLoading: false,
      isError: false,
    });

    const { container } = render(<UnidadesEmSuporte />);

    expect(container).toBeEmptyDOMElement();
  });

  it("deve renderizar tabela com dados", () => {
    useUnidadesEmSuporte.mockReturnValue({
      data: {
        results: [
          {
            uuid: "1",
            codigo_eol: "123",
            nome_com_tipo: "Escola Teste",
          },
        ],
      },
      count: 1,
      isLoading: false,
      isError: false,
    });

    render(<UnidadesEmSuporte />);

    expect(screen.getByText("Unidades de suporte vinculadas")).toBeInTheDocument();
    expect(screen.getByText("Escola Teste")).toBeInTheDocument();
  });

  it("deve chamar logout ao clicar no botão", () => {
    useUnidadesEmSuporte.mockReturnValue({
      data: { results: [] },
      count: 1,
      isLoading: false,
      isError: false,
    });

    render(<UnidadesEmSuporte />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /Login para as unidades de suporte/i,
      })
    );

    expect(authService.logoutToSuporte).toHaveBeenCalled();
  });

  it("deve abrir modal de confirmação ao clicar em remover suporte", () => {
    useUnidadesEmSuporte.mockReturnValue({
      data: {
        results: [
          {
            uuid: "1",
            nome_com_tipo: "Escola Teste",
          },
        ],
      },
      count: 1,
      isLoading: false,
      isError: false,
    });

    render(<UnidadesEmSuporte />);

    const button = screen.getByRole('button', { name: /remover suporte/i });
    fireEvent.click(button);

    expect(ModalConfirm).toHaveBeenCalled();
  });

  it("deve executar remoção ao confirmar modal", async () => {
    useUnidadesEmSuporte.mockReturnValue({
      data: {
        results: [{ uuid: "1", nome_com_tipo: "Teste" }],
      },
      count: 1,
      isLoading: false,
      isError: false,
    });

    ModalConfirm.mockImplementation(({ onConfirm }) => {
      onConfirm();
    });

    render(<UnidadesEmSuporte />);

    const button = screen.getByRole('button', { name: /remover suporte/i });
    fireEvent.click(button);

    expect(mockMutate).toHaveBeenCalledWith({
      usuario: "usuario_teste",
      unidade_uuid: "1",
    });
  });

  it("deve mudar de página ao usar paginator", async () => {
    useUnidadesEmSuporte.mockReturnValue({
      data: { results: [] },
      count: 20,
      isLoading: false,
      isError: false,
    });

    render(<UnidadesEmSuporte />);

    fireEvent.click(screen.getByTestId("next-page"));

    await waitFor(() => {
      expect(useUnidadesEmSuporte).toHaveBeenCalledWith(
        "usuario_teste",
        2
      );
    });
  });

  it("deve exibir loading overlay durante mutation", () => {
    useRemoverSuporte.mockReturnValue({
      mutationRemoverSuporte: {
        mutate: mockMutate,
        isPending: true,
      },
      mutationRemoverSuporteEmLote: {
        mutateAsync: mockMutateAsync,
        isPending: false,
      },
    });

    useUnidadesEmSuporte.mockReturnValue({
      data: { results: [] },
      count: 1,
      isLoading: false,
      isError: false,
    });

    render(<UnidadesEmSuporte />);

    expect(screen.getAllByTestId("loading")).toHaveLength(1);
  });

  it("deve resetar pagina quando erro 404", () => {
    useUnidadesEmSuporte.mockReturnValue({
      data: null,
      count: 0,
      isLoading: false,
      isError: true,
      error: {
        response: { status: 404 },
      },
    });

    render(<UnidadesEmSuporte />);

    expect(useUnidadesEmSuporte).toHaveBeenCalledWith(
      "usuario_teste",
      1
    );
  });
});
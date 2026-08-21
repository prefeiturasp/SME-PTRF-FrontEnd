import React from "react";
import { render, screen, fireEvent, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { TabelaAcoes } from "../components/TabelaAcoes";
import { useAcoesContext } from "../hooks/useAcoesContext";
import { useRecursoSelecionadoContext } from "../../../../../../context/RecursoSelecionado";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";

// Configura o Testing Library para identificar o atributo 'data-qa' caso necessário
configure({ testIdAttribute: "data-qa" });

// Mock dos Hooks de Contexto
jest.mock("../hooks/useAcoesContext", () => ({
  useAcoesContext: jest.fn(),
}));

jest.mock("../../../../../../context/RecursoSelecionado", () => ({
  useRecursoSelecionadoContext: jest.fn(),
}));

jest.mock(
  "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext",
  () => ({
    useAbasPorRecursoContext: jest.fn(),
  })
);

// Mock do react-router-dom
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Mock dos componentes reutilizáveis
jest.mock("../../../componentes/TotalRegistros", () => ({
  TotalRegistros: ({ titulo, total_registros }) => (
    <div data-qa="total-registros">
      {titulo}: {total_registros}
    </div>
  ),
}));

jest.mock("../../../../../Globais/UI/Button", () => ({
  EditIconButton: ({ onClick }) => (
    <button data-qa="btn-editar-acao" onClick={onClick}>
      Editar
    </button>
  ),
}));

jest.mock("react-tooltip", () => ({
  Tooltip: ({ content }) => <div data-qa="tooltip-content">{content}</div>,
}));

describe("Componente <TabelaAcoes />", () => {
  const mockHandleOpenModalForm = jest.fn();

  const mockResults = [
    {
      uuid: "acao-1-uuid",
      nome: "Ação Número Um",
      ordem_exibicao: 1,
      aceita_capital: true,
      aceita_custeio: false,
      aceita_livre: true,
      e_recursos_proprios: false,
      exibir_paa: true,
      recurso: "recurso-999-uuid",
    },
    {
      uuid: "acao-2-uuid",
      nome: "Ação Número Dois",
      ordem_exibicao: 2,
      aceita_capital: false,
      aceita_custeio: true,
      aceita_livre: false,
      e_recursos_proprios: true,
      exibir_paa: false,
      recurso: "recurso-999-uuid",
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    useAcoesContext.mockReturnValue({
      results: mockResults,
      handleOpenModalForm: mockHandleOpenModalForm,
    });

    useRecursoSelecionadoContext.mockReturnValue({
      recursoSelecionado: { uuid: "recurso-999-uuid", cor: "#123456" },
    });

    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: { uuid: "recurso-999-uuid", nome: "Recurso Teste 1" },
    });
  });

  const renderComponent = () =>
    render(
      <MemoryRouter>
        <TabelaAcoes />
      </MemoryRouter>
    );

  test("deve renderizar o total de registros e os cabeçalhos da tabela", () => {
    renderComponent();

    // Valida a contagem de registros
    expect(screen.getByTestId("total-registros")).toHaveTextContent("Ações: 2");

    // Valida o botão de alterar ordenação
    expect(
      screen.getByRole("button", { name: "Alterar ordenação" })
    ).toBeInTheDocument();

    // Valida o cabeçalho 'Nome' especificamente dentro dos cabeçalhos das colunas (role='columnheader')
    const colunas = screen.getAllByRole("columnheader");
    expect(colunas[0]).toHaveTextContent("Nome");
    expect(colunas[1]).toHaveTextContent("Ordenação");
    expect(colunas[2]).toHaveTextContent("UEs vinculadas");
    expect(colunas[3]).toHaveTextContent("Aceita Capital?");
    expect(colunas[4]).toHaveTextContent("Aceita Custeio?");
    expect(colunas[5]).toHaveTextContent("Aceita Livre Aplicação?");
    expect(colunas[6]).toHaveTextContent("Recursos externos?");
    expect(colunas[7]).toHaveTextContent("Exibe no PAA?");
  });

  test("deve renderizar os dados das ações corretamente nas linhas da tabela", () => {
    renderComponent();

    expect(screen.getByText("Ação Número Um")).toBeInTheDocument();
    expect(screen.getByText("Ação Número Dois")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  test("deve construir o link 'Ver UEs vinculadas' apontando para o recurso selecionado", () => {
    renderComponent();

    const linksUes = screen.getAllByRole("link", { name: /Ver UEs vinculadas/i });
    expect(linksUes).toHaveLength(2);

    expect(linksUes[0]).toHaveAttribute(
      "href",
      "/associacoes-da-acao/acao-1-uuid?recurso_uuid=recurso-999-uuid"
    );
    expect(linksUes[1]).toHaveAttribute(
      "href",
      "/associacoes-da-acao/acao-2-uuid?recurso_uuid=recurso-999-uuid"
    );
  });

  test("deve tratar link de UEs vinculadas quando selectedRecurso não estiver definido", () => {
    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: null,
    });

    renderComponent();

    const linksUes = screen.getAllByRole("link", { name: /Ver UEs vinculadas/i });
    expect(linksUes[0]).toHaveAttribute(
      "href",
      "/associacoes-da-acao/acao-1-uuid?recurso_uuid=undefined"
    );
  });

  test("deve navegar para '/parametro-acoes/reordenar' ao clicar no botão 'Alterar ordenação'", () => {
    renderComponent();

    const recurso_uuid = "recurso-999-uuid";
    const btnAlterarOrdenacao = screen.getByRole("button", {
      name: "Alterar ordenação",
    });
    fireEvent.click(btnAlterarOrdenacao);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(`/parametro-acoes/reordenar?recurso_uuid=${recurso_uuid}`);
  });

  test("deve acionar handleOpenModalForm com os dados da linha (incluindo o recurso como UUID string) ao clicar no botão de editar", () => {
    renderComponent();

    const botoesEditar = screen.getAllByTestId("btn-editar-acao");
    expect(botoesEditar).toHaveLength(2);

    fireEvent.click(botoesEditar[0]);

    expect(mockHandleOpenModalForm).toHaveBeenCalledTimes(1);
    expect(mockHandleOpenModalForm).toHaveBeenCalledWith(
      expect.objectContaining({
        uuid: "acao-1-uuid",
        nome: "Ação Número Um",
        recurso: "recurso-999-uuid",
      })
    );
  });
});
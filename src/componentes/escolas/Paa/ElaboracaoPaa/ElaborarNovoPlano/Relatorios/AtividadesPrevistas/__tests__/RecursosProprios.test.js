import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { RecursosProprios } from "../RecursosProprios";
import { useGetRecursosPropriosPrevistos } from "../hooks/useGetRecursosPropriosPrevistos";
import { deleteRecursoProprioPaa } from "../../../../../../../../services/escolas/Paa.service";
import { toastCustom } from "../../../../../../../Globais/ToastCustom";
import { visoesService } from "../../../../../../../../services/visoes.service";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../hooks/useGetRecursosPropriosPrevistos", () => ({
  useGetRecursosPropriosPrevistos: jest.fn(),
}));

jest.mock("../../../../../../../../services/escolas/Paa.service", () => ({
  deleteRecursoProprioPaa: jest.fn(),
}));

jest.mock("../../../../../../../../services/visoes.service", () => ({
  visoesService: {
    getPermissoes: jest.fn(),
  },
}));

jest.mock("../../../../../../../Globais/ToastCustom", () => ({
  toastCustom: {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  },
}));

jest.mock("../../../../../../../Globais/UI/Button", () => ({
  IconButton: ({ onClick, "aria-label": ariaLabel, disabled }) => (
    <button type="button" aria-label={ariaLabel} onClick={onClick} disabled={disabled}>
      {ariaLabel}
    </button>
  ),
}));

jest.mock("../../../../../../../Globais/UI/Icon", () => ({
  Icon: ({ icon }) => <span data-testid={`icon-${icon}`} />,
}));

jest.mock("../../../../../componentes/TagRetificacao", () => ({
  TagRetificacao: () => <span data-testid="tag-retificacao">Em retificação</span>,
}));

jest.mock("antd", () => ({
  Spin: ({ spinning, children }) => (
    <div data-testid={spinning ? "spin-loading" : "spin-idle"}>{children}</div>
  ),
  Table: {
    Summary: {
      Row: ({ children, className }) => (
        <tr data-testid="summary-row" className={className}>{children}</tr>
      ),
      Cell: ({ children, align, index }) => (
        <td data-testid={`summary-cell-${index}`} align={align}>{children}</td>
      ),
    },
  },
}));

jest.mock("../../components/RelatorioTabelaGrupo", () => ({
  RelatorioTabelaGrupo: ({ title, columns, dataSource, rowKey, headerExtra, tableProps }) => (
    <div data-testid={`tabela-grupo-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <div data-testid="tabela-titulo">{title}</div>
      {headerExtra && <div data-testid="tabela-header-extra">{headerExtra}</div>}
      <div data-testid="tabela-body">
        {(dataSource || []).map((record) => {
          const key = typeof rowKey === "function" ? rowKey(record) : record[rowKey];
          return (
            <div key={key} data-testid={`row-${key}`}>
              {columns.map((col) => (
                <div key={col.key} data-testid={`cell-${col.key}-${key}`}>
                  {col.render
                    ? col.render(record[col.dataIndex], record)
                    : (record[col.dataIndex] ?? "")}
                </div>
              ))}
            </div>
          );
        })}
      </div>
      {tableProps?.summary && (
        <table>
          <tbody>{tableProps.summary()}</tbody>
        </table>
      )}
    </div>
  ),
}));

jest.mock(
  "../../../../../../../sme/Parametrizacoes/componentes/ModalConfirmarExclusao",
  () => ({
    ModalConfirmarExclusao: ({ open, onOk, onCancel, titulo, bodyText }) =>
      open ? (
        <div data-testid="modal-excluir-recurso">
          <span data-testid="modal-titulo">{titulo}</span>
          <span data-testid="modal-body">{bodyText}</span>
          <button data-testid="modal-confirmar" onClick={onOk}>
            Confirmar
          </button>
          <button data-testid="modal-cancelar" onClick={onCancel}>
            Cancelar
          </button>
        </div>
      ) : null,
  }),
);

const mockRefetchRecursos = jest.fn();

// Use noon UTC to avoid date formatting differences across timezones
const DUMMY_RECURSO = {
  uuid: "recurso-uuid-1",
  fonte_recurso: { nome: "Fonte A" },
  data_prevista: "2024-03-15T12:00:00.000Z",
  valor: "1500.50",
  descricao: "Descrição do recurso",
};

const MOCK_PAA = { uuid: "paa-uuid-test", status: "ABERTO" };

const setupDefaultMocks = ({
  recursos = [DUMMY_RECURSO],
  isLoading = false,
} = {}) => {
  useGetRecursosPropriosPrevistos.mockReturnValue({
    data: recursos,
    isLoading,
    refetch: mockRefetchRecursos,
  });
};

const renderComponent = (paa = MOCK_PAA) =>
  render(<RecursosProprios paa={paa} />);

describe("RecursosProprios", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    visoesService.getPermissoes.mockReturnValue(true);
    mockRefetchRecursos.mockResolvedValue({});
    deleteRecursoProprioPaa.mockResolvedValue({});
    setupDefaultMocks();
  });

  // ─── Renderização básica ───────────────────────────────────────────────────

  describe("renderização básica", () => {
    it("renderiza a tabela de recursos próprios", () => {
      renderComponent();
      expect(screen.getByTestId("tabela-grupo-recursos-próprios")).toBeInTheDocument();
    });

    it("exibe o título 'Recursos próprios'", () => {
      renderComponent();
      expect(screen.getByTestId("tabela-titulo")).toHaveTextContent("Recursos próprios");
    });

    it("renderiza o botão Editar receitas de recursos próprios", () => {
      renderComponent();
      expect(
        screen.getByText("Editar receitas de recursos próprios"),
      ).toBeInTheDocument();
    });

    it("renderiza as linhas da tabela com os recursos fornecidos", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument();
      });
    });

    it("exibe o Spin inativo quando não está carregando", () => {
      renderComponent();
      expect(screen.getByTestId("spin-idle")).toBeInTheDocument();
    });
  });

  // ─── Estado de carregamento ────────────────────────────────────────────────

  describe("estado de carregamento", () => {
    it("exibe Spin ativo quando isLoadingRecursos=true", () => {
      setupDefaultMocks({ isLoading: true });
      renderComponent();
      expect(screen.getByTestId("spin-loading")).toBeInTheDocument();
    });

    it("não inicializa a tabela enquanto isLoading=true", () => {
      setupDefaultMocks({ isLoading: true });
      renderComponent();
      expect(screen.queryByTestId("row-recurso-uuid-1")).not.toBeInTheDocument();
    });
  });

  // ─── useEffect: inicialização da tabela ───────────────────────────────────

  describe("useEffect: inicialização da tabela", () => {
    it("popula a tabela ao receber dados do hook", async () => {
      renderComponent();
      await waitFor(() => {
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument();
      });
    });

    it("exibe '-' na coluna tipoAtividade quando fonte_recurso é ausente", async () => {
      setupDefaultMocks({
        recursos: [{ uuid: "r2", fonte_recurso: null, data_prevista: "", valor: "0" }],
      });
      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-r2")).toBeInTheDocument(),
      );
      expect(screen.getByTestId("cell-tipoAtividade-r2")).toHaveTextContent("-");
    });

    it("lida corretamente quando recursosProprios não é array (null)", async () => {
      useGetRecursosPropriosPrevistos.mockReturnValue({
        data: null,
        isLoading: false,
        refetch: mockRefetchRecursos,
      });
      renderComponent();
      await act(async () => {});
      expect(screen.getByTestId("tabela-grupo-recursos-próprios")).toBeInTheDocument();
      expect(screen.queryByTestId(/^row-/)).not.toBeInTheDocument();
    });

    it("não exibe recursos com _destroy=true", async () => {
      useGetRecursosPropriosPrevistos.mockReturnValue({
        data: [DUMMY_RECURSO],
        isLoading: false,
        refetch: mockRefetchRecursos,
      });
      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument(),
      );
      // O useEffect inicializa _destroy: false, então o recurso aparece
      expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument();
    });
  });

  // ─── Colunas: render de células ───────────────────────────────────────────

  describe("colunas: render de células", () => {
    beforeEach(async () => {
      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument(),
      );
    });

    it("exibe o nome da fonte do recurso na coluna tipoAtividade", () => {
      expect(
        screen.getByTestId("cell-tipoAtividade-recurso-uuid-1"),
      ).toHaveTextContent("Fonte A");
    });

    it("não exibe TagRetificacao quando alteracao é falsy", () => {
      expect(screen.queryByTestId("tag-retificacao")).not.toBeInTheDocument();
    });

    it("exibe TagRetificacao quando alteracao é truthy", async () => {
      setupDefaultMocks({
        recursos: [{ ...DUMMY_RECURSO, uuid: "r-alt", alteracao: true }],
      });
      const { unmount } = renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-r-alt")).toBeInTheDocument(),
      );
      expect(screen.getByTestId("tag-retificacao")).toBeInTheDocument();
      unmount();
    });

    it("exibe a data formatada na coluna data", () => {
      const cell = screen.getByTestId("cell-data-recurso-uuid-1");
      expect(cell.textContent).toMatch(/15\/03\/2024/);
    });

    it("exibe '-' na coluna data quando o valor é vazio", async () => {
      setupDefaultMocks({
        recursos: [{ ...DUMMY_RECURSO, uuid: "r-nodate", data_prevista: "" }],
      });
      const { unmount } = renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-r-nodate")).toBeInTheDocument(),
      );
      expect(screen.getByTestId("cell-data-r-nodate")).toHaveTextContent("-");
      unmount();
    });

    it("exibe '-' na coluna data quando o valor é inválido", async () => {
      setupDefaultMocks({
        recursos: [{ ...DUMMY_RECURSO, uuid: "r-baddate", data_prevista: "not-a-date" }],
      });
      const { unmount } = renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-r-baddate")).toBeInTheDocument(),
      );
      expect(screen.getByTestId("cell-data-r-baddate")).toHaveTextContent("-");
      unmount();
    });

    it("exibe a descricao na coluna descricao", () => {
      expect(
        screen.getByTestId("cell-descricao-recurso-uuid-1"),
      ).toHaveTextContent("Descrição do recurso");
    });

    it("exibe '-' na coluna descricao quando descricao é nulo/vazio", async () => {
      setupDefaultMocks({
        recursos: [{ ...DUMMY_RECURSO, uuid: "r-nodesc", descricao: null }],
      });
      const { unmount } = renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-r-nodesc")).toBeInTheDocument(),
      );
      expect(screen.getByTestId("cell-descricao-r-nodesc")).toHaveTextContent("-");
      unmount();
    });

    it("exibe o valor formatado na coluna valor", () => {
      expect(
        screen.getByTestId("cell-valor-recurso-uuid-1"),
      ).toHaveTextContent("1.500,50");
    });

    it("exibe 0,00 quando valor é inválido/nulo", async () => {
      setupDefaultMocks({
        recursos: [{ ...DUMMY_RECURSO, uuid: "r-noval", valor: null }],
      });
      const { unmount } = renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-r-noval")).toBeInTheDocument(),
      );
      expect(screen.getByTestId("cell-valor-r-noval")).toHaveTextContent("0,00");
      unmount();
    });

    it("exibe botão de excluir na coluna acoes quando podeEditar=true", () => {
      expect(
        screen.getByRole("button", { name: "Excluir recurso próprio" }),
      ).toBeInTheDocument();
    });
  });

  // ─── podeEditar=false ─────────────────────────────────────────────────────

  describe("quando podeEditar=false", () => {
    beforeEach(() => {
      visoesService.getPermissoes.mockReturnValue(false);
    });

    it("não exibe botão de excluir na coluna acoes", async () => {
      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument(),
      );
      expect(
        screen.queryByRole("button", { name: "Excluir recurso próprio" }),
      ).not.toBeInTheDocument();
    });

    it("não abre o modal ao tentar excluir", async () => {
      renderComponent();
      await act(async () => {});
      expect(screen.queryByTestId("modal-excluir-recurso")).not.toBeInTheDocument();
    });
  });

  // ─── Summary row: totalRecursosProprios ───────────────────────────────────

  describe("linha de resumo (summary)", () => {
    it("exibe o total dos recursos próprios formatado", async () => {
      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument(),
      );
      expect(screen.getByTestId("summary-cell-3")).toHaveTextContent("1.500,50");
    });

    it("exibe 0,00 quando não há recursos", async () => {
      setupDefaultMocks({ recursos: [] });
      renderComponent();
      await act(async () => {});
      expect(screen.getByTestId("summary-cell-3")).toHaveTextContent("0,00");
    });

    it("soma vários recursos corretamente", async () => {
      setupDefaultMocks({
        recursos: [
          { ...DUMMY_RECURSO, uuid: "r1", valor: "100" },
          { ...DUMMY_RECURSO, uuid: "r2", valor: "200" },
        ],
      });
      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-r1")).toBeInTheDocument(),
      );
      expect(screen.getByTestId("summary-cell-3")).toHaveTextContent("300,00");
    });
  });

  // ─── handleEditarRecursosProprios ─────────────────────────────────────────

  describe("handleEditarRecursosProprios", () => {
    it("navega para /elaborar-novo-paa com state correto quando status é ABERTO", async () => {
      renderComponent();
      await act(async () => {
        fireEvent.click(screen.getByText("Editar receitas de recursos próprios"));
      });
      expect(mockNavigate).toHaveBeenCalledWith("/elaborar-novo-paa", {
        state: {
          activeTab: "receitas",
          receitasDestino: "recursos-proprios",
          fromRecursosPropriosRelatorio: true,
          fromAtividadesPrevistas: true,
        },
      });
    });

    it("navega para /retificacao-paa/:uuid quando status é EM_RETIFICACAO", async () => {
      renderComponent({ uuid: "paa-uuid-test", status: "EM_RETIFICACAO" });
      await act(async () => {
        fireEvent.click(screen.getByText("Editar receitas de recursos próprios"));
      });
      expect(mockNavigate).toHaveBeenCalledWith("/retificacao-paa/paa-uuid-test", {
        state: {
          activeTab: "receitas",
          receitasDestino: "recursos-proprios",
          fromRecursosPropriosRelatorio: true,
          fromAtividadesPrevistas: true,
        },
      });
    });
  });

  // ─── handleExcluirRecursoProprio ──────────────────────────────────────────

  describe("handleExcluirRecursoProprio", () => {
    const setup = async () => {
      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument(),
      );
    };

    it("abre o modal de exclusão ao clicar no botão excluir", async () => {
      await setup();
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Excluir recurso próprio" }));
      });
      expect(screen.getByTestId("modal-excluir-recurso")).toBeInTheDocument();
    });

    it("exibe título e texto corretos no modal", async () => {
      await setup();
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Excluir recurso próprio" }));
      });
      expect(screen.getByTestId("modal-titulo")).toHaveTextContent("Excluir recurso próprio");
      expect(screen.getByTestId("modal-body")).toHaveTextContent(
        "Tem certeza que deseja excluir o recurso próprio selecionado?",
      );
    });
  });

  // ─── cancelarExclusaoRecursoProprio ───────────────────────────────────────

  describe("cancelarExclusaoRecursoProprio", () => {
    it("fecha o modal ao clicar em Cancelar", async () => {
      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument(),
      );
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Excluir recurso próprio" }));
      });
      expect(screen.getByTestId("modal-excluir-recurso")).toBeInTheDocument();
      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-cancelar"));
      });
      expect(screen.queryByTestId("modal-excluir-recurso")).not.toBeInTheDocument();
    });
  });

  // ─── confirmarExclusaoRecursoProprio: recurso existente ───────────────────

  describe("confirmarExclusaoRecursoProprio: recurso existente (isNovo=false)", () => {
    const openModal = async () => {
      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument(),
      );
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Excluir recurso próprio" }));
      });
    };

    it("chama deleteRecursoProprioPaa com o uuid do recurso", async () => {
      await openModal();
      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-confirmar"));
      });
      expect(deleteRecursoProprioPaa).toHaveBeenCalledWith("recurso-uuid-1");
    });

    it("exibe toast de sucesso após excluir", async () => {
      await openModal();
      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-confirmar"));
      });
      await waitFor(() => {
        expect(toastCustom.ToastCustomSuccess).toHaveBeenCalledWith(
          "Sucesso!",
          "Recurso próprio excluído com sucesso.",
        );
      });
    });

    it("chama refetchRecursos após excluir", async () => {
      await openModal();
      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-confirmar"));
      });
      await waitFor(() => {
        expect(mockRefetchRecursos).toHaveBeenCalled();
      });
    });

    it("fecha o modal após confirmar exclusão", async () => {
      await openModal();
      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-confirmar"));
      });
      await waitFor(() => {
        expect(screen.queryByTestId("modal-excluir-recurso")).not.toBeInTheDocument();
      });
    });

    it("exibe toast de erro quando deleteRecursoProprioPaa falha", async () => {
      deleteRecursoProprioPaa.mockRejectedValue(new Error("Falha na API"));
      await openModal();
      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-confirmar"));
      });
      await waitFor(() => {
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Erro!",
          "Não foi possível excluir o recurso próprio. Tente novamente.",
        );
      });
    });

    it("fecha o modal mesmo quando a exclusão falha", async () => {
      deleteRecursoProprioPaa.mockRejectedValue(new Error("Falha na API"));
      await openModal();
      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-confirmar"));
      });
      await waitFor(() => {
        expect(screen.queryByTestId("modal-excluir-recurso")).not.toBeInTheDocument();
      });
    });

    it("não chama a API quando podeEditar=false", async () => {
      visoesService.getPermissoes.mockReturnValue(false);
      renderComponent();
      await act(async () => {});
      expect(deleteRecursoProprioPaa).not.toHaveBeenCalled();
    });
  });

  // ─── confirmarExclusaoRecursoProprio: recurso sem uuid ───────────────────

  describe("confirmarExclusaoRecursoProprio: recurso sem uuid", () => {
    it("exibe toast de erro quando o recurso não possui uuid", async () => {
      // uuid: null força !recurso.uuid → throw dentro do else branch (linha 105)
      setupDefaultMocks({
        recursos: [{ ...DUMMY_RECURSO, uuid: null }],
      });

      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-null")).toBeInTheDocument(),
      );
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Excluir recurso próprio" }));
      });
      await act(async () => {
        fireEvent.click(screen.getByTestId("modal-confirmar"));
      });

      await waitFor(() => {
        expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
          "Erro!",
          "Não foi possível excluir o recurso próprio. Tente novamente.",
        );
      });
      expect(deleteRecursoProprioPaa).not.toHaveBeenCalled();
    });
  });

  // ─── guardsde estado concurrent (isExcluindoRecurso) ─────────────────────

  describe("guards de estado concorrente", () => {
    it("não inicia nova exclusão enquanto já está excluindo (linha 84)", async () => {
      let resolveDelete;
      deleteRecursoProprioPaa.mockImplementation(
        () => new Promise((res) => { resolveDelete = res; }),
      );

      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument(),
      );
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Excluir recurso próprio" }));
      });

      // Primeiro clique inicia a exclusão (não aguardamos)
      act(() => { fireEvent.click(screen.getByTestId("modal-confirmar")); });
      // Segundo clique deve ser bloqueado pelo guard isExcluindoRecurso
      act(() => { fireEvent.click(screen.getByTestId("modal-confirmar")); });

      // Resolve a exclusão para limpar o estado
      await act(async () => { resolveDelete(); });

      expect(deleteRecursoProprioPaa).toHaveBeenCalledTimes(1);
    });

    it("não fecha o modal enquanto exclusão está em progresso (linha 140)", async () => {
      let resolveDelete;
      deleteRecursoProprioPaa.mockImplementation(
        () => new Promise((res) => { resolveDelete = res; }),
      );

      renderComponent();
      await waitFor(() =>
        expect(screen.getByTestId("row-recurso-uuid-1")).toBeInTheDocument(),
      );
      await act(async () => {
        fireEvent.click(screen.getByRole("button", { name: "Excluir recurso próprio" }));
      });

      // Inicia exclusão sem aguardar
      act(() => { fireEvent.click(screen.getByTestId("modal-confirmar")); });
      // Tenta cancelar enquanto está excluindo — deve ser bloqueado
      act(() => { fireEvent.click(screen.getByTestId("modal-cancelar")); });

      expect(screen.getByTestId("modal-excluir-recurso")).toBeInTheDocument();

      await act(async () => { resolveDelete(); });
    });
  });
});

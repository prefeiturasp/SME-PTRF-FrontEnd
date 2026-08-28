import React, { useContext } from "react";
import { render, screen, fireEvent, act, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { AcoesContext, AcoesContextProvider } from "../context/AcoesContext";
import { useAbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext";
import { useGetAcoes } from "../hooks/useGetAcoes";
import { usePostAcao } from "../hooks/usePostAcao";
import { usePatchAcao } from "../hooks/usePatchAcao";
import { useDeleteAcao } from "../hooks/useDeleteAcao";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

// Configura o atributo de id de teste globalmente
configure({ testIdAttribute: "data-qa" });

// Mocks das dependências
jest.mock("../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext", () => ({
  useAbasPorRecursoContext: jest.fn(),
}));

jest.mock("../hooks/useGetAcoes", () => ({
  useGetAcoes: jest.fn(),
}));

jest.mock("../hooks/usePostAcao", () => ({
  usePostAcao: jest.fn(),
}));

jest.mock("../hooks/usePatchAcao", () => ({
  usePatchAcao: jest.fn(),
}));

jest.mock("../hooks/useDeleteAcao", () => ({
  useDeleteAcao: jest.fn(),
}));

jest.mock("../../../RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
  RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

// Componente Consumidor do Contexto com atributos data-qa
const TestConsumer = () => {
  const context = useContext(AcoesContext);

  return (
    <div>
      <span data-qa="is-loading">{context.isLoading ? "Sim" : "Não"}</span>
      <span data-qa="has-permissao">
        {context.TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES ? "Sim" : "Não"}
      </span>
      <span data-qa="filter-nome">{context.filters.filtrar_por_nome}</span>
      <span data-qa="filter-recurso">{context.filters.recurso_uuid}</span>
      <span data-qa="draft-nome">{context.draftFilters.filtrar_por_nome}</span>
      
      <span data-qa="modal-form-open">{context.modalForm.open ? "Sim" : "Não"}</span>
      <span data-qa="modal-form-nome">{context.modalForm.nome}</span>
      <span data-qa="modal-form-operacao">{context.modalForm.operacao}</span>
      
      <span data-qa="modal-delete-open">
        {context.showModalDeleteAcao ? "Sim" : "Não"}
      </span>
      <span data-qa="modal-desabilitar-open">
        {context.showModalConfirmDesabilitarAcao.open ? "Sim" : "Não"}
      </span>

      <span data-qa="results-count">{context.results?.length || 0}</span>

      {/* Botões para disparar os métodos do contexto */}
      <button
        data-qa="btn-create-modal"
        onClick={() => context.handleOpenCreateModal()}
      >
        Open Create Modal
      </button>

      <button
        data-qa="btn-close-modal"
        onClick={() => context.handleClose()}
      >
        Close Modal
      </button>

      <button
        data-qa="btn-open-edit"
        onClick={() =>
          context.handleOpenModalForm({
            uuid: "acao-123",
            nome: "Ação Existente",
            exibir_paa: true,
            recurso_uuid: "rec-999",
          })
        }
      >
        Open Edit
      </button>

      <button
        data-qa="btn-change-field"
        onClick={() => context.handleChangeFormModal("nome", "Novo Nome Ação")}
      >
        Change Name Field
      </button>

      <button
        data-qa="btn-change-filter"
        onClick={() => context.handleChangeFiltros("filtrar_por_nome", "Busca")}
      >
        Change Filter
      </button>

      <button
        data-qa="btn-submit-filters"
        onClick={() => context.handleSubmitFiltros()}
      >
        Submit Filters
      </button>

      <button
        data-qa="btn-clear-filters"
        onClick={() => context.limpaFiltros()}
      >
        Clear Filters
      </button>

      <button
        data-qa="btn-open-delete-modal"
        onClick={() => context.handleOpenModalDeleteAcao()}
      >
        Open Delete Modal
      </button>

      <button
        data-qa="btn-close-delete-modal"
        onClick={() => context.handleCloseModalDeleteAcao()}
      >
        Close Delete Modal
      </button>

      <button
        data-qa="btn-delete"
        onClick={() => context.handleDelete("acao-123")}
      >
        Execute Delete
      </button>

      <button
        data-qa="btn-submit-create"
        onClick={() =>
          context.handleSubmitFormModal({
            nome: "Nova Ação",
            e_recursos_proprios: false,
            aceita_capital: true,
            aceita_custeio: false,
            aceita_livre: false,
            exibir_paa: true,
            recurso: { uuid: "rec-999" },
          })
        }
      >
        Submit Create
      </button>

      <button
        data-qa="btn-submit-edit-normal"
        onClick={() =>
          context.handleSubmitFormModal({
            uuid: "acao-123",
            nome: "Ação Editada",
            operacao: "edit",
            exibir_paa: false,
            exibir_paa_original: true,
            tem_receitas_previstas_paa_em_elaboracao: false,
            tem_prioridades_paa_em_elaboracao: false,
            recurso: { uuid: "rec-999" },
          })
        }
      >
        Submit Edit Normal
      </button>

      <button
        data-qa="btn-submit-edit-desabilitar-alerta"
        onClick={() =>
          context.handleSubmitFormModal({
            uuid: "acao-123",
            nome: "Ação Com Pendencias",
            operacao: "edit",
            exibir_paa: false,
            exibir_paa_original: true,
            tem_receitas_previstas_paa_em_elaboracao: true,
            tem_prioridades_paa_em_elaboracao: false,
            recurso: { uuid: "rec-999" },
          })
        }
      >
        Submit Edit Com Alerta
      </button>

      <button
        data-qa="btn-close-confirm-desabilitar"
        onClick={() => context.handleCloseModalConfirmDesabilitarAcao()}
      >
        Close Confirm Desabilitar
      </button>
    </div>
  );
};

describe("AcoesContextProvider", () => {
  const mockMutatePost = jest.fn();
  const mockMutatePatch = jest.fn();
  const mockMutateDelete = jest.fn();

  const selectedRecursoMock = { uuid: "rec-999", nome: "Recurso 999" };

  beforeEach(() => {
    jest.clearAllMocks();

    useAbasPorRecursoContext.mockReturnValue({
      selectedRecurso: selectedRecursoMock,
    });

    RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);

    usePostAcao.mockReturnValue({ mutationPost: { mutate: mockMutatePost } });
    usePatchAcao.mockReturnValue({ mutationPatch: { mutate: mockMutatePatch } });
    useDeleteAcao.mockReturnValue({ mutationDelete: { mutate: mockMutateDelete } });

    useGetAcoes.mockReturnValue({
      isLoading: false,
      data: [{ uuid: "1", nome: "Ação 1" }],
    });
  });

  const renderContextProvider = () =>
    render(
      <AcoesContextProvider>
        <TestConsumer />
      </AcoesContextProvider>
    );

  test("deve inicializar o contexto com valores padrão e vincular o selectedRecurso.uuid aos filtros", () => {
    renderContextProvider();

    expect(screen.getByTestId("is-loading")).toHaveTextContent("Não");
    expect(screen.getByTestId("has-permissao")).toHaveTextContent("Sim");
    expect(screen.getByTestId("filter-recurso")).toHaveTextContent("rec-999");
    expect(screen.getByTestId("results-count")).toHaveTextContent("1");
  });

  test("deve abrir o modal de criação com dados iniciais corretos", () => {
    renderContextProvider();

    expect(screen.getByTestId("modal-form-open")).toHaveTextContent("Não");

    fireEvent.click(screen.getByTestId("btn-create-modal"));

    expect(screen.getByTestId("modal-form-open")).toHaveTextContent("Sim");
    expect(screen.getByTestId("modal-form-operacao")).toHaveTextContent("create");
  });

  test("deve atualizar os campos do modal de formulário individualmente", () => {
    renderContextProvider();

    fireEvent.click(screen.getByTestId("btn-create-modal"));
    fireEvent.click(screen.getByTestId("btn-change-field"));

    expect(screen.getByTestId("modal-form-nome")).toHaveTextContent("Novo Nome Ação");
  });

  test("deve fechar e resetar o estado do modal de formulário", () => {
    renderContextProvider();

    fireEvent.click(screen.getByTestId("btn-create-modal"));
    expect(screen.getByTestId("modal-form-open")).toHaveTextContent("Sim");

    fireEvent.click(screen.getByTestId("btn-close-modal"));
    expect(screen.getByTestId("modal-form-open")).toHaveTextContent("Não");
  });

  test("deve abrir o modal em modo de edição ao chamar handleOpenModalForm", () => {
    renderContextProvider();

    fireEvent.click(screen.getByTestId("btn-open-edit"));

    expect(screen.getByTestId("modal-form-open")).toHaveTextContent("Sim");
    expect(screen.getByTestId("modal-form-operacao")).toHaveTextContent("edit");
    expect(screen.getByTestId("modal-form-nome")).toHaveTextContent("Ação Existente");
  });

  test("deve atualizar os rascunhos de filtros e aplicá-los ao submeter", () => {
    renderContextProvider();

    fireEvent.click(screen.getByTestId("btn-change-filter"));
    expect(screen.getByTestId("draft-nome")).toHaveTextContent("Busca");
    expect(screen.getByTestId("filter-nome")).toHaveTextContent("");

    fireEvent.click(screen.getByTestId("btn-submit-filters"));
    expect(screen.getByTestId("filter-nome")).toHaveTextContent("Busca");
  });

  test("deve limpar os filtros e restaurar o recurso selecionado", () => {
    renderContextProvider();

    fireEvent.click(screen.getByTestId("btn-change-filter"));
    fireEvent.click(screen.getByTestId("btn-submit-filters"));
    expect(screen.getByTestId("filter-nome")).toHaveTextContent("Busca");

    fireEvent.click(screen.getByTestId("btn-clear-filters"));

    expect(screen.getByTestId("filter-nome")).toHaveTextContent("");
    expect(screen.getByTestId("draft-nome")).toHaveTextContent("");
    expect(screen.getByTestId("filter-recurso")).toHaveTextContent("rec-999");
  });

  test("deve gerenciar abertura, fechamento e exclusão de ação", () => {
    renderContextProvider();

    expect(screen.getByTestId("modal-delete-open")).toHaveTextContent("Não");

    fireEvent.click(screen.getByTestId("btn-open-delete-modal"));
    expect(screen.getByTestId("modal-delete-open")).toHaveTextContent("Sim");

    fireEvent.click(screen.getByTestId("btn-close-delete-modal"));
    expect(screen.getByTestId("modal-delete-open")).toHaveTextContent("Não");

    fireEvent.click(screen.getByTestId("btn-delete"));
    expect(mockMutateDelete).toHaveBeenCalledWith("acao-123");
  });

  test("deve disparar mutationPost para criação de novas ações", async () => {
    renderContextProvider();

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-submit-create"));
    });

    expect(mockMutatePost).toHaveBeenCalledTimes(1);
    expect(mockMutatePost).toHaveBeenCalledWith({
      payload: expect.objectContaining({
        nome: "Nova Ação",
        recurso: "rec-999",
      }),
    });
  });

  test("deve disparar mutationPatch no fluxo normal de edição sem desabilitação crítica", async () => {
    renderContextProvider();

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-submit-edit-normal"));
    });

    expect(mockMutatePatch).toHaveBeenCalledTimes(1);
    expect(mockMutatePatch).toHaveBeenCalledWith({
      UUID: "acao-123",
      payload: expect.objectContaining({
        nome: "Ação Editada",
        recurso: "rec-999",
      }),
    });
  });

  test("deve abrir o modal de confirmação ao tentar desabilitar ação que possui receitas ou prioridades pendentes", async () => {
    renderContextProvider();

    expect(screen.getByTestId("modal-desabilitar-open")).toHaveTextContent("Não");

    await act(async () => {
      fireEvent.click(screen.getByTestId("btn-submit-edit-desabilitar-alerta"));
    });

    expect(mockMutatePatch).not.toHaveBeenCalled();

    expect(screen.getByTestId("modal-desabilitar-open")).toHaveTextContent("Sim");

    fireEvent.click(screen.getByTestId("btn-close-confirm-desabilitar"));
    expect(screen.getByTestId("modal-desabilitar-open")).toHaveTextContent("Não");
  });
});
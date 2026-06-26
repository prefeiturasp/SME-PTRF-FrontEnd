import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContasDasAssociacoesProvider } from "../context/ContasDasAssociacoesContext";
import { useContasDasAssociacoesContext } from "../hooks/useContasDasAssociacoesContext";
import { AbasPorRecursoContext } from "../../../componentes/AbasPorRecurso/context/Recursos";
import { useGetAssociacoes } from "../hooks/useGetAssociacoes";
import { useGetTiposContas } from "../../TiposConta/hooks/useGetTiposdeConta";

jest.mock("../hooks/useGetAssociacoes");
jest.mock("../../TiposConta/hooks/useGetTiposdeConta");

const Consumer = () => {
  const {
    filter,
    stateFormModal,
    showModalConfirmacaoExclusao,
    listaTiposDeConta,
    todasAsAssociacoesAutoComplete,
    loadingAssociacoes,
    handleOpenCreateModal,
    handleCloseModalForm,
    handleOpenModalConfirmacaoExclusao,
    handleCloseModalConfirmacaoExclusao,
    recebeAutoComplete,
  } = useContasDasAssociacoesContext();

  return (
    <div>
      <span data-testid="filter-recurso">{filter.recurso_uuid}</span>
      <span data-testid="modal-open">{String(stateFormModal.isOpen)}</span>
      <span data-testid="modal-recurso">{stateFormModal.recurso_uuid}</span>
      <span data-testid="associacao">{stateFormModal.associacao}</span>
      <span data-testid="associacao-nome">{stateFormModal.associacao_nome}</span>
      <span data-testid="confirm-open">{String(showModalConfirmacaoExclusao.is_open)}</span>
      <span data-testid="confirm-uuid">{showModalConfirmacaoExclusao.conta_uuid}</span>
      <span data-testid="tipos-count">{listaTiposDeConta.length}</span>
      <span data-testid="associacoes-count">{todasAsAssociacoesAutoComplete.length}</span>
      <span data-testid="loading-associacoes">{String(loadingAssociacoes)}</span>
      <button onClick={() => handleOpenCreateModal({ uuid: "recurso-2" })}>abrir</button>
      <button onClick={handleCloseModalForm}>fechar</button>
      <button onClick={() => handleOpenModalConfirmacaoExclusao("conta-1")}>abrir confirmacao</button>
      <button onClick={handleCloseModalConfirmacaoExclusao}>fechar confirmacao</button>
      <button
        onClick={() =>
          recebeAutoComplete({
            uuid: "associacao-1",
            unidade: { nome_com_tipo: "EMEF Teste" },
          })
        }
      >
        selecionar associacao
      </button>
    </div>
  );
};

describe("ContasDasAssociacoesProvider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useGetAssociacoes.mockReturnValue({
      data: [
        {
          uuid: "associacao-1",
          unidade: { nome_com_tipo: "EMEF Teste" },
        },
      ],
      isLoading: false,
    });
    useGetTiposContas.mockReturnValue({
      data: [{ uuid: "tipo-1", nome: "Conta Corrente" }],
    });
  });

  it("fornece estado inicial, listas e handlers do modal", async () => {
    render(
      <AbasPorRecursoContext.Provider value={{ selectedRecurso: { uuid: "recurso-1", nome: "PTRF" } }}>
        <ContasDasAssociacoesProvider>
          <Consumer />
        </ContasDasAssociacoesProvider>
      </AbasPorRecursoContext.Provider>
    );

    await waitFor(() => expect(screen.getByTestId("filter-recurso")).toHaveTextContent("recurso-1"));
    expect(screen.getByTestId("tipos-count")).toHaveTextContent("1");
    expect(screen.getByTestId("associacoes-count")).toHaveTextContent("1");
    expect(screen.getByTestId("loading-associacoes")).toHaveTextContent("false");

    fireEvent.click(screen.getByText("abrir"));
    expect(screen.getByTestId("modal-open")).toHaveTextContent("true");
    expect(screen.getByTestId("modal-recurso")).toHaveTextContent("recurso-2");

    fireEvent.click(screen.getByText("selecionar associacao"));
    expect(screen.getByTestId("associacao")).toHaveTextContent("associacao-1");
    expect(screen.getByTestId("associacao-nome")).toHaveTextContent("EMEF Teste");

    fireEvent.click(screen.getByText("abrir confirmacao"));
    expect(screen.getByTestId("confirm-open")).toHaveTextContent("true");
    expect(screen.getByTestId("confirm-uuid")).toHaveTextContent("conta-1");

    fireEvent.click(screen.getByText("fechar confirmacao"));
    expect(screen.getByTestId("confirm-open")).toHaveTextContent("false");

    fireEvent.click(screen.getByText("fechar"));
    expect(screen.getByTestId("modal-open")).toHaveTextContent("false");
  });
});

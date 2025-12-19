import React, { useContext } from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { OutrosRecursosPeriodosPaaProvider, OutrosRecursosPeriodosPaaContext } from "../context";

const ConsumerTest = () => {
  const {
    filter,
    setFilter,
    currentPage,
    setCurrentPage,
    firstPage,
    setFirstPage,
    stateFormModal,
    setStateFormModal,
    showModalImportarUEs,
    setShowModalImportarUEs,
    rowsPerPage,
  } = useContext(OutrosRecursosPeriodosPaaContext);

  return (
    <div>
      <span data-testid="filter-nome">{filter.nome}</span>
      <span data-testid="current-page">{currentPage}</span>
      <span data-testid="first-page">{firstPage}</span>
      <span data-testid="rows-per-page">{rowsPerPage}</span>
      <span data-testid="modal-show">{String(showModalImportarUEs)}</span>
      <span data-testid="modal-uuid">{stateFormModal.uuid}</span>

      <button
        onClick={() =>
          setFilter({
            nome: "Recurso X",
            outro_recurso_uuid: "uuid-1",
            periodo_paa_uuid: "periodo-1",
          })
        }
      >
        set-filter
      </button>

      <button onClick={() => setCurrentPage(3)}>set-current-page</button>
      <button onClick={() => setFirstPage(20)}>set-first-page</button>

      <button
        onClick={() =>
          setStateFormModal({
            uuid: "modal-uuid",
            ativo: true,
          })
        }
      >
        set-modal
      </button>

      <button onClick={() => setShowModalImportarUEs(true)}>
        open-modal
      </button>
    </div>
  );
};

describe("OutrosRecursosPeriodosPaaContext", () => {
  const renderWithProvider = () =>
    render(
      <OutrosRecursosPeriodosPaaProvider>
        <ConsumerTest />
      </OutrosRecursosPeriodosPaaProvider>
    );

  it("inicia com os valores padrão", () => {
    renderWithProvider();

    expect(screen.getByTestId("filter-nome")).toHaveTextContent("");
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("first-page")).toHaveTextContent("0");
    expect(screen.getByTestId("rows-per-page")).toHaveTextContent("10");
    expect(screen.getByTestId("modal-show")).toHaveTextContent("false");
    expect(screen.getByTestId("modal-uuid")).toHaveTextContent("");
  });

  it("atualiza o filtro corretamente", () => {
    renderWithProvider();

    fireEvent.click(screen.getByText("set-filter"));

    expect(screen.getByTestId("filter-nome")).toHaveTextContent("Recurso X");
  });

  it("atualiza currentPage", () => {
    renderWithProvider();

    fireEvent.click(screen.getByText("set-current-page"));

    expect(screen.getByTestId("current-page")).toHaveTextContent("3");
  });

  it("atualiza firstPage", () => {
    renderWithProvider();

    fireEvent.click(screen.getByText("set-first-page"));

    expect(screen.getByTestId("first-page")).toHaveTextContent("20");
  });

  it("atualiza stateFormModal", () => {
    renderWithProvider();

    fireEvent.click(screen.getByText("set-modal"));

    expect(screen.getByTestId("modal-uuid")).toHaveTextContent("modal-uuid");
  });

  it("controla a exibição do modal de importação", () => {
    renderWithProvider();

    fireEvent.click(screen.getByText("open-modal"));

    expect(screen.getByTestId("modal-show")).toHaveTextContent("true");
  });
});

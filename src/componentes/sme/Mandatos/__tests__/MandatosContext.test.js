import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import { MandatosContext, MandatosProvider } from "../context/Mandatos";

const ContextHarness = () => {
  const context = useContext(MandatosContext);

  return (
    <section>
      <h1>Harness Mandatos</h1>

      <p data-testid="filter-referencia">{context.filter.referencia || "vazio"}</p>
      <p data-testid="current-page">{String(context.currentPage)}</p>
      <p data-testid="first-page">{String(context.firstPage)}</p>
      <p data-testid="show-modal-form">{String(context.showModalForm)}</p>
      <p data-testid="show-modal-info">{String(context.showModalInfo)}</p>
      <p data-testid="titulo-modal-info">{context.tituloModalInfo || "sem-titulo"}</p>
      <p data-testid="texto-modal-info">{context.textoModalInfo || "sem-texto"}</p>
      <p data-testid="bloquear-btn-salvar">{String(context.bloquearBtnSalvarForm)}</p>
      <p data-testid="force-loading">{String(context.forceLoading)}</p>
      <p data-testid="state-form-uuid">{context.stateFormModal.uuid || "sem-uuid"}</p>
      <p data-testid="state-form-referencia">{context.stateFormModal.referencia || "sem-referencia"}</p>

      <button type="button" onClick={() => context.setFilter({ referencia: "2026" })}>
        Alterar filtro
      </button>
      <button type="button" onClick={() => context.setCurrentPage(3)}>
        Alterar pagina atual
      </button>
      <button type="button" onClick={() => context.setFirstPage(0)}>
        Alterar primeira pagina
      </button>
      <button type="button" onClick={() => context.setShowModalForm(true)}>
        Abrir modal form
      </button>
      <button type="button" onClick={() => context.setShowModalInfo(true)}>
        Abrir modal info
      </button>
      <button type="button" onClick={() => context.setTituloModalInfo("Titulo atualizado")}> 
        Alterar titulo modal info
      </button>
      <button type="button" onClick={() => context.setTextoModalInfo("Texto atualizado")}> 
        Alterar texto modal info
      </button>
      <button type="button" onClick={() => context.setBloquearBtnSalvarForm(true)}>
        Bloquear salvar form
      </button>
      <button type="button" onClick={() => context.setForceLoading(true)}>
        Ativar force loading
      </button>
      <button
        type="button"
        onClick={() =>
          context.setStateFormModal((prevState) => ({
            ...prevState,
            referencia: "Mandato 2026",
            uuid: "uuid-mandato-1",
          }))
        }
      >
        Alterar state form modal
      </button>
    </section>
  );
};

const renderWithProvider = (ui) =>
  render(<MandatosProvider>{ui}</MandatosProvider>);

describe("MandatosProvider", () => {
  test("should render children and expose initial context values", () => {
    renderWithProvider(<ContextHarness />);

    expect(screen.getByRole("heading", { name: /Harness Mandatos/i })).toBeInTheDocument();
    expect(screen.getByTestId("filter-referencia")).toHaveTextContent("vazio");
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("first-page")).toHaveTextContent("1");
    expect(screen.getByTestId("show-modal-form")).toHaveTextContent("false");
    expect(screen.getByTestId("show-modal-info")).toHaveTextContent("false");
    expect(screen.getByTestId("titulo-modal-info")).toHaveTextContent("sem-titulo");
    expect(screen.getByTestId("texto-modal-info")).toHaveTextContent("sem-texto");
    expect(screen.getByTestId("bloquear-btn-salvar")).toHaveTextContent("false");
    expect(screen.getByTestId("force-loading")).toHaveTextContent("false");
    expect(screen.getByTestId("state-form-uuid")).toHaveTextContent("sem-uuid");
    expect(screen.getByTestId("state-form-referencia")).toHaveTextContent("sem-referencia");
  });

  test("should update context values when user interacts with harness actions", async () => {
    const user = userEvent.setup();
    renderWithProvider(<ContextHarness />);

    await user.click(screen.getByRole("button", { name: /Alterar filtro/i }));
    await user.click(screen.getByRole("button", { name: /Alterar pagina atual/i }));
    await user.click(screen.getByRole("button", { name: /Alterar primeira pagina/i }));
    await user.click(screen.getByRole("button", { name: /Abrir modal form/i }));
    await user.click(screen.getByRole("button", { name: /Abrir modal info/i }));
    await user.click(screen.getByRole("button", { name: /Alterar titulo modal info/i }));
    await user.click(screen.getByRole("button", { name: /Alterar texto modal info/i }));
    await user.click(screen.getByRole("button", { name: /Bloquear salvar form/i }));
    await user.click(screen.getByRole("button", { name: /Ativar force loading/i }));
    await user.click(screen.getByRole("button", { name: /Alterar state form modal/i }));

    expect(screen.getByTestId("filter-referencia")).toHaveTextContent("2026");
    expect(screen.getByTestId("current-page")).toHaveTextContent("3");
    expect(screen.getByTestId("first-page")).toHaveTextContent("0");
    expect(screen.getByTestId("show-modal-form")).toHaveTextContent("true");
    expect(screen.getByTestId("show-modal-info")).toHaveTextContent("true");
    expect(screen.getByTestId("titulo-modal-info")).toHaveTextContent("Titulo atualizado");
    expect(screen.getByTestId("texto-modal-info")).toHaveTextContent("Texto atualizado");
    expect(screen.getByTestId("bloquear-btn-salvar")).toHaveTextContent("true");
    expect(screen.getByTestId("force-loading")).toHaveTextContent("true");
    expect(screen.getByTestId("state-form-uuid")).toHaveTextContent("uuid-mandato-1");
    expect(screen.getByTestId("state-form-referencia")).toHaveTextContent("Mandato 2026");
  });

  test("should render without children without crashing", () => {
    expect(() => render(<MandatosProvider />)).not.toThrow();
  });

  test("should expose safe default context values and no-op setters when used without provider", async () => {
    const user = userEvent.setup();
    render(<ContextHarness />);

    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("first-page")).toHaveTextContent("0");

    await user.click(screen.getByRole("button", { name: /Alterar filtro/i }));
    await user.click(screen.getByRole("button", { name: /Alterar pagina atual/i }));
    await user.click(screen.getByRole("button", { name: /Alterar primeira pagina/i }));

    expect(screen.getByTestId("filter-referencia")).toHaveTextContent("vazio");
    expect(screen.getByTestId("current-page")).toHaveTextContent("1");
    expect(screen.getByTestId("first-page")).toHaveTextContent("0");
  });
});

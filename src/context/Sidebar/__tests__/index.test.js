import React, { useContext } from "react";
import { render, screen } from "@testing-library/react";
import { SidebarContext, SidebarContextProvider } from "../index";
import userEvent from "@testing-library/user-event";

const TestComponent = () => {
  const { sideBarStatus, setSideBarStatus, irParaUrl, setIrParaUrl } =
    useContext(SidebarContext);

  return (
    <div>
      <p data-testid="sidebar-status">{sideBarStatus ? "true" : "false"}</p>
      <p data-testid="ir-para-url">{irParaUrl ? "true" : "false"}</p>
      <button onClick={() => setSideBarStatus(false)}>Fechar Sidebar</button>
      <button onClick={() => setIrParaUrl(false)}>
        Desabilitar Ir Para URL
      </button>
    </div>
  );
};

describe("SidebarContextProvider", () => {
  it("deve renderizar os filhos e valores padrão corretamente", () => {
    render(
      <SidebarContextProvider>
        <TestComponent />
      </SidebarContextProvider>
    );

    expect(screen.getByTestId("sidebar-status")).toHaveTextContent("true");
    expect(screen.getByTestId("ir-para-url")).toHaveTextContent("true");
  });

  it("deve permitir atualizar os valores do contexto", async () => {
    render(
      <SidebarContextProvider>
        <TestComponent />
      </SidebarContextProvider>
    );

    await userEvent.click(screen.getByText("Fechar Sidebar"));
    await userEvent.click(screen.getByText("Desabilitar Ir Para URL"));

    expect(screen.getByTestId("sidebar-status")).toHaveTextContent("false");
    expect(screen.getByTestId("ir-para-url")).toHaveTextContent("false");
  });
});

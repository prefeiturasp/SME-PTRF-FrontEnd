import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Tabs from "../index";

const mockTabs = [
  { uuid: "tab1", label: "Tab 1" },
  { uuid: "tab2", label: "Tab 2" },
  { uuid: "tab3", label: "Tab 3" },
];

describe("Tabs Component", () => {
  it("renderiza todas as tabs", () => {
    render(<Tabs tabs={mockTabs} initialActiveTab="tab1" />);

    mockTabs.forEach((tab) => {
      expect(screen.getByText(tab.label)).toBeInTheDocument();
    });
  });

  it("define a tab ativa inicial corretamente", () => {
    render(<Tabs tabs={mockTabs} initialActiveTab="tab2" />);

    const activeTab = screen.getByText("Tab 2");
    expect(activeTab).toHaveClass("btn-escolhe-acao-active");
  });

  it("altera a aba ativa ao clicar", () => {
    render(<Tabs tabs={mockTabs} initialActiveTab="tab1" />);

    const tabToClick = screen.getByText("Tab 3");
    fireEvent.click(tabToClick);

    expect(tabToClick).toHaveClass("btn-escolhe-acao-active");
    expect(screen.getByText("Tab 1")).not.toHaveClass(
      "btn-escolhe-acao-active"
    );
  });

  it("chama onTabClick com argumentos corretos", () => {
    const handleClick = jest.fn();
    render(
      <Tabs tabs={mockTabs} initialActiveTab="tab1" onTabClick={handleClick} />
    );

    const tabToClick = screen.getByText("Tab 3");
    fireEvent.click(tabToClick);

    expect(handleClick).toHaveBeenCalledWith("tab3", 2);
  });

  it("atualiza a aba ativa se a propriedade initialActiveTab for alterada", () => {
    const { rerender } = render(
      <Tabs tabs={mockTabs} initialActiveTab="tab1" />
    );

    expect(screen.getByText("Tab 1")).toHaveClass("btn-escolhe-acao-active");

    rerender(<Tabs tabs={mockTabs} initialActiveTab="tab2" />);
    expect(screen.getByText("Tab 2")).toHaveClass("btn-escolhe-acao-active");
  });
});

import React from "react";
import { render, screen, act } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../index";

const FALLBACK_COLOR = "#01585e";
const STORAGE_KEY = "TEMA_SIGESCOLA";

const TestComponent = () => {
  const { theme } = useTheme();
  return <div data-testid="theme-value">{theme}</div>;
};

const renderWithTheme = () =>
  render(
    <ThemeProvider>
      <TestComponent />
    </ThemeProvider>
  );

describe("ThemeProvider", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.style.removeProperty("--color-primary");
  });

  it("usa o fallback quando não há tema salvo no storage", () => {
    renderWithTheme();
    expect(screen.getByTestId("theme-value")).toHaveTextContent(FALLBACK_COLOR);
  });

  it("usa o fallback quando o storage tem valor inválido", () => {
    const invalidValues = ["auto", "undefined", "null", "", "blue", "123456"];
    invalidValues.forEach((value) => {
      localStorage.setItem(STORAGE_KEY, value);
      const { unmount } = renderWithTheme();
      expect(screen.getByTestId("theme-value")).toHaveTextContent(FALLBACK_COLOR);
      unmount();
    });
  });

  it("usa a cor salva no storage quando é um hex válido", () => {
    localStorage.setItem(STORAGE_KEY, "#ff5733");
    renderWithTheme();
    expect(screen.getByTestId("theme-value")).toHaveTextContent("#ff5733");
  });

  it("aplica --color-primary no documento após renderizar", () => {
    renderWithTheme();
    expect(
      document.documentElement.style.getPropertyValue("--color-primary")
    ).toBe(FALLBACK_COLOR);
  });

  it("aplica --color-primary com a cor salva no storage", () => {
    localStorage.setItem(STORAGE_KEY, "#ff5733");
    renderWithTheme();
    expect(
      document.documentElement.style.getPropertyValue("--color-primary")
    ).toBe("#ff5733");
  });

  it("salva a cor no storage ao aplicar o tema", () => {
    renderWithTheme();
    expect(localStorage.getItem(STORAGE_KEY)).toBe(FALLBACK_COLOR);
  });

  it("atualiza --color-primary e o storage ao chamar setTheme com cor válida", () => {
    const SetThemeComponent = () => {
      const { setTheme } = useTheme();
      return (
        <button onClick={() => setTheme("#123456")}>Mudar tema</button>
      );
    };

    render(
      <ThemeProvider>
        <TestComponent />
        <SetThemeComponent />
      </ThemeProvider>
    );

    act(() => {
      screen.getByText("Mudar tema").click();
    });

    expect(screen.getByTestId("theme-value")).toHaveTextContent("#123456");
    expect(document.documentElement.style.getPropertyValue("--color-primary")).toBe("#123456");
    expect(localStorage.getItem(STORAGE_KEY)).toBe("#123456");
  });
});

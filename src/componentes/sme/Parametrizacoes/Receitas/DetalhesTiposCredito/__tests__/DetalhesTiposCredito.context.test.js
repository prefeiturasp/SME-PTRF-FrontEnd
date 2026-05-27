import React from "react";
import { render } from "@testing-library/react";

describe("DetalhesTiposCredito - Context", () => {
  it("deve importar provider sem erros", () => {
    const { DetalhesTipoCreditoProvider } = require("../context/DetalhesTiposCredito");
    expect(DetalhesTipoCreditoProvider).toBeDefined();
  });

  it("deve ter contexto definido", () => {
    const { DetalhesTipoCreditoContext } = require("../context/DetalhesTiposCredito");
    expect(DetalhesTipoCreditoContext).toBeDefined();
  });

  it("deve ser um componente React válido", () => {
    const { DetalhesTipoCreditoProvider } = require("../context/DetalhesTiposCredito");
    expect(typeof DetalhesTipoCreditoProvider).toBe("function");
  });

  it("deve exportar como named export", () => {
    const exports = require("../context/DetalhesTiposCredito");
    expect(exports).toHaveProperty("DetalhesTipoCreditoProvider");
    expect(exports).toHaveProperty("DetalhesTipoCreditoContext");
  });

  it("deve aceitar children como prop", () => {
    const { DetalhesTipoCreditoProvider } = require("../context/DetalhesTiposCredito");
    const { container } = render(
      <DetalhesTipoCreditoProvider>
        <div data-testid="child">Conteúdo</div>
      </DetalhesTipoCreditoProvider>
    );
    expect(container.querySelector('[data-testid="child"]')).toBeInTheDocument();
  });

  it("deve renderizar múltiplos children", () => {
    const { DetalhesTipoCreditoProvider } = require("../context/DetalhesTiposCredito");
    const { container } = render(
      <DetalhesTipoCreditoProvider>
        <div data-testid="child1">Conteúdo 1</div>
        <div data-testid="child2">Conteúdo 2</div>
      </DetalhesTipoCreditoProvider>
    );
    expect(container.querySelector('[data-testid="child1"]')).toBeInTheDocument();
    expect(container.querySelector('[data-testid="child2"]')).toBeInTheDocument();
  });
});

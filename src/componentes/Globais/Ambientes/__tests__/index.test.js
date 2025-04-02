import { render, screen, waitFor } from "@testing-library/react";
import React from "react";
import { Ambientes } from "../index";
import { getAmbientes } from "../../../../services/Core.service";

jest.mock("../../../../services/Core.service", () => ({
  getAmbientes: jest.fn(),
}));

describe("Ambientes Component", () => {
  afterEach(() => {
    delete window.location;
  });

  it("deve exibir o nome do ambiente se encontrado", async () => {
    const mockAmbientes = [
      { id: 1, prefixo: "dev", nome: "Dev" },
      { id: 2, prefixo: "hom", nome: "Hom" },
    ];
    getAmbientes.mockResolvedValue(mockAmbientes);

    Object.defineProperty(window, "location", {
      value: { href: "http://dev.exemplo.com" },
    });

    render(<Ambientes />);

    await waitFor(() => {
      expect(screen.getByText("Dev")).toBeInTheDocument();
    });
  });

  it('deve exibir "Local" se o ambiente não for encontrado', async () => {
    const mockAmbientes = [
      { id: 1, prefixo: "dev", nome: "Dev" },
      { id: 2, prefixo: "hom", nome: "Hom" },
    ];
    getAmbientes.mockResolvedValue(mockAmbientes);

    Object.defineProperty(window, "location", {
      value: { href: "http://test.exemplo.com" },
    });

    render(<Ambientes />);

    const localText = await screen.findByText("Local");
    expect(localText).toBeInTheDocument();
  });
});

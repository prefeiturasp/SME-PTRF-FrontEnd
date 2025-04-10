import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { Versao } from "../index";
import { getVersaoApi } from "../../../../services/Core.service";

jest.mock("../../../../services/Core.service", () => ({
  getVersaoApi: jest.fn(),
}));

jest.mock("../../../../../package.json", () => ({
  version: "9.8.7",
}));

describe("Versao", () => {
  it("deve exibir a versão do front e da API", async () => {
    getVersaoApi.mockResolvedValue("1.2.3");

    render(<Versao />);

    await waitFor(() => {
      expect(screen.getByText("9.8.7 (API:1.2.3)")).toBeInTheDocument();
    });
  });
});

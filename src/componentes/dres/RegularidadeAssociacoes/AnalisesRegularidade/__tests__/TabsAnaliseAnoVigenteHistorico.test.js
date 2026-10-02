import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TabsAnaliseAnoVigenteHistorico } from "../TabsAnaliseAnoVigenteHistorico";

jest.mock("../RegularidadeAssociacaoNoAno", () => ({
  RegularidadeAssociacaoNoAno: ({ ano, apenasLeitura }) => (
    <p>
      Regularidade {ano === null || ano === undefined ? "sem ano" : ano}
      {apenasLeitura ? " somente leitura" : ""}
    </p>
  ),
}));

jest.mock("../../SelecaoAnoAnaliseRegularidade", () => ({
  SelecaoAnoAnaliseRegularidade: ({ handleChangeAnoSelected }) => (
    <button type="button" onClick={() => handleChangeAnoSelected(2020)}>
      Selecionar 2020
    </button>
  ),
}));

describe("TabsAnaliseAnoVigenteHistorico", () => {
  it("deve exibir a regularidade do ano vigente e o histórico somente leitura", async () => {
    const user = userEvent.setup();
    const anoVigente = new Date().getFullYear();

    render(<TabsAnaliseAnoVigenteHistorico associacaoUuid="associacao-1" />);

    expect(screen.getByText("Regularidade da associação")).toBeInTheDocument();
    expect(screen.getByText(`Ano vigente: ${anoVigente}`)).toBeInTheDocument();
    expect(screen.getByText(`Regularidade ${anoVigente}`)).toBeInTheDocument();
    expect(screen.getByText("Regularidade sem ano somente leitura")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Selecionar 2020" }));

    expect(screen.getByText("Regularidade 2020 somente leitura")).toBeInTheDocument();
  });
});

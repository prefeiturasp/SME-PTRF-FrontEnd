import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ModalPeriodoFechadoVisualizacao from "../../components/ModalPeriodoFechadoVisualizacao";

describe("ModalPeriodoFechadoVisualizacao", () => {
  it("deve exibir o texto de bens produzidos no lugar de lançamentos", () => {
    render(<ModalPeriodoFechadoVisualizacao show={true} handleClose={jest.fn()} />);

    expect(screen.getByText("Período Fechado")).toBeInTheDocument();
    expect(
      screen.getByText(/inclusão ou edição de bens produzidos/)
    ).toBeInTheDocument();
    expect(screen.queryByText(/lançamentos \(créditos ou despesas\)/)).not.toBeInTheDocument();
  });

  it("deve não exibir o texto do modal de inclusão de bem produzido", () => {
    render(<ModalPeriodoFechadoVisualizacao show={true} handleClose={jest.fn()} />);

    expect(
      screen.queryByText(/Para inclusão do bem produzido é necessário reabrir ou selecionar despesas/)
    ).not.toBeInTheDocument();
  });

  it("deve solicitar o fechamento ao clicar em Fechar", async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(<ModalPeriodoFechadoVisualizacao show={true} handleClose={handleClose} />);

    await user.click(screen.getByRole("button", { name: "Fechar" }));
    expect(handleClose).toHaveBeenCalled();
  });
});

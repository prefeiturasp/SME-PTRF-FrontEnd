import React from "react";
import { render, screen } from "@testing-library/react";
import { ModalInfoPerdeuAcesso } from "../ModalInfoPerdeuAcesso";
import userEvent from "@testing-library/user-event";

describe("ModalInfoPerdeuAcesso", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("deve renderizar o modal quando 'show' for true", () => {
    render(
      <ModalInfoPerdeuAcesso show={true} handleClose={jest.fn()} titulo="Acesso perdido" />
    );
    expect(screen.getByRole("dialog", {selector: ".fade.modal-backdrop.show"})).toBeInTheDocument();
  });

  test("não deve renderizar o modal quando 'show' for false", () => {
    render(
      <ModalInfoPerdeuAcesso show={false} handleClose={jest.fn()} titulo="Acesso perdido" />
    );
    expect(screen.queryByTestId("modal")).not.toBeInTheDocument();
  });

  test("deve exibir unidades que o usuário perdeu acesso", () => {
    localStorage.setItem("INFO_PERDEU_ACESSO",
      JSON.stringify({ unidades_que_perdeu_acesso: [
        { tipo_unidade: "SME", nome_unidade: "Unidade A" },
        { tipo_unidade: "DRE", cod_eol: "123", nome_unidade: "Unidade B" },
      ] })
    );
    
    render(<ModalInfoPerdeuAcesso show={true} handleClose={jest.fn()} titulo="Acesso perdido" />);

    expect(screen.getByText("SME Unidade A")).toBeInTheDocument();
  });

  test("deve exibir mensagem se estiver presente no localStorage", () => {
    localStorage.setItem("INFO_PERDEU_ACESSO",
      JSON.stringify({ mensagem: "Seu acesso foi removido." })
    );
    
    render(<ModalInfoPerdeuAcesso show={true} handleClose={jest.fn()} titulo="Acesso perdido" />);

    expect(screen.getByText("Seu acesso foi removido.")).toBeInTheDocument();
  });

  test("deve chamar handleClose ao clicar no botão de fechar", async () => {
    const handleClose = jest.fn();
    render(<ModalInfoPerdeuAcesso show={true} handleClose={handleClose} titulo="Acesso perdido" />);

    await userEvent.click(screen.getByText("Fechar"));
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

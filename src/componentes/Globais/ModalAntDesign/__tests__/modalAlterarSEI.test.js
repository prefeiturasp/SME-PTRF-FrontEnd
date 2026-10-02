import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalAlterarSEI } from "../modalAlterarSEI";

describe("ModalAlterarSEI", () => {
  const receberPrestacaoDeContas = jest.fn();
  const primeiroBotaoOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve oferecer manter ou atualizar o processo SEI e cancelar a escolha", async () => {
    const user = userEvent.setup();
    render(
      <ModalAlterarSEI
        show
        titulo="Processo SEI alterado"
        receberPrestacaoDeContas={receberPrestacaoDeContas}
        primeiroBotaoTexto="Cancelar"
        primeiroBotaoOnClick={primeiroBotaoOnClick}
      />
    );

    expect(screen.getByText("Processo SEI alterado")).toBeInTheDocument();
    expect(
      screen.getByText("O processo SEI foi alterado. O que você deseja fazer?")
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Manter o número do processo SEI existente" }));
    expect(receberPrestacaoDeContas).toHaveBeenCalledWith();

    await user.click(screen.getByRole("button", { name: "Atualizar o número do processo SEI existente" }));
    expect(receberPrestacaoDeContas).toHaveBeenCalledWith("editar");

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(primeiroBotaoOnClick).toHaveBeenCalledTimes(1);
  });
});

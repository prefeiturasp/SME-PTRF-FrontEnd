import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalSelecionaRepasse } from "../ModalSelecionaRepasse";

const repasse = {
  conta_associacao: { nome: "Cheque" },
  acao_associacao: { nome: "PTRF" },
  valor_capital: 1000,
  valor_custeio: 0,
  valor_livre: 250.5,
};

describe("ModalSelecionaRepasse", () => {
  const cancelar = jest.fn();
  const trataRepasse = jest.fn();
  const setFieldValue = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve informar quando não existem repasses pendentes", () => {
    render(
      <ModalSelecionaRepasse
        show
        titulo="Selecionar repasse"
        repasses={[]}
        cancelar={cancelar}
        trataRepasse={trataRepasse}
        setFieldValue={setFieldValue}
      />
    );

    expect(screen.getByText("Selecionar repasse")).toBeInTheDocument();
    expect(
      screen.getByText("No momento não existem repasses pendentes para a associação.")
    ).toBeInTheDocument();
  });

  it("deve permitir selecionar apenas valores positivos e cancelar a escolha", async () => {
    const user = userEvent.setup();
    render(
      <ModalSelecionaRepasse
        show
        titulo="Selecionar repasse"
        repasses={[repasse]}
        cancelar={cancelar}
        trataRepasse={trataRepasse}
        setFieldValue={setFieldValue}
      />
    );

    expect(screen.getByText("Cheque")).toBeInTheDocument();
    expect(screen.getByText("PTRF")).toBeInTheDocument();

    const capital = screen.getByRole("button", { name: /1\.000,00/ });
    const livre = screen.getByRole("button", { name: /250,50/ });
    expect(screen.getAllByRole("button")).toHaveLength(3);

    await user.click(capital);
    expect(trataRepasse).toHaveBeenCalledWith(
      repasse,
      setFieldValue,
      expect.stringMatching(/1\.000,00/),
      "valor_capital"
    );

    await user.click(livre);
    expect(trataRepasse).toHaveBeenCalledWith(
      repasse,
      setFieldValue,
      expect.stringMatching(/250,50/),
      "valor_livre"
    );

    await user.click(screen.getByRole("button", { name: "Cancelar" }));
    expect(cancelar).toHaveBeenCalledTimes(1);
  });
});

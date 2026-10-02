import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModalConcluirAcertoComPendencias } from "../ModalConcluirAcertoComPendencias";

describe("ModalConcluirAcertoComPendencias", () => {
  const handleClose = jest.fn();
  const onIrParaAnaliseDre = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve explicar a pendência e oferecer a análise da DRE ou o fechamento", async () => {
    const user = userEvent.setup();
    render(
      <ModalConcluirAcertoComPendencias
        show
        titulo="Acerto com pendências"
        handleClose={handleClose}
        onIrParaAnaliseDre={onIrParaAnaliseDre}
      />
    );

    expect(screen.getByText("Acerto com pendências")).toBeInTheDocument();
    expect(
      screen.getByText(/Não é possível concluir o acerto da prestação de contas/)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Ir para Análise DRE" }));
    await user.click(screen.getByRole("button", { name: "Fechar" }));

    expect(onIrParaAnaliseDre).toHaveBeenCalledTimes(1);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });
});

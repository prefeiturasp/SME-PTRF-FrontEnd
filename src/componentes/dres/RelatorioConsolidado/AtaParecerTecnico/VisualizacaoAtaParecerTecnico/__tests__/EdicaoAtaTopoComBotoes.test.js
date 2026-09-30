import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { TopoComBotoes } from "../EdicaoAta/TopoComBotoes";

describe("TopoComBotoes da edição da ata Component", () => {
  const renderComponente = (props = {}) => {
    const propsPadrao = {
      onSubmitFormEdicaoAta: jest.fn(),
      handleClickFecharAta: jest.fn(),
      disableBtnSalvar: false,
      formRef: { current: null },
      ...props,
    };

    render(<TopoComBotoes {...propsPadrao} />);

    return propsPadrao;
  };

  it("deve renderizar o título da edição da ata", () => {
    renderComponente();

    expect(screen.getByText("Editar ata de Parecer Técnico")).toBeInTheDocument();
  });

  describe("Botão Voltar para ata", () => {
    it("deve chamar handleClickFecharAta ao ser clicado", () => {
      const { handleClickFecharAta } = renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Voltar para ata" }));

      expect(handleClickFecharAta).toHaveBeenCalledTimes(1);
    });

    it("deve permanecer habilitado mesmo quando o salvar estiver desabilitado", () => {
      renderComponente({ disableBtnSalvar: true });

      expect(screen.getByRole("button", { name: "Voltar para ata" })).toBeEnabled();
    });
  });

  describe("Botão Salvar edições", () => {
    it("deve chamar onSubmitFormEdicaoAta ao ser clicado", () => {
      const { onSubmitFormEdicaoAta } = renderComponente();

      fireEvent.click(screen.getByRole("button", { name: "Salvar edições" }));

      expect(onSubmitFormEdicaoAta).toHaveBeenCalledTimes(1);
    });

    it("deve estar desabilitado e não salvar quando disableBtnSalvar for true", () => {
      const { onSubmitFormEdicaoAta } = renderComponente({ disableBtnSalvar: true });

      const botaoSalvar = screen.getByRole("button", { name: "Salvar edições" });

      expect(botaoSalvar).toBeDisabled();

      fireEvent.click(botaoSalvar);

      expect(onSubmitFormEdicaoAta).not.toHaveBeenCalled();
    });
  });
});

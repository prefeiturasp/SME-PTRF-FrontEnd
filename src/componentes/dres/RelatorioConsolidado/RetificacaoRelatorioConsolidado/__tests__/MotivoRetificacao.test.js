import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MotivoRetificacao } from "../MotivoRetificacao";

describe("MotivoRetificacao", () => {
  const setup = (over = {}) => {
    const props = {
      relatorioConsolidado: { motivo_retificacao: "Motivo salvo" },
      handleEditarMotivoRetificacao: jest.fn(),
      estadoBotaoSalvarMotivo: false,
      mudarEstadoBotaoSalvarMotivo: jest.fn(),
      ehEdicaoRetificacao: true,
      formRef: React.createRef(),
      ...over,
    };
    render(<MotivoRetificacao {...props} />);
    return props;
  };

  it("edição: preenche com motivo existente e botão desabilitado", () => {
    setup();
    expect(screen.getByRole("textbox")).toHaveValue("Motivo salvo");
    expect(screen.getByRole("button", { name: "Salvar" })).toBeDisabled();
  });

  it("edição sem motivo no relatório usa string vazia", () => {
    setup({ relatorioConsolidado: {} });
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("edição com relatorioConsolidado falso", () => {
    setup({ relatorioConsolidado: false });
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

  it("não edição: textarea vazio e sem botão Salvar", () => {
    setup({ ehEdicaoRetificacao: false });
    expect(screen.getByRole("textbox")).toHaveValue("");
    expect(screen.queryByRole("button", { name: "Salvar" })).not.toBeInTheDocument();
  });

  it("digitar chama mudarEstadoBotaoSalvarMotivo(true) e esvaziar chama (false)", () => {
    const props = setup({ ehEdicaoRetificacao: false });
    const ta = screen.getByRole("textbox");
    fireEvent.change(ta, { target: { name: "motivo_retificacao", value: "novo" } });
    expect(props.mudarEstadoBotaoSalvarMotivo).toHaveBeenLastCalledWith(true);
    expect(props.formRef.current.values.motivo_retificacao).toBe("novo");
    fireEvent.change(ta, { target: { name: "motivo_retificacao", value: "" } });
    expect(props.mudarEstadoBotaoSalvarMotivo).toHaveBeenLastCalledWith(false);
  });

  it("salvar habilitado chama handler, mostra 'Salvo' e desabilita; digitar esconde 'Salvo'", () => {
    const props = setup({ estadoBotaoSalvarMotivo: true });
    const btn = screen.getByRole("button", { name: "Salvar" });
    expect(btn).toBeEnabled();
    expect(btn).toHaveClass("btn-success");
    fireEvent.click(btn);
    expect(props.handleEditarMotivoRetificacao).toHaveBeenCalled();
    expect(props.mudarEstadoBotaoSalvarMotivo).toHaveBeenLastCalledWith(false);
    expect(screen.getByText(/Salvo/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("textbox"), { target: { name: "motivo_retificacao", value: "x" } });
    expect(screen.queryByText(/Salvo/)).not.toBeInTheDocument();
  });
});

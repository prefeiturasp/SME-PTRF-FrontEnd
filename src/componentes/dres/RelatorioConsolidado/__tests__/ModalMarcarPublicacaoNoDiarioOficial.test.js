import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ModalMarcarPublicacaoNoDiarioOficial } from "../ModalMarcarPublicacaoNoDiarioOficial";

jest.mock("../MarcarPublicacaoNoDiarioOficial/FormMarcarPublicacaoNoDiarioOficial", () => (props) => (
  <div data-testid="form-marcar">
    <span>{props.textoMsg}</span>
    <span>{props.textoBotaoSalvar}</span>
    <button onClick={props.handleClose}>fechar-form</button>
    <button onClick={props.carregaConsolidadosDreJaPublicadosProximaPublicacao}>carrega</button>
  </div>
));

describe("ModalMarcarPublicacaoNoDiarioOficial", () => {
  it("renderiza o form dentro do modal e repassa props", () => {
    const handleClose = jest.fn();
    const carrega = jest.fn();
    render(
      <ModalMarcarPublicacaoNoDiarioOficial
        show
        titulo="Marcar publicação"
        handleClose={handleClose}
        consolidadoDre={{ uuid: "x" }}
        carregaConsolidadosDreJaPublicadosProximaPublicacao={carrega}
        textoMsg="Mensagem"
        textoBotaoSalvar="Salvar já"
      />
    );
    expect(screen.getByText("Marcar publicação")).toBeInTheDocument();
    expect(screen.getByTestId("form-marcar")).toBeInTheDocument();
    expect(screen.getByText("Mensagem")).toBeInTheDocument();
    expect(screen.getByText("Salvar já")).toBeInTheDocument();
    fireEvent.click(screen.getByText("fechar-form"));
    expect(handleClose).toHaveBeenCalled();
    fireEvent.click(screen.getByText("carrega"));
    expect(carrega).toHaveBeenCalled();
  });

  it("não renderiza com show false", () => {
    render(<ModalMarcarPublicacaoNoDiarioOficial show={false} titulo="Oculto" />);
    expect(screen.queryByText("Oculto")).not.toBeInTheDocument();
  });
});

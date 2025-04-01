import React from "react";
import { render, screen } from "@testing-library/react";
import { IconeDadosDaAssociacaoPendentes } from "../IconeDadosDaAssociacaoPendentes";

jest.mock("../../../../componentes/Globais/UI/Icon", () => ({
  Icon: ({ tooltipMessage, icon }) => (
    <div 
      data-testid="icon-mock" 
      data-tooltip={tooltipMessage} 
      data-icon={icon} 
    />
  ),
}));

describe("IconeDadosDaAssociacaoPendentes", () => {
  test("renderiza o ícone corretamente com a mensagem tooltip", () => {
    render(<IconeDadosDaAssociacaoPendentes />);
    
    const iconElement = screen.getByTestId("icon-mock");

    expect(iconElement).toBeInTheDocument();
    expect(iconElement).toHaveAttribute(
      "data-tooltip", 
      "Há campos pendentes para preenchimento"
    );
    expect(iconElement).toHaveAttribute(
      "data-icon", 
      "icone-exclamacao-vermelho"
    );
  });
});
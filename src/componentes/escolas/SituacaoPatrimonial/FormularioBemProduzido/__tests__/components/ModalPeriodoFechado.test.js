import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import ModalPeriodoFechado from "../../components/ModalPeriodoFechado";

// Mock do Modal do Ant Design
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Modal: ({ open, children, footer, onCancel }) => {
    if (!open) return null;
    return (
      <div data-testid="mock-modal">
        {children}
        {footer}
      </div>
    );
  },
  Row: ({ children, justify }) => <div data-testid="row">{children}</div>,
  Button: ({ children, onClick, ...props }) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe("Componente ModalPeriodoFechado", () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("deve renderizar o modal quando open=true", () => {
    render(<ModalPeriodoFechado open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Período Fechado")).toBeInTheDocument();
    expect(
      screen.getByText(/Para inclusão do bem produzido é necessário reabrir/)
    ).toBeInTheDocument();
  });

  it("não deve renderizar o modal quando open=false", () => {
    render(<ModalPeriodoFechado open={false} onClose={mockOnClose} />);

    expect(screen.queryByText("Período Fechado")).not.toBeInTheDocument();
  });

  it("deve exibir a mensagem completa sobre contatar a DRE", () => {
    render(<ModalPeriodoFechado open={true} onClose={mockOnClose} />);

    const mensagemCompleta = screen.getByText(
      /Para inclusão do bem produzido é necessário reabrir ou selecionar despesas de períodos posteriores\. Se o caso for reabrir, por favor, entre em contato com sua Diretoria Regional de Educação - DRE\./
    );
    expect(mensagemCompleta).toBeInTheDocument();
  });

  it("deve exibir o ícone de aviso", () => {
    const { container } = render(
      <ModalPeriodoFechado open={true} onClose={mockOnClose} />
    );

    const icone = container.querySelector("img");
    expect(icone).toBeInTheDocument();
  });

  it("deve chamar onClose ao clicar no botão Fechar", () => {
    render(<ModalPeriodoFechado open={true} onClose={mockOnClose} />);

    const botaoFechar = screen.getByTestId("botao-fechar-modal-periodo-fechado");
    fireEvent.click(botaoFechar);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("deve renderizar o botão Fechar com o texto correto", () => {
    render(<ModalPeriodoFechado open={true} onClose={mockOnClose} />);

    const botaoFechar = screen.getByTestId("botao-fechar-modal-periodo-fechado");
    expect(botaoFechar).toHaveTextContent("Fechar");
  });

  it("deve possuir o data-testid correto no botão", () => {
    render(<ModalPeriodoFechado open={true} onClose={mockOnClose} />);

    const botao = screen.getByTestId("botao-fechar-modal-periodo-fechado");
    expect(botao).toBeInTheDocument();
  });

  it("deve renderizar o modal corretamente", () => {
    const { container } = render(
      <ModalPeriodoFechado open={true} onClose={mockOnClose} />
    );

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
  });
});

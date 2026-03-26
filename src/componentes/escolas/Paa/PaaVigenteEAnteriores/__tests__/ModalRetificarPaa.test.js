import { render, screen, fireEvent } from "@testing-library/react";
import { ModalRetificarPAA } from "../ModalRetificarPaa";


describe("ModalRetificarPAA", () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onConfirm: jest.fn(),
    paaData: { id: 1 },
    statusDocumento: { mensagem: "Documento inválido" },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve renderizar o modal com título", () => {
    render(<ModalRetificarPAA {...defaultProps} />);

    expect(screen.getByText("Retificar o PAA")).toBeInTheDocument();
  });

  it("deve exibir a mensagem do statusDocumento", () => {
    render(<ModalRetificarPAA {...defaultProps} />);

    expect(screen.getByText(/Documento inválido/i)).toBeInTheDocument();
  });

  it("botão Retificar deve iniciar desabilitado", () => {
    render(<ModalRetificarPAA {...defaultProps} />);

    const botao = screen.getByRole("button", { name: /retificar/i });
    expect(botao).toBeDisabled();
  });

  it("deve habilitar botão ao digitar justificativa", () => {
    render(<ModalRetificarPAA {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Digite a justificativa aqui");
    const botao = screen.getByRole("button", { name: /retificar/i });

    fireEvent.change(textarea, {
      target: { value: "Motivo da retificação" },
    });

    expect(botao).not.toBeDisabled();
  });

  it("deve chamar onClose ao clicar em Cancelar", () => {
    render(<ModalRetificarPAA {...defaultProps} />);

    const botaoCancelar = screen.getByRole("button", { name: /cancelar/i });
    fireEvent.click(botaoCancelar);

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it("deve chamar onConfirm ao clicar em Retificar", () => {
    render(<ModalRetificarPAA {...defaultProps} />);

    const textarea = screen.getByPlaceholderText("Digite a justificativa aqui");
    const botao = screen.getByRole("button", { name: /retificar/i });

    fireEvent.change(textarea, {
      target: { value: "Motivo da retificação" },
    });

    fireEvent.click(botao);

    expect(defaultProps.onConfirm).toHaveBeenCalled();
  });

  it("deve limpar justificativa ao reabrir modal", () => {
    const { rerender } = render(
      <ModalRetificarPAA {...defaultProps} open={true} />
    );

    const textarea = screen.getByPlaceholderText("Digite a justificativa aqui");

    fireEvent.change(textarea, {
      target: { value: "Teste" },
    });

    expect(textarea).toHaveValue("Teste");

    // fecha
    rerender(<ModalRetificarPAA {...defaultProps} open={false} />);

    // reabre
    rerender(<ModalRetificarPAA {...defaultProps} open={true} />);

    expect(screen.getByPlaceholderText("Digite a justificativa aqui")).toHaveValue("");
  });
});
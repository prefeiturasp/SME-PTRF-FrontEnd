import React from "react";
import { render, screen, fireEvent, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModalSalvarOrdenacao } from "../../components/ReordenarAcoes/components/ModalSalvarOrdenacao";
import { useReordenarAcoesContext } from "../../components/ReordenarAcoes/hooks/useReordenarAcoesContext";

// Configura o atributo de teste do Testing Library caso o projeto utilize 'data-qa'
configure({ testIdAttribute: "data-qa" });

// Mock do hook de contexto do componente
jest.mock("../../components/ReordenarAcoes/hooks/useReordenarAcoesContext", () => ({
  useReordenarAcoesContext: jest.fn(),
}));

// Mock do componente ModalInformativoOrdenacaoAcoes
jest.mock(
  "../../../../componentes/ModalInformativoOrdenacaoAcoes",
  () => ({
    ModalInformativoOrdenacaoAcoes: ({
      open,
      onOk,
      okText,
      onCancel,
      cancelText,
      cancelButtonProps,
      titulo,
      bodyText,
    }) => {
      if (!open) return null;
      return (
        <div data-testid="modal-salvar-ordenacao" data-qa="modal-salvar-ordenacao">
          <h2>{titulo}</h2>
          <div>{bodyText}</div>
          <button
            data-testid="btn-cancelar"
            data-qa="btn-cancelar"
            onClick={onCancel}
            className={cancelButtonProps?.className}
          >
            {cancelText}
          </button>
          <button data-testid="btn-salvar" data-qa="btn-salvar" onClick={onOk}>
            {okText}
          </button>
        </div>
      );
    },
  })
);

describe("Componente <ModalSalvarOrdenacao />", () => {
  const mockHandleCloseModalSalvarOrdenacao = jest.fn();
  const mockHandleConfirmModalSalvarOrdenacao = jest.fn();

  const defaultContextValues = {
    showModalSalvarOrdenacao: true,
    handleCloseModalSalvarOrdenacao: mockHandleCloseModalSalvarOrdenacao,
    handleConfirmModalSalvarOrdenacao: mockHandleConfirmModalSalvarOrdenacao,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useReordenarAcoesContext.mockReturnValue(defaultContextValues);
  });

  test("deve renderizar o modal com título, textos dos botões e mensagens do corpo quando aberto", () => {
    render(<ModalSalvarOrdenacao />);

    // Valida o título do modal
    expect(
      screen.getByRole("heading", { level: 2, name: "Confirmar ordenação" })
    ).toBeInTheDocument();

    // Valida as mensagens do corpo
    expect(
      screen.getByText(
        /Ao salvar, a ordenação será exibida em todas as listas de ações\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Deseja realmente salvar as alterações\?/i)
    ).toBeInTheDocument();

    // Valida os botões
    const btnSalvar = screen.getByRole("button", { name: "Salvar" });
    const btnCancelar = screen.getByRole("button", { name: "Cancelar" });

    expect(btnSalvar).toBeInTheDocument();
    expect(btnCancelar).toBeInTheDocument();
    expect(btnCancelar).toHaveClass("btn-base-verde-outline");
  });

  test("não deve renderizar a modal quando showModalSalvarOrdenacao for false", () => {
    useReordenarAcoesContext.mockReturnValue({
      ...defaultContextValues,
      showModalSalvarOrdenacao: false,
    });

    render(<ModalSalvarOrdenacao />);

    expect(
      screen.queryByTestId("modal-salvar-ordenacao")
    ).not.toBeInTheDocument();
  });

  test("deve chamar handleConfirmModalSalvarOrdenacao ao clicar no botão 'Salvar'", () => {
    render(<ModalSalvarOrdenacao />);

    const btnSalvar = screen.getByRole("button", { name: "Salvar" });
    fireEvent.click(btnSalvar);

    expect(mockHandleConfirmModalSalvarOrdenacao).toHaveBeenCalledTimes(1);
  });

  test("deve chamar handleCloseModalSalvarOrdenacao ao clicar no botão 'Cancelar'", () => {
    render(<ModalSalvarOrdenacao />);

    const btnCancelar = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(btnCancelar);

    expect(mockHandleCloseModalSalvarOrdenacao).toHaveBeenCalledTimes(1);
  });
});
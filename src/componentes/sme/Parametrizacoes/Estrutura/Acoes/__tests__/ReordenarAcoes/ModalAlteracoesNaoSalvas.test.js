import React from "react";
import { render, screen, fireEvent, configure } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ModalAlteracoesNaoSalvas } from "../../components/ReordenarAcoes/components/ModalAlteracoesNaoSalvas";
import { useReordenarAcoesContext } from "../../components/ReordenarAcoes/hooks/useReordenarAcoesContext";

// Configura o atributo de seletores do Testing Library para utilizar 'data-qa' caso o projeto utilize
configure({ testIdAttribute: "data-qa" });

// Mock do hook de contexto do componente
jest.mock("../../components/ReordenarAcoes/hooks/useReordenarAcoesContext", () => ({
  useReordenarAcoesContext: jest.fn(),
}));

// Mock do componente genérico ModalInformativoOrdenacaoAcoes
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
        <div data-testid="modal-informativo-ordenacao" data-qa="modal-informativo-ordenacao">
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
          <button data-testid="btn-confirmar" data-qa="btn-confirmar" onClick={onOk}>
            {okText}
          </button>
        </div>
      );
    },
  })
);

describe("Componente <ModalAlteracoesNaoSalvas />", () => {
  const mockHandleCloseModalAlteracoesNaoSalvas = jest.fn();
  const mockHandleConfirmModalAlteracoesNaoSalvas = jest.fn();

  const defaultContextValues = {
    showModalAlteracoesNaoSalvas: true,
    handleCloseModalAlteracoesNaoSalvas: mockHandleCloseModalAlteracoesNaoSalvas,
    handleConfirmModalAlteracoesNaoSalvas: mockHandleConfirmModalAlteracoesNaoSalvas,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useReordenarAcoesContext.mockReturnValue(defaultContextValues);
  });

  test("deve renderizar o modal com título, texto, botões e classe CSS corretos quando visível", () => {
    render(<ModalAlteracoesNaoSalvas />);

    // Valida exibição do título
    expect(screen.getByRole("heading", { level: 2, name: "Atenção!" })).toBeInTheDocument();

    // Valida o corpo do texto
    expect(
      screen.getByText(/Foram feitas alterações na ordenação das ações\./i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Você deseja salvar as alterações\?/i)
    ).toBeInTheDocument();

    // Valida o botão de confirmação ("Salvar")
    const btnSalvar = screen.getByRole("button", { name: "Salvar" });
    expect(btnSalvar).toBeInTheDocument();

    // Valida o botão de cancelamento ("Cancelar") e a classe CSS customizada
    const btnCancelar = screen.getByRole("button", { name: "Cancelar" });
    expect(btnCancelar).toBeInTheDocument();
    expect(btnCancelar).toHaveClass("btn-base-verde-outline");
  });

  test("não deve renderizar a modal quando showModalAlteracoesNaoSalvas for false", () => {
    useReordenarAcoesContext.mockReturnValue({
      ...defaultContextValues,
      showModalAlteracoesNaoSalvas: false,
    });

    render(<ModalAlteracoesNaoSalvas />);

    expect(screen.queryByTestId("modal-informativo-ordenacao")).not.toBeInTheDocument();
  });

  test("deve chamar handleConfirmModalAlteracoesNaoSalvas ao clicar no botão 'Salvar'", () => {
    render(<ModalAlteracoesNaoSalvas />);

    const btnSalvar = screen.getByRole("button", { name: "Salvar" });
    fireEvent.click(btnSalvar);

    expect(mockHandleConfirmModalAlteracoesNaoSalvas).toHaveBeenCalledTimes(1);
  });

  test("deve chamar handleCloseModalAlteracoesNaoSalvas ao clicar no botão 'Cancelar'", () => {
    render(<ModalAlteracoesNaoSalvas />);

    const btnCancelar = screen.getByRole("button", { name: "Cancelar" });
    fireEvent.click(btnCancelar);

    expect(mockHandleCloseModalAlteracoesNaoSalvas).toHaveBeenCalledTimes(1);
  });
});
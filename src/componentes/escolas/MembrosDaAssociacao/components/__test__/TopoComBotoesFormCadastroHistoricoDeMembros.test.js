import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { TopoComBotoesFormCadastroHistoricoDeMembros } from "../TopoComBotoesFormCadastroHistoricoDeMembros";

import { useGetComposicao } from "../../hooks/useGetComposicao";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import { RetornaSeTemPermissaoEdicaoHistoricoDeMembros } from "../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";

jest.mock("../../hooks/useGetComposicao");

jest.mock("../../../../../hooks/Globais/useDataTemplate");

jest.mock(
  "../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros",
  () => ({
    RetornaSeTemPermissaoEdicaoHistoricoDeMembros: jest.fn(() => true),
  })
);

describe("TopoComBotoesFormCadastroHistoricoDeMembros", () => {
  const mockOnInformarSaida = jest.fn();

  const createDefaultProps = () => ({
    composicaoUuid: "uuid-123",
    cargo: {},
    isValid: true,
    retornaSeEhComposicaoVigente: jest.fn(() => true),
    onInformarSaida: mockOnInformarSaida,
  });

  beforeEach(() => {
    jest.clearAllMocks();

    useGetComposicao.mockReturnValue({
      data: {
        mandato: {
          data_inicial: "2024-01-01",
          data_final: "2024-12-31",
        },
      },
    });

    useDataTemplate.mockReturnValue((_, __, data) => data);

    RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);
  });

  const renderComponent = (props = {}) =>
    render(
      <MemoryRouter>
            <TopoComBotoesFormCadastroHistoricoDeMembros
                {...createDefaultProps()}
                {...props}
            />
      </MemoryRouter>
    );

describe("renderização", () => {
    it("deve renderizar título de adicionar membro quando não existir cargo.uuid", () => {
      renderComponent();

      expect(
        screen.getByRole("heading", { name: /adicionar membro/i })
      ).toBeInTheDocument();
    });

    it("deve renderizar título de editar membro quando existir cargo.uuid", () => {
      renderComponent({
        cargo: {
          uuid: "cargo-1",
        },
      });

      expect(
        screen.getByRole("heading", { name: /editar membro/i })
      ).toBeInTheDocument();
    });

    it("deve exibir período do mandato", () => {
      renderComponent();

      expect(
        screen.getByText(/mandato:/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/2024-01-01 até 2024-12-31/i)
      ).toBeInTheDocument();
    });

    it("deve renderizar link voltar", () => {
      renderComponent();

      const link = screen.getByRole("link", {
        name: /voltar/i,
      });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute(
        "href",
        "/membros-da-associacao"
      );
    });

    it("não deve quebrar quando não houver mandato", () => {
      useGetComposicao.mockReturnValue({
        data: {},
      });

      renderComponent();

      expect(screen.getByText(/mandato:/i)).toBeInTheDocument();
    });
  });

  describe("botão informar saída", () => {
      it("deve exibir botão informar saída quando estiver editando", () => {
        renderComponent({
          cargo: {
            uuid: "cargo-123",
          },
        });

        expect(
          screen.getByRole("button", {
            name: /informar saída/i,
          })
        ).toBeInTheDocument();
      });

      it("não deve exibir botão informar saída quando estiver adicionando", () => {
        renderComponent();

        expect(
          screen.queryByRole("button", {
            name: /informar saída/i,
          })
        ).not.toBeInTheDocument();
      });

      it("deve executar callback ao clicar em informar saída", () => {
          renderComponent({
            cargo: {
              uuid: "cargo-123",
            },
          });
          
          const botao = screen.getByRole("button", {
            name: /informar saída/i,
          });

          expect(botao).toBeEnabled();

          fireEvent.click(botao);

          expect(mockOnInformarSaida).toHaveBeenCalledTimes(1);
      });
  });

  describe("estado habilitado", () => {
    it("deve habilitar botão salvar quando formulário for válido, composição vigente e usuário possuir permissão", () => {
      renderComponent();
      
      expect(
        screen.getByRole("button", {
          name: /salvar/i,
        })
      ).toBeEnabled();
    });

    it("deve habilitar botão informar saída quando todas condições forem atendidas", () => {
      renderComponent({
        cargo: {
          uuid: "cargo-123",
        },
      });

      expect(
        screen.getByRole("button", {
          name: /informar saída/i,
        })
      ).toBeEnabled();
    });
  });

  describe("estado desabilitado", () => {
    it("deve desabilitar salvar quando formulário for inválido", () => {
      renderComponent({
        isValid: false,
      });

      expect(
        screen.getByRole("button", {
          name: /salvar/i,
        })
      ).toBeDisabled();
    });

    it("deve desabilitar salvar quando composição não for vigente", () => {
      renderComponent({
        retornaSeEhComposicaoVigente: jest.fn(() => false),
      });

      expect(
        screen.getByRole("button", {
          name: /salvar/i,
        })
      ).toBeDisabled();
    });

    it("deve desabilitar salvar quando usuário não possuir permissão", () => {
      RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);

      renderComponent();

      expect(
        screen.getByRole("button", {
          name: /salvar/i,
        })
      ).toBeDisabled();
    });

    it("deve desabilitar informar saída quando formulário for inválido", () => {
      renderComponent({
        cargo: {
          uuid: "cargo-123",
        },
        isValid: false,
      });

      expect(
        screen.getByRole("button", {
          name: /informar saída/i,
        })
      ).toBeDisabled();
    });

    it("deve desabilitar informar saída quando composição não for vigente", () => {
      renderComponent({
        cargo: {
          uuid: "cargo-123",
        },
        retornaSeEhComposicaoVigente: jest.fn(() => false),
      });

      expect(
        screen.getByRole("button", {
          name: /informar saída/i,
        })
      ).toBeDisabled();
    });

    it("deve desabilitar informar saída quando usuário não possuir permissão", () => {
      RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(false);

      renderComponent({
        cargo: {
          uuid: "cargo-123",
        },
      });

      expect(
        screen.getByRole("button", {
          name: /informar saída/i,
        })
      ).toBeDisabled();
    });
  });
});
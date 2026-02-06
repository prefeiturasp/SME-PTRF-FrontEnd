import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { FormDadosDasContas } from "../index";

jest.mock("../BarraStatusEncerramentoConta", () => ({
  BarraStatusEncerramentoConta: () => <div data-testid="barra-status">Barra Status</div>,
}));

jest.mock("../CardSaldoEncerramentoConta", () => ({
  CardSaldoEncerramentoConta: () => <div data-testid="card-saldo">Card Saldo</div>,
}));

describe("FormDadosDasContas - Agrupamento por Recurso", () => {
  const defaultProps = {
    intialValues: [],
    setaCampoReadonly: jest.fn(() => false),
    onSubmit: jest.fn(),
    errors: {},
    podeEditarDadosMembros: jest.fn(() => true),
    handleOpenModalConfirmEncerramentoConta: jest.fn(),
    handleOpenModalMotivoRejeicaoEncerramento: jest.fn(),
    errosDataEncerramentoConta: [],
    inicioPeriodo: null,
    handleCancelarEncerramento: jest.fn(),
  };

  describe("Exibição com um único recurso", () => {
    it("exibe contas agrupadas por recurso mesmo quando há apenas um recurso", () => {
      const contasMock = [
        {
          uuid: "1",
          id: "1",
          nome_recurso: "Recurso A",
          banco_nome: "Banco X",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "1234",
          numero_conta: "56789-0",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
        {
          uuid: "2",
          id: "2",
          nome_recurso: "Recurso A",
          banco_nome: "Banco Y",
          tipo_conta: { nome: "Poupança", permite_inativacao: false },
          agencia: "5678",
          numero_conta: "12345-6",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
      ];

      render(
        <FormDadosDasContas {...defaultProps} intialValues={contasMock} />
      );

      // Deve exibir título de recurso
      expect(screen.queryByText("Recurso A")).toBeInTheDocument();

      // Deve exibir "Conta 1" e "Conta 2"
      expect(screen.getByText("Conta 1")).toBeInTheDocument();
      expect(screen.getByText("Conta 2")).toBeInTheDocument();

      // Deve exibir os dados das contas
      expect(screen.getByDisplayValue("Banco X")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Banco Y")).toBeInTheDocument();
    });
  });

  describe("Exibição com múltiplos recursos", () => {
    it("deve exibir recursos e contas agrupadas.", () => {
      const contasMock = [
        {
          uuid: "1",
          id: "1",
          nome_recurso: "Recurso A",
          banco_nome: "Banco X",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "1234",
          numero_conta: "56789-0",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
        {
          uuid: "2",
          id: "2",
          nome_recurso: "Recurso B",
          banco_nome: "Banco Y",
          tipo_conta: { nome: "Poupança", permite_inativacao: false },
          agencia: "5678",
          numero_conta: "12345-6",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
      ];

      render(
        <FormDadosDasContas {...defaultProps} intialValues={contasMock} />
      );

      // Deve exibir títulos de recursos
      expect(screen.getByText("Recurso A")).toBeInTheDocument();
      expect(screen.getByText("Recurso B")).toBeInTheDocument();
    });

    it("deve aplicar margin-top apenas a partir do segundo recurso", () => {
      const contasMock = [
        {
          uuid: "1",
          id: "1",
          nome_recurso: "Recurso A",
          banco_nome: "Banco X",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "1234",
          numero_conta: "56789-0",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
        {
          uuid: "2",
          id: "2",
          nome_recurso: "Recurso B",
          banco_nome: "Banco Y",
          tipo_conta: { nome: "Poupança", permite_inativacao: false },
          agencia: "5678",
          numero_conta: "12345-6",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
        {
          uuid: "3",
          id: "3",
          nome_recurso: "Recurso C",
          banco_nome: "Banco Z",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "9012",
          numero_conta: "67890-1",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
      ];

      const { container } = render(
        <FormDadosDasContas {...defaultProps} intialValues={contasMock} />
      );

      // Obter os divs de cada recurso
      const recursoADiv = container.querySelector('[data-testid="recurso-Recurso A"]');
      const recursoBDiv = container.querySelector('[data-testid="recurso-Recurso B"]');
      const recursoCDiv = container.querySelector('[data-testid="recurso-Recurso C"]');

      // Recurso A não deve ter mt-5
      expect(recursoADiv).not.toHaveClass("mt-5");

      // Recurso B e C devem ter mt-5
      expect(recursoBDiv).toHaveClass("mt-5");
      expect(recursoCDiv).toHaveClass("mt-5");
    });

    it("deve manter numeração sequencial das contas entre recursos", () => {
      const contasMock = [
        {
          uuid: "1",
          id: "1",
          nome_recurso: "Recurso A",
          banco_nome: "Banco X",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "1234",
          numero_conta: "56789-0",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
        {
          uuid: "2",
          id: "2",
          nome_recurso: "Recurso A",
          banco_nome: "Banco Y",
          tipo_conta: { nome: "Poupança", permite_inativacao: false },
          agencia: "5678",
          numero_conta: "12345-6",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
        {
          uuid: "3",
          id: "3",
          nome_recurso: "Recurso B",
          banco_nome: "Banco Z",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "9012",
          numero_conta: "67890-1",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
      ];

      render(
        <FormDadosDasContas {...defaultProps} intialValues={contasMock} />
      );
      
      const contas = screen.getAllByText(/Conta \d+/);

      expect(contas[0]).toHaveTextContent("Conta 1");
      expect(contas[1]).toHaveTextContent("Conta 2");
      // primeira conta do segundo recurso deve ser "Conta 1".
      expect(contas[2]).toHaveTextContent("Conta 1");
    });
  });

  describe("Renderização de campos", () => {
    it("deve renderizar os campos de entrada para cada conta", () => {
      const contasMock = [
        {
          uuid: "1",
          id: "1",
          nome_recurso: "Recurso A",
          banco_nome: "Banco X",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "1234",
          numero_conta: "56789-0",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
      ];

      render(
        <FormDadosDasContas {...defaultProps} intialValues={contasMock} />
      );

      expect(screen.getByDisplayValue("Banco X")).toBeInTheDocument();
      expect(screen.getByDisplayValue("1234")).toBeInTheDocument();
      expect(screen.getByDisplayValue("56789-0")).toBeInTheDocument();
    });

    it("deve renderizar o tipo de conta como readOnly", () => {
      const contasMock = [
        {
          uuid: "1",
          id: "1",
          nome_recurso: "Recurso A",
          banco_nome: "Banco X",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "1234",
          numero_conta: "56789-0",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
      ];

      render(
        <FormDadosDasContas {...defaultProps} intialValues={contasMock} />
      );

      const inputTipoConta = screen.getByDisplayValue("Corrente");
      expect(inputTipoConta).toHaveAttribute("readonly");
    });
  });

  describe("Componentes renderizados", () => {
    it("deve renderizar BarraStatusEncerramentoConta quando solicitacao_encerramento existe e status é diferente de APROVADA", () => {
      const contasMock = [
        {
          uuid: "1",
          id: "1",
          nome_recurso: "Recurso A",
          banco_nome: "Banco X",
          tipo_conta: { nome: "Corrente", permite_inativacao: true },
          agencia: "1234",
          numero_conta: "56789-0",
          status: "ATIVA",
          solicitacao_encerramento: { status: "PENDENTE" },
        },
      ];

      render(
        <FormDadosDasContas {...defaultProps} intialValues={contasMock} />
      );

      expect(screen.getByTestId("barra-status")).toBeInTheDocument();
    });
  });

  describe("Casos extremos", () => {
    it("deve renderizar corretamente com lista vazia", () => {
      const { container } = render(
        <FormDadosDasContas {...defaultProps} intialValues={[]} />
      );

      // Deve renderizar o formulário sem erros
      expect(container.querySelector("form")).toBeInTheDocument();
    });

    it("deve renderizar contas com nome_recurso undefined", () => {
      const contasMock = [
        {
          uuid: "1",
          id: "1",
          nome_recurso: undefined,
          banco_nome: "Banco X",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "1234",
          numero_conta: "56789-0",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
      ];

      render(
        <FormDadosDasContas {...defaultProps} intialValues={contasMock} />
      );

      // Deve exibir o banco mesmo sem recurso
      expect(screen.getByDisplayValue("Banco X")).toBeInTheDocument();
    });
  });

  describe("Mensagens de erro", () => {
    it("deve exibir mensagem de erro quando campos_obrigatorios contém erro", () => {
      const contasMock = [
        {
          uuid: "1",
          id: "1",
          nome_recurso: "Recurso A",
          banco_nome: "Banco X",
          tipo_conta: { nome: "Corrente", permite_inativacao: false },
          agencia: "1234",
          numero_conta: "56789-0",
          status: "ATIVA",
          solicitacao_encerramento: null,
        },
      ];

      const errorsWithCamposObrigatorios = {
        campos_obrigatorios: "Todos os campos são obrigatórios",
      };

      render(
        <FormDadosDasContas
          {...defaultProps}
          intialValues={contasMock}
          errors={errorsWithCamposObrigatorios}
        />
      );

      expect(screen.getByText("Todos os campos são obrigatórios")).toBeInTheDocument();
    });
  });
});

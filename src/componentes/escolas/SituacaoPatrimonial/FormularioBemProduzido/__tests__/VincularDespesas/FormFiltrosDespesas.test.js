// FormFiltrosDespesas.test.jsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormFiltrosDespesas } from "../../VincularDespesas/FormFiltrosDespesas";

describe("FormFiltrosDespesas", () => {
  const contaOptions = [{ uuid: "1", nome: "Conta 1" }];
  const periodoOptions = [{ uuid: "p1", referencia: "Jan/2025" }];

  beforeEach(() => {
    window.matchMedia = jest.fn().mockImplementation((query) => ({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));
  });

  test("renderiza todos os campos corretamente", () => {
    render(
      <FormFiltrosDespesas
        contaOptions={contaOptions}
        periodoOptions={periodoOptions}
      />
    );

    expect(
      screen.getByPlaceholderText(
        "Digite o CNPJ/CPF ou a Razão Social do Fornecedor"
      )
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Digite Material ou Serviço")
    ).toBeInTheDocument();
    expect(screen.getByText("Filtrar por conta")).toBeInTheDocument();
    expect(screen.getByText("Filtrar por período")).toBeInTheDocument();
    expect(
      screen.getByLabelText("Data do documento início")
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Data do documento fim")).toBeInTheDocument();
    expect(screen.getByText("Limpar Filtros")).toBeInTheDocument();
    expect(screen.getByText("Filtrar")).toBeInTheDocument();
  });

  test("chama onFiltrar ao submeter o formulário", async () => {
    const onFiltrar = jest.fn();

    render(
      <FormFiltrosDespesas
        contaOptions={contaOptions}
        periodoOptions={periodoOptions}
        onFiltrar={onFiltrar}
      />
    );

    const fornecedorInput = screen.getByPlaceholderText(
      "Digite o CNPJ/CPF ou a Razão Social do Fornecedor"
    );

    await userEvent.type(fornecedorInput, "Fornecedor Teste");
    fireEvent.click(screen.getByText("Filtrar"));

    await waitFor(() => {
      expect(onFiltrar).toHaveBeenCalled();
      expect(onFiltrar.mock.calls[0][0].fornecedor).toBe("Fornecedor Teste");
    });
  });

  test("chama onFiltrosChange ao alterar um campo", async () => {
    const onFiltrosChange = jest.fn();

    render(
      <FormFiltrosDespesas
        contaOptions={contaOptions}
        periodoOptions={periodoOptions}
        onFiltrosChange={onFiltrosChange}
      />
    );

    const searchInput = screen.getByPlaceholderText(
      "Digite Material ou Serviço"
    );
    await userEvent.type(searchInput, "cimento");

    await waitFor(() => {
      expect(onFiltrosChange).toHaveBeenCalled();
      expect(onFiltrosChange.mock.calls[0][0].search).toBe("c");
    });
  });

  test("chama onLimparFiltros ao clicar em 'Limpar Filtros'", async () => {
    const onLimparFiltros = jest.fn();

    render(
      <FormFiltrosDespesas
        contaOptions={contaOptions}
        periodoOptions={periodoOptions}
        onLimparFiltros={onLimparFiltros}
      />
    );

    const fornecedorInput = screen.getByPlaceholderText(
      "Digite o CNPJ/CPF ou a Razão Social do Fornecedor"
    );

    await userEvent.type(fornecedorInput, "Fornecedor Teste");
    fireEvent.click(screen.getByText("Limpar Filtros"));

    await waitFor(() => {
      expect(onLimparFiltros).toHaveBeenCalled();
      expect(fornecedorInput).toHaveValue(""); // Campo limpo
    });
  });
});

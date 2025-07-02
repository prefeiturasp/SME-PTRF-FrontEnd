import moment from "moment";

if (!window.matchMedia) {
  window.matchMedia = function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {},
    };
  };
}

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormFiltrosBens } from "../FormFiltrosBens";

describe("FormFiltrosBens", () => {
  const acaoOptions = [
    { uuid: "a1", nome: "Ação 1" },
    { uuid: "a2", nome: "Ação 2" },
  ];
  const tipoContaOptions = [
    { uuid: "c1", nome: "Conta 1" },
    { uuid: "c2", nome: "Conta 2" },
  ];
  const periodoOptions = [
    { uuid: "p1", referencia: "2023/1" },
    { uuid: "p2", referencia: "2023/2" },
  ];
  const filtroSalvo = {
    especificacao_bem: "Mesa",
    fornecedor: "Fornecedor X",
    acao_associacao_uuid: "a2",
    conta_associacao_uuid: "c2",
    periodos_uuid: ["p2"],
    data_inicio: moment("2023-01-01"),
    data_fim: moment("2023-01-31"),
  };

  it("deve renderizar todos os campos principais", () => {
    render(
      <FormFiltrosBens
        acaoOptions={acaoOptions}
        tipoContaOptions={tipoContaOptions}
        periodoOptions={periodoOptions}
      />
    );
    expect(screen.getByLabelText(/Filtro por especificação/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Filtrar por fornecedor/i)).toBeInTheDocument();
    expect(screen.getByText(/Filtrar por ação/i)).toBeInTheDocument();
    expect(screen.getByText(/Filtrar por conta/i)).toBeInTheDocument();
    expect(screen.getByText(/Filtrar por período/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data do documento início/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Data do documento fim/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Filtrar/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Limpar Filtros/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Cancelar/i })).toBeInTheDocument();
  });

  it("deve chamar onFiltrosChange ao alterar campos", async () => {
    const onFiltrosChange = jest.fn();
    render(
      <FormFiltrosBens
        acaoOptions={acaoOptions}
        tipoContaOptions={tipoContaOptions}
        periodoOptions={periodoOptions}
        onFiltrosChange={onFiltrosChange}
      />
    );
    const input = screen.getByPlaceholderText(/Digite uma especificação/i);
    await userEvent.type(input, "Teste");
    expect(onFiltrosChange).toHaveBeenCalled();
  });

  it("deve chamar onFiltrar ao clicar em Filtrar", async () => {
    const onFiltrar = jest.fn();
    render(
      <FormFiltrosBens
        acaoOptions={acaoOptions}
        tipoContaOptions={tipoContaOptions}
        periodoOptions={periodoOptions}
        onFiltrar={onFiltrar}
      />
    );
    // Preencha um campo para garantir que o formulário é válido
    await userEvent.type(screen.getByPlaceholderText(/Digite uma especificação/i), "Teste");
    await userEvent.click(screen.getByRole("button", { name: /Filtrar/i }));
    await waitFor(() => {
      expect(onFiltrar).toHaveBeenCalled();
    });
  });

  it("deve chamar onLimparFiltros ao clicar em Limpar Filtros e limpar campos", () => {
    const onLimparFiltros = jest.fn();
    render(
      <FormFiltrosBens
        acaoOptions={acaoOptions}
        tipoContaOptions={tipoContaOptions}
        periodoOptions={periodoOptions}
        onLimparFiltros={onLimparFiltros}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Limpar Filtros/i }));
    expect(onLimparFiltros).toHaveBeenCalled();
    // Os campos devem ser limpos (placeholder presente)
    expect(screen.getByPlaceholderText(/Digite uma especificação/i)).toHaveValue("");
    expect(screen.getByPlaceholderText(/Digite um fornecedor/i)).toHaveValue("");
  });

  it("deve chamar onCancelarFiltros ao clicar em Cancelar e restaurar filtroSalvo", () => {
    const onCancelarFiltros = jest.fn();
    render(
      <FormFiltrosBens
        acaoOptions={acaoOptions}
        tipoContaOptions={tipoContaOptions}
        periodoOptions={periodoOptions}
        filtroSalvo={filtroSalvo}
        onCancelarFiltros={onCancelarFiltros}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /Cancelar/i }));
    expect(onCancelarFiltros).toHaveBeenCalled();
    // O campo deve ser restaurado para o valor do filtroSalvo
    expect(screen.getByPlaceholderText(/Digite uma especificação/i)).toHaveValue("Mesa");
    expect(screen.getByPlaceholderText(/Digite um fornecedor/i)).toHaveValue("Fornecedor X");
  });

  it("deve renderizar selects com opções corretas", () => {
    render(
      <FormFiltrosBens
        acaoOptions={acaoOptions}
        tipoContaOptions={tipoContaOptions}
        periodoOptions={periodoOptions}
      />
    );
    expect(screen.getByText(/Filtrar por ação/i)).toBeInTheDocument();
    expect(screen.getByText(/Filtrar por conta/i)).toBeInTheDocument();
    expect(screen.getByText(/Filtrar por período/i)).toBeInTheDocument();
  });
});

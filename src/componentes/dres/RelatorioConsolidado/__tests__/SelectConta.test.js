import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectConta } from "../SelectConta";

describe("SelectConta", () => {
  const contas = [{ uuid: "c1", nome: "Cheque" }, { uuid: "c2", nome: "Cartão" }];

  it("renderiza opções e dispara callbacks", () => {
    const handle = jest.fn(), ver = jest.fn(), lauda = jest.fn();
    render(<SelectConta contas={contas} contaEscolhida="c1" handleChangeContas={handle} onClickVerRelatorio={ver} gerarLauda={lauda} disablebtnGerarLauda={false} />);
    expect(screen.getByText("Cheque")).toBeInTheDocument();
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "c2" } });
    expect(handle).toHaveBeenCalledWith("c2");
    fireEvent.click(screen.getByText("Gerar lauda"));
    expect(lauda).toHaveBeenCalled();
    fireEvent.click(screen.getByText("Ver relatórios"));
    expect(ver).toHaveBeenCalled();
  });

  it("sem contas e botão de lauda desabilitado", () => {
    render(<SelectConta contaEscolhida="" handleChangeContas={jest.fn()} disablebtnGerarLauda={true} />);
    expect(screen.queryAllByRole("option")).toHaveLength(0);
    expect(screen.getByText("Gerar lauda")).toBeDisabled();
  });
});

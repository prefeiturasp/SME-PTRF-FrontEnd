import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import InputSelect from "../index";

const mockOptions = [
  { value: "opt1", label: "Opção 1" },
  { value: "opt2", label: "Opção 2" },
  { value: "opt3", label: "Opção 3" },
];

describe("Componente InputSelect", () => {
  it("exibe o rótulo corretamente", () => {
    render(<InputSelect label="Escolha uma opção" name="select-test" />);
    expect(screen.getByText("Escolha uma opção")).toBeInTheDocument();
  });

  it('renderiza a opção padrão "Selecionar"', () => {
    render(<InputSelect name="select-test" options={[]} />);
    expect(screen.getByRole("combobox")).toHaveDisplayValue("Selecionar");
  });

  it("renderiza todas as opções fornecidas", () => {
    render(<InputSelect name="select-test" options={mockOptions} />);
    mockOptions.forEach((opt) => {
      expect(
        screen.getByRole("option", { name: opt.label })
      ).toBeInTheDocument();
    });
  });

  it("seleciona corretamente o valor inicial", () => {
    render(
      <InputSelect
        name="select-test"
        options={mockOptions}
        value="opt2"
        onChange={() => {}}
      />
    );
    expect(screen.getByRole("combobox")).toHaveValue("opt2");
  });

  it("dispara a função onChange ao selecionar uma nova opção", () => {
    const handleChange = jest.fn();
    render(
      <InputSelect
        name="select-test"
        options={mockOptions}
        value=""
        onChange={handleChange}
      />
    );

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: "opt1" },
    });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

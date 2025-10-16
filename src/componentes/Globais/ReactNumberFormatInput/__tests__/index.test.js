import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ReactNumberFormatInput } from "../index";

describe("ReactNumberFormatInput", () => {
    it("renderiza o componente com placeholder padrão", () => {
        render(<ReactNumberFormatInput />);
        const input = screen.getByPlaceholderText("R$0,00");
        expect(input).toBeInTheDocument();
    });

    it("renderiza com placeholder customizado", () => {
        render(<ReactNumberFormatInput placeholder="Digite o valor" />);
        const input = screen.getByPlaceholderText("Digite o valor");
        expect(input).toBeInTheDocument();
    });

    it("renderiza com selectAllOnFocus true", () => {
        const { container } = render(<ReactNumberFormatInput selectAllOnFocus={true} value="100" />);
        expect(container.querySelector("input")).toBeInTheDocument();
    });

    it("renderiza com selectAllOnFocus false", () => {
        const { container } = render(<ReactNumberFormatInput selectAllOnFocus={false} value="100" />);
        expect(container.querySelector("input")).toBeInTheDocument();
    });

    it("chama onChangeEvent quando o valor muda", () => {
        const onChange = jest.fn();
        render(<ReactNumberFormatInput onChangeEvent={onChange} />);
        
        const input = screen.getByPlaceholderText("R$0,00");
        fireEvent.change(input, { target: { value: "123.45" } });
        
        expect(onChange).toHaveBeenCalled();
    });

    it("aceita allowEmpty como prop", () => {
        const { container } = render(<ReactNumberFormatInput allowEmpty={true} />);
        expect(container.querySelector("input")).toBeInTheDocument();
    });

    it("aceita props adicionais", () => {
        render(<ReactNumberFormatInput name="valor" id="input-valor" className="custom-class" />);
        const input = screen.getByPlaceholderText("R$0,00");
        
        expect(input).toHaveAttribute("name", "valor");
        expect(input).toHaveAttribute("id", "input-valor");
    });
});


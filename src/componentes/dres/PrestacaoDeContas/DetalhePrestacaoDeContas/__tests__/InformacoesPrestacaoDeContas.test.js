import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { InformacoesPrestacaoDeContas } from "../InformacoesPrestacaoDeContas";

describe("InformacoesPrestacaoDeContas", () => {
    const props = {
        handleChangeFormInformacoesPrestacaoDeContas: jest.fn(),
        informacoesPrestacaoDeContas: { processo_sei: "", ultima_analise: "" },
        editavel: true,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("deve renderizar o título e os campos do formulário", () => {
        const { container } = render(<InformacoesPrestacaoDeContas {...props} />);
        expect(screen.getByText("Informativos da prestação de contas")).toBeInTheDocument();
        expect(container.querySelector('input[name="processo_sei"]')).toBeInTheDocument();
        expect(screen.getByLabelText("Última análise")).toBeInTheDocument();
    });

    it("deve marcar o campo Processo SEI como inválido quando estiver vazio", () => {
        const { container } = render(<InformacoesPrestacaoDeContas {...props} />);
        expect(container.querySelector('input[name="processo_sei"]')).toHaveClass("is_invalid");
    });

    it("não deve marcar o campo Processo SEI como inválido quando preenchido", () => {
        const { container } = render(
            <InformacoesPrestacaoDeContas
                {...props}
                informacoesPrestacaoDeContas={{ processo_sei: "1234567890", ultima_analise: "" }}
            />
        );
        expect(container.querySelector('input[name="processo_sei"]')).not.toHaveClass("is_invalid");
    });

    it("deve chamar handleChangeFormInformacoesPrestacaoDeContas ao digitar no campo Processo SEI", () => {
        const { container } = render(<InformacoesPrestacaoDeContas {...props} />);
        fireEvent.change(container.querySelector('input[name="processo_sei"]'), { target: { value: "1" } });
        expect(props.handleChangeFormInformacoesPrestacaoDeContas).toHaveBeenCalled();
    });

    it("deve desabilitar o campo Processo SEI quando editavel for false", () => {
        const { container } = render(<InformacoesPrestacaoDeContas {...props} editavel={false} />);
        expect(container.querySelector('input[name="processo_sei"]')).toBeDisabled();
    });

    it("deve exibir o valor de última análise quando informado", () => {
        render(
            <InformacoesPrestacaoDeContas
                {...props}
                informacoesPrestacaoDeContas={{ processo_sei: "123", ultima_analise: "2024-01-10" }}
            />
        );
        expect(screen.getByLabelText("Última análise")).toHaveValue("10/01/2024");
    });
});

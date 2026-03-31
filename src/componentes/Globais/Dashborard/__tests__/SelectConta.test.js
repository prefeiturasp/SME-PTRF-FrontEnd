import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { SelectConta } from "../SelectConta";

jest.mock("../../../../utils/FormataData", () => ({
    formataData: jest.fn((data) => `formatado(${data})`),
}));

import { formataData } from "../../../../utils/FormataData";

const CONTAS_SEM_ENCERRAMENTO = [
    { uuid: "uuid-conta-1", nome: "Conta Custeio" },
    { uuid: "uuid-conta-2", nome: "Conta Capital" },
];

const CONTA_COM_ENCERRAMENTO_ATIVO = {
    uuid: "uuid-conta-3",
    nome: "Conta Encerrada",
    solicitacao_encerramento: {
        status: "APROVADA",
        data_de_encerramento_na_agencia: "2023-12-31",
    },
};

const CONTA_COM_ENCERRAMENTO_REJEITADO = {
    uuid: "uuid-conta-4",
    nome: "Conta Rejeitada",
    solicitacao_encerramento: {
        status: "REJEITADA",
        data_de_encerramento_na_agencia: "2023-12-31",
    },
};

describe("SelectConta", () => {
    const handleChangeConta = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        formataData.mockImplementation((data) => `formatado(${data})`);
    });

    it("renderiza o label 'Conta:'", () => {
        render(
            <SelectConta
                handleChangeConta={handleChangeConta}
                selectConta=""
                tiposConta={CONTAS_SEM_ENCERRAMENTO}
            />
        );
        expect(screen.getByText("Conta:")).toBeInTheDocument();
    });

    it("renderiza a opção padrão 'Todas as contas'", () => {
        render(
            <SelectConta
                handleChangeConta={handleChangeConta}
                selectConta=""
                tiposConta={[]}
            />
        );
        expect(screen.getByText("Todas as contas")).toBeInTheDocument();
    });

    it("renderiza as contas sem encerramento sem sufixo", () => {
        render(
            <SelectConta
                handleChangeConta={handleChangeConta}
                selectConta=""
                tiposConta={CONTAS_SEM_ENCERRAMENTO}
            />
        );

        expect(screen.getByText("Conta Custeio")).toBeInTheDocument();
        expect(screen.getByText("Conta Capital")).toBeInTheDocument();
    });

    it("renderiza conta com encerramento ativo com sufixo de data", () => {
        const { container } = render(
            <SelectConta
                handleChangeConta={handleChangeConta}
                selectConta=""
                tiposConta={[CONTA_COM_ENCERRAMENTO_ATIVO]}
            />
        );

        expect(formataData).toHaveBeenCalledWith("2023-12-31");
        const option = container.querySelector('option[value="uuid-conta-3"]');
        expect(option.textContent).toBe("Conta Encerrada (encerrada em formatado(2023-12-31))");
    });

    it("não adiciona sufixo quando solicitacao_encerramento está REJEITADA", () => {
        render(
            <SelectConta
                handleChangeConta={handleChangeConta}
                selectConta=""
                tiposConta={[CONTA_COM_ENCERRAMENTO_REJEITADO]}
            />
        );

        expect(screen.getByText("Conta Rejeitada")).toBeInTheDocument();
    });

    it("não adiciona sufixo quando solicitacao_encerramento é null", () => {
        const conta = { uuid: "uuid-1", nome: "Conta Simples", solicitacao_encerramento: null };

        render(
            <SelectConta
                handleChangeConta={handleChangeConta}
                selectConta=""
                tiposConta={[conta]}
            />
        );

        expect(screen.getByText("Conta Simples")).toBeInTheDocument();
    });

    it("não renderiza opções de conta quando tiposConta é null", () => {
        render(
            <SelectConta
                handleChangeConta={handleChangeConta}
                selectConta=""
                tiposConta={null}
            />
        );

        const select = screen.getByRole("combobox");
        expect(select.options).toHaveLength(1); // apenas "Todas as contas"
    });

    it("chama handleChangeConta com o uuid correto ao mudar a seleção", () => {
        render(
            <SelectConta
                handleChangeConta={handleChangeConta}
                selectConta=""
                tiposConta={CONTAS_SEM_ENCERRAMENTO}
            />
        );

        fireEvent.change(screen.getByRole("combobox"), {
            target: { value: "uuid-conta-1" },
        });

        expect(handleChangeConta).toHaveBeenCalledWith("uuid-conta-1");
    });
});

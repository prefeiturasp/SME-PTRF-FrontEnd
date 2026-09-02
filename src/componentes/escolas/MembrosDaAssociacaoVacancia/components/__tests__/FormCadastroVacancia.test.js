import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { FormCadastroVacancia } from "../FormCadastroVacancia";
import { RetornaSeTemPermissaoEdicaoHistoricoDeMembros } from "../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import {
    consultarCodEolNoSmeIntegracao,
    consultarRFNoSmeIntegracao,
    getCargosDoRFSmeIntegracao,
} from "../../../../../services/MandatosVacancia.service";

jest.mock("../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros", () => ({
    RetornaSeTemPermissaoEdicaoHistoricoDeMembros: jest.fn(() => true),
}));

jest.mock("../../../../../services/MandatosVacancia.service", () => ({
    consultarCodEolNoSmeIntegracao: jest.fn(),
    consultarRFNoSmeIntegracao: jest.fn(),
    getCargosDoRFSmeIntegracao: jest.fn(),
}));

jest.mock("../../../../../hooks/Globais/useDataTemplate", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("../../../../Globais/DatePickerField", () => ({
    DatePickerField: ({ name, value, onChange, disabled, ...props }) => (
        <input
            name={name}
            value={value || ""}
            onChange={(event) => onChange(name, event.target.value)}
            disabled={disabled}
            {...props}
        />
    ),
}));

describe("FormCadastroVacancia", () => {
    const onSubmitForm = jest.fn();
    const onInformarSaida = jest.fn();

    const mandato = { data_inicial: "2026-01-01", data_final: "2026-12-31" };

    const buildCargo = (overrides = {}) => ({
        uuid: "",
        cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
        cargo_associacao_label: "Presidente",
        cargo_vago: false,
        cargo_vago_vigente: false,
        ocupante_vigente: true,
        substituido: false,
        ocupante_do_cargo: {
            nome: "Maria Silva",
            cpf_responsavel: "11144477735",
            representacao: "PAI_RESPONSAVEL",
            cargo_educacao: "",
            codigo_identificacao: "",
            telefone: "",
            cep: "",
            bairro: "",
            endereco: "",
            email: "maria@example.com",
        },
        data_inicio_no_cargo: "2026-01-01",
        substituto: false,
        ...overrides,
    });

    const renderComponent = (props = {}) =>
        render(
            <MemoryRouter>
                <FormCadastroVacancia
                    cargo={buildCargo()}
                    mandato={mandato}
                    onSubmitForm={onSubmitForm}
                    onInformarSaida={onInformarSaida}
                    ehEdicao={true}
                    ocupanteVigente={true}
                    {...props}
                />
            </MemoryRouter>
        );

    beforeEach(() => {
        jest.clearAllMocks();
        onSubmitForm.mockReset();

        RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);
        useDataTemplate.mockReturnValue((_, __, value) => value);
        consultarRFNoSmeIntegracao.mockResolvedValue({
            status: 200,
            data: { nome: "João da Silva", email: "joao@example.com" },
        });
        getCargosDoRFSmeIntegracao.mockResolvedValue({
            status: 200,
            data: { cargos: [{ nomeCargo: "Professor" }] },
        });
        consultarCodEolNoSmeIntegracao.mockResolvedValue({
            status: 200,
            data: { nomeAluno: "Ana da Silva" },
        });
    });

    describe("renderização inicial", () => {
        it("deve renderizar o formulário com os valores iniciais do cargo", () => {
            renderComponent();

            expect(screen.getByText(/editar membro/i)).toBeInTheDocument();
            expect(screen.getByDisplayValue("Presidente")).toBeInTheDocument();
            expect(screen.getByDisplayValue("Maria Silva")).toBeInTheDocument();
            expect(screen.getByDisplayValue("maria@example.com")).toBeInTheDocument();
        });

        it("deve mostrar o campo de CPF quando a representação for pai ou responsável", () => {
            renderComponent();

            expect(screen.getByText(/cpf do pai ou responsável/i)).toBeInTheDocument();
        });

        it("deve exibir título de adicionar membro quando ehEdicao for false", () => {
            renderComponent({
                ehEdicao: false,
                cargo: buildCargo({ uuid: "", cargo_vago: true, cargo_vago_vigente: true, ocupante_vigente: false }),
            });

            expect(screen.getByText(/adicionar membro/i)).toBeInTheDocument();
        });
    });

    describe("interações do usuário", () => {
        it("deve mostrar os campos específicos para servidor e preencher os dados ao perder o foco", async () => {
            renderComponent();

            const selectRepresentacao = screen.getByLabelText(/\* Representação na associação/i);
            fireEvent.change(selectRepresentacao, {
                target: { name: "representacao", value: "SERVIDOR" },
            });

            expect(screen.getByText(/registro funcional/i)).toBeInTheDocument();
            expect(screen.getByText(/cargo na educação/i)).toBeInTheDocument();

            const inputCodigo = screen.getByLabelText(/registro funcional/i);
            fireEvent.change(inputCodigo, { target: { name: "codigo_identificacao", value: "1234567" } });
            fireEvent.blur(inputCodigo);

            await waitFor(() => {
                expect(screen.getByLabelText(/nome completo/i)).toHaveValue("João da Silva");
            });

            expect(screen.getByLabelText(/cargo na educação/i)).toHaveValue("Professor");
            expect(consultarRFNoSmeIntegracao).toHaveBeenCalledWith("1234567");
            expect(getCargosDoRFSmeIntegracao).toHaveBeenCalledWith("1234567");
        });

        it("deve preencher o nome quando a representação for estudante e o código EOL for consultado", async () => {
            renderComponent();

            const selectRepresentacao = screen.getByLabelText(/\* Representação na associação/i);
            fireEvent.change(selectRepresentacao, {
                target: { name: "representacao", value: "ESTUDANTE" },
            });

            expect(screen.getByText(/código eol/i)).toBeInTheDocument();

            const inputCodigo = screen.getByLabelText(/código eol/i);
            fireEvent.change(inputCodigo, { target: { name: "codigo_identificacao", value: "7654321" } });
            fireEvent.blur(inputCodigo);

            await waitFor(() => {
                expect(screen.getByLabelText(/nome completo/i)).toHaveValue("Ana da Silva");
            });

            expect(consultarCodEolNoSmeIntegracao).toHaveBeenCalledWith("7654321");
        });

        it("deve submeter o formulário com os valores preenchidos pelo usuário", async () => {
            const { container } = renderComponent();

            const inputNome = screen.getByLabelText(/nome completo/i);
            fireEvent.change(inputNome, { target: { name: "nome", value: "Carlos Pereira" } });

            const form = container.querySelector("form");
            fireEvent.submit(form);

            await waitFor(() => {
                expect(onSubmitForm).toHaveBeenCalledTimes(1);
            });

            expect(onSubmitForm).toHaveBeenCalledWith(
                expect.objectContaining({
                    nome: "Carlos Pereira",
                    representacao: "PAI_RESPONSAVEL",
                }),
                expect.anything()
            );
        });

        it("deve limpar os campos ao perder o foco no campo de representação", async () => {
            renderComponent();

            expect(screen.getByLabelText(/nome completo/i)).toHaveValue("Maria Silva");
            expect(screen.getByLabelText(/e-mail/i)).toHaveValue("maria@example.com");

            const selectRepresentacao = screen.getByLabelText(/\* Representação na associação/i);
            fireEvent.blur(selectRepresentacao);

            await waitFor(() => {
                expect(screen.getByLabelText(/nome completo/i)).toHaveValue("");
                expect(screen.getByLabelText(/e-mail/i)).toHaveValue("");
            });
        });

        it("deve impedir o comportamento padrão ao pressionar Enter", () => {
            const { container } = renderComponent();

            const form = container.querySelector("form");

            const event = new KeyboardEvent("keydown", {
                key: "Enter",
                keyCode: 13,
                bubbles: true,
                cancelable: true,
            });
            Object.defineProperty(event, "charCode", { value: 13 });
            event.preventDefault = jest.fn();

            form.dispatchEvent(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it("não deve exibir os campos exclusivos do presidente quando o cargo não for presidente", () => {
            renderComponent({
                cargo: buildCargo({
                    cargo_associacao: "TESOUREIRO",
                    cargo_associacao_label: "Tesoureiro",
                }),
            });

            expect(screen.queryByLabelText(/telefone/i)).not.toBeInTheDocument();
            expect(screen.queryByLabelText(/cep/i)).not.toBeInTheDocument();
            expect(screen.queryByLabelText(/bairro/i)).not.toBeInTheDocument();
            expect(screen.queryByLabelText(/endereço/i)).not.toBeInTheDocument();
        });

        it("deve manter o campo telefone habilitado para um presidente já cadastrado", () => {
            renderComponent({
                cargo: buildCargo({ uuid: "uuid-1" }),
            });

            expect(screen.getByLabelText(/telefone/i)).not.toBeDisabled();
        });

        it("deve desabilitar nome quando a representação for servidor, mesmo na criação", () => {
            renderComponent({
                ehEdicao: false,
                cargo: buildCargo({
                    uuid: "",
                    cargo_vago: true,
                    cargo_vago_vigente: true,
                    ocupante_vigente: false,
                    ocupante_do_cargo: { ...buildCargo().ocupante_do_cargo, representacao: "SERVIDOR" },
                }),
            });

            expect(screen.getByLabelText(/nome completo/i)).toBeDisabled();
        });
    });

    describe("restrições específicas da v2 (sem edição de vínculo)", () => {
        it("deve travar representação e código de identificação ao editar um cargo já ocupado", () => {
            renderComponent({
                ehEdicao: true,
                cargo: buildCargo({
                    uuid: "cargo-1",
                    ocupante_do_cargo: { ...buildCargo().ocupante_do_cargo, representacao: "SERVIDOR" },
                }),
            });

            expect(screen.getByLabelText(/\* Representação na associação/i)).toBeDisabled();
            expect(screen.getByLabelText(/registro funcional/i)).toBeDisabled();
        });

        it("deve travar o período inicial de ocupação ao editar um cargo já ocupado", () => {
            renderComponent({ ehEdicao: true, cargo: buildCargo({ uuid: "cargo-1" }) });

            expect(screen.getByLabelText(/período inicial de ocupação/i)).toBeDisabled();
        });

        it("não deve travar o período inicial de ocupação ao criar um novo registro num cargo vago vigente", () => {
            renderComponent({
                ehEdicao: false,
                cargo: buildCargo({ uuid: "", cargo_vago: true, cargo_vago_vigente: true, ocupante_vigente: false }),
            });

            expect(screen.getByLabelText(/período inicial de ocupação/i)).not.toBeDisabled();
        });

        it("deve travar o período inicial de ocupação ao navegar por um vago histórico (não vigente)", () => {
            renderComponent({
                ehEdicao: false,
                cargo: buildCargo({ uuid: "vago-1", cargo_vago: true, cargo_vago_vigente: false, ocupante_vigente: false }),
            });

            expect(screen.getByLabelText(/período inicial de ocupação/i)).toBeDisabled();
        });

        it("deve exibir o campo de período final de ocupação sempre desabilitado (não editável na v2)", () => {
            renderComponent();

            const campo = screen.getByLabelText(/período final de ocupação/i);
            expect(campo).toBeInTheDocument();
            expect(campo).toBeDisabled();
        });
    });

    describe("integração com o Topo (botões condicionais)", () => {
        it("deve exibir botão cancelar entrada quando podeCancelarEntrada for true", () => {
            renderComponent({ podeCancelarEntrada: true, onCancelarEntrada: jest.fn() });

            expect(screen.getByRole("button", { name: /cancelar entrada/i })).toBeInTheDocument();
        });

        it("deve exibir botão cancelar saída quando podeCancelarSaida for true", () => {
            renderComponent({ podeCancelarSaida: true, onCancelarSaida: jest.fn() });

            expect(screen.getByRole("button", { name: /cancelar saída/i })).toBeInTheDocument();
        });
    });

    describe("branches condicionais", () => {
        it("não deve exibir campos extras quando não houver representação selecionada", () => {
            renderComponent({
                cargo: buildCargo({ ocupante_do_cargo: { ...buildCargo().ocupante_do_cargo, representacao: "" } }),
            });

            expect(screen.queryByText(/registro funcional/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/código eol/i)).not.toBeInTheDocument();
            expect(screen.queryByText(/cpf do pai ou responsável/i)).not.toBeInTheDocument();
        });
    });
});

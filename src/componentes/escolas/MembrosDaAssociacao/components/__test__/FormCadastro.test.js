import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

import { FormCadastro } from "../FormCadastro";
import { useGetComposicao } from "../../hooks/useGetComposicao";
import useDataTemplate from "../../../../../hooks/Globais/useDataTemplate";
import { RetornaSeTemPermissaoEdicaoHistoricoDeMembros } from "../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros";
import {
    consultarCodEolNoSmeIntegracao,
    consultarRFNoSmeIntegracao,
    getCargosDoRFSmeIntegracao,
} from "../../../../../services/Mandatos.service";

jest.mock("../../hooks/useGetComposicao");

jest.mock("../../RetornaSeTemPermissaoEdicaoHistoricoDeMembros", () => ({
    RetornaSeTemPermissaoEdicaoHistoricoDeMembros: jest.fn(() => true),
}));

jest.mock("../../../../../services/Mandatos.service", () => ({
    consultarCodEolNoSmeIntegracao: jest.fn(),
    consultarRFNoSmeIntegracao: jest.fn(),
    getCargosDoRFSmeIntegracao: jest.fn(),
}));

jest.mock("../../../../../hooks/Globais/useDataTemplate", () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock("antd", () => ({
    Switch: ({ checked, onChange, ...props }) => (
        <input
            type="checkbox"
            checked={checked}
            onChange={(event) => onChange(event.target.checked)}
            {...props}
        />
    ),
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

describe("FormCadastro", () => {
    const onSubmitForm = jest.fn();

    const buildCargo = (overrides = {}) => ({
        uuid: "",
        cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
        cargo_associacao_label: "Presidente",
        eh_composicao_vigente: true,
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
        data_inicio_no_cargo: "2024-01-01",
        data_fim_no_cargo: "2024-12-31",
        substituto: false,
        substituido: false,
        ...overrides,
    });

  const renderComponent = (props = {}) =>
        render(
            <MemoryRouter>
                <FormCadastro
                    cargo={buildCargo()}
                    onSubmitForm={onSubmitForm}
                    composicaoUuid="uuid-1"
                    switchStatusPresidente={true}
                    cargosDaDiretoriaExecutiva={[]}
                    responsavelPelasAtribuicoes=""
                    onInformarSaida={jest.fn()}
                    {...props}
                />
            </MemoryRouter>
        );

    beforeEach(() => {
        jest.clearAllMocks();
        onSubmitForm.mockReset();

        useGetComposicao.mockReturnValue({
        isLoading: false,
        data: {
            data_inicial: "2024-01-01",
            data_final: "2024-12-31",
            mandato: {
                data_inicial: "2024-01-01",
                data_final: "2024-12-31",
            },
        },
    });

    useDataTemplate.mockReturnValue((_, __, value) => value);
    RetornaSeTemPermissaoEdicaoHistoricoDeMembros.mockReturnValue(true);
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
        it("deve exibir o loading enquanto a composição estiver sendo carregada", () => {
            useGetComposicao.mockReturnValue({ isLoading: true, data: null });

            renderComponent();

            expect(screen.getByText(/carregando/i)).toBeInTheDocument();
        });

        it("deve renderizar o formulário com os valores iniciais do cargo", () => {
            renderComponent();

            expect(screen.getByText(/adicionar membro/i)).toBeInTheDocument();
            expect(screen.getByDisplayValue("Presidente")).toBeInTheDocument();
            expect(screen.getByDisplayValue("Maria Silva")).toBeInTheDocument();
            expect(screen.getByDisplayValue("maria@example.com")).toBeInTheDocument();
        });

        it("deve mostrar o campo de CPF quando a representação for pai ou responsável", () => {
            renderComponent({
                cargo: buildCargo({ ocupante_do_cargo: { ...buildCargo().ocupante_do_cargo, representacao: "PAI_RESPONSAVEL" } }),
            });

            expect(screen.getByText(/cpf do pai ou responsável/i)).toBeInTheDocument();
        });
    });

    describe("interações do usuário", () => {
        it("deve mostrar os campos específicos para servidor e preencher os dados ao perder o foco", async () => {
            const { container } = renderComponent();

            const selectRepresentacao = screen.getByLabelText(/\* Representação na associação/i)
            fireEvent.change(selectRepresentacao, {
                target: { name: "representacao", value: "SERVIDOR" },
            });

            expect(screen.getByText(/registro funcional/i)).toBeInTheDocument();
            expect(screen.getByText(/cargo na educação/i)).toBeInTheDocument();

            
            const inputCodigo = screen.getByLabelText(/registro funcional/i);
            fireEvent.change(inputCodigo, { target: { name: "codigo_identificacao", value: "1234567" } });
            fireEvent.blur(inputCodigo);

            await waitFor(() => {
                const nomeInput = screen.getByLabelText(/nome completo/i);
                expect(nomeInput).toHaveValue("João da Silva");
            });

            const cargoEducacaoInput = screen.getByLabelText(/cargo na educação/i);
            expect(cargoEducacaoInput).toHaveValue("Professor");
            expect(consultarRFNoSmeIntegracao).toHaveBeenCalledWith("1234567");
            expect(getCargosDoRFSmeIntegracao).toHaveBeenCalledWith("1234567");
        });

        it("deve preencher o nome quando a representação for estudante e o código EOL for consultado", async () => {
            const { container } = renderComponent();

            const selectRepresentacao = screen.getByLabelText(/\* Representação na associação/i)
            fireEvent.change(selectRepresentacao, {
                target: { name: "representacao", value: "ESTUDANTE" },
            });

            expect(screen.getByText(/código eol/i)).toBeInTheDocument();

            const inputCodigo = screen.getByLabelText(/código eol/i);
            fireEvent.change(inputCodigo, { target: { name: "codigo_identificacao", value: "7654321" } });
            fireEvent.blur(inputCodigo);

            await waitFor(() => {
                const nomeInput = screen.getByLabelText(/nome completo/i);
                expect(nomeInput).toHaveValue("Ana da Silva");
            });

            expect(consultarCodEolNoSmeIntegracao).toHaveBeenCalledWith("7654321");
        });

        it("deve submeter o formulário com os valores preenchidos pelo usuário", async () => {
            const { container } = renderComponent({
                cargo: buildCargo({
                    ocupante_do_cargo: {
                        ...buildCargo().ocupante_do_cargo,
                        representacao: "PAI_RESPONSAVEL",
                        cpf_responsavel: "11144477735",
                    },
                }),
            });

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

        it("deve alternar a seção de responsável pelas atribuições para presidente ausente", async () => {
            renderComponent({
                cargo: buildCargo({
                    cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                    ocupante_do_cargo: { ...buildCargo().ocupante_do_cargo, representacao: "SERVIDOR" },
                }),
                switchStatusPresidente: false,
            });

            expect(screen.getByText(/responsável pelas atribuições/i)).toBeInTheDocument();

            const switchInput = screen.getByRole("checkbox");
            await userEvent.click(switchInput);

            expect(screen.queryByText(/responsável pelas atribuições/i)).not.toBeInTheDocument();
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

            fireEvent.change(selectRepresentacao, {
                target: { name: "representacao", value: "SERVIDOR" },
            });

            await waitFor(() => {
                expect(screen.getByLabelText(/registro funcional/i)).toHaveValue("");
                expect(screen.getByLabelText(/cargo na educação/i)).toHaveValue("");
            });

            expect(screen.getByLabelText(/telefone/i)).toHaveValue("");
            expect(screen.getByLabelText(/cep/i)).toHaveValue("");
            expect(screen.getByLabelText(/bairro/i)).toHaveValue("");
            expect(screen.getByLabelText(/endereço/i)).toHaveValue("");
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

            Object.defineProperty(event, "charCode", {
                value: 13,
            });

            event.preventDefault = jest.fn();

            form.dispatchEvent(event);

            expect(event.preventDefault).toHaveBeenCalled();
        });

        it("deve exibir erro quando o responsável pelas atribuições for obrigatório", async () => {
            renderComponent({
                switchStatusPresidente: false,
                cargo: buildCargo({
                    cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                    ocupante_do_cargo: {
                        ...buildCargo().ocupante_do_cargo,
                        representacao: "SERVIDOR",
                        codigo_identificacao: "1234567",
                        nome: "João da Silva",
                    },
                }),
                cargosDaDiretoriaExecutiva: [
                    {
                        id: "VICE_PRESIDENTE",
                        nome: "Vice-presidente",
                    },
                ],
            });

            const botaoSalvar = screen.getByRole("button", {
                name: /salvar/i,
            });

            await userEvent.click(botaoSalvar);

            expect(
                await screen.findByText(/Responsável pelas atribuições é obrigatório/i)
            ).toBeInTheDocument();
        });

        it("não deve renderizar opções quando cargosDaDiretoriaExecutiva for undefined", () => {
            renderComponent({
                switchStatusPresidente: false,
                cargosDaDiretoriaExecutiva: undefined,
            });

            const select = screen.getByLabelText(/responsável pelas atribuições/i);

            expect(select.querySelectorAll("option")).toHaveLength(1);
        });

        it("não deve renderizar opções quando cargosDaDiretoriaExecutiva estiver vazia", () => {
            renderComponent({
                switchStatusPresidente: false,
                cargosDaDiretoriaExecutiva: [],
            });

            const select = screen.getByLabelText(/responsável pelas atribuições/i);

            expect(select.querySelectorAll("option")).toHaveLength(1);
        });

        it("deve renderizar apenas os cargos diferentes de presidente", () => {
            renderComponent({
                switchStatusPresidente: false,
                cargosDaDiretoriaExecutiva: [
                    {
                        id: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                        nome: "Presidente",
                    },
                    {
                        id: "VICE_PRESIDENTE",
                        nome: "Vice-presidente",
                    },
                    {
                        id: "TESOUREIRO",
                        nome: "Tesoureiro",
                    },
                ],
            });

            expect(screen.queryByRole("option", { name: "Presidente" })).not.toBeInTheDocument();

            expect(
                screen.getByRole("option", { name: "Vice-presidente" })
            ).toBeInTheDocument();

            expect(
                screen.getByRole("option", { name: "Tesoureiro" })
            ).toBeInTheDocument();
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
            expect(
                screen.queryByText(/status de ocupação/i)
            ).not.toBeInTheDocument();
        });

        it("deve manter o campo telefone habilitado para um presidente já cadastrado", () => {
            renderComponent({
                cargo: buildCargo({
                    uuid: "uuid-1",
                    cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA",
                }),
            });

            expect(screen.getByLabelText(/telefone/i)).not.toBeDisabled();
        });
    });

  describe("branches condicionais", () => {
    it("deve mostrar o campo de período final alternativo quando houver composição mais recente", () => {
      renderComponent({
        cargo: buildCargo({
          data_fim_no_cargo_composicao_mais_recente: "2024-06-30",
        }),
      });

      expect(screen.getByText(/período final de ocupação/i)).toBeInTheDocument();
      expect(screen.getAllByRole("textbox").length).toBeGreaterThan(0);
    });

    it("deve não exibir campos extras quando não houver representação selecionada", () => {
      renderComponent({
        cargo: buildCargo({ ocupante_do_cargo: { ...buildCargo().ocupante_do_cargo, representacao: "" } }),
      });

      expect(screen.queryByText(/registro funcional/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/código eol/i)).not.toBeInTheDocument();
      expect(screen.queryByText(/cpf do pai ou responsável/i)).not.toBeInTheDocument();
    });
  });
});

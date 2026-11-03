import React, { useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

import AutoCompleteAssociacoes from "../components/AutoCompleteAssociacoes";
import { RepassesContext } from "../context/Repasse";

const associacoes = [
    {
        uuid: "associacao-ativa-1",
        encerrada: false,
        unidade: {
            nome_com_tipo: "EMEF Escola Alfa",
            codigo_eol: "100001",
        },
    },
    {
        uuid: "associacao-ativa-2",
        encerrada: false,
        unidade: {
            nome_com_tipo: "CEI Escola Beta",
            codigo_eol: "200002",
        },
    },
    {
        uuid: "associacao-encerrada",
        encerrada: true,
        unidade: {
            nome_com_tipo: "EMEI Escola Encerrada",
            codigo_eol: "300003",
        },
    },
];

const FormAutocompleteAssociacoes = ({
    disabled = false,
    loadingAssociacoes = false,
    lista = associacoes,
}) => {
    const [formulario, setFormulario] = useState({ associacao: "" });

    return (
        <RepassesContext.Provider
            value={{
                stateFormModal: formulario,
                setStateFormModal: setFormulario,
            }}
        >
            <label htmlFor="associacao">Unidade Educacional</label>
            <AutoCompleteAssociacoes
                todasAsAssociacoesAutoComplete={lista}
                setFieldValue={(campo, valor) =>
                    setFormulario((atual) => ({ ...atual, [campo]: valor }))
                }
                disabled={disabled}
                loadingAssociacoes={loadingAssociacoes}
            />
            <output aria-label="Associação selecionada">
                {formulario.associacao}
            </output>
        </RepassesContext.Provider>
    );
};

const digitarBusca = async (user, texto) => {
    const campo = screen.getByRole("combobox", { name: "Unidade Educacional" });
    await user.clear(campo);
    if (texto) {
        await user.type(campo, texto);
    }
    return campo;
};

const opcaoUnidade = (name) =>
    screen.findByRole("option", { name, hidden: true });

describe("AutoCompleteAssociacoes", () => {
    describe("busca", () => {
        it("deve listar a unidade ao buscar pelo nome", async () => {
            const user = userEvent.setup();
            render(<FormAutocompleteAssociacoes />);

            await digitarBusca(user, "alfa");

            expect(
                await opcaoUnidade("EMEF Escola Alfa")
            ).toBeInTheDocument();
            expect(
                screen.queryByRole("option", {
                    name: "CEI Escola Beta",
                    hidden: true,
                })
            ).not.toBeInTheDocument();
        });

        it("deve listar a unidade ao buscar pelo código EOL", async () => {
            const user = userEvent.setup();
            render(<FormAutocompleteAssociacoes />);

            await digitarBusca(user, "200002");

            expect(
                await opcaoUnidade("CEI Escola Beta")
            ).toBeInTheDocument();
            expect(
                screen.queryByRole("option", {
                    name: "EMEF Escola Alfa",
                    hidden: true,
                })
            ).not.toBeInTheDocument();
        });
    });

    describe("seleção", () => {
        it("deve preencher a associação ao escolher uma unidade ativa", async () => {
            const user = userEvent.setup({ pointerEventsCheck: 0 });
            render(<FormAutocompleteAssociacoes />);

            await digitarBusca(user, "alfa");
            await user.click(await opcaoUnidade("EMEF Escola Alfa"));

            expect(
                screen.getByRole("combobox", { name: "Unidade Educacional" })
            ).toHaveValue("EMEF Escola Alfa");
            expect(
                screen.getByLabelText("Associação selecionada")
            ).toHaveTextContent("associacao-ativa-1");
        });

        it("deve identificar a associação encerrada e não selecioná-la", async () => {
            const user = userEvent.setup({ pointerEventsCheck: 0 });
            render(<FormAutocompleteAssociacoes />);

            await digitarBusca(user, "encerrada");

            const opcao = await opcaoUnidade(/EMEI Escola Encerrada/);

            expect(
                screen.getByText("Associação encerrada", { hidden: true })
            ).toBeInTheDocument();

            await user.click(opcao);

            expect(
                screen.getByRole("combobox", { name: "Unidade Educacional" })
            ).toHaveValue("");
            expect(screen.getByLabelText("Associação selecionada")).toHaveTextContent(
                ""
            );
        });
    });

    describe("disponibilidade", () => {
        it("deve desabilitar a busca quando o usuário não pode editar", () => {
            render(<FormAutocompleteAssociacoes disabled />);

            expect(
                screen.getByRole("combobox", { name: "Unidade Educacional" })
            ).toBeDisabled();
        });

        it("deve desabilitar a busca e informar o carregamento das unidades", () => {
            render(<FormAutocompleteAssociacoes loadingAssociacoes />);

            const campo = screen.getByRole("combobox", {
                name: "Unidade Educacional",
            });

            expect(campo).toBeDisabled();
            expect(campo).toHaveAttribute("placeholder", "Carregando unidades");
        });
    });
});

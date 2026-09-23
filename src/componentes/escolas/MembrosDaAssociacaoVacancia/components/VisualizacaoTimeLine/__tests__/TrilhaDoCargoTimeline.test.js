import { render, screen, fireEvent } from "@testing-library/react";

import { TrilhaDoCargoTimeline } from "../TrilhaDoCargoTimeline";

describe("TrilhaDoCargoTimeline", () => {
    const mandato = { data_inicial: "2026-01-01", data_final: "2026-12-31" };
    const dataTemplate = (_, __, value) => value;
    const cargoRow = { cargo_associacao: "PRESIDENTE_DIRETORIA_EXECUTIVA", cargo_associacao_label: "Presidente" };
    const onSelecionarRegistro = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (props = {}) =>
        render(
            <TrilhaDoCargoTimeline
                cargoRow={cargoRow}
                registrosDoCargo={undefined}
                mandato={mandato}
                hojeDentroDoMandato={true}
                totalDias={365}
                dataTemplate={dataTemplate}
                registroSelecionado={null}
                onSelecionarRegistro={onSelecionarRegistro}
                {...props}
            />
        );

    it("renderiza um segmento sintético 'Vago' cobrindo o mandato inteiro quando o cargo nunca teve nenhum registro", () => {
        renderComponent({ registrosDoCargo: undefined });

        const segmento = screen.getByRole("button", { name: /Vago/i });
        expect(segmento).toBeInTheDocument();
        expect(segmento).toHaveClass("seg-vago");
    });

    it("também usa o segmento sintético quando registrosDoCargo é um array vazio", () => {
        renderComponent({ registrosDoCargo: [] });

        expect(screen.getByRole("button", { name: /Vago/i })).toBeInTheDocument();
    });

    it("renderiza um segmento por registro real, com a classe de cor conforme o status", () => {
        const registros = [
            {
                uuid: "r1",
                cargo_vago: false,
                ocupante_vigente: true,
                data_inicio_no_cargo: "2026-01-01",
                data_fim_no_cargo: "2026-06-30",
                ocupante_do_cargo: { nome: "Maria Silva" },
                tag_novo_membro: null,
                tag_vacancia: null,
            },
            {
                uuid: "r2",
                cargo_vago: false,
                ocupante_vigente: false,
                data_inicio_no_cargo: "2026-07-01",
                data_fim_no_cargo: "2026-09-30",
                ocupante_do_cargo: { nome: "João Souza" },
                tag_novo_membro: null,
                tag_vacancia: null,
            },
            {
                uuid: "r3",
                cargo_vago: true,
                ocupante_vigente: false,
                data_inicio_no_cargo: "2026-10-01",
                data_fim_no_cargo: "2026-12-31",
                ocupante_do_cargo: null,
                tag_novo_membro: null,
                tag_vacancia: null,
            },
        ];

        renderComponent({ registrosDoCargo: registros });

        expect(screen.getByRole("button", { name: /Maria Silva/i })).toHaveClass("seg-vigente");
        expect(screen.getByRole("button", { name: /João Souza/i })).toHaveClass("seg-encerrado");
        expect(screen.getByRole("button", { name: /Vago/i })).toHaveClass("seg-vago");
    });

    it("inclui período e tags no título/aria-label do segmento", () => {
        const registros = [
            {
                uuid: "r1",
                cargo_vago: false,
                ocupante_vigente: true,
                data_inicio_no_cargo: "2026-01-01",
                data_fim_no_cargo: "2026-06-30",
                ocupante_do_cargo: { nome: "Maria Silva" },
                tag_novo_membro: "Novo membro",
                tag_vacancia: "Vacância",
            },
        ];

        renderComponent({ registrosDoCargo: registros });

        const segmento = screen.getByRole("button", {
            name: "Maria Silva — 2026-01-01 até 2026-06-30 — Novo membro — Vacância",
        });
        expect(segmento).toBeInTheDocument();
    });

    it("marca o segmento correspondente ao registroSelecionado com a classe 'selecionado'", () => {
        const registros = [
            {
                uuid: "r1",
                cargo_vago: false,
                ocupante_vigente: true,
                data_inicio_no_cargo: "2026-01-01",
                data_fim_no_cargo: "2026-06-30",
                ocupante_do_cargo: { nome: "Maria Silva" },
                tag_novo_membro: null,
                tag_vacancia: null,
            },
        ];

        renderComponent({ registrosDoCargo: registros, registroSelecionado: { uuid: "r1" } });

        expect(screen.getByRole("button", { name: /Maria Silva/i })).toHaveClass("selecionado");
    });

    it("não marca nenhum segmento como selecionado quando o uuid não corresponde", () => {
        const registros = [
            {
                uuid: "r1",
                cargo_vago: false,
                ocupante_vigente: true,
                data_inicio_no_cargo: "2026-01-01",
                data_fim_no_cargo: "2026-06-30",
                ocupante_do_cargo: { nome: "Maria Silva" },
                tag_novo_membro: null,
                tag_vacancia: null,
            },
        ];

        renderComponent({ registrosDoCargo: registros, registroSelecionado: { uuid: "outro" } });

        expect(screen.getByRole("button", { name: /Maria Silva/i })).not.toHaveClass("selecionado");
    });

    it("chama onSelecionarRegistro com o registro clicado e o rótulo do cargo", () => {
        const registro = {
            uuid: "r1",
            cargo_vago: false,
            ocupante_vigente: true,
            data_inicio_no_cargo: "2026-01-01",
            data_fim_no_cargo: "2026-06-30",
            ocupante_do_cargo: { nome: "Maria Silva" },
            tag_novo_membro: null,
            tag_vacancia: null,
        };

        renderComponent({ registrosDoCargo: [registro] });

        fireEvent.click(screen.getByRole("button", { name: /Maria Silva/i }));

        expect(onSelecionarRegistro).toHaveBeenCalledWith({ ...registro, cargoLabel: "Presidente" });
    });

    it("não exibe o rótulo de texto quando o segmento é estreito demais (menos de 5% de largura)", () => {
        const registro = {
            uuid: "r1",
            cargo_vago: false,
            ocupante_vigente: true,
            data_inicio_no_cargo: "2026-01-01",
            data_fim_no_cargo: "2026-01-02",
            ocupante_do_cargo: { nome: "Maria Silva" },
            tag_novo_membro: null,
            tag_vacancia: null,
        };

        // 1 dia em 365 -> bem menos que 5% de largura
        renderComponent({ registrosDoCargo: [registro], totalDias: 365 });

        const segmento = screen.getByRole("button", { name: /Maria Silva/i });
        expect(segmento.querySelector(".segmento-timeline-label")).not.toBeInTheDocument();
    });

    it("exibe o rótulo de texto quando o segmento é largo o suficiente (>= 5% de largura)", () => {
        const registro = {
            uuid: "r1",
            cargo_vago: false,
            ocupante_vigente: true,
            data_inicio_no_cargo: "2026-01-01",
            data_fim_no_cargo: "2026-06-30",
            ocupante_do_cargo: { nome: "Maria Silva" },
            tag_novo_membro: null,
            tag_vacancia: null,
        };

        renderComponent({ registrosDoCargo: [registro], totalDias: 365 });

        const segmento = screen.getByRole("button", { name: /Maria Silva/i });
        expect(segmento.querySelector(".segmento-timeline-label")).toHaveTextContent("Maria Silva");
    });
});

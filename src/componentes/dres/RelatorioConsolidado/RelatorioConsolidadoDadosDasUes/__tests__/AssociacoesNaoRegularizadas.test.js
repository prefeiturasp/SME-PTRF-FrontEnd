import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import AssociacoesNaoRegularizadas from "../AssociacoesNaoRegularizadas";

const criaAssociacoes = (quantidade) =>
    Array.from({ length: quantidade }, (_, i) => ({
        uuid: `uuid-${i + 1}`,
        nome: `Associação ${i + 1}`,
        motivo_nao_regularidade: `Motivo ${i + 1}`,
        unidade: { codigo_eol: `0000${i + 1}` },
    }));

const associacoesComESemMotivo = [
    { uuid: "uuid-a", nome: "Associação A", motivo_nao_regularidade: "Falta de documento", unidade: { codigo_eol: "111" } },
    { uuid: "uuid-b", nome: "Associação B", motivo_nao_regularidade: "", unidade: { codigo_eol: "222" } },
];

const criaTemplates = () => ({
    nomeTemplate: jest.fn((rowData, column) => (
        <span>{rowData.unidade.codigo_eol} - {rowData[column.field]}</span>
    )),
    motivoTemplate: jest.fn((rowData, column) =>
        rowData[column.field]
            ? <span>{rowData[column.field]}</span>
            : <span>Informe motivo no “Ver regularidade” da Associação</span>
    ),
    acoesTemplate: jest.fn((rowData) => (
        <button type="button" aria-label={`Ver ${rowData.nome}`} onClick={() => rowData.onClickMock?.(rowData)}>
            Ver
        </button>
    )),
});

const renderComponente = (props = {}) => {
    const propsPadrao = {
        listaAssociacoesNaoRegularizadas: associacoesComESemMotivo,
        ...criaTemplates(),
        ...props,
    };
    const resultado = render(<AssociacoesNaoRegularizadas {...propsPadrao} />);
    return { ...resultado, props: propsPadrao };
};

const corpoDaTabela = () => screen.getAllByRole("rowgroup")[1];
const linhasDoCorpo = () => within(corpoDaTabela()).getAllByRole("row");
const botoesDePagina = () => screen.getAllByRole("button", { name: /^Page \d+$/ });
const botaoPagina = (numero) => botoesDePagina()[numero - 1];
const botaoProximo = () => screen.getByRole("button", { name: "Next Page" });
const botaoAnterior = () => screen.getByRole("button", { name: "Previous Page" });

describe("AssociacoesNaoRegularizadas", () => {

    describe("Renderização", () => {
        it("deve exibir o título da seção", () => {
            renderComponente();
            expect(screen.getByRole("heading", { level: 5, name: "Associações não regularizadas" })).toBeInTheDocument();
        });

        it("deve exibir a tabela", () => {
            renderComponente();
            expect(screen.getByRole("table")).toBeInTheDocument();
        });

        it("deve exibir os cabeçalhos das colunas na ordem correta", () => {
            renderComponente();
            const cabecalhos = screen.getAllByRole("columnheader").map((th) => th.textContent);
            expect(cabecalhos).toEqual(["Associações não regularizadas", "Motivo", ""]);
        });

        it("deve renderizar uma linha para cada associação", () => {
            renderComponente();
            expect(linhasDoCorpo()).toHaveLength(2);
        });
    });
});

describe("Templates das colunas", () => {
    it("deve chamar cada template com a linha e o field correspondente", () => {
        const { props } = renderComponente();

        expect(props.nomeTemplate).toHaveBeenCalledWith(
            associacoesComESemMotivo[0], expect.objectContaining({ field: "nome" })
        );
        expect(props.motivoTemplate).toHaveBeenCalledWith(
            associacoesComESemMotivo[0], expect.objectContaining({ field: "motivo_nao_regularidade" })
        );
        expect(props.acoesTemplate).toHaveBeenCalledWith(
            associacoesComESemMotivo[0], expect.objectContaining({ field: "acoes" })
        );
    });

    it("deve exibir o código EOL junto com o nome da associação", () => {
        renderComponente();
        expect(screen.getByText("111 - Associação A")).toBeInTheDocument();
        expect(screen.getByText("222 - Associação B")).toBeInTheDocument();
    });

    it("deve exibir o motivo quando informado", () => {
        renderComponente();
        expect(screen.getByText("Falta de documento")).toBeInTheDocument();
    });

    it("deve exibir a mensagem padrão quando o motivo não for informado", () => {
        renderComponente();
        const [, linhaSemMotivo] = linhasDoCorpo();
        expect(within(linhaSemMotivo).getByText("Informe motivo no “Ver regularidade” da Associação")).toBeInTheDocument();
    });

    it("deve disparar a ação com a linha correta ao clicar no botão", () => {
        const onClickMock = jest.fn();
        const lista = associacoesComESemMotivo.map((a) => ({ ...a, onClickMock }));
        renderComponente({ listaAssociacoesNaoRegularizadas: lista });

        fireEvent.click(screen.getByRole("button", { name: "Ver Associação B" }));

        expect(onClickMock).toHaveBeenCalledTimes(1);
        expect(onClickMock).toHaveBeenCalledWith(expect.objectContaining({ uuid: "uuid-b" }));
    });
});

describe("Casos de erro e lista vazia", () => {
    it("deve exibir a mensagem de lista vazia quando não houver associações", () => {
        const { props } = renderComponente({ listaAssociacoesNaoRegularizadas: [] });

        expect(props.nomeTemplate).not.toHaveBeenCalled();
        expect(props.motivoTemplate).not.toHaveBeenCalled();
        expect(props.acoesTemplate).not.toHaveBeenCalled();
    });

    it.each([null, undefined])("não deve quebrar quando a lista for %s", (valor) => {
        renderComponente({ listaAssociacoesNaoRegularizadas: valor });

        expect(screen.getByRole("heading", { name: "Associações não regularizadas" })).toBeInTheDocument();
    });

    it("deve exibir o valor bruto dos campos quando os templates não forem informados", () => {
        renderComponente({ nomeTemplate: undefined, motivoTemplate: undefined, acoesTemplate: undefined });

        expect(screen.getByText("Associação A")).toBeInTheDocument();
        expect(screen.getByText("Falta de documento")).toBeInTheDocument();
    });
});

describe("Paginação", () => {
    it("deve exibir no máximo 10 registros na primeira página", () => {
        renderComponente({ listaAssociacoesNaoRegularizadas: criaAssociacoes(25) });

        expect(linhasDoCorpo()).toHaveLength(10);
        expect(screen.getByText("00001 - Associação 1")).toBeInTheDocument();
        expect(screen.queryByText("000011 - Associação 11")).not.toBeInTheDocument();
    });

    it("deve iniciar na primeira página", () => {
        renderComponente({ listaAssociacoesNaoRegularizadas: criaAssociacoes(25) });

        expect(botaoPagina(1)).toHaveClass("p-highlight");
        expect(botaoAnterior()).toBeDisabled();
        expect(botaoProximo()).toBeEnabled();
    });

    it("deve exibir uma única página quando houver até 10 registros", () => {
        renderComponente({ listaAssociacoesNaoRegularizadas: criaAssociacoes(10) });

        expect(botaoPagina(1)).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Página 2" })).not.toBeInTheDocument();
        expect(botaoProximo()).toBeDisabled();
        expect(botaoAnterior()).toBeDisabled();
    });

    it("deve criar uma nova página a partir do 11º registro", () => {
        renderComponente({ listaAssociacoesNaoRegularizadas: criaAssociacoes(11) });

        expect(botaoPagina(2)).toBeInTheDocument();
        expect(screen.queryByRole("button", { name: "Página 3" })).not.toBeInTheDocument();
    });

    it("não deve exibir os botões de primeira e última página", () => {
        renderComponente({ listaAssociacoesNaoRegularizadas: criaAssociacoes(25) });

        expect(screen.queryByRole("button", { name: /primeira|first/i })).not.toBeInTheDocument();
        expect(screen.queryByRole("button", { name: /última|last/i })).not.toBeInTheDocument();
    });

    it("deve navegar para a próxima página e atualizar os registros exibidos", () => {
        renderComponente({ listaAssociacoesNaoRegularizadas: criaAssociacoes(25) });

        fireEvent.click(botaoProximo());

        expect(botaoPagina(2)).toHaveClass("p-highlight");
        expect(botaoPagina(1)).not.toHaveClass("p-highlight");
        expect(screen.getByText("000011 - Associação 11")).toBeInTheDocument();
        expect(screen.queryByText("00001 - Associação 1")).not.toBeInTheDocument();
    });

    it("deve navegar ao clicar no número da página e exibir os registros restantes", () => {
        renderComponente({ listaAssociacoesNaoRegularizadas: criaAssociacoes(25) });

        fireEvent.click(botaoPagina(3));

        expect(linhasDoCorpo()).toHaveLength(5);
        expect(botaoProximo()).toBeDisabled();
        expect(botaoAnterior()).toBeEnabled();
    });

    it("deve voltar para a página anterior", () => {
        renderComponente({ listaAssociacoesNaoRegularizadas: criaAssociacoes(25) });

        fireEvent.click(botaoProximo());
        fireEvent.click(botaoAnterior());

        expect(botaoPagina(1)).toHaveClass("p-highlight");
        expect(screen.getByText("00001 - Associação 1")).toBeInTheDocument();
    });
});

describe("Memoização", () => {
    it("não deve re-renderizar quando receber as mesmas props", () => {
        const { rerender, props } = renderComponente();
        const chamadasIniciais = props.nomeTemplate.mock.calls.length;

        rerender(<AssociacoesNaoRegularizadas {...props} />);

        expect(props.nomeTemplate.mock.calls.length).toBe(chamadasIniciais);
    });

    it("deve re-renderizar quando a lista mudar", () => {
        const { rerender, props } = renderComponente();

        rerender(<AssociacoesNaoRegularizadas {...props} listaAssociacoesNaoRegularizadas={criaAssociacoes(3)} />);

        expect(linhasDoCorpo()).toHaveLength(3);
    });
});


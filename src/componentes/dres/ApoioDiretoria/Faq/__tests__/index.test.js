import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Faq } from "../index";
import { getFaqCategorias, getFaqPorCategoria } from "../../../../../services/dres/ApoioDiretoria.service";

jest.mock("../../../../../services/dres/ApoioDiretoria.service", () => ({
    getFaqCategorias: jest.fn(),
    getFaqPorCategoria: jest.fn(),
}));

const categorias = [
    { uuid: "c1", nome: "Cat 1" },
    { uuid: "c2", nome: "Cat 2" },
];

const faqsCategoria1 = [{ pergunta: "Pergunta 1", resposta: "Resposta 1" }];
const faqsCategoria2 = [{ pergunta: "Pergunta 2", resposta: "Resposta 2" }];

describe("Faq", () => {
    beforeEach(() => {
        jest.clearAllMocks();

        getFaqCategorias.mockResolvedValue(categorias);
        getFaqPorCategoria.mockImplementation((uuid) => {
            if (uuid === "c1") return Promise.resolve(faqsCategoria1);
            if (uuid === "c2") return Promise.resolve(faqsCategoria2);
            return Promise.resolve([]);
        });
    });

    it("exibe o Loading enquanto os faqs da categoria ainda estão sendo buscados", async () => {
        getFaqPorCategoria.mockImplementation(() => new Promise(() => {}));

        render(<Faq />);

        expect(await screen.findByText("Carregando...")).toBeInTheDocument();
    });

    it("carrega as categorias e seleciona automaticamente a primeira, exibindo seus faqs", async () => {
        render(<Faq />);

        expect(await screen.findByText("Pergunta 1")).toBeInTheDocument();

        expect(screen.getByText("Cat 1")).toBeInTheDocument();
        expect(screen.getByText("Cat 2")).toBeInTheDocument();

        expect(screen.getByText("Cat 1")).toHaveClass("btn-escolhe-categoria-active");
        expect(screen.getByText("Cat 2")).not.toHaveClass("btn-escolhe-categoria-active");

        expect(getFaqPorCategoria).toHaveBeenCalledWith("c1");
        expect(screen.getByText("Resposta 1")).toBeInTheDocument();
    });

    it("troca de categoria ao clicar em outro botão, carregando os faqs correspondentes", async () => {
        render(<Faq />);
        await screen.findByText("Pergunta 1");

        fireEvent.click(screen.getByText("Cat 2"));

        expect(await screen.findByText("Pergunta 2")).toBeInTheDocument();
        expect(screen.queryByText("Pergunta 1")).not.toBeInTheDocument();

        expect(screen.getByText("Cat 2")).toHaveClass("btn-escolhe-categoria-active");
        expect(screen.getByText("Cat 1")).not.toHaveClass("btn-escolhe-categoria-active");
    });

    it("alterna o ícone da pergunta entre chevron-down e chevron-up ao clicar nela", async () => {
        render(<Faq />);

        const botaoPergunta = await screen.findByText("Pergunta 1");
        const icone = botaoPergunta.closest(".row").querySelector("svg");

        expect(icone).toHaveClass("fa-chevron-down");

        fireEvent.click(botaoPergunta);

        await waitFor(() => {
            expect(icone).toHaveClass("fa-chevron-up");
        });

        fireEvent.click(botaoPergunta);

        await waitFor(() => {
            expect(icone).toHaveClass("fa-chevron-down");
        });
    });

    it("alterna o ícone da pergunta ao clicar no botão do ícone", async () => {
        render(<Faq />);

        const botaoPergunta = await screen.findByText("Pergunta 1");
        const linha = botaoPergunta.closest(".row");
        const icone = linha.querySelector("svg");
        const botaoIcone = icone.closest("button");

        expect(icone).toHaveClass("fa-chevron-down");

        fireEvent.click(botaoIcone);

        await waitFor(() => {
            expect(icone).toHaveClass("fa-chevron-up");
        });
    });

    it("não exibe categorias nem faqs quando a lista de categorias vem vazia", async () => {
        getFaqCategorias.mockResolvedValue([]);

        render(<Faq />);

        await waitFor(() => {
            expect(getFaqCategorias).toHaveBeenCalledTimes(2);
        });

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
        expect(getFaqPorCategoria).not.toHaveBeenCalled();
    });

    it("não quebra quando os serviços retornam null", async () => {
        getFaqCategorias.mockResolvedValue(null);

        render(<Faq />);

        await waitFor(() => {
            expect(getFaqCategorias).toHaveBeenCalledTimes(2);
        });

        expect(screen.queryByRole("button")).not.toBeInTheDocument();
        expect(getFaqPorCategoria).not.toHaveBeenCalled();
    });
});

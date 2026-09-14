import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MandatosVacancia } from "../index";
import {
    getMandatosVacancia,
    postMandatoVacancia,
    patchMandatoVacancia,
    deleteMandatoVacancia,
    getMandatoMaisRecenteVacancia,
} from "../../../../services/MandatosVacancia.service";
import { toastCustom } from "../../../Globais/ToastCustom";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <>{children}</>,
}));

jest.mock("../../../../services/MandatosVacancia.service", () => ({
    getMandatosVacancia: jest.fn(),
    postMandatoVacancia: jest.fn(),
    patchMandatoVacancia: jest.fn(),
    deleteMandatoVacancia: jest.fn(),
    getMandatoMaisRecenteVacancia: jest.fn(),
}));

jest.mock("../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock("../../../Globais/ToastCustom", () => ({
    toastCustom: { ToastCustomSuccess: jest.fn(), ToastCustomError: jest.fn() },
}));

const mandatosMock = {
    count: 2,
    results: [
        { uuid: "mandato-1", id: 1, referencia_mandato: "2023 a 2025", data_inicial: "2023-01-01", data_final: "2025-12-31", editavel: true, limite_min_data_inicial: null },
        { uuid: "mandato-2", id: 2, referencia_mandato: "2026 a 2028", data_inicial: "2026-01-01", data_final: "2028-12-31", editavel: true, limite_min_data_inicial: null },
    ],
};

const renderComponent = () => {
    const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
        <QueryClientProvider client={queryClient}>
            <MandatosVacancia />
        </QueryClientProvider>
    );
};

describe("MandatosVacancia (index)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getMandatosVacancia.mockResolvedValue(mandatosMock);
        getMandatoMaisRecenteVacancia.mockResolvedValue(null);
        window.matchMedia = jest.fn().mockImplementation(() => ({
            matches: false,
            addListener: jest.fn(),
            removeListener: jest.fn(),
        }));
    });

    it("deve exibir loading e depois a lista de mandatos", async () => {
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText("2023 a 2025")).toBeInTheDocument();
        });
        expect(screen.getByText("2026 a 2028")).toBeInTheDocument();
    });

    it("deve filtrar por referência ao submeter o filtro", async () => {
        renderComponent();

        await waitFor(() => expect(screen.getByText("2023 a 2025")).toBeInTheDocument());

        fireEvent.change(screen.getByLabelText(/filtrar por referência/i), {
            target: { name: "filtrar_por_referencia", value: "2023" },
        });
        fireEvent.click(screen.getByRole("button", { name: /^filtrar$/i }));

        await waitFor(() => {
            expect(getMandatosVacancia).toHaveBeenCalledWith("2023", 1);
        });
    });

    it("deve abrir a modal de adicionar ao clicar no botão", async () => {
        renderComponent();

        await waitFor(() => expect(screen.getByText("2023 a 2025")).toBeInTheDocument());

        fireEvent.click(screen.getByRole("button", { name: /adicionar período de mandato/i }));

        expect(screen.getByLabelText("Referência do mandato *")).toHaveValue("");
    });

    it("deve abrir a modal de edição preenchida ao clicar em editar um mandato", async () => {
        renderComponent();

        await waitFor(() => expect(screen.getByText("2023 a 2025")).toBeInTheDocument());

        const botoesEditar = screen.getAllByRole("button", { name: /editar/i });
        fireEvent.click(botoesEditar[0]);

        expect(screen.getByText("Editar período de mandato")).toBeInTheDocument();
        expect(screen.getByLabelText("Referência do mandato *")).toHaveValue("2023 a 2025");
    });

    it("deve criar um mandato enviando as datas no formato YYYY-MM-DD e recarregar a lista", async () => {
        postMandatoVacancia.mockResolvedValueOnce({ uuid: "mandato-3" });
        renderComponent();

        await waitFor(() => expect(screen.getByText("2023 a 2025")).toBeInTheDocument());

        fireEvent.click(screen.getByRole("button", { name: /adicionar período de mandato/i }));
        fireEvent.change(screen.getByLabelText("Referência do mandato *"), { target: { value: "2029 a 2031" } });
        fireEvent.change(screen.getByLabelText("Data inicial *"), { target: { value: "01/01/2029" } });
        fireEvent.change(screen.getByLabelText("Data final *"), { target: { value: "31/12/2031" } });

        fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));

        await waitFor(() => {
            expect(postMandatoVacancia).toHaveBeenCalledWith({
                referencia_mandato: "2029 a 2031",
                data_inicial: "2029-01-01",
                data_final: "2031-12-31",
            });
            expect(toastCustom.ToastCustomSuccess).toHaveBeenCalled();
        });
    });

    it("deve mostrar toast de erro com a mensagem real (campo detail) quando a criação falhar", async () => {
        postMandatoVacancia.mockRejectedValueOnce({ response: { data: { detail: "Já existe um mandato com essas datas." } } });
        renderComponent();

        await waitFor(() => expect(screen.getByText("2023 a 2025")).toBeInTheDocument());

        fireEvent.click(screen.getByRole("button", { name: /adicionar período de mandato/i }));
        fireEvent.change(screen.getByLabelText("Referência do mandato *"), { target: { value: "2029 a 2031" } });
        fireEvent.change(screen.getByLabelText("Data inicial *"), { target: { value: "01/01/2029" } });
        fireEvent.change(screen.getByLabelText("Data final *"), { target: { value: "31/12/2031" } });

        fireEvent.click(screen.getByRole("button", { name: "Adicionar" }));

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Inclusão não permitida",
                "Já existe um mandato com essas datas."
            );
        });
        // a modal do formulário continua aberta para o usuário corrigir
        expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();
    });

    it("deve mostrar toast de erro com a mensagem real de erro de validação por campo do DRF na edição", async () => {
        patchMandatoVacancia.mockRejectedValueOnce({
            response: {
                data: {
                    data_final: ["Formato inválido para data. Use um dos formatos a seguir: YYYY-MM-DD."],
                },
            },
        });
        renderComponent();

        await waitFor(() => expect(screen.getByText("2023 a 2025")).toBeInTheDocument());

        fireEvent.click(screen.getAllByRole("button", { name: /editar/i })[0]);
        fireEvent.click(screen.getByRole("button", { name: "Salvar" }));

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Alteração não permitida",
                "Formato inválido para data. Use um dos formatos a seguir: YYYY-MM-DD."
            );
        });
    });

    it("deve mostrar toast de erro quando a exclusão falhar", async () => {
        deleteMandatoVacancia.mockRejectedValueOnce({
            response: { data: { mensagem: "Somente o mandato mais recente pode ser excluído" } },
        });
        renderComponent();

        await waitFor(() => expect(screen.getByText("2023 a 2025")).toBeInTheDocument());

        fireEvent.click(screen.getAllByRole("button", { name: /editar/i })[0]);
        fireEvent.click(screen.getByRole("button", { name: "Excluir" }));
        fireEvent.click(screen.getByTestId("botao-confirmar-modal"));

        await waitFor(() => {
            expect(toastCustom.ToastCustomError).toHaveBeenCalledWith(
                "Não foi possível excluir o período de mandato",
                "Somente o mandato mais recente pode ser excluído"
            );
        });
    });

    it("deve exibir mensagem de nenhum resultado quando a lista vier vazia", async () => {
        getMandatosVacancia.mockResolvedValue({ count: 0, results: [] });
        renderComponent();

        await waitFor(() => {
            expect(screen.getByText(/nenhum resultado encontrado/i)).toBeInTheDocument();
        });
    });

    it("deve voltar para a primeira página ao excluir um mandato", async () => {
        deleteMandatoVacancia.mockResolvedValueOnce({});
        // começa numa página > 1
        getMandatosVacancia.mockResolvedValue({ ...mandatosMock, count: 30 });
        renderComponent();

        await waitFor(() => expect(screen.getByText("2023 a 2025")).toBeInTheDocument());

        // navega até a página 3 (dois cliques em "Next Page" no Paginator do PrimeReact)
        fireEvent.click(screen.getByRole("button", { name: /next page/i }));
        await waitFor(() => expect(getMandatosVacancia).toHaveBeenLastCalledWith(undefined, 2));
        fireEvent.click(screen.getByRole("button", { name: /next page/i }));
        await waitFor(() => expect(getMandatosVacancia).toHaveBeenLastCalledWith(undefined, 3));

        // abre a modal de edição e confirma exclusão
        fireEvent.click(screen.getAllByRole("button", { name: /editar/i })[0]);
        fireEvent.click(screen.getByRole("button", { name: "Excluir" }));
        fireEvent.click(screen.getByTestId("botao-confirmar-modal"));

        await waitFor(() => {
            expect(deleteMandatoVacancia).toHaveBeenCalledWith("mandato-1");
            // após excluir, volta a buscar a página 1
            expect(getMandatosVacancia).toHaveBeenLastCalledWith(undefined, 1);
        });
    });
});

import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotivosRejeicaoEncerramentoConta } from '../index';
import { MotivosRejeicaoContext } from '../context/MotivosRejeicao';
import { useGetMotivosRejeicao } from "../hooks/useGetMotivosRejeicao";
import { usePostMotivoRejeicao } from "../hooks/usePostMotivoRejeicao";
import { usePatchMotivoRejeicao } from "../hooks/usePatchMotivoRejeicao";
import { useDeleteMotivoRejeicao } from "../hooks/useDeleteMotivoRejeicao";
import { MemoryRouter } from 'react-router-dom';

jest.mock('../../../../../../context/RecursoSelecionado', () => ({
    useRecursoSelecionadoContext: () => ({ recursoSelecionado: null }),
}));

jest.mock("../hooks/useGetMotivosRejeicao");
jest.mock("../hooks/usePostMotivoRejeicao");
jest.mock("../hooks/usePatchMotivoRejeicao");
jest.mock("../hooks/useDeleteMotivoRejeicao");

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});
const itemMock = { id: 1, nome: "Motivo 1", uuid: "123" }
const mockContext = {
    setShowModalForm: jest.fn(),
    setBloquearBtnSalvarForm: jest.fn(),
}
describe('MotivosRejeicaoEncerramentoConta', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        queryClient.clear();

        useGetMotivosRejeicao.mockReturnValue({
              isLoading: false,
              data: { results: [itemMock] },
            });

        usePostMotivoRejeicao.mockReturnValue({
            mutationPost: { mutate: jest.fn() },
        });
    
        usePatchMotivoRejeicao.mockReturnValue({
            mutationPatch: { mutate: jest.fn() },
        });
    
        useDeleteMotivoRejeicao.mockReturnValue({
            mutationDelete: { mutate: jest.fn() },
        });
    })
    const renderComponent = () => {
        return render(
            <MemoryRouter>
                <QueryClientProvider client={queryClient}>
                    <MotivosRejeicaoContext.Provider value={mockContext}>
                        <MotivosRejeicaoEncerramentoConta />
                    </MotivosRejeicaoContext.Provider>
                </QueryClientProvider>
            </MemoryRouter>
        )
    }
    test('Deve renderizar o título corretamente', async () => {
        renderComponent();
        expect(screen.getByText('Motivos Rejeição (encerramento conta)')).toBeInTheDocument();

    });
    test('Deve Abrir a Modal', async () => {
        renderComponent();

        const botaoEditar = within(screen.getByRole("table")).getByRole("button", { selector: ".btn-editar-membro" });
        expect(botaoEditar).toBeInTheDocument();
        fireEvent.click(botaoEditar);

        const campoNome = screen.getByLabelText("Motivo *")
        expect(campoNome).toBeInTheDocument();
    });
});
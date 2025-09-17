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
// jest.mock("../index", () => ({
//     MotivosRejeicaoEncerramentoConta: ({children}) => {children}
// }));
// // Mock dos componentes filhos para verificar se estão sendo renderizados
// jest.mock("../../../../../../paginas/PaginasContainer", () => ({
//     PaginasContainer: ({ children }) => <div>{children}</div>,
// }));


// // Mock dos componentes filhos para verificar se estão sendo renderizados
// jest.mock("../../../../../../paginas/PaginasContainer", () => ({
//     PaginasContainer: ({ children }) => <div>{children}</div>,
// }));

// jest.mock("../components/TopoComBotoes", () => ({
//     TopoComBotoes: () => <div>TopoComBotoes</div>,
// }));

// jest.mock("../components/Filtros", () => ({
//     Filtros: () => <div>Filtros</div>,
// }));

// jest.mock("../components/ExibicaoQuantidade", () => ({
//     ExibicaoQuantidade: () => <div>ExibicaoQuantidade</div>,
// }));

// jest.mock("../components/Lista", () => ({
//     Lista: () => <div>Lista</div>,
// }));

// jest.mock("../components/Paginacao", () => ({
//     Paginacao: () => <div>Paginacao</div>,
// }));

// describe('MotivosRejeicaoEncerramentoConta', () => {
//     test('Deve renderizar o título corretamente', () => {
//         render(
//             <MotivosRejeicaoContext.Provider>
//                 <MotivosRejeicaoEncerramentoConta />
//             </MotivosRejeicaoContext.Provider>
//         );

//         expect(screen.getByText('Motivos Rejeição (encerramento conta)')).toBeInTheDocument();
//     });

//     test('Deve renderizar os componentes filhos corretamente', () => {
//         render(
//             <MotivosRejeicaoContext.Provider>
//                 <MotivosRejeicaoEncerramentoConta />
//             </MotivosRejeicaoContext.Provider>
//         );

//         // Verifica se cada componente está sendo renderizado
//         expect(screen.getByText('TopoComBotoes')).toBeInTheDocument();
//         expect(screen.getByText('Filtros')).toBeInTheDocument();
//         expect(screen.getByText('ExibicaoQuantidade')).toBeInTheDocument();
//         expect(screen.getByText('Lista')).toBeInTheDocument();
//         expect(screen.getByText('Paginacao')).toBeInTheDocument();
//     });

//     test('Deve renderizar a estrutura correta da página', () => {
//         render(
//             <MotivosRejeicaoContext.Provider>
//                 <MotivosRejeicaoEncerramentoConta />
//             </MotivosRejeicaoContext.Provider>
//         );

//         const pageContent = screen.getByText('Motivos Rejeição (encerramento conta)');
//         const pageInnerContent = screen.getByText('TopoComBotoes');
        
//         expect(pageContent).toBeInTheDocument();
//         expect(pageInnerContent).toBeInTheDocument();
//     });
// });
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
        // return render(
        //     <QueryClientProvider client={queryClient}>
        //         <MotivosRejeicaoContext.Provider value={mockContext}>
        //             <MotivosRejeicaoEncerramentoConta>
        //                 <PaginasContainer>
        //                     <h1 className="titulo-itens-painel mt-5">Motivos Rejeição (encerramento conta)</h1>
        //                     <div className="page-content-inner"></div>
        //                     <Lista />
        //                 </PaginasContainer>
        //             </MotivosRejeicaoEncerramentoConta>
        //         </MotivosRejeicaoContext.Provider>
        //     </QueryClientProvider>
        // )
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
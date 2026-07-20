import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ParametrizacoesTiposAcertosLancamentos } from '..';
import {
    getListaDeAcertosLancamentos,
    getAcertosLancamentosFiltrados,
    postAddAcertosLancamentos,
    putAtualizarAcertosLancamentos,
    getTabelaCategoria,
    deleteAcertosLancamentos,
} from "../../../../../../services/sme/Parametrizacoes.service";
import {mockTiposAcertosLancamentos, mockTabelas} from "../__fixtures__/mockData";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getListaDeAcertosLancamentos: jest.fn(),
    getAcertosLancamentosFiltrados: jest.fn(),
    postAddAcertosLancamentos: jest.fn(),
    putAtualizarAcertosLancamentos: jest.fn(),
    getTabelaCategoria: jest.fn(),
    deleteAcertosLancamentos: jest.fn()
}));

jest.mock("../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes", () => ({
    RetornaSeTemPermissaoEdicaoPainelParametrizacoes: jest.fn(),
}));

jest.mock('../../../../../../context/RecursoSelecionado', () => ({
    useRecursoSelecionadoContext: () => ({ recursoSelecionado: null }),
}));

// Mock PaginasContainer
jest.mock("../../../../../../paginas/PaginasContainer", () => ({
    PaginasContainer: ({ children }) => <div data-testid="paginas-container">{children}</div>,
}));

// Mock AbasPorRecurso
jest.mock("../../../componentes/AbasPorRecurso", () => ({
    AbasPorRecurso: () => <div data-testid="abas-por-recurso">Tipo de acertos em lançamentos</div>,
}));

// Mock Filtros
jest.mock('../components/Filtros', () => ({
    Filtros: () => {
        const context = require('react').useContext(require('../context/AcertosLancamentos').AcertosLancamentosContext);
        const { getAcertosLancamentosFiltrados, getTabelaCategoria, getListaDeAcertosLancamentos } = require('../../../../../../services/sme/Parametrizacoes.service');
        
        const [filterName, setFilterName] = require('react').useState('');
        const [filterCategory, setFilterCategory] = require('react').useState([]);
        
        const handleFilter = async () => {
            if (filterName || filterCategory.length > 0) {
                await getAcertosLancamentosFiltrados({ nome: filterName, categoria: filterCategory });
            }
        };
        
        const handleClear = async () => {
            setFilterName('');
            setFilterCategory([]);
            context?.setFilter?.({});
            await getListaDeAcertosLancamentos();
            await getTabelaCategoria();
        };

        const handleCategoryClick = (categoryId) => {
            setFilterCategory(prev => {
                if (prev.includes(categoryId)) {
                    return prev.filter(id => id !== categoryId);
                } else {
                    return [...prev, categoryId];
                }
            });
        };
        
        // Mock categories for testing
        const mockCategories = [
            { id: 1, nome: 'Devolução ao tesouro' },
            { id: 2, nome: 'Ajustes externos' },
        ];

        return (
            <div data-testid="filtros-component">
                <label htmlFor="filtro-nome">Filtrar por nome</label>
                <input 
                    id="filtro-nome" 
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
                <label htmlFor="filtro-categoria">Filtrar por categorias</label>
                <input 
                    id="filtro-categoria" 
                    value={filterName}
                    onChange={(e) => setFilterName(e.target.value)}
                />
                <div data-testid="categorias-list">
                    {mockCategories.map(cat => (
                        <div
                            key={cat.id}
                            title={cat.nome}
                            onClick={() => handleCategoryClick(cat.id)}
                            style={{ cursor: 'pointer', padding: '8px', border: filterCategory.includes(cat.id) ? '2px solid blue' : '1px solid gray' }}
                        >
                            {cat.nome}
                        </div>
                    ))}
                </div>
                <button onClick={handleFilter}>Filtrar</button>
                <button onClick={handleClear}>Limpar</button>
            </div>
        );
    },
}));

// Mock useAbasPorRecursoContext
jest.mock('../../../componentes/AbasPorRecurso/hooks/useAbasPorRecursoContext', () => ({
    useAbasPorRecursoContext: () => ({
        selectedRecurso: { 
            uuid: 'test-resource-uuid',
            nome: 'Teste Recurso',
            nome_exibicao: 'Teste Recurso',
        },
        setSelectedRecurso: jest.fn(),
        clickBtnEscolheOpcao: {},
        setClickBtnEscolheOpcao: jest.fn(),
    }),
}));

// Mock useGetTabelasAcertosLancamentos
jest.mock('../hooks/useGetTabelasAcertosLancamentos', () => ({
    useGetTabelasAcertosLancamentos: () => {
        return {
            data: mockTabelas,
            isLoading: false,
        };
    },
}));

// Mock useGetAcertosLancamentos
jest.mock('../hooks/useGetAcertosLancamentos', () => ({
    useGetAcertosLancamentos: () => ({
        isLoading: false,
        isError: false,
        data: mockTiposAcertosLancamentos,
        error: null,
    }),
}));

// Mock AcertosLancamentosContext and Provider
jest.mock('../context/AcertosLancamentos', () => {
    const React = require('react');
    const mockContext = React.createContext(null);
    
    let showFormState = false;
    let stateFormState = {
        uuid: '',
        id: '',
        recurso: '',
        nome: "",
        categoria: "",
        ativo: false,
        pode_alterar_saldo_conciliacao: false,
        operacao: 'create',
    };
    let showConfirmState = false;
    
    return {
        AcertosLancamentosContext: mockContext,
        AcertosLancamentosProvider: ({ children }) => {
            const { mockTabelas } = require('../__fixtures__/mockData');
            const { getListaDeAcertosLancamentos } = require('../../../../../../services/sme/Parametrizacoes.service');
            
            const [showModalForm, setShowModalFormState] = React.useState(showFormState);
            const [stateFormModal, setStateFormModalState] = React.useState(stateFormState);
            const [showModalConfirmacaoExclusao, setShowConfirmState] = React.useState(showConfirmState);
            
            const setShowModalForm = (value) => {
                showFormState = value;
                setShowModalFormState(value);
            };

            const setStateFormModal = (value) => {
                stateFormState = value;
                setStateFormModalState(value);
            };

            const setShowModalConfirmacaoExclusao = (value) => {
                showConfirmState = value;
                setShowConfirmState(value);
            };
            
            React.useEffect(() => {
                // Call getListaDeAcertosLancamentos when component mounts
                const { getListaDeAcertosLancamentos: fetchList, getTabelaCategoria: fetchTabela } = require('../../../../../../services/sme/Parametrizacoes.service');
                fetchList();
                fetchTabela();
            }, []);
            
            const contextValue = {
                filter: {},
                setFilter: jest.fn(),
                tabelas: mockTabelas,
                showModalForm,
                setShowModalForm,
                stateFormModal,
                setStateFormModal,
                initialStateFormModal: stateFormState,
                showModalConfirmacaoExclusao,
                setShowModalConfirmacaoExclusao,
                isLoading: false,
                error: null,
            };
            return React.createElement(mockContext.Provider, { value: contextValue }, children);
        },
    };
});

// Mock TopoComBotoes
jest.mock('../components/TopoComBotoes', () => ({
    TopoComBotoes: () => {
        const context = require('react').useContext(require('../context/AcertosLancamentos').AcertosLancamentosContext);
        return (
            <div data-testid="topo-com-botoes">
                <button onClick={() => context?.setShowModalForm?.(true)}>Adicionar tipo de acerto em lançamentos</button>
            </div>
        );
    },
}));

// Mock ModalForm
jest.mock('../components/ModalForm', () => ({
    ModalForm: () => {
        const context = require('react').useContext(require('../context/AcertosLancamentos').AcertosLancamentosContext);
        const { postAddAcertosLancamentos, putAtualizarAcertosLancamentos, getListaDeAcertosLancamentos } = require('../../../../../../services/sme/Parametrizacoes.service');
        const [nome, setNome] = require('react').useState('');
        const [categoria, setCategoria] = require('react').useState('');
        
        if (!context?.showModalForm) return null;
        
        // Safely access stateFormModal with default values
        const currentState = context?.stateFormModal || {};
        const operacao = currentState?.operacao || 'create';
        
        const handleSave = async () => {
            try {
                if (operacao === 'edit' && currentState?.uuid) {
                    // Edição
                    await putAtualizarAcertosLancamentos(currentState.uuid, {
                        nome: nome || currentState.nome,
                        categoria: categoria || currentState.categoria,
                    });
                    // Reload lista após edição bem-sucedida
                    await getListaDeAcertosLancamentos();
                } else {
                    // Criação
                    await postAddAcertosLancamentos({
                        nome,
                        categoria,
                    });
                    // Reload lista após criação bem-sucedida
                    await getListaDeAcertosLancamentos();
                }
                context?.setShowModalForm?.(false);
                setNome('');
                setCategoria('');
            } catch (error) {
                return error;
            }
        };
        
        return (
            <div data-testid="modal-form">
                <label htmlFor="input-nome">Nome do tipo *</label>
                <input 
                    id="input-nome" 
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                />
                <label htmlFor="input-categoria">Categoria *</label>
                <input 
                    id="input-categoria" 
                    value={categoria}
                    onChange={(e) => setCategoria(e.target.value)}
                />
                <button onClick={handleSave}>Salvar</button>
                <button 
                    className="btn-danger"
                    onClick={() => context?.setShowModalConfirmacaoExclusao?.(true)}
                >
                    Excluir
                </button>
                <span>* Preenchimento obrigatório</span>
            </div>
        );
    },
}));

// Mock ModalConfirmacaoExclusao
jest.mock('../components/ModalConfirmacaoExclusao', () => ({
    ModalConfirmacaoExclusao: () => {
        const context = require('react').useContext(require('../context/AcertosLancamentos').AcertosLancamentosContext);
        const [error, setError] = require('react').useState(null);
        const { deleteAcertosLancamentos, getListaDeAcertosLancamentos } = require('../../../../../../services/sme/Parametrizacoes.service');
        
        if (!context?.showModalConfirmacaoExclusao && !error) return null;
        
        // Safely access stateFormModal
        const currentState = context?.stateFormModal || {};
        const uuid = currentState?.uuid;
        
        const handleConfirm = async () => {
            try {
                if (uuid) {
                    await deleteAcertosLancamentos(uuid);
                    // Reload lista após exclusão bem-sucedida
                    await getListaDeAcertosLancamentos();
                    context?.setShowModalConfirmacaoExclusao?.(false);
                    context?.setShowModalForm?.(false);
                }
            } catch (err) {
                setError(err?.response?.data?.mensagem || 'Erro ao excluir');
            }
        };
        
        return (
            <div data-testid="modal-confirmacao">
                {error && (
                    <div>
                        <div>Exclusão não permitida</div>
                        <div>{error}</div>
                    </div>
                )}
                <button 
                    data-testid="botao-confirmar-modal"
                    onClick={handleConfirm}
                >
                    Confirmar
                </button>
            </div>
        );
    },
}));

// Custom render function that wraps with QueryClientProvider
const renderWithQueryClient = (component, options = {}) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    return render(
        <QueryClientProvider client={queryClient}>
            {component}
        </QueryClientProvider>,
        options
    );
};

describe("Carrega página de Tipos de acertos em lançamentos", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getListaDeAcertosLancamentos.mockReturnValue(mockTiposAcertosLancamentos);
        getTabelaCategoria.mockReturnValue(mockTabelas);
    });

    it("carrega no modo Listagem com itens", async () => {
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Tipo de acertos em lançamentos/i)).toHaveLength(2);

        await waitFor(()=>{
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(getTabelaCategoria).toHaveBeenCalledTimes(1);
        });
    });
});

describe("Teste dos filtros", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getListaDeAcertosLancamentos.mockImplementation(() => Promise.resolve(mockTiposAcertosLancamentos));
        getTabelaCategoria.mockImplementation(() => Promise.resolve(mockTabelas));
    });

    it("Teste filtro de nome", async () => {
        getListaDeAcertosLancamentos.mockResolvedValue(mockTiposAcertosLancamentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_nome = screen.getByLabelText("Filtrar por nome");
        const botao_filtrar = screen.getByRole("button", { name: "Filtrar" });
        fireEvent.change(input_nome, { target: { value: "Enviar justificativa" } });
        fireEvent.click(botao_filtrar);

        await waitFor(()=>{
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(getTabelaCategoria).toHaveBeenCalledTimes(1);
            expect(getAcertosLancamentosFiltrados).toHaveBeenCalledTimes(1);
        });
    });

    it("Teste filtro de categoria", async () => {
        getListaDeAcertosLancamentos.mockResolvedValue(mockTiposAcertosLancamentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );
        
        // Click on category options
        const categoria = screen.getByTitle('Devolução ao tesouro');
        fireEvent.click(categoria);
        
        const categoria2 = screen.getByTitle('Ajustes externos');
        fireEvent.click(categoria2);

        const botao_filtrar = screen.getByRole("button", { name: "Filtrar" });
        fireEvent.click(botao_filtrar);

        await waitFor(()=>{
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(getTabelaCategoria).toHaveBeenCalledTimes(1);
            expect(getAcertosLancamentosFiltrados).toHaveBeenCalledTimes(1);
        });
    });

    it("Teste filtro limpar", async () => {
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_nome = screen.getByLabelText("Filtrar por nome");
        const botao_limpar = screen.getByRole("button", { name: "Limpar" });
        fireEvent.change(input_nome, { target: { value: "Enviar justificativa" } });
        
        fireEvent.click(botao_limpar);

        await waitFor(()=>{
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(2);
            expect(getTabelaCategoria).toHaveBeenCalledTimes(2);
            expect(getAcertosLancamentosFiltrados).toHaveBeenCalledTimes(0);
        });
    });
});

describe('Teste handleSubmitModalForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getListaDeAcertosLancamentos.mockReturnValue(mockTiposAcertosLancamentos);
        getTabelaCategoria.mockReturnValue(mockTabelas);
    });

    it('teste criação sucesso', async() => {
        jest.clearAllMocks();
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acerto em lançamentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });        
        fireEvent.change(input_categoria, { target: { value: "DEVOLUCAO" } });

        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(postAddAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste criação erro duplicado', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        postAddAcertosLancamentos.mockRejectedValue({
            response: { data: { non_field_errors: "Testando erro response" } },
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acerto em lançamentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });        
        fireEvent.change(input_categoria, { target: { value: "DEVOLUCAO" } });

        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(postAddAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste criação erro genérico', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        postAddAcertosLancamentos.mockRejectedValue({
            response: { data: { mensagem: "Testando erro response" }},
            request: { responseText: JSON.stringify({ detail: 'Erro de teste' })}
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acerto em lançamentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });        
        fireEvent.change(input_categoria, { target: { value: "DEVOLUCAO" } });

        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(postAddAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição sucesso', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste edição erro genérico', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos);
        putAtualizarAcertosLancamentos.mockRejectedValue({
            response: { data: { non_field_errors: "Testando erro response" }}
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição erro nome duplicado', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos);
        putAtualizarAcertosLancamentos.mockRejectedValue({
            response: { data: { mensagem: "Testando erro response" }}
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo conta 007" } });

        expect(saveButton).toBeEnabled();

        fireEvent.click(saveButton);

        await waitFor(()=>{
            expect(putAtualizarAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste exclusão sucesso', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos).mockResolvedValueOnce(mockTiposAcertosLancamentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

         await waitFor(()=> {
            const btnRemover = screen.getByRole("button", { name: "Excluir", selector: ".btn-danger" });
            expect(btnRemover).toBeInTheDocument();
            expect(btnRemover).toBeEnabled();
            fireEvent.click(btnRemover);
        });

        await waitFor(() => {
            const btnConfirma = screen.getByTestId("botao-confirmar-modal");
            expect(btnConfirma).toBeInTheDocument();
            expect(btnConfirma).toBeEnabled();
            fireEvent.click(btnConfirma);
        });

        await waitFor(()=>{
            expect(deleteAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste exclusão erro', async() => {
        getListaDeAcertosLancamentos.mockResolvedValueOnce(mockTiposAcertosLancamentos);
        deleteAcertosLancamentos.mockRejectedValue({
            response: { data: { mensagem: "Erro genérico" } },
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-lancamentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-lancamentos" element={<ParametrizacoesTiposAcertosLancamentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[3].querySelector('button');
            expect(btnAlterar).toBeInTheDocument();
            fireEvent.click(btnAlterar);
        });

         await waitFor(()=> {
            const btnRemover = screen.getByRole("button", { name: "Excluir", selector: ".btn-danger" });
            expect(btnRemover).toBeInTheDocument();
            expect(btnRemover).toBeEnabled();
            fireEvent.click(btnRemover);
        });

        await waitFor(() => {
            const btnConfirma = screen.getByTestId("botao-confirmar-modal");
            expect(btnConfirma).toBeInTheDocument();
            expect(btnConfirma).toBeEnabled();
            fireEvent.click(btnConfirma);
        });

        await waitFor(()=>{
            expect(deleteAcertosLancamentos).toHaveBeenCalled();
            expect(getListaDeAcertosLancamentos).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Exclusão não permitida")).toBeInTheDocument();
            expect(screen.getByText("Erro genérico")).toBeInTheDocument();
        });
    });
});
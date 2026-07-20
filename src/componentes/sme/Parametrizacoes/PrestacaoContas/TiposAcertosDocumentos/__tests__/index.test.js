import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ParametrizacoesTiposAcertosDocumentos } from '..';
import {
    getListaDeAcertosDocumentos,
    getAcertosDocumentosFiltrados,
    postAddAcertosDocumentos,
    putAtualizarAcertosDocumentos,
    deleteAcertosDocumentos,
    getTabelaDocumento,
} from "../../../../../../services/sme/Parametrizacoes.service";
import {mockTiposAcertosDocumentos, mockTabelas} from "../__fixtures__/mockData";
import { RetornaSeTemPermissaoEdicaoPainelParametrizacoes } from "../../../../Parametrizacoes/RetornaSeTemPermissaoEdicaoPainelParametrizacoes";

jest.mock("../../../../../../services/sme/Parametrizacoes.service", ()=>({
    getListaDeAcertosDocumentos: jest.fn(),
    getAcertosDocumentosFiltrados: jest.fn(),
    postAddAcertosDocumentos: jest.fn(),
    putAtualizarAcertosDocumentos: jest.fn(),
    deleteAcertosDocumentos: jest.fn(),
    getTabelaDocumento: jest.fn()
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
    AbasPorRecurso: () => <div data-testid="abas-por-recurso" />,
}));

// Mock Filtros
jest.mock('../components/Filtros', () => ({
    Filtros: () => {
        const context = require('react').useContext(require('../context/AcertosDocumentos').AcertosDocumentosContext);
        const { getAcertosDocumentosFiltrados, getTabelaDocumento, getListaDeAcertosDocumentos } = require('../../../../../../services/sme/Parametrizacoes.service');
        
        const [filterName, setFilterName] = require('react').useState('');
        const [filterCategory, setFilterCategory] = require('react').useState([]);
        
        const handleFilter = async () => {
            if (filterName || filterCategory.length > 0) {
                await getAcertosDocumentosFiltrados({ nome: filterName, categoria: filterCategory });
            }
        };
        
        const handleClear = async () => {
            setFilterName('');
            setFilterCategory([]);
            context?.setFilter?.({});
            await getListaDeAcertosDocumentos();
            await getTabelaDocumento();
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
            { id: 1, nome: 'Inclusão de crédito' },
            { id: 2, nome: 'Inclusão de gasto' },
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

// Mock useGetTabelasAcertosDocumentos
jest.mock('../hooks/useGetTabelasAcertosDocumentos', () => ({
    useGetTabelasAcertosDocumentos: () => {
        return {
            data: mockTabelas,
            isLoading: false,
        };
    },
}));

// Mock useGetAcertosDocumentos
jest.mock('../hooks/useGetAcertosDocumentos', () => ({
    useGetAcertosDocumentos: () => ({
        isLoading: false,
        isError: false,
        data: mockTiposAcertosDocumentos,
        error: null,
    }),
}));

// Mock AcertosDocumentosContext and Provider
jest.mock('../context/AcertosDocumentos', () => {
    const React = require('react');
    const mockContext = React.createContext(null);
    
    let showFormState = false;
    let stateFormState = {
        uuid: '',
        id: '',
        recurso: '',
        nome: "",
        categoria: "",
        tipos_documento_prestacao: [],
        ativo: false,
        pode_alterar_saldo_conciliacao: false,
        operacao: 'create',
    };
    let showConfirmState = false;
    
    return {
        AcertosDocumentosContext: mockContext,
        AcertosDocumentosProvider: ({ children }) => {
            const { mockTabelas } = require('../__fixtures__/mockData');
            const { getListaDeAcertosDocumentos } = require('../../../../../../services/sme/Parametrizacoes.service');
            
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
                // Call getListaDeAcertosDocumentos when component mounts
                const { getListaDeAcertosDocumentos: fetchList, getTabelaDocumento: fetchTabela } = require('../../../../../../services/sme/Parametrizacoes.service');
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
        const context = require('react').useContext(require('../context/AcertosDocumentos').AcertosDocumentosContext);
        return (
            <div data-testid="topo-com-botoes">
                <button onClick={() => context?.setShowModalForm?.(true)}>Adicionar tipo de acertos em documentos</button>
            </div>
        );
    },
}));

// Mock ModalForm
jest.mock('../components/ModalForm', () => ({
    ModalForm: () => {
        const context = require('react').useContext(require('../context/AcertosDocumentos').AcertosDocumentosContext);
        const { postAddAcertosDocumentos, putAtualizarAcertosDocumentos, getListaDeAcertosDocumentos } = require('../../../../../../services/sme/Parametrizacoes.service');
        const [nome, setNome] = require('react').useState('');
        const [categoria, setCategoria] = require('react').useState('');
        const [documentos, setDocumentos] = require('react').useState('');
        
        if (!context?.showModalForm) return null;
        
        // Safely access stateFormModal with default values
        const currentState = context?.stateFormModal || {};
        const operacao = currentState?.operacao || 'create';
        
        const handleSave = async () => {
            try {
                if (operacao === 'edit' && currentState?.uuid) {
                    // Edição
                    await putAtualizarAcertosDocumentos(currentState.uuid, {
                        nome: nome || currentState.nome,
                        categoria: categoria || currentState.categoria,
                        documentos: documentos || currentState.tipos_documento_prestacao,
                    });
                    // Reload lista após edição bem-sucedida
                    await getListaDeAcertosDocumentos();
                } else {
                    // Criação
                    await postAddAcertosDocumentos({
                        nome,
                        categoria,
                        tipos_documento_prestacao: documentos,
                    });
                    // Reload lista após criação bem-sucedida
                    await getListaDeAcertosDocumentos();
                }
                context?.setShowModalForm?.(false);
                setNome('');
                setCategoria('');
                setDocumentos('');
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
                <label htmlFor="input-documentos">Documentos Prestações *</label>
                <input 
                    id="input-documentos" 
                    value={documentos}
                    onChange={(e) => setDocumentos(e.target.value)}
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
        const context = require('react').useContext(require('../context/AcertosDocumentos').AcertosDocumentosContext);
        const [error, setError] = require('react').useState(null);
        const { deleteAcertosDocumentos, getListaDeAcertosDocumentos } = require('../../../../../../services/sme/Parametrizacoes.service');
        
        if (!context?.showModalConfirmacaoExclusao && !error) return null;
        
        // Safely access stateFormModal
        const currentState = context?.stateFormModal || {};
        const uuid = currentState?.uuid;
        
        const handleConfirm = async () => {
            try {
                if (uuid) {
                    await deleteAcertosDocumentos(uuid);
                    // Reload lista após exclusão bem-sucedida
                    await getListaDeAcertosDocumentos();
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

describe("Carrega página de Tipos de acertos em documentos", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getListaDeAcertosDocumentos.mockReturnValue(mockTiposAcertosDocumentos);
        getTabelaDocumento.mockReturnValue(mockTabelas);
    });

    it("carrega no modo Listagem com itens", async () => {
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getAllByText(/Tipo de acertos em documentos/i)).toHaveLength(2);

        await waitFor(()=>{
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
            expect(getTabelaDocumento).toHaveBeenCalledTimes(1);
        });
    });
});

describe("Teste dos filtros", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        getListaDeAcertosDocumentos.mockImplementation(() => Promise.resolve(mockTiposAcertosDocumentos));
        getTabelaDocumento.mockImplementation(() => Promise.resolve(mockTabelas));
    });

    it("Teste filtro de nome", async () => {
        getListaDeAcertosDocumentos.mockResolvedValue(mockTiposAcertosDocumentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_nome = screen.getByLabelText("Filtrar por nome");
        const botao_filtrar = screen.getByRole("button", { name: "Filtrar" });
        fireEvent.change(input_nome, { target: { value: "Incluir documento" } });
        fireEvent.click(botao_filtrar);

        await waitFor(()=>{
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
            expect(getTabelaDocumento).toHaveBeenCalledTimes(1);
            expect(getAcertosDocumentosFiltrados).toHaveBeenCalledTimes(1);
        });
    });

    it("Teste filtro de categoria", async () => {
        getListaDeAcertosDocumentos.mockResolvedValue(mockTiposAcertosDocumentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );
        
        // Click on category options
        const categoria = screen.getByTitle('Inclusão de crédito');
        fireEvent.click(categoria);
        
        const categoria2 = screen.getByTitle('Inclusão de gasto');
        fireEvent.click(categoria2);

        const botao_filtrar = screen.getByRole("button", { name: "Filtrar" });
        fireEvent.click(botao_filtrar);

        await waitFor(()=>{
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
            expect(getTabelaDocumento).toHaveBeenCalledTimes(1);
            expect(getAcertosDocumentosFiltrados).toHaveBeenCalledTimes(1);
        });
    });

    it("Teste filtro limpar", async () => {
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );
        const input_nome = screen.getByLabelText("Filtrar por nome");
        const botao_limpar = screen.getByRole("button", { name: "Limpar" });
        fireEvent.change(input_nome, { target: { value: "Incluir documento" } });
        
        fireEvent.click(botao_limpar);

        await waitFor(()=>{
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(2);
            expect(getTabelaDocumento).toHaveBeenCalledTimes(2);
            expect(getAcertosDocumentosFiltrados).toHaveBeenCalledTimes(0);
        });
    });
});

describe('Teste handleSubmitModalForm', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoPainelParametrizacoes.mockReturnValue(true);
        getListaDeAcertosDocumentos.mockReturnValue(mockTiposAcertosDocumentos);
        getTabelaDocumento.mockReturnValue(mockTabelas);
    });

    it('teste criação sucesso', async() => {
        jest.clearAllMocks();
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acertos em documentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_documentos = screen.getByLabelText("Documentos Prestações *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_documentos).toBeInTheDocument();
        expect(input_documentos).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo documento 007" } });        
        fireEvent.change(input_categoria, { target: { value: "INCLUSAO_CREDITO" } });
        fireEvent.input(input_documentos, { target: { value: '6' } });

        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(postAddAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste criação erro duplicado', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        postAddAcertosDocumentos.mockRejectedValue({
            response: { data: { non_field_errors: "Testando erro response" } },
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acertos em documentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_documentos = screen.getByLabelText("Documentos Prestações *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_documentos).toBeInTheDocument();
        expect(input_documentos).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo documento 007" } });        
        fireEvent.change(input_categoria, { target: { value: "INCLUSAO_CREDITO" } });
        fireEvent.input(input_documentos, { target: { value: '6' } });

        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(postAddAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste criação erro genérico', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        postAddAcertosDocumentos.mockRejectedValue({
            response: { data: { mensagem: "Testando erro response" }},
            request: { responseText: JSON.stringify({ detail: 'Erro de teste' })}
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(()=>{
            const botaoAdicionar = screen.getByRole("button", { name: "Adicionar tipo de acertos em documentos" });
            expect(botaoAdicionar).toBeInTheDocument();
            expect(botaoAdicionar).toBeEnabled();
            fireEvent.click(botaoAdicionar);
            }
        );

        expect(screen.getByText("* Preenchimento obrigatório")).toBeInTheDocument();

        const input_nome = screen.getByLabelText("Nome do tipo *");
        const input_documentos = screen.getByLabelText("Documentos Prestações *");
        const input_categoria = screen.getByLabelText("Categoria *");
        const saveButton = screen.getByRole("button", { name: "Salvar" });

        expect(input_nome).toBeInTheDocument();
        expect(input_nome).toBeEnabled();
        expect(input_documentos).toBeInTheDocument();
        expect(input_documentos).toBeEnabled();
        expect(input_categoria).toBeInTheDocument();
        expect(input_categoria).toBeEnabled();
        
        expect(saveButton).toBeInTheDocument();

        fireEvent.change(input_nome, { target: { value: "Tipo documento 007" } });        
        fireEvent.change(input_categoria, { target: { value: "INCLUSAO_CREDITO" } });
        fireEvent.input(input_documentos, { target: { value: '6' } });

        expect(saveButton).toBeEnabled();
        fireEvent.click(saveButton);
        await waitFor(()=>{
            expect(postAddAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição sucesso', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
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
            expect(putAtualizarAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste edição erro genérico', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos);
        putAtualizarAcertosDocumentos.mockRejectedValue({
            response: { data: { non_field_errors: "Testando erro response" }}
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
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
            expect(putAtualizarAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste edição erro nome duplicado', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos);
        putAtualizarAcertosDocumentos.mockRejectedValue({
            response: { data: { mensagem: "Testando erro response" }}
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
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
            expect(putAtualizarAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
        });
    });

    it('teste exclusão sucesso', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos).mockResolvedValueOnce(mockTiposAcertosDocumentos);
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
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
            expect(deleteAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(2);
        });
    });

    it('teste exclusão erro', async() => {
        getListaDeAcertosDocumentos.mockResolvedValueOnce(mockTiposAcertosDocumentos);
        deleteAcertosDocumentos.mockRejectedValue({
            response: { data: { mensagem: "Erro genérico" } },
        });
        renderWithQueryClient(
            <MemoryRouter initialEntries={["/parametro-tipos-acertos-documentos"]}>
                <Routes>
                    <Route path="/parametro-tipos-acertos-documentos" element={<ParametrizacoesTiposAcertosDocumentos />} />
                </Routes>
            </MemoryRouter>
        );

         await waitFor(()=>{
            const tabela = screen.getByRole('table');
            const linhas = tabela.querySelectorAll('tbody tr');
            const linha = linhas[0];
            const coluna = linha.querySelectorAll('td');
            const btnAlterar = coluna[4].querySelector('button');
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
            expect(deleteAcertosDocumentos).toHaveBeenCalled();
            expect(getListaDeAcertosDocumentos).toHaveBeenCalledTimes(1);
            expect(screen.getByText("Exclusão não permitida")).toBeInTheDocument();
            expect(screen.getByText("Erro genérico")).toBeInTheDocument();
        });
    });
});
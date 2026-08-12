import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { TiposConta } from '../index';
import { useTiposContas } from '../hooks/useTiposdeContas';

// Mock do Custom Hook principal
jest.mock('../hooks/useTiposdeContas');

// Mocks dos subcomponentes (incluindo __esModule: true para os exports default)
jest.mock('../../../../../../paginas/PaginasContainer', () => ({
    PaginasContainer: ({ children }) => <div>{children}</div>
}));

jest.mock('../../../../../../utils/Loading', () => ({
    __esModule: true,
    default: () => <div data-testid="loading-mock">Carregando...</div>
}));

jest.mock('../../../componentes/AbasPorRecurso', () => ({
    AbasPorRecurso: () => <div data-testid="abas-por-recurso-mock">Abas Por Recurso</div>
}));

jest.mock('../TopoComBotoes', () => ({
    TopoComBotoes: ({ handleOpenCreateModal, tem_permissao_edicao_painel_parametrizacoes }) => (
        <div data-testid="topo-com-botoes-mock">
            <button 
                onClick={handleOpenCreateModal} 
                disabled={!tem_permissao_edicao_painel_parametrizacoes}
            >
                Novo Tipo de Conta
            </button>
        </div>
    )
}));

jest.mock('../Filtros', () => ({
    Filtros: ({ stateFiltros, handleChangeFiltros, handleSubmitFiltros, handleLimparFiltros }) => (
        <div data-testid="filtros-mock">
            <input 
                data-testid="filtro-nome-input" 
                value={stateFiltros?.nome || ''} 
                onChange={handleChangeFiltros} 
            />
            <button onClick={handleSubmitFiltros}>Filtrar</button>
            <button onClick={handleLimparFiltros}>Limpar</button>
        </div>
    )
}));

jest.mock('../TabelaTiposConta', () => ({
    __esModule: true,
    default: ({ rowsPerPage, listaDeTiposContas }) => (
        <div data-testid="tabela-tipos-conta-mock">
            <span>Linhas por pagina: {rowsPerPage}</span>
            <ul>
                {listaDeTiposContas?.map((item) => (
                    <li key={item.uuid}>{item.nome}</li>
                ))}
            </ul>
        </div>
    )
}));

jest.mock('../ModalAddEditTipoConta', () => ({
    __esModule: true,
    default: ({ show, handleClose }) => show ? (
        <div data-testid="modal-add-edit-tipo-conta-mock">
            <h2>Modal Formulario</h2>
            <button onClick={handleClose}>Fechar Modal Form</button>
        </div>
    ) : null
}));

jest.mock('../../../../../../componentes/Globais/ModalAntDesign/ModalConfirmarExclusao', () => ({
    ModalConfirmarExclusao: ({ open, onOk, onCancel, titulo, bodyText }) => open ? (
        <div data-testid="modal-confirmar-exclusao-mock">
            <h2>{titulo}</h2>
            <p>{bodyText}</p>
            <button onClick={onOk}>Excluir</button>
            <button onClick={onCancel}>Cancelar</button>
        </div>
    ) : null
}));

// Helper para renderizar encapsulado no MemoryRouter
const renderWithProviders = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe('Componente <TiposConta />', () => {
    const mockHandleOpenCreateModal = jest.fn();
    const mockHandleChangeFiltros = jest.fn();
    const mockHandleSubmitFiltros = jest.fn();
    const mockHandleLimparFiltros = jest.fn();
    const mockHandleCloseFormModal = jest.fn();
    const mockHandleSubmitModalFormTiposConta = jest.fn();
    const mockSetShowModalConfirmDeleteTipoConta = jest.fn();
    const mockOnDeleteTipoContaTrue = jest.fn();
    const mockHandleCloseConfirmDeleteTipoConta = jest.fn();

    const defaultHookValues = {
        draftFiltros: { nome: 'Filtro Inicial' },
        handleChangeFiltros: mockHandleChangeFiltros,
        handleSubmitFiltros: mockHandleSubmitFiltros,
        handleLimparFiltros: mockHandleLimparFiltros,
        rowsPerPage: 10,
        acoesTemplate: jest.fn(),
        handleOpenCreateModal: mockHandleOpenCreateModal,
        TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: true,
        showModalForm: false,
        stateFormModal: { id: 1, nome: 'Conta Teste' },
        handleCloseFormModal: mockHandleCloseFormModal,
        handleSubmitModalFormTiposConta: mockHandleSubmitModalFormTiposConta,
        setShowModalConfirmDeleteTipoConta: mockSetShowModalConfirmDeleteTipoConta,
        showModalConfirmDeleteTipoConta: false,
        onDeleteTipoContaTrue: mockOnDeleteTipoContaTrue,
        handleCloseConfirmDeleteTipoConta: mockHandleCloseConfirmDeleteTipoConta,
        results: [
            { uuid: '1', nome: 'Conta Corrente' },
            { uuid: '2', nome: 'Conta Poupança' }
        ],
        isLoading: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useTiposContas.mockReturnValue(defaultHookValues);
    });

    describe('Estado de Carregamento (Loading)', () => {
        it('deve renderizar apenas a mensagem de carregamento quando isLoading for verdadeiro', () => {
            useTiposContas.mockReturnValue({
                ...defaultHookValues,
                isLoading: true,
            });

            renderWithProviders(<TiposConta />);

            expect(screen.getByRole('heading', { level: 1, name: /tipos de conta/i })).toBeInTheDocument();
            expect(screen.getByTestId('loading-mock')).toBeInTheDocument();

            expect(screen.queryByTestId('topo-com-botoes-mock')).not.toBeInTheDocument();
            expect(screen.queryByTestId('filtros-mock')).not.toBeInTheDocument();
            expect(screen.queryByTestId('tabela-tipos-conta-mock')).not.toBeInTheDocument();
        });
    });

    describe('Renderização dos Subcomponentes e Interações', () => {
        it('deve renderizar todos os subcomponentes principais quando não estiver carregando', () => {
            renderWithProviders(<TiposConta />);

            expect(screen.getByTestId('abas-por-recurso-mock')).toBeInTheDocument();
            expect(screen.getByTestId('topo-com-botoes-mock')).toBeInTheDocument();
            expect(screen.getByTestId('filtros-mock')).toBeInTheDocument();
            expect(screen.getByTestId('tabela-tipos-conta-mock')).toBeInTheDocument();
        });

        it('deve passar corretamente as props e acionar handleOpenCreateModal no TopoComBotoes', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TiposConta />);

            const btnNovo = screen.getByRole('button', { name: /novo tipo de conta/i });
            expect(btnNovo).not.toBeDisabled();

            await user.click(btnNovo);
            expect(mockHandleOpenCreateModal).toHaveBeenCalledTimes(1);
        });

        it('deve desabilitar o botão de novo registro caso não tenha permissão de edição', () => {
            useTiposContas.mockReturnValue({
                ...defaultHookValues,
                TEM_PERMISSAO_EDICAO_PAINEL_PARAMETRIZACOES: false,
            });

            renderWithProviders(<TiposConta />);

            const btnNovo = screen.getByRole('button', { name: /novo tipo de conta/i });
            expect(btnNovo).toBeDisabled();
        });

        it('deve repassar as props e permitir interações nos Filtros', async () => {
            const user = userEvent.setup();
            renderWithProviders(<TiposConta />);

            const inputFiltro = screen.getByTestId('filtro-nome-input');
            expect(inputFiltro).toHaveValue('Filtro Inicial');

            const btnFiltrar = screen.getByRole('button', { name: /filtrar/i });
            const btnLimpar = screen.getByRole('button', { name: /limpar/i });

            await user.click(btnFiltrar);
            expect(mockHandleSubmitFiltros).toHaveBeenCalledTimes(1);

            await user.click(btnLimpar);
            expect(mockHandleLimparFiltros).toHaveBeenCalledTimes(1);
        });

        it('deve renderizar a TabelaTiposConta repassando os dados do resultado e rowsPerPage', () => {
            renderWithProviders(<TiposConta />);

            expect(screen.getByText('Linhas por pagina: 10')).toBeInTheDocument();
            expect(screen.getByText('Conta Corrente')).toBeInTheDocument();
            expect(screen.getByText('Conta Poupança')).toBeInTheDocument();
        });
    });

    describe('Modal de Adição / Edição (ModalAddEditTipoConta)', () => {
        it('não deve renderizar o modal de formulário se showModalForm for falso', () => {
            renderWithProviders(<TiposConta />);

            expect(screen.queryByTestId('modal-add-edit-tipo-conta-mock')).not.toBeInTheDocument();
        });

        it('deve renderizar o modal de formulário e permitir o fechamento quando showModalForm for verdadeiro', async () => {
            const user = userEvent.setup();

            useTiposContas.mockReturnValue({
                ...defaultHookValues,
                showModalForm: true,
            });

            renderWithProviders(<TiposConta />);

            expect(screen.getByTestId('modal-add-edit-tipo-conta-mock')).toBeInTheDocument();

            const btnFecharForm = screen.getByRole('button', { name: /fechar modal form/i });
            await user.click(btnFecharForm);

            expect(mockHandleCloseFormModal).toHaveBeenCalledTimes(1);
        });
    });

    describe('Modal de Confirmação de Exclusão (ModalConfirmarExclusao)', () => {
        it('deve exibir o modal de exclusão apenas quando showModalConfirmDeleteTipoConta for verdadeiro', () => {
            renderWithProviders(<TiposConta />);

            expect(screen.queryByTestId('modal-confirmar-exclusao-mock')).not.toBeInTheDocument();
        });

        it('deve acionar as callbacks corretas ao confirmar a exclusão no modal', async () => {
            const user = userEvent.setup();

            useTiposContas.mockReturnValue({
                ...defaultHookValues,
                showModalConfirmDeleteTipoConta: true,
            });

            renderWithProviders(<TiposConta />);

            const btnExcluir = screen.getByRole('button', { name: /excluir/i });
            await user.click(btnExcluir);

            expect(mockOnDeleteTipoContaTrue).toHaveBeenCalledTimes(1);
            expect(mockHandleCloseConfirmDeleteTipoConta).toHaveBeenCalledTimes(1);
        });

        it('deve acionar apenas handleCloseConfirmDeleteTipoConta ao cancelar a exclusão', async () => {
            const user = userEvent.setup();

            useTiposContas.mockReturnValue({
                ...defaultHookValues,
                showModalConfirmDeleteTipoConta: true,
            });

            renderWithProviders(<TiposConta />);

            const btnCancelar = screen.getByRole('button', { name: /cancelar/i });
            await user.click(btnCancelar);

            expect(mockOnDeleteTipoContaTrue).not.toHaveBeenCalled();
            expect(mockHandleCloseConfirmDeleteTipoConta).toHaveBeenCalledTimes(1);
        });
    });
});
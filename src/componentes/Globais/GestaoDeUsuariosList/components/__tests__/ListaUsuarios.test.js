import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ListaUsuarios } from '../ListaUsuarios';
import { GestaoDeUsuariosListContext } from '../../context/GestaoDeUsuariosListProvider';
import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from '../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios';
import { useRemoveAcessosUsuario } from '../../../GestaoDeUsuarios/hooks/useRemoveAcessosUsuario';
import { useAcessoEmSuporteInfo } from '../../../../../hooks/Globais/useAcessoEmSuporteInfo';

const mockNavigate = jest.fn();
const mockMutate = jest.fn();
let capturedRowExpansionTemplate = null;
let capturedOnRowToggle = null;

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios', () => ({
    RetornaSeTemPermissaoEdicaoGestaoUsuarios: jest.fn(),
}));

jest.mock('../../../GestaoDeUsuarios/hooks/useRemoveAcessosUsuario', () => ({
    useRemoveAcessosUsuario: jest.fn(),
}));

jest.mock('../../../../../hooks/Globais/useAcessoEmSuporteInfo', () => ({
    useAcessoEmSuporteInfo: jest.fn(),
}));

jest.mock('primereact/datatable', () => ({
    DataTable: ({ value, rowExpansionTemplate, onRowToggle, children }) => {
        capturedRowExpansionTemplate = rowExpansionTemplate;
        capturedOnRowToggle = onRowToggle;
        if (!value || value.length === 0) return <div data-testid="datatable-empty" />;
        const cols = [].concat(children).filter(Boolean);
        return (
            <div data-testid="datatable">
                {value.map((row, i) =>
                    cols.map((col, j) => {
                        if (col?.props?.body) {
                            return <div key={`${i}-${j}`}>{col.props.body(row)}</div>;
                        }
                        return null;
                    })
                )}
            </div>
        );
    },
}));

jest.mock('primereact/column', () => ({
    Column: () => null,
}));

jest.mock('../../../../../utils/Loading', () => ({
    __esModule: true,
    default: () => <div data-testid="loading" />,
}));

jest.mock('../../../Mensagens/MsgImgCentralizada', () => ({
    MsgImgCentralizada: ({ texto }) => <div data-testid="msg-vazia">{texto}</div>,
}));

jest.mock('../../../TableTags', () => ({
    TableTags: ({ data }) => (
        <div data-testid={`table-tag-${data?.informacoes?.[0]?.tag_id}`}>
            {data?.informacoes?.[0]?.tag_nome}
        </div>
    ),
}));

jest.mock('../../../GestaoDeUsuarios/components/ModalConfirmacaoRemoverAcesso', () => ({
    ModalConfirmacaoRemoverAcesso: ({ show, botaoCancelarHandle, botaoConfirmarHandle }) =>
        show ? (
            <>
                <button data-testid="modal-cancelar" onClick={botaoCancelarHandle}>Cancelar</button>
                <button data-testid="modal-confirmar" onClick={botaoConfirmarHandle}>Confirmar</button>
            </>
        ) : null,
}));

jest.mock('../../../UI/Button', () => ({
    EditIconButton: ({ onClick, tooltipMessage }) => (
        <button data-testid="edit-btn" onClick={onClick} aria-label={tooltipMessage}>Editar</button>
    ),
}));

jest.mock('react-tooltip', () => ({
    Tooltip: ({ id }) => <div data-testid={`tooltip-${id}`} />,
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

const USUARIO_BASE = {
    id: 1,
    name: 'João Silva',
    username: 'joao.silva',
    email: 'joao@exemplo.com',
    e_servidor: true,
    groups: [{ name: 'Grupo Admin' }],
    unidades: [
        { uuid: 'uuid-unidade-1', nome: 'Escola A', acesso_de_suporte: false, acesso_concedido_sme: false },
    ],
};

const defaultCtxValue = {
    uuidUnidadeBase: 'uuid-unidade-1',
    visaoBase: 'UE',
};

const renderListaUsuarios = (props = {}, ctxOverride = {}) => {
    const contextValue = { ...defaultCtxValue, ...ctxOverride };
    return render(
        <GestaoDeUsuariosListContext.Provider value={contextValue}>
            <ListaUsuarios {...props} />
        </GestaoDeUsuariosListContext.Provider>
    );
};

describe('ListaUsuarios', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        capturedRowExpansionTemplate = null;
        capturedOnRowToggle = null;
        RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(true);
        useAcessoEmSuporteInfo.mockReturnValue({ unidadeEstaEmSuporte: false });
        useRemoveAcessosUsuario.mockReturnValue({
            mutate: mockMutate,
            isPending: false,
            error: null,
            data: null,
        });
    });

    describe('estados de carregamento e vazio', () => {
        it('exibe Loading quando isLoading é true', () => {
            renderListaUsuarios({ isLoading: true, usuarios: null });
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });

        it('não exibe Loading quando isLoading é false', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });

        it('exibe mensagem de vazio quando usuarios é objeto vazio', () => {
            renderListaUsuarios({ isLoading: false, usuarios: {} });
            expect(screen.getByTestId('msg-vazia')).toHaveTextContent(
                'Não há usuários que atendam aos filtros especificados.'
            );
        });

        it('exibe a tabela quando usuarios tem itens', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(screen.getByTestId('datatable')).toBeInTheDocument();
        });

        it('não exibe tabela quando isLoading é true', () => {
            renderListaUsuarios({ isLoading: true, usuarios: [USUARIO_BASE] });
            expect(screen.queryByTestId('datatable')).not.toBeInTheDocument();
        });
    });

    describe('nomeUsuarioTemplate', () => {
        it('renderiza o nome do usuário', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(screen.getByText('João Silva')).toBeInTheDocument();
        });

        it('renderiza tag de suporte quando unidade tem acesso_de_suporte', () => {
            const usuario = {
                ...USUARIO_BASE,
                unidades: [{ uuid: 'uuid-unidade-1', nome: 'Escola A', acesso_de_suporte: true }],
            };
            renderListaUsuarios({ isLoading: false, usuarios: [usuario] });
            expect(screen.getByTestId('table-tag-1')).toBeInTheDocument();
        });

        it('não renderiza tag de suporte quando unidade não tem acesso_de_suporte', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(screen.queryByTestId('table-tag-1')).not.toBeInTheDocument();
        });
    });

    describe('tipoUsuarioTemplate', () => {
        it('exibe "Servidor" quando e_servidor é true', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(screen.getByText('Servidor')).toBeInTheDocument();
        });

        it('exibe "Não Servidor" quando e_servidor é false', () => {
            const usuario = { ...USUARIO_BASE, e_servidor: false };
            renderListaUsuarios({ isLoading: false, usuarios: [usuario] });
            expect(screen.getByText('Não Servidor')).toBeInTheDocument();
        });
    });

    describe('grupoTemplate', () => {
        it('renderiza os nomes dos grupos do usuário', () => {
            const usuario = {
                ...USUARIO_BASE,
                groups: [{ name: 'Grupo Admin' }, { name: 'Grupo Viewer' }],
            };
            renderListaUsuarios({ isLoading: false, usuarios: [usuario] });
            expect(screen.getByText('Grupo Admin')).toBeInTheDocument();
            expect(screen.getByText('Grupo Viewer')).toBeInTheDocument();
        });

        it('não renderiza grupos quando groups está vazio', () => {
            const usuario = { ...USUARIO_BASE, groups: [] };
            renderListaUsuarios({ isLoading: false, usuarios: [usuario] });
            expect(screen.queryByText('Grupo Admin')).not.toBeInTheDocument();
        });
    });

    describe('acoesTemplate', () => {
        it('renderiza o botão de remover acesso', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
        });

        it('renderiza o botão de editar quando não está em suporte', () => {
            useAcessoEmSuporteInfo.mockReturnValue({ unidadeEstaEmSuporte: false });
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(screen.getByTestId('edit-btn')).toBeInTheDocument();
        });

        it('oculta o botão de editar quando está em suporte', () => {
            useAcessoEmSuporteInfo.mockReturnValue({ unidadeEstaEmSuporte: true });
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(screen.queryByTestId('edit-btn')).not.toBeInTheDocument();
        });

        it('navega para o formulário ao clicar em editar', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            fireEvent.click(screen.getByTestId('edit-btn'));
            expect(mockNavigate).toHaveBeenCalledWith('/gestao-de-usuarios-form/1');
        });
    });

    describe('modal de confirmação de remoção de acesso', () => {
        it('modal não é exibido inicialmente', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(screen.queryByTestId('modal-cancelar')).not.toBeInTheDocument();
        });

        it('abre o modal ao clicar no botão de remover', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            const removeButton = screen.getAllByRole('button').find(
                (b) => b.className.includes('botao-acao-lista')
            );
            act(() => { fireEvent.click(removeButton); });
            expect(screen.getByTestId('modal-cancelar')).toBeInTheDocument();
        });

        it('fecha o modal ao clicar em Cancelar', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            const removeButton = screen.getAllByRole('button').find(
                (b) => b.className.includes('botao-acao-lista')
            );
            act(() => { fireEvent.click(removeButton); });
            act(() => { fireEvent.click(screen.getByTestId('modal-cancelar')); });
            expect(screen.queryByTestId('modal-cancelar')).not.toBeInTheDocument();
        });

        it('chama removeAcessos e fecha o modal ao confirmar', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            const removeButton = screen.getAllByRole('button').find(
                (b) => b.className.includes('botao-acao-lista')
            );
            act(() => { fireEvent.click(removeButton); });
            act(() => { fireEvent.click(screen.getByTestId('modal-confirmar')); });
            expect(mockMutate).toHaveBeenCalledWith({ id: 1, uuidUnidadeBase: 'uuid-unidade-1' });
            expect(screen.queryByTestId('modal-confirmar')).not.toBeInTheDocument();
        });

        it('botão de remover fica desabilitado sem permissão de edição', () => {
            RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(false);
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            const removeButton = screen.getAllByRole('button').find(
                (b) => b.className.includes('botao-acao-lista')
            );
            expect(removeButton).toBeDisabled();
        });
    });

    describe('rowExpansionTemplate', () => {
        it('renderiza email e username na expansão', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            const expansao = capturedRowExpansionTemplate(USUARIO_BASE);
            const { getByText } = render(<div>{expansao}</div>);
            expect(getByText('joao@exemplo.com')).toBeInTheDocument();
            expect(getByText('joao.silva')).toBeInTheDocument();
        });

        it('exibe unidades com acesso para visão DRE', () => {
            const usuario = {
                ...USUARIO_BASE,
                unidades: [
                    { uuid: 'u1', nome: 'Escola Central', acesso_de_suporte: false, acesso_concedido_sme: false },
                ],
            };
            renderListaUsuarios({ isLoading: false, usuarios: [usuario] }, { visaoBase: 'DRE' });
            const expansao = capturedRowExpansionTemplate(usuario);
            const { getByText } = render(<div>{expansao}</div>);
            expect(getByText('Escola Central')).toBeInTheDocument();
        });

        it('exibe unidades em suporte para visão SME', () => {
            const usuario = {
                ...USUARIO_BASE,
                unidades: [
                    { uuid: 'u2', nome: 'Escola Suporte', acesso_de_suporte: true, acesso_concedido_sme: false },
                ],
            };
            renderListaUsuarios({ isLoading: false, usuarios: [usuario] }, { visaoBase: 'SME' });
            const expansao = capturedRowExpansionTemplate(usuario);
            const { getByText } = render(<div>{expansao}</div>);
            expect(getByText('Escola Suporte')).toBeInTheDocument();
        });

        it('não exibe seção de unidades para visão UE', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] }, { visaoBase: 'UE' });
            const expansao = capturedRowExpansionTemplate(USUARIO_BASE);
            const { queryByText } = render(<div>{expansao}</div>);
            expect(queryByText('Unidades com acesso')).not.toBeInTheDocument();
        });

        it('renderiza tag acesso_concedido_sme quando unidade tem acesso concedido pela SME', () => {
            const usuario = {
                ...USUARIO_BASE,
                unidades: [
                    { uuid: 'u3', nome: 'Escola SME', acesso_de_suporte: false, acesso_concedido_sme: true },
                ],
            };
            renderListaUsuarios({ isLoading: false, usuarios: [usuario] }, { visaoBase: 'SME' });
            const expansao = capturedRowExpansionTemplate(usuario);
            const { getByTestId } = render(<div>{expansao}</div>);
            expect(getByTestId('table-tag-2')).toBeInTheDocument();
        });
    });

    describe('onRowToggle', () => {
        it('captura onRowToggle do DataTable', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            expect(capturedOnRowToggle).toBeInstanceOf(Function);
        });

        it('atualiza expandedRows via onRowToggle', () => {
            renderListaUsuarios({ isLoading: false, usuarios: [USUARIO_BASE] });
            act(() => { capturedOnRowToggle({ data: [USUARIO_BASE] }); });
        });
    });
});

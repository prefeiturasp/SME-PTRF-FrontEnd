import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { UnidadesUsuario } from '../UnidadesUsuario';
import { GestaoDeUsuariosFormContext } from '../../context/GestaoDeUsuariosFormProvider';
import { UnidadesUsuarioContext } from '../../context/UnidadesUsuarioProvider';

// ── PrimeReact DataTable mock — invoca body de cada Column para cobrir templates ─
jest.mock('primereact/datatable', () => ({
    DataTable: ({ children, value }) => {
        // Normaliza children para array sem depender de React.Children (não permitido em factories)
        const columns = Array.isArray(children) ? children : (children ? [children] : []);
        return (
            <table data-testid="datatable">
                <tbody>
                    {value?.map((row, rowIdx) => (
                        <tr key={rowIdx} data-testid={`row-${rowIdx}`}>
                            {columns.map((col, colIdx) => (
                                <td key={colIdx} data-testid={`cell-${rowIdx}-${colIdx}`}>
                                    {col && col.props && col.props.body ? col.props.body(row) : null}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    },
}));
jest.mock('primereact/column', () => ({
    Column: () => null,
}));

// ── FontAwesome mock ──────────────────────────────────────────────────────────
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: ({ icon }) => <span data-testid={`icon-${icon?.iconName || 'icon'}`} />,
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faExclamationCircle: { iconName: 'exclamation-circle' },
    faCheckCircle: { iconName: 'check-circle' },
}));

// ── Ant Design Switch mock ────────────────────────────────────────────────────
jest.mock('antd', () => ({
    Switch: ({ checked, onChange, disabled, className, name }) => (
        <input
            type="checkbox"
            data-testid="switch-acesso"
            checked={checked}
            onChange={onChange}
            disabled={disabled}
            className={className}
            name={name}
            readOnly={!onChange}
        />
    ),
}));

// ── react-tooltip mock ────────────────────────────────────────────────────────
jest.mock('react-tooltip', () => ({
    Tooltip: ({ id }) => <div data-testid={`tooltip-${id}`} />,
}));

// ── Loading mock ──────────────────────────────────────────────────────────────
jest.mock('../../../../../utils/Loading', () => ({
    __esModule: true,
    default: () => <div data-testid="loading" />,
}));

// ── MsgImgCentralizada mock ───────────────────────────────────────────────────
jest.mock('../../../Mensagens/MsgImgCentralizada', () => ({
    MsgImgCentralizada: ({ texto }) => <div data-testid="msg-img-centralizada">{texto}</div>,
}));

// ── BarraTopoListagem mock ────────────────────────────────────────────────────
jest.mock('../BarraTopoListagem', () => ({
    BarraTopoListagem: () => <div data-testid="barra-topo-listagem" />,
}));

// ── ModalConfirmacao mock ─────────────────────────────────────────────────────
jest.mock('../ModalConfirmacao', () => ({
    ModalConfirmacao: ({ show, botaoCancelarHandle, botaoConfirmarHandle, titulo }) =>
        show ? (
            <div data-testid="modal-confirmacao">
                <span>{titulo}</span>
                <button data-testid="modal-cancelar" onClick={botaoCancelarHandle}>Cancelar</button>
                <button data-testid="modal-confirmar" onClick={botaoConfirmarHandle}>Salvar</button>
            </div>
        ) : null,
}));

// ── Permissão mock ────────────────────────────────────────────────────────────
jest.mock('../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios', () => ({
    RetornaSeTemPermissaoEdicaoGestaoUsuarios: jest.fn(),
}));

// ── Hooks mocks ───────────────────────────────────────────────────────────────
jest.mock('../../hooks/useUnidadesUsuario', () => ({
    useUnidadesUsuario: jest.fn(),
}));
jest.mock('../../hooks/useHabilitarAcesso', () => ({
    useHabilitarAcesso: jest.fn(),
}));
jest.mock('../../hooks/useDesabilitarAcesso', () => ({
    useDesabilitarAcesso: jest.fn(),
}));

// ── SVG mock ──────────────────────────────────────────────────────────────────
jest.mock('../../../../../assets/img/img-404.svg', () => 'img-404.svg');

import { RetornaSeTemPermissaoEdicaoGestaoUsuarios } from '../../../GestaoDeUsuarios/utils/RetornaSeTemPermissaoEdicaoGestaoUsuarios';
import { useUnidadesUsuario } from '../../hooks/useUnidadesUsuario';
import { useHabilitarAcesso } from '../../hooks/useHabilitarAcesso';
import { useDesabilitarAcesso } from '../../hooks/useDesabilitarAcesso';

// ── Dados de teste ────────────────────────────────────────────────────────────
const USUARIO_MOCK = { username: 'joao', id: 1, e_servidor: false };
const USUARIO_SERVIDOR = { username: 'maria', id: 2, e_servidor: true };

/** Row 0 – membro, tem_acesso, sem acesso SME → desabilitar ao clicar switch */
const ROW_MEMBRO_COM_ACESSO = {
    uuid_unidade: 'uuid-1',
    uuid: 'uuid-1',
    nome_com_tipo: 'EMEF Teste',
    tem_acesso: true,
    membro: true,
    unidade_em_exercicio: true,
    acesso_concedido_sme: false,
    username: 'joao',
};

/** Row 1 – não-membro, sem acesso, sem acesso SME → habilitar ao clicar switch */
const ROW_NAO_MEMBRO_SEM_ACESSO = {
    uuid_unidade: 'uuid-2',
    uuid: 'uuid-2',
    nome_com_tipo: 'CEI Escola',
    tem_acesso: false,
    membro: false,
    unidade_em_exercicio: false,
    acesso_concedido_sme: false,
    username: 'joao',
};

/** Row 2 – acesso concedido pela SME → switch abre modal ao clicar */
const ROW_ACESSO_SME = {
    uuid_unidade: 'uuid-3',
    uuid: 'uuid-3',
    nome_com_tipo: 'EMEI Outra',
    tem_acesso: true,
    membro: false,
    unidade_em_exercicio: true,
    acesso_concedido_sme: true,
    username: 'joao',
};

/** Row para disableSwitchTemAcesso=true: servidor + membro + não está em exercício */
const ROW_SERVIDOR_MEMBRO_INATIVO = {
    uuid_unidade: 'uuid-4',
    uuid: 'uuid-4',
    nome_com_tipo: 'EMEF Servidor',
    tem_acesso: false,
    membro: true,
    unidade_em_exercicio: false,
    acesso_concedido_sme: false,
    username: 'maria',
};

const UNIDADES_COMPLETAS = [ROW_MEMBRO_COM_ACESSO, ROW_NAO_MEMBRO_SEM_ACESSO, ROW_ACESSO_SME];

// ── Helpers de contexto ───────────────────────────────────────────────────────
const buildFormContext = (overrides = {}) => ({
    visaoBase: 'DRE',
    uuidUnidadeBase: 'uuid-dre',
    modo: 'Editar Usuário',
    setModo: jest.fn(),
    Modos: { INSERT: 'Adicionar Usuário', EDIT: 'Editar Usuário', VIEW: 'Visualizar Usuário' },
    usuarioId: '1',
    setUsuarioId: jest.fn(),
    ...overrides,
});

const buildUnidadesContext = (overrides = {}) => ({
    showModalRemoverAcesso: false,
    setShowModalRemoverAcesso: jest.fn(),
    textoModalRemoverAcesso: 'Texto do modal',
    payloadRemoveAcessoConcedidoSme: {},
    setPayloadRemoveAcessoConcedidoSme: jest.fn(),
    currentPage: 1,
    setCurrentPage: jest.fn(),
    firstPage: 1,
    setFirstPage: jest.fn(),
    showFaixaIndicativa: false,
    setShowFaixaIndicativa: jest.fn(),
    ...overrides,
});

const mockMutateHabilitar = jest.fn();
const mockMutateDesabilitar = jest.fn();

const setupDefaultMocks = () => {
    RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(true);
    useHabilitarAcesso.mockReturnValue({ mutationHabilitarAcesso: { mutate: mockMutateHabilitar } });
    useDesabilitarAcesso.mockReturnValue({ mutationDesabilitarAcesso: { mutate: mockMutateDesabilitar } });
};

const renderComponent = (
    props = {},
    formContextOverrides = {},
    unidadesContextOverrides = {}
) => {
    const usuario = props.usuario !== undefined ? props.usuario : USUARIO_MOCK;
    const { usuario: _ignored, ...restProps } = props;

    return render(
        <GestaoDeUsuariosFormContext.Provider value={buildFormContext(formContextOverrides)}>
            <UnidadesUsuarioContext.Provider value={buildUnidadesContext(unidadesContextOverrides)}>
                <UnidadesUsuario usuario={usuario} {...restProps} />
            </UnidadesUsuarioContext.Provider>
        </GestaoDeUsuariosFormContext.Provider>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
describe('UnidadesUsuario', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        setupDefaultMocks();
    });

    // ── Visibilidade geral ────────────────────────────────────────────────────
    describe('visibilidade geral', () => {
        it('retorna null (não renderiza nada) quando visaoBase é "UE"', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            const { container } = renderComponent({}, { visaoBase: 'UE' });
            expect(container).toBeEmptyDOMElement();
        });

        it('renderiza a BarraTopoListagem quando visaoBase não é "UE"', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            renderComponent();
            expect(screen.getByTestId('barra-topo-listagem')).toBeInTheDocument();
        });

        it('exibe mensagem de "Informe um ID" quando modo é "Adicionar Usuário"', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            renderComponent({}, { modo: 'Adicionar Usuário' });
            expect(
                screen.getByText(/Informe um ID de usuário para visualizar as Unidades/)
            ).toBeInTheDocument();
        });
    });

    // ── Loading ───────────────────────────────────────────────────────────────
    describe('estado de carregamento', () => {
        it('exibe loading quando modo é "Editar Usuário" e isLoading=true', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: true, data: [] });
            renderComponent({}, { modo: 'Editar Usuário' });
            expect(screen.getByTestId('loading')).toBeInTheDocument();
        });

        it('não exibe loading quando isLoading=false', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            renderComponent();
            expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
        });
    });

    // ── DataTable e estado vazio ──────────────────────────────────────────────
    describe('DataTable e estado vazio', () => {
        it('exibe DataTable quando modo é "Editar Usuário", há dados e usuario', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: UNIDADES_COMPLETAS });
            renderComponent();
            expect(screen.getByTestId('datatable')).toBeInTheDocument();
        });

        it('não exibe DataTable quando não há dados', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            renderComponent();
            expect(screen.queryByTestId('datatable')).not.toBeInTheDocument();
        });

        it('exibe MsgImgCentralizada quando modo Editar e sem dados', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            renderComponent({}, { modo: 'Editar Usuário' });
            expect(screen.getByTestId('msg-img-centralizada')).toBeInTheDocument();
            expect(screen.getByText('Não encontramos resultados')).toBeInTheDocument();
        });

        it('não exibe MsgImgCentralizada quando está carregando', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: true, data: [] });
            renderComponent({}, { modo: 'Editar Usuário' });
            expect(screen.queryByTestId('msg-img-centralizada')).not.toBeInTheDocument();
        });
    });

    // ── membroTemplate ────────────────────────────────────────────────────────
    describe('membroTemplate (coluna Membro)', () => {
        it('exibe ícone check quando membro=true', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_MEMBRO_COM_ACESSO] });
            renderComponent();
            // Coluna índice 1 = Membro
            const cell = screen.getByTestId('cell-0-1');
            expect(within(cell).getByTestId('icon-check-circle')).toBeInTheDocument();
        });

        it('exibe "-" quando membro=false', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_NAO_MEMBRO_SEM_ACESSO] });
            renderComponent();
            const cell = screen.getByTestId('cell-0-1');
            expect(within(cell).getByText('-')).toBeInTheDocument();
        });
    });

    // ── unidadeEscolarTemplate ────────────────────────────────────────────────
    describe('unidadeEscolarTemplate (coluna Nome)', () => {
        it('exibe o nome da unidade', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_MEMBRO_COM_ACESSO] });
            renderComponent();
            const cell = screen.getByTestId('cell-0-0');
            expect(within(cell).getByText('EMEF Teste')).toBeInTheDocument();
        });

        it('exibe a tag "Acesso habilitado pela SME" quando acesso_concedido_sme=true', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_ACESSO_SME] });
            renderComponent();
            expect(screen.getByText('Acesso habilitado pela SME')).toBeInTheDocument();
        });

        it('não exibe a tag SME quando acesso_concedido_sme=false', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_MEMBRO_COM_ACESSO] });
            renderComponent();
            expect(screen.queryByText('Acesso habilitado pela SME')).not.toBeInTheDocument();
        });
    });

    // ── temAcessoTemplate e disableSwitchTemAcesso ────────────────────────────
    describe('temAcessoTemplate (coluna Acesso)', () => {
        it('switch fica marcado (checked) quando tem_acesso=true', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_MEMBRO_COM_ACESSO] });
            renderComponent();
            const switches = screen.getAllByTestId('switch-acesso');
            expect(switches[0]).toBeChecked();
        });

        it('switch fica desmarcado quando tem_acesso=false', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_NAO_MEMBRO_SEM_ACESSO] });
            renderComponent();
            const switches = screen.getAllByTestId('switch-acesso');
            expect(switches[0]).not.toBeChecked();
        });

        it('switch não é desabilitado quando acesso_concedido_sme=true (disableSwitchTemAcesso retorna false)', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_ACESSO_SME] });
            renderComponent();
            const sw = screen.getAllByTestId('switch-acesso')[0];
            expect(sw).not.toBeDisabled();
        });

        it('switch é desabilitado quando usuario é servidor, membro e não está em exercício', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_SERVIDOR_MEMBRO_INATIVO] });
            renderComponent({ usuario: USUARIO_SERVIDOR });
            const sw = screen.getAllByTestId('switch-acesso')[0];
            expect(sw).toBeDisabled();
        });

        it('tooltip é renderizado quando switch está desabilitado por regra de servidor', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_SERVIDOR_MEMBRO_INATIVO] });
            renderComponent({ usuario: USUARIO_SERVIDOR });
            expect(
                screen.getByTestId(`tooltip-tooltip-id-${ROW_SERVIDOR_MEMBRO_INATIVO.uuid_unidade}`)
            ).toBeInTheDocument();
        });

        it('switch é desabilitado quando não tem permissão de edição', () => {
            RetornaSeTemPermissaoEdicaoGestaoUsuarios.mockReturnValue(false);
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_MEMBRO_COM_ACESSO] });
            renderComponent();
            const sw = screen.getAllByTestId('switch-acesso')[0];
            expect(sw).toBeDisabled();
        });
    });

    // ── handleChangeSwitchTemAcesso ───────────────────────────────────────────
    describe('handleChangeSwitchTemAcesso', () => {
        it('abre o modal quando acesso_concedido_sme=true ao clicar no switch', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_ACESSO_SME] });
            const setShowModalRemoverAcesso = jest.fn();
            renderComponent({}, {}, { setShowModalRemoverAcesso });
            fireEvent.click(screen.getAllByTestId('switch-acesso')[0]);
            expect(setShowModalRemoverAcesso).toHaveBeenCalledWith(true);
        });

        it('armazena o payload ao clicar no switch com acesso_concedido_sme=true', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_ACESSO_SME] });
            const setPayloadRemoveAcessoConcedidoSme = jest.fn();
            renderComponent({}, {}, { setPayloadRemoveAcessoConcedidoSme });
            fireEvent.click(screen.getAllByTestId('switch-acesso')[0]);
            expect(setPayloadRemoveAcessoConcedidoSme).toHaveBeenCalledWith(
                expect.objectContaining({
                    username: ROW_ACESSO_SME.username,
                    uuid_unidade: ROW_ACESSO_SME.uuid_unidade,
                    acesso_concedido_sme: true,
                })
            );
        });

        it('chama mutationDesabilitarAcesso ao clicar no switch com tem_acesso=true e sem acesso SME', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_MEMBRO_COM_ACESSO] });
            renderComponent();
            fireEvent.click(screen.getAllByTestId('switch-acesso')[0]);
            expect(mockMutateDesabilitar).toHaveBeenCalledWith(
                expect.objectContaining({
                    payload: expect.objectContaining({
                        username: ROW_MEMBRO_COM_ACESSO.username,
                        uuid_unidade: ROW_MEMBRO_COM_ACESSO.uuid_unidade,
                    }),
                })
            );
        });

        it('chama mutationHabilitarAcesso ao clicar no switch com tem_acesso=false e sem acesso SME', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [ROW_NAO_MEMBRO_SEM_ACESSO] });
            renderComponent();
            fireEvent.click(screen.getAllByTestId('switch-acesso')[0]);
            expect(mockMutateHabilitar).toHaveBeenCalledWith(
                expect.objectContaining({
                    payload: expect.objectContaining({
                        username: ROW_NAO_MEMBRO_SEM_ACESSO.username,
                        uuid_unidade: ROW_NAO_MEMBRO_SEM_ACESSO.uuid_unidade,
                    }),
                })
            );
        });
    });

    // ── acaoSwitchTemAcesso via modal ─────────────────────────────────────────
    describe('acaoSwitchTemAcesso via modal de confirmação', () => {
        it('chama mutationDesabilitarAcesso ao confirmar o modal (tem_acesso padrão=true)', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            const payloadRemoveAcessoConcedidoSme = {
                username: 'joao',
                uuid_unidade: 'uuid-1',
                acesso_concedido_sme: true,
                visao_base: 'DRE',
            };
            renderComponent(
                {},
                {},
                { showModalRemoverAcesso: true, payloadRemoveAcessoConcedidoSme }
            );
            fireEvent.click(screen.getByTestId('modal-confirmar'));
            expect(mockMutateDesabilitar).toHaveBeenCalledWith({
                payload: payloadRemoveAcessoConcedidoSme,
            });
        });

        it('fecha o modal ao confirmar', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            const setShowModalRemoverAcesso = jest.fn();
            renderComponent(
                {},
                {},
                { showModalRemoverAcesso: true, setShowModalRemoverAcesso }
            );
            fireEvent.click(screen.getByTestId('modal-confirmar'));
            expect(setShowModalRemoverAcesso).toHaveBeenCalledWith(false);
        });

        it('chama setShowModalRemoverAcesso(false) ao cancelar o modal', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            const setShowModalRemoverAcesso = jest.fn();
            renderComponent({}, {}, { showModalRemoverAcesso: true, setShowModalRemoverAcesso });
            fireEvent.click(screen.getByTestId('modal-cancelar'));
            expect(setShowModalRemoverAcesso).toHaveBeenCalledWith(false);
        });

        it('renderiza o modal quando showModalRemoverAcesso=true', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            renderComponent({}, {}, { showModalRemoverAcesso: true });
            expect(screen.getByTestId('modal-confirmacao')).toBeInTheDocument();
        });

        it('não renderiza o modal quando showModalRemoverAcesso=false', () => {
            useUnidadesUsuario.mockReturnValue({ isLoading: false, data: [] });
            renderComponent({}, {}, { showModalRemoverAcesso: false });
            expect(screen.queryByTestId('modal-confirmacao')).not.toBeInTheDocument();
        });
    });
});

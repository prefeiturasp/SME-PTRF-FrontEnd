import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { GestaoDePerfisFormFormik } from '../GestaoDePerfisFormFormik';

// ── FontAwesome ────────────────────────────────────────────────────────────────
jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => null,
}));
jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faTrash: 'faTrash',
    faTrashAlt: 'faTrashAlt',
}));

// ── react-text-mask → input simples ───────────────────────────────────────────
jest.mock('react-text-mask', () =>
    // eslint-disable-next-line react/prop-types
    ({ mask, guide, showMask, ...props }) => <input {...props} />
);

// ── Autocomplete ──────────────────────────────────────────────────────────────
jest.mock('../GestaoDePerfisFormAutocomplete', () => () => <div data-testid="autocomplete" />);

// ── Modais — expostos com botões de teste ─────────────────────────────────────
jest.mock('../ModalUsuarioNaoCadastrado', () => ({
    // eslint-disable-next-line react/prop-types
    ModalUsuarioNaoCadastrado: ({ show, handleClose, onCadastrarTrue }) =>
        show ? (
            <>
                <button data-testid="modal-nao-cadastrado-close" onClick={handleClose}>Fechar NaoCadastrado</button>
                <button data-testid="modal-nao-cadastrado-cadastrar" onClick={onCadastrarTrue}>Cadastrar</button>
            </>
        ) : null,
}));

jest.mock('../ModalUsuarioCadastradoVinculado', () => ({
    // eslint-disable-next-line react/prop-types
    ModalUsuarioCadastradoVinculado: ({ show, handleClose }) =>
        show ? (
            <button data-testid="modal-vinculado-close" onClick={handleClose}>Fechar Vinculado</button>
        ) : null,
}));

jest.mock('../ModalConfirmDeletePerfil', () => ({
    // eslint-disable-next-line react/prop-types
    ModalConfirmDeletePerfil: ({ show, handleClose, onDeletePerfilTrue }) =>
        show ? (
            <>
                <button data-testid="modal-delete-close" onClick={handleClose}>Fechar Delete</button>
                <button data-testid="modal-delete-confirm" onClick={onDeletePerfilTrue}>Confirmar Delete</button>
            </>
        ) : null,
}));

jest.mock('../ModalInfo', () => ({
    // eslint-disable-next-line react/prop-types
    ModalInfo: ({ show, handleClose }) =>
        show ? (
            <button data-testid="modal-info-close" onClick={handleClose}>Fechar Info</button>
        ) : null,
}));

// ── Dados base ─────────────────────────────────────────────────────────────────
const VISOES_MOCK = [
    { nome: 'DRE', id: 'visao-dre-id', editavel: true },
    { nome: 'SME', id: 'visao-sme-id', editavel: true },
    { nome: 'UE', id: 'visao-ue-id', editavel: false },
];

const GRUPOS_MOCK = [
    { id: 1, nome: 'Grupo Admin', visao: 'DRE' },
    { id: 2, nome: 'Grupo Leitor', visao: 'SME' },
];

const TABELA_ASSOCIACOES_MOCK = {
    tipos_unidade: [
        { id: 'EMEF', nome: 'EMEF' },
        { id: 'CEI', nome: 'CEI' },
    ],
};

const DEFAULT_STATE = {
    id: null,
    e_servidor: '',
    username: '',
    name: '',
    email: '',
    visoes: [],
    groups: [],
    unidades_vinculadas: [],
};

const DEFAULT_INIT = {
    visao: 'DRE',
    unidade_selecionada: null,
};

const UNIDADE_UUID = 'uuid-principal';

const STATE_WITH_ID = {
    ...DEFAULT_STATE,
    id: 42,
    visao: 'DRE',
    e_servidor: 'True',
    name: 'Usuário Teste',
    visoes: ['DRE'],
    groups: [1],
    unidades_vinculadas: [
        { uuid: 'uuid-outra', nome: 'EMEF Outra', tipo_unidade: 'EMEF', pode_excluir: true },
    ],
};

const STATE_WITH_ID_UE = {
    ...DEFAULT_STATE,
    id: 42,
    visao: 'UE',
    e_servidor: 'True',
    name: 'Usuário UE',
    visoes: ['UE'],
    groups: [1],
    unidades_vinculadas: [
        { uuid: UNIDADE_UUID, nome: 'EMEF Principal', tipo_unidade: 'EMEF', pode_excluir: true },
    ],
};

// ── Factory de props ───────────────────────────────────────────────────────────
const makeProps = (overrides = {}) => ({
    initPerfisForm: DEFAULT_INIT,
    setStatePerfisForm: jest.fn(),
    statePerfisForm: DEFAULT_STATE,
    handleSubmitPerfisForm: jest.fn(),
    setShowModalDeletePerfil: jest.fn(),
    validacoesPersonalizadas: jest.fn(),
    setFormErrors: jest.fn(),
    formErrors: {},
    idUsuarioCondicionalMask: jest.fn(() => []),
    setBloquearCampoName: jest.fn(),
    bloquearCampoName: false,
    grupos: GRUPOS_MOCK,
    visoes: VISOES_MOCK,
    showModalUsuarioNaoCadastrado: false,
    handleCloseUsuarioNaoCadastrado: jest.fn(),
    showModalUsuarioCadastradoVinculado: false,
    setShowModalUsuarioNaoCadastrado: jest.fn(),
    setShowModalUsuarioCadastradoVinculado: jest.fn(),
    showModalDeletePerfil: false,
    handleCloseDeletePerfil: jest.fn(),
    onDeletePerfilTrue: jest.fn(),
    showModalInfo: false,
    setShowModalInfo: jest.fn(),
    tituloModalInfo: 'Título',
    textoModalInfo: 'Texto',
    tabelaAssociacoes: TABELA_ASSOCIACOES_MOCK,
    handleChangeTipoUnidade: jest.fn(),
    unidadesPorTipo: [],
    vinculaUnidadeUsuario: jest.fn(),
    desvinculaUnidadeUsuario: jest.fn().mockResolvedValue({}),
    btnAdicionarDisabled: false,
    handleChangeVisao: jest.fn(),
    handleChangeGrupo: jest.fn(),
    getEstadoInicialVisoesChecked: jest.fn(),
    getEstadoInicialGruposChecked: jest.fn(),
    acessoCadastrarUnidade: jest.fn(() => true),
    unidadeVisaoUE: { tipo_unidade: 'EMEF' },
    serviceTemUnidadeDre: jest.fn(() => false),
    serviceTemUnidadeUE: jest.fn(() => false),
    pesquisaVisao: jest.fn((v) => ({ id: `${v}_ID`, nome: v })),
    pesquisaPermissaoExibicaoVisao: jest.fn(() => true),
    evitaDuplicacao: jest.fn((g) => g),
    ...overrides,
});

// ── Setup ──────────────────────────────────────────────────────────────────────
beforeEach(() => {
    delete window.location;
    window.location = { assign: jest.fn() };
});

// ══════════════════════════════════════════════════════════════════════════════
describe('GestaoDePerfisFormFormik', () => {

    // ── Título ─────────────────────────────────────────────────────────────────
    describe('título do formulário', () => {
        it('exibe "Adicionar usuário" quando statePerfisForm.id é nulo', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.getByText('Adicionar usuário')).toBeInTheDocument();
        });

        it('exibe "Editar usuário" quando statePerfisForm.id está definido', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: STATE_WITH_ID })} />);
            expect(screen.getByText('Editar usuário')).toBeInTheDocument();
        });
    });

    // ── Botões fixos ───────────────────────────────────────────────────────────
    describe('botões Salvar e Voltar', () => {
        it('sempre exibe o botão Salvar', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.getByRole('button', { name: 'Salvar' })).toBeInTheDocument();
        });

        it('sempre exibe o botão Voltar', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.getByRole('button', { name: 'Voltar' })).toBeInTheDocument();
        });

        it('clique em Voltar chama window.location.assign', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            fireEvent.click(screen.getByRole('button', { name: 'Voltar' }));
            expect(window.location.assign).toHaveBeenCalledWith('/gestao-de-perfis/');
        });
    });

    // ── Botão Desvincular ──────────────────────────────────────────────────────
    describe('botão Desvincular', () => {
        it('não exibe o botão Desvincular quando statePerfisForm.id é nulo', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.queryByText(/Desvincular/)).not.toBeInTheDocument();
        });

        it('não exibe o botão Desvincular quando visao não é UE', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: STATE_WITH_ID })} />);
            expect(screen.queryByText(/Desvincular/)).not.toBeInTheDocument();
        });

        it('não exibe o botão Desvincular quando visao é UE mas não há unidade_selecionada', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID_UE,
                initPerfisForm: { visao: 'UE', unidade_selecionada: 'uuid-inexistente' },
            })} />);
            expect(screen.queryByText(/Desvincular/)).not.toBeInTheDocument();
        });

        it('exibe "Desvincular e excluir" quando há apenas uma unidade e sem outras visoes', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID_UE,
                initPerfisForm: { visao: 'UE', unidade_selecionada: UNIDADE_UUID },
            })} />);
            expect(screen.getByText('Desvincular e excluir')).toBeInTheDocument();
        });

        it('exibe "Desvincular usuário" quando há mais de uma unidade', () => {
            const stateComDuasUnidades = {
                ...STATE_WITH_ID_UE,
                unidades_vinculadas: [
                    { uuid: UNIDADE_UUID, nome: 'Principal', tipo_unidade: 'EMEF', pode_excluir: true },
                    { uuid: 'uuid-extra', nome: 'Extra', tipo_unidade: 'CEI', pode_excluir: true },
                ],
            };
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: stateComDuasUnidades,
                initPerfisForm: { visao: 'UE', unidade_selecionada: UNIDADE_UUID },
            })} />);
            expect(screen.getByText('Desvincular usuário')).toBeInTheDocument();
        });

        it('clique em Desvincular chama desvinculaUnidadeUsuario e window.location quando temOutrasUnidades', async () => {
            const desvinculaUnidadeUsuario = jest.fn().mockResolvedValue({});
            const stateComDuasUnidades = {
                ...STATE_WITH_ID_UE,
                unidades_vinculadas: [
                    { uuid: UNIDADE_UUID, nome: 'Principal', tipo_unidade: 'EMEF', pode_excluir: true },
                    { uuid: 'uuid-extra', nome: 'Extra', tipo_unidade: 'CEI', pode_excluir: true },
                ],
            };
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: stateComDuasUnidades,
                initPerfisForm: { visao: 'UE', unidade_selecionada: UNIDADE_UUID },
                desvinculaUnidadeUsuario,
            })} />);
            await act(async () => {
                fireEvent.click(screen.getByText('Desvincular usuário'));
            });
            expect(desvinculaUnidadeUsuario).toHaveBeenCalledWith(stateComDuasUnidades.unidades_vinculadas[0]);
            expect(window.location.assign).toHaveBeenCalledWith('/gestao-de-perfis/');
        });

        it('clique em "Desvincular e excluir" chama desvinculaUnidadeUsuario e setShowModalDeletePerfil', async () => {
            const desvinculaUnidadeUsuario = jest.fn().mockResolvedValue({});
            const setShowModalDeletePerfil = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID_UE,
                initPerfisForm: { visao: 'UE', unidade_selecionada: UNIDADE_UUID },
                desvinculaUnidadeUsuario,
                setShowModalDeletePerfil,
            })} />);
            await act(async () => {
                fireEvent.click(screen.getByText('Desvincular e excluir'));
            });
            expect(desvinculaUnidadeUsuario).toHaveBeenCalledWith(STATE_WITH_ID_UE.unidades_vinculadas[0]);
            expect(setShowModalDeletePerfil).toHaveBeenCalledWith(true);
        });
    });

    // ── Botão Deletar usuário ──────────────────────────────────────────────────
    describe('botão Deletar usuário', () => {
        it('não exibe quando statePerfisForm.id é nulo', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.queryByText('Deletar usuário')).not.toBeInTheDocument();
        });

        it('não exibe quando initPerfisForm.visao é UE', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID,
                initPerfisForm: { visao: 'UE', unidade_selecionada: null },
            })} />);
            expect(screen.queryByText('Deletar usuário')).not.toBeInTheDocument();
        });

        it('exibe quando statePerfisForm.id existe e visao não é UE', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: STATE_WITH_ID })} />);
            expect(screen.getByText('Deletar usuário')).toBeInTheDocument();
        });

        it('está desabilitado quando serviceTemUnidadeDre retorna true', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID,
                serviceTemUnidadeDre: jest.fn(() => true),
            })} />);
            expect(screen.getByText('Deletar usuário').closest('button')).toBeDisabled();
        });

        it('está desabilitado quando serviceTemUnidadeUE retorna true', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID,
                serviceTemUnidadeUE: jest.fn(() => true),
            })} />);
            expect(screen.getByText('Deletar usuário').closest('button')).toBeDisabled();
        });

        it('está desabilitado quando visoes inclui SME', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: { ...STATE_WITH_ID, visoes: ['SME_ID'] },
                pesquisaVisao: jest.fn((v) => ({ id: `${v}_ID`, nome: v })),
            })} />);
            expect(screen.getByText('Deletar usuário').closest('button')).toBeDisabled();
        });

        it('clique em Deletar chama setShowModalDeletePerfil(true)', () => {
            const setShowModalDeletePerfil = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID,
                setShowModalDeletePerfil,
            })} />);
            fireEvent.click(screen.getByText('Deletar usuário'));
            expect(setShowModalDeletePerfil).toHaveBeenCalledWith(true);
        });
    });

    // ── Campo tipo de usuário ──────────────────────────────────────────────────
    describe('campo tipo de usuário (e_servidor)', () => {
        it('renderiza as opções de tipo de usuário', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.getByRole('option', { name: 'Escolha o tipo de usuário' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Servidor' })).toBeInTheDocument();
            expect(screen.getByRole('option', { name: 'Não Servidor' })).toBeInTheDocument();
        });

        it('está desabilitado quando statePerfisForm.id existe', () => {
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: STATE_WITH_ID })} />);
            expect(container.querySelector('select[name="e_servidor"]')).toBeDisabled();
        });

        it('não está desabilitado quando statePerfisForm.id é nulo', () => {
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(container.querySelector('select[name="e_servidor"]')).not.toBeDisabled();
        });

        it('onChange chama handleChange interno do Formik', () => {
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps()} />);
            fireEvent.change(container.querySelector('select[name="e_servidor"]'), {
                target: { name: 'e_servidor', value: 'True' },
            });
            expect(container.querySelector('select[name="e_servidor"]').value).toBe('True');
        });

        it('onBlur chama validacoesPersonalizadas', () => {
            const validacoesPersonalizadas = jest.fn();
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({ validacoesPersonalizadas })} />);
            fireEvent.blur(container.querySelector('select[name="e_servidor"]'));
            expect(validacoesPersonalizadas).toHaveBeenCalledTimes(1);
        });

        it('onClick chama setFormErrors limpando username', () => {
            const setFormErrors = jest.fn();
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({ setFormErrors })} />);
            fireEvent.click(container.querySelector('select[name="e_servidor"]'));
            expect(setFormErrors).toHaveBeenCalledWith({ username: '' });
        });
    });

    // ── Campo username ─────────────────────────────────────────────────────────
    describe('campo username (MaskedInput)', () => {
        it('está desabilitado quando e_servidor está vazio', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            const input = screen.getByPlaceholderText('Insira o RF do servidor, sem ponto nem traço');
            expect(input).toBeDisabled();
        });

        it('não está desabilitado quando e_servidor é "True" e sem id', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: { ...DEFAULT_STATE, e_servidor: 'True' },
            })} />);
            expect(screen.getByPlaceholderText('Insira o RF do servidor, sem ponto nem traço')).not.toBeDisabled();
        });

        it('placeholder muda para CPF quando e_servidor é "False"', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: { ...DEFAULT_STATE, e_servidor: 'False' },
            })} />);
            expect(screen.getByPlaceholderText('Insira o CPF do usuário, sem ponto nem traço')).toBeInTheDocument();
        });

        it('onBlur chama validacoesPersonalizadas', () => {
            const validacoesPersonalizadas = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                validacoesPersonalizadas,
                statePerfisForm: { ...DEFAULT_STATE, e_servidor: 'True' },
            })} />);
            fireEvent.blur(screen.getByPlaceholderText('Insira o RF do servidor, sem ponto nem traço'));
            expect(validacoesPersonalizadas).toHaveBeenCalledTimes(1);
        });

        it('onClick chama setFormErrors limpando username', () => {
            const setFormErrors = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                setFormErrors,
                statePerfisForm: { ...DEFAULT_STATE, e_servidor: 'True' },
            })} />);
            fireEvent.click(screen.getByPlaceholderText('Insira o RF do servidor, sem ponto nem traço'));
            expect(setFormErrors).toHaveBeenCalledWith({ username: '' });
        });

        it('exibe formErrors.username quando definido', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                formErrors: { username: 'Usuário inválido' },
            })} />);
            expect(screen.getByText('Usuário inválido')).toBeInTheDocument();
        });
    });

    // ── Campo Nome ─────────────────────────────────────────────────────────────
    describe('campo Nome', () => {
        it('é readOnly quando bloquearCampoName é true', () => {
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({ bloquearCampoName: true })} />);
            expect(container.querySelector('input[name="name"]')).toHaveAttribute('readOnly');
        });

        it('não é readOnly quando bloquearCampoName é false', () => {
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({ bloquearCampoName: false })} />);
            expect(container.querySelector('input[name="name"]')).not.toHaveAttribute('readOnly');
        });

        it('onChange atualiza o valor do campo no Formik', () => {
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps()} />);
            fireEvent.change(container.querySelector('input[name="name"]'), {
                target: { name: 'name', value: 'Novo Nome' },
            });
            expect(container.querySelector('input[name="name"]').value).toBe('Novo Nome');
        });
    });

    // ── Campo Email ────────────────────────────────────────────────────────────
    describe('campo Email', () => {
        it('renderiza o campo de email com placeholder', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.getByPlaceholderText('Insira seu email se desejar')).toBeInTheDocument();
        });

        it('onChange atualiza o valor do campo no Formik', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            fireEvent.change(screen.getByPlaceholderText('Insira seu email se desejar'), {
                target: { name: 'email', value: 'teste@email.com' },
            });
            expect(screen.getByPlaceholderText('Insira seu email se desejar').value).toBe('teste@email.com');
        });
    });

    // ── Checkboxes de Visões ───────────────────────────────────────────────────
    describe('checkboxes de visões', () => {
        it('renderiza um checkbox por visão', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            VISOES_MOCK.forEach(v => {
                expect(screen.getByLabelText(v.nome)).toBeInTheDocument();
            });
        });

        it('checkbox fica checked quando visão está em values.visoes', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: { ...DEFAULT_STATE, visoes: ['DRE'] },
            })} />);
            expect(screen.getByLabelText('DRE')).toBeChecked();
            expect(screen.getByLabelText('SME')).not.toBeChecked();
        });

        it('checkbox editável=false fica desabilitado', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.getByLabelText('UE')).toBeDisabled();
        });

        it('checkbox fica desabilitado quando initPerfisForm.visao é UE', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                initPerfisForm: { visao: 'UE', unidade_selecionada: null },
            })} />);
            VISOES_MOCK.forEach(v => {
                expect(screen.getByLabelText(v.nome)).toBeDisabled();
            });
        });

        it('onChange de visão chama handleChangeVisao e getEstadoInicialVisoesChecked', () => {
            const handleChangeVisao = jest.fn();
            const getEstadoInicialVisoesChecked = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({ handleChangeVisao, getEstadoInicialVisoesChecked })} />);
            fireEvent.click(screen.getByLabelText('DRE'));
            expect(handleChangeVisao).toHaveBeenCalledTimes(1);
            expect(getEstadoInicialVisoesChecked).toHaveBeenCalledTimes(1);
        });
    });

    // ── Checkboxes de Grupos ───────────────────────────────────────────────────
    describe('checkboxes de grupos', () => {
        it('renderiza checkboxes de grupos filtrados por evitaDuplicacao', () => {
            const evitaDuplicacao = jest.fn((g) => g);
            render(<GestaoDePerfisFormFormik {...makeProps({ evitaDuplicacao })} />);
            expect(evitaDuplicacao).toHaveBeenCalledWith(GRUPOS_MOCK);
            expect(screen.getByLabelText('Grupo Admin')).toBeInTheDocument();
            expect(screen.getByLabelText('Grupo Leitor')).toBeInTheDocument();
        });

        it('não renderiza checkbox quando pesquisaPermissaoExibicaoVisao retorna false', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                pesquisaPermissaoExibicaoVisao: jest.fn(() => false),
            })} />);
            expect(screen.queryByLabelText('Grupo Admin')).not.toBeInTheDocument();
        });

        it('checkbox de grupo fica checked quando grupo está em values.groups', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: { ...DEFAULT_STATE, groups: [1] },
            })} />);
            expect(screen.getByLabelText('Grupo Admin')).toBeChecked();
            expect(screen.getByLabelText('Grupo Leitor')).not.toBeChecked();
        });

        it('onChange de grupo chama handleChangeGrupo e getEstadoInicialGruposChecked', () => {
            const handleChangeGrupo = jest.fn();
            const getEstadoInicialGruposChecked = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({ handleChangeGrupo, getEstadoInicialGruposChecked })} />);
            fireEvent.click(screen.getByLabelText('Grupo Admin'));
            expect(handleChangeGrupo).toHaveBeenCalledTimes(1);
            expect(getEstadoInicialGruposChecked).toHaveBeenCalledTimes(1);
        });

        it('não renderiza checkboxes quando grupos está vazio', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ grupos: [] })} />);
            expect(screen.queryByLabelText('Grupo Admin')).not.toBeInTheDocument();
        });
    });

    // ── Seção de unidades ──────────────────────────────────────────────────────
    describe('seção de unidades vinculadas', () => {
        it('exibe "Salve o usuário..." quando visao não é UE e id é nulo', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.getByText('Salve o usuário para poder vincular as unidades.')).toBeInTheDocument();
        });

        it('exibe "Unidades que possui acesso" quando visao não é UE e id existe', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: STATE_WITH_ID })} />);
            expect(screen.getByText('Unidades que possui acesso')).toBeInTheDocument();
        });

        it('não exibe a seção quando initPerfisForm.visao é UE', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                initPerfisForm: { visao: 'UE', unidade_selecionada: null },
            })} />);
            expect(screen.queryByText(/vincular as unidades/)).not.toBeInTheDocument();
            expect(screen.queryByText(/Unidades que possui acesso/)).not.toBeInTheDocument();
        });

        it('não exibe FieldArray quando id é nulo', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.queryByRole('button', { name: '+ Adicionar' })).not.toBeInTheDocument();
        });
    });

    // ── FieldArray ─────────────────────────────────────────────────────────────
    describe('FieldArray de unidades vinculadas', () => {
        it('exibe o botão "+ Adicionar" quando id existe e visao não é UE', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: STATE_WITH_ID })} />);
            expect(screen.getByRole('button', { name: '+ Adicionar' })).toBeInTheDocument();
        });

        it('botão "+ Adicionar" chama getEstadoInicialVisoesChecked e getEstadoInicialGruposChecked', async () => {
            const getEstadoInicialVisoesChecked = jest.fn();
            const getEstadoInicialGruposChecked = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID,
                getEstadoInicialVisoesChecked,
                getEstadoInicialGruposChecked,
            })} />);
            await act(async () => {
                fireEvent.click(screen.getByRole('button', { name: '+ Adicionar' }));
            });
            expect(getEstadoInicialVisoesChecked).toHaveBeenCalledTimes(1);
            expect(getEstadoInicialGruposChecked).toHaveBeenCalledTimes(1);
        });

        it('botão "+ Adicionar" adiciona nova linha ao FieldArray', async () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: STATE_WITH_ID })} />);
            await act(async () => {
                fireEvent.click(screen.getByRole('button', { name: '+ Adicionar' }));
            });
            await waitFor(() => {
                expect(screen.getByTestId('autocomplete')).toBeInTheDocument();
            });
        });

        it('botão "+ Adicionar" fica desabilitado quando btnAdicionarDisabled é true', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID,
                btnAdicionarDisabled: true,
            })} />);
            expect(screen.getByRole('button', { name: '+ Adicionar' })).toBeDisabled();
        });

        it('exibe input desabilitado quando unidade_vinculada.nome está definido', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: STATE_WITH_ID })} />);
            expect(screen.getByDisplayValue('EMEF Outra')).toBeDisabled();
        });

        it('onChange do input de unidade (disabled) passa o evento ao Formik sem erro', () => {
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: STATE_WITH_ID })} />);
            const unidadeInput = container.querySelector('input[name="unidades_vinculadas[0].unidade_vinculada"]');
            expect(() => {
                fireEvent.change(unidadeInput, { target: { value: 'EMEF Nova' } });
            }).not.toThrow();
        });

        it('exibe autocomplete quando unidade_vinculada.nome está vazio', async () => {
            const stateComUnidadeVazia = {
                ...STATE_WITH_ID,
                unidades_vinculadas: [
                    { uuid: undefined, nome: '', tipo_unidade: '', pode_excluir: false },
                ],
            };
            render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: stateComUnidadeVazia })} />);
            expect(screen.getByTestId('autocomplete')).toBeInTheDocument();
        });

        it('usa o select de visão UE quando values.visao é "UE" — opção DRE sempre desabilitada', () => {
            // com nome vazio o select pai fica habilitado, podendo checar disabled individualmente
            const stateUEBranch = {
                ...STATE_WITH_ID,
                visao: 'UE',
                unidades_vinculadas: [
                    { uuid: undefined, nome: '', tipo_unidade: '', pode_excluir: false },
                ],
            };
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: stateUEBranch })} />);
            const tipoSelect = container.querySelector('#tipo_unidade_0');
            // No branch UE, a opção DRE tem disabled={true} fixo
            const dreOption = tipoSelect.querySelector('option[value="DRE"]');
            expect(dreOption).toBeDisabled();
        });

        it('onChange do select de tipo_de_unidade (branch UE) chama handleChangeTipoUnidade', () => {
            const handleChangeTipoUnidade = jest.fn();
            const stateUEBranch = {
                ...STATE_WITH_ID,
                visao: 'UE',
                unidades_vinculadas: [
                    { uuid: undefined, nome: '', tipo_unidade: '', pode_excluir: false },
                ],
            };
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: stateUEBranch,
                handleChangeTipoUnidade,
            })} />);
            fireEvent.change(container.querySelector('#tipo_unidade_0'), {
                target: { value: 'EMEF' },
            });
            expect(handleChangeTipoUnidade).toHaveBeenCalledWith('EMEF', expect.any(Object));
        });

        it('usa o select de visão DRE quando values.visao não é "UE" — opção DRE habilitada', () => {
            const stateDREBranch = {
                ...STATE_WITH_ID,
                visao: 'DRE',
                unidades_vinculadas: [
                    { uuid: undefined, nome: '', tipo_unidade: '', pode_excluir: false },
                ],
            };
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: stateDREBranch })} />);
            const tipoSelect = container.querySelector('#tipo_unidade_0');
            // No branch DRE, disabled={!acessoCadastrarUnidade('DRE')} — mock retorna true → não disabled
            expect(tipoSelect.querySelector('option[value="DRE"]')).not.toBeDisabled();
        });

        it('select tipo_de_unidade onChange (branch DRE) chama handleChangeTipoUnidade', () => {
            const handleChangeTipoUnidade = jest.fn();
            const stateComUnidadeVazia = {
                ...STATE_WITH_ID,
                visao: 'DRE',
                unidades_vinculadas: [
                    { uuid: undefined, nome: '', tipo_unidade: '', pode_excluir: false },
                ],
            };
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: stateComUnidadeVazia,
                handleChangeTipoUnidade,
            })} />);
            fireEvent.change(container.querySelector('#tipo_unidade_0'), { target: { value: 'EMEF' } });
            expect(handleChangeTipoUnidade).toHaveBeenCalledWith('EMEF', expect.any(Object));
        });

        it('botão trash chama desvinculaUnidadeUsuario e remove a linha', async () => {
            const desvinculaUnidadeUsuario = jest.fn().mockResolvedValue({});
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: STATE_WITH_ID,
                desvinculaUnidadeUsuario,
            })} />);
            const trashBtn = container.querySelector('button.btn-link.fonte-14');
            await act(async () => {
                fireEvent.click(trashBtn);
            });
            expect(desvinculaUnidadeUsuario).toHaveBeenCalledWith(STATE_WITH_ID.unidades_vinculadas[0]);
            await waitFor(() => {
                expect(screen.queryByDisplayValue('EMEF Outra')).not.toBeInTheDocument();
            });
        });

        it('botão trash fica desabilitado quando pode_excluir é false e uuid existe', () => {
            const stateNaoPodeExcluir = {
                ...STATE_WITH_ID,
                unidades_vinculadas: [
                    { uuid: 'uuid-1', nome: 'EMEF Outra', tipo_unidade: 'EMEF', pode_excluir: false },
                ],
            };
            const { container } = render(<GestaoDePerfisFormFormik {...makeProps({ statePerfisForm: stateNaoPodeExcluir })} />);
            const trashBtn = container.querySelector('button.btn-link.fonte-14');
            expect(trashBtn).toBeDisabled();
        });
    });

    // ── Erros Yup na submissão ─────────────────────────────────────────────────
    describe('erros de validação Yup', () => {
        it('exibe erro de e_servidor obrigatório ao submeter formulário vazio', async () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            fireEvent.submit(screen.getByRole('button', { name: 'Salvar' }).closest('form'));
            await waitFor(() => {
                expect(screen.getByText('Tipo de usuário é obrigatório')).toBeInTheDocument();
            });
        });

        it('exibe erro de name obrigatório ao submeter formulário vazio', async () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            fireEvent.submit(screen.getByRole('button', { name: 'Salvar' }).closest('form'));
            await waitFor(() => {
                expect(screen.getByText('Nome de usuário é obrigatório')).toBeInTheDocument();
            });
        });

        it('exibe erro de grupos obrigatório ao submeter formulário vazio', async () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            fireEvent.submit(screen.getByRole('button', { name: 'Salvar' }).closest('form'));
            await waitFor(() => {
                expect(screen.getByText('Grupo de acesso é obrigatório')).toBeInTheDocument();
            });
        });

        it('exibe erro de visões obrigatório ao submeter formulário vazio', async () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            fireEvent.submit(screen.getByRole('button', { name: 'Salvar' }).closest('form'));
            await waitFor(() => {
                expect(screen.getByText('Visão é obrigatório')).toBeInTheDocument();
            });
        });

        it('chama handleSubmitPerfisForm ao submeter com dados válidos', async () => {
            const handleSubmitPerfisForm = jest.fn();
            const validState = {
                id: null,
                e_servidor: 'True',
                username: '123456',
                name: 'João da Silva',
                email: '',
                visoes: ['DRE'],
                groups: ['1'],
                unidades_vinculadas: [],
            };
            render(<GestaoDePerfisFormFormik {...makeProps({
                statePerfisForm: validState,
                handleSubmitPerfisForm,
            })} />);
            fireEvent.submit(screen.getByRole('button', { name: 'Salvar' }).closest('form'));
            await waitFor(() => {
                expect(handleSubmitPerfisForm).toHaveBeenCalledTimes(1);
            });
        });
    });

    // ── Modais ─────────────────────────────────────────────────────────────────
    describe('ModalUsuarioNaoCadastrado', () => {
        it('não exibe quando showModalUsuarioNaoCadastrado é false', () => {
            render(<GestaoDePerfisFormFormik {...makeProps()} />);
            expect(screen.queryByTestId('modal-nao-cadastrado-close')).not.toBeInTheDocument();
        });

        it('exibe quando showModalUsuarioNaoCadastrado é true', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ showModalUsuarioNaoCadastrado: true })} />);
            expect(screen.getByTestId('modal-nao-cadastrado-close')).toBeInTheDocument();
        });

        it('fechar chama handleCloseUsuarioNaoCadastrado', () => {
            const handleCloseUsuarioNaoCadastrado = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                showModalUsuarioNaoCadastrado: true,
                handleCloseUsuarioNaoCadastrado,
            })} />);
            fireEvent.click(screen.getByTestId('modal-nao-cadastrado-close'));
            expect(handleCloseUsuarioNaoCadastrado).toHaveBeenCalledTimes(1);
        });

        it('Cadastrar chama setBloquearCampoName(false) e setShowModalUsuarioNaoCadastrado(false)', () => {
            const setBloquearCampoName = jest.fn();
            const setShowModalUsuarioNaoCadastrado = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                showModalUsuarioNaoCadastrado: true,
                setBloquearCampoName,
                setShowModalUsuarioNaoCadastrado,
            })} />);
            fireEvent.click(screen.getByTestId('modal-nao-cadastrado-cadastrar'));
            expect(setBloquearCampoName).toHaveBeenCalledWith(false);
            expect(setShowModalUsuarioNaoCadastrado).toHaveBeenCalledWith(false);
        });
    });

    describe('ModalUsuarioCadastradoVinculado', () => {
        it('exibe quando showModalUsuarioCadastradoVinculado é true', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ showModalUsuarioCadastradoVinculado: true })} />);
            expect(screen.getByTestId('modal-vinculado-close')).toBeInTheDocument();
        });

        it('fechar chama setShowModalUsuarioCadastradoVinculado(false) e setStatePerfisForm(initPerfisForm)', () => {
            const setShowModalUsuarioCadastradoVinculado = jest.fn();
            const setStatePerfisForm = jest.fn();
            const initPerfisForm = DEFAULT_INIT;
            render(<GestaoDePerfisFormFormik {...makeProps({
                showModalUsuarioCadastradoVinculado: true,
                setShowModalUsuarioCadastradoVinculado,
                setStatePerfisForm,
                initPerfisForm,
            })} />);
            fireEvent.click(screen.getByTestId('modal-vinculado-close'));
            expect(setShowModalUsuarioCadastradoVinculado).toHaveBeenCalledWith(false);
            expect(setStatePerfisForm).toHaveBeenCalledWith(initPerfisForm);
        });
    });

    describe('ModalConfirmDeletePerfil', () => {
        it('exibe quando showModalDeletePerfil é true', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ showModalDeletePerfil: true })} />);
            expect(screen.getByTestId('modal-delete-close')).toBeInTheDocument();
        });

        it('fechar chama handleCloseDeletePerfil', () => {
            const handleCloseDeletePerfil = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                showModalDeletePerfil: true,
                handleCloseDeletePerfil,
            })} />);
            fireEvent.click(screen.getByTestId('modal-delete-close'));
            expect(handleCloseDeletePerfil).toHaveBeenCalledTimes(1);
        });

        it('confirmar chama onDeletePerfilTrue', () => {
            const onDeletePerfilTrue = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                showModalDeletePerfil: true,
                onDeletePerfilTrue,
            })} />);
            fireEvent.click(screen.getByTestId('modal-delete-confirm'));
            expect(onDeletePerfilTrue).toHaveBeenCalledTimes(1);
        });
    });

    describe('ModalInfo', () => {
        it('exibe quando showModalInfo é true', () => {
            render(<GestaoDePerfisFormFormik {...makeProps({ showModalInfo: true })} />);
            expect(screen.getByTestId('modal-info-close')).toBeInTheDocument();
        });

        it('fechar chama setShowModalInfo(false)', () => {
            const setShowModalInfo = jest.fn();
            render(<GestaoDePerfisFormFormik {...makeProps({
                showModalInfo: true,
                setShowModalInfo,
            })} />);
            fireEvent.click(screen.getByTestId('modal-info-close'));
            expect(setShowModalInfo).toHaveBeenCalledWith(false);
        });
    });
});

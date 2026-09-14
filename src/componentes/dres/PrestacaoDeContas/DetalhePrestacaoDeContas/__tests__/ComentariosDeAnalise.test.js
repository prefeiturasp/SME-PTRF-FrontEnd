import { render, screen, act, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ComentariosDeAnalise from '../ComentariosDeAnalise';
import {
    getComentariosDeAnalise,
    criarComentarioDeAnalise,
    editarComentarioDeAnalise,
    deleteComentarioDeAnalise,
    getReordenarComentarios,
    postNotificarComentarios,
} from '../../../../../services/dres/PrestacaoDeContas.service';

jest.mock('../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getComentariosDeAnalise: jest.fn(),
    criarComentarioDeAnalise: jest.fn(),
    editarComentarioDeAnalise: jest.fn(),
    deleteComentarioDeAnalise: jest.fn(),
    getReordenarComentarios: jest.fn(),
    postNotificarComentarios: jest.fn(),
}));

// dnd-kit: mantemos o essencial real (arrayMove) mas simplificamos DndContext/useSortable
// para não depender da mecânica real de drag (PointerEvent/eventos de mouse) no jsdom —
// capturamos apenas o onDragEnd para poder disparar a reordenação diretamente nos testes.
let mockCapturedOnDragEnd = null;
jest.mock('@dnd-kit/core', () => ({
    DndContext: (props) => {
        mockCapturedOnDragEnd = props.onDragEnd;
        return <div data-testid="mock-dnd-context">{props.children}</div>;
    },
    closestCenter: jest.fn(),
    MouseSensor: 'MouseSensor',
    KeyboardSensor: 'KeyboardSensor',
    useSensor: jest.fn(() => ({})),
    useSensors: jest.fn(() => []),
}));

jest.mock('@dnd-kit/sortable', () => ({
    // Reimplementado manualmente (em vez de jest.requireActual) porque o módulo real de
    // @dnd-kit/sortable acessa @dnd-kit/utilities no carregamento do módulo (CSS.Translate
    // etc.), o que quebra com o mock simplificado de @dnd-kit/utilities abaixo.
    arrayMove: (array, from, to) => {
        const result = array.slice();
        const [item] = result.splice(from, 1);
        result.splice(to, 0, item);
        return result;
    },
    verticalListSortingStrategy: 'vertical',
    SortableContext: (props) => <div data-testid="mock-sortable-context">{props.children}</div>,
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: () => {},
        transform: null,
        transition: null,
    }),
}));

jest.mock('@dnd-kit/utilities', () => ({
    CSS: { Transform: { toString: () => '' } },
}));

let mockCapturedModalEditar = null;
jest.mock('../../ModalEditarDeletarComentario', () => ({
    ModalEditarDeletarComentario: (props) => {
        mockCapturedModalEditar = props;
        return props.show ? (
            <div data-testid="mock-modal-editar">
                <input
                    data-testid="mock-modal-editar-input"
                    value={props.comentario.comentario || ''}
                    onChange={(e) => props.onChangeComentario(e.target.value, props.comentario)}
                />
                <button data-testid="mock-modal-editar-confirmar" onClick={props.onEditarComentario}>Confirmar</button>
                <button data-testid="mock-modal-editar-excluir" onClick={() => props.setShowModalDeleteComentario(true)}>Excluir</button>
                <button data-testid="mock-modal-editar-fechar" onClick={props.handleClose}>Fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedModalDelete = null;
jest.mock('../../ModalDeleteComentario', () => ({
    ModalDeleteComentario: (props) => {
        mockCapturedModalDelete = props;
        return props.show ? (
            <div data-testid="mock-modal-delete">
                <button data-testid="mock-modal-delete-confirmar" onClick={props.onDeleteComentarioTrue}>Confirmar exclusão</button>
                <button data-testid="mock-modal-delete-fechar" onClick={props.handleClose}>Fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedModalNotificar = null;
jest.mock('../../ModalNotificarComentarios', () => ({
    ModalNotificarComentarios: (props) => {
        mockCapturedModalNotificar = props;
        return props.show ? (
            <div data-testid="mock-modal-notificar">
                <button data-testid="mock-modal-notificar-confirmar" onClick={props.notificarComentarios}>Notificar</button>
                <button data-testid="mock-modal-notificar-fechar" onClick={props.handleClose}>Fechar</button>
            </div>
        ) : null;
    },
}));

jest.mock('../ComentariosDeAnaliseNotificados', () => (props) => (
    <div data-testid="mock-comentarios-notificados">{props.comentariosNotificados?.length ?? 0}</div>
));

const buildComentario = (overrides = {}) => ({
    uuid: 'com-1',
    comentario: 'Primeiro comentário',
    ordem: 1,
    ...overrides,
});

const respostaComentarios = (naoNotificados = [], notificados = []) => ({
    comentarios_nao_notificados: naoNotificados,
    comentarios_notificados: notificados,
});

const renderComponent = (props = {}) =>
    render(<ComentariosDeAnalise prestacaoDeContas={{ uuid: 'pc-1', associacao: { uuid: 'assoc-1' }, periodo_uuid: 'periodo-1' }} editavel {...props} />);

const waitForCarregado = () =>
    waitFor(() => {
        expect(getComentariosDeAnalise).toHaveBeenCalled();
    });

describe('ComentariosDeAnalise', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedOnDragEnd = null;
        mockCapturedModalEditar = null;
        mockCapturedModalDelete = null;
        mockCapturedModalNotificar = null;
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios());
        criarComentarioDeAnalise.mockResolvedValue({});
        editarComentarioDeAnalise.mockResolvedValue({});
        deleteComentarioDeAnalise.mockResolvedValue({});
        getReordenarComentarios.mockResolvedValue({});
        postNotificarComentarios.mockResolvedValue({ mensagem: 'ok' });
    });

    it('carrega os comentários pela prestação de contas quando ela está informada', async () => {
        renderComponent();
        await waitForCarregado();

        expect(getComentariosDeAnalise).toHaveBeenCalledWith('pc-1');
    });

    it('carrega os comentários por associação/período quando não há prestação de contas', async () => {
        renderComponent({ prestacaoDeContas: null, associacaoUuid: 'assoc-2', periodoUuid: 'periodo-2' });
        await waitForCarregado();

        expect(getComentariosDeAnalise).toHaveBeenCalledWith('', 'assoc-2', 'periodo-2');
    });

    it('exibe os comentários carregados e o total de notificados', async () => {
        getComentariosDeAnalise.mockResolvedValue(
            respostaComentarios([buildComentario()], [buildComentario({ uuid: 'com-notificado' })])
        );
        renderComponent();
        await waitForCarregado();

        expect(await screen.findByText('Primeiro comentário')).toBeInTheDocument();
        expect(screen.getByTestId('mock-comentarios-notificados')).toHaveTextContent('1');
    });

    it('adiciona um novo comentário: alterna para o input, digita e confirma', async () => {
        renderComponent();
        await waitForCarregado();

        fireEvent.click(screen.getByText('+ Adicionar novo comentário'));

        const input = await screen.findByPlaceholderText('Escreva o comentário aqui...');
        fireEvent.change(input, { target: { value: 'Novo comentário' } });
        expect(screen.getByText('Confirmar comentário')).not.toBeDisabled();

        // Esvaziar o campo desabilita o botão de confirmar novamente
        fireEvent.change(input, { target: { value: '' } });
        expect(screen.getByText('Confirmar comentário')).toBeDisabled();

        fireEvent.change(input, { target: { value: 'Novo comentário' } });
        await act(async () => {
            fireEvent.click(screen.getByText('Confirmar comentário'));
        });

        expect(criarComentarioDeAnalise).toHaveBeenCalledWith(
            expect.objectContaining({ prestacao_conta: 'pc-1', comentario: 'Novo comentário', ordem: 1 })
        );
        expect(getComentariosDeAnalise).toHaveBeenCalledTimes(2);
    });

    it('cria o comentário usando associação/período quando não há prestação de contas', async () => {
        renderComponent({ prestacaoDeContas: null, associacaoUuid: 'assoc-2', periodoUuid: 'periodo-2' });
        await waitForCarregado();

        fireEvent.click(screen.getByText('+ Adicionar novo comentário'));
        const input = await screen.findByPlaceholderText('Escreva o comentário aqui...');
        fireEvent.change(input, { target: { value: 'Comentário sem PC' } });

        await act(async () => {
            fireEvent.click(screen.getByText('Confirmar comentário'));
        });

        expect(criarComentarioDeAnalise).toHaveBeenCalledWith(
            expect.objectContaining({ associacao: 'assoc-2', periodo: 'periodo-2', comentario: 'Comentário sem PC' })
        );
    });

    it('cancela a adição de um novo comentário e volta a exibir o botão de adicionar', async () => {
        renderComponent();
        await waitForCarregado();

        fireEvent.click(screen.getByText('+ Adicionar novo comentário'));
        await screen.findByPlaceholderText('Escreva o comentário aqui...');

        fireEvent.click(screen.getByText('Cancelar'));

        expect(screen.getByText('+ Adicionar novo comentário')).toBeInTheDocument();
    });

    it('abre o modal de edição de um comentário existente e confirma a edição', async () => {
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        fireEvent.click(screen.getByText('Editar'));
        expect(screen.getByTestId('mock-modal-editar')).toBeInTheDocument();

        fireEvent.change(screen.getByTestId('mock-modal-editar-input'), { target: { value: 'Comentário editado' } });

        await act(async () => {
            fireEvent.click(screen.getByTestId('mock-modal-editar-confirmar'));
        });

        expect(editarComentarioDeAnalise).toHaveBeenCalledWith(
            'com-1',
            expect.objectContaining({ comentario: 'Comentário editado', prestacao_conta: 'pc-1' })
        );
        expect(getComentariosDeAnalise).toHaveBeenCalledTimes(2);
    });

    it('atualiza o comentário em edição usando associação/período quando não há prestação de contas', async () => {
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent({ prestacaoDeContas: null, associacaoUuid: 'assoc-2', periodoUuid: 'periodo-2' });
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        fireEvent.click(screen.getByText('Editar'));
        fireEvent.change(screen.getByTestId('mock-modal-editar-input'), { target: { value: 'Editado sem PC' } });

        expect(mockCapturedModalEditar.comentario).toEqual(
            expect.objectContaining({ associacao_uuid: 'assoc-2', periodo_uuid: 'periodo-2', comentario: 'Editado sem PC' })
        );
    });

    it('fecha o modal de edição', async () => {
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        fireEvent.click(screen.getByText('Editar'));
        fireEvent.click(screen.getByTestId('mock-modal-editar-fechar'));

        expect(screen.queryByTestId('mock-modal-editar')).not.toBeInTheDocument();
    });

    it('exclui um comentário a partir do modal de edição', async () => {
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        fireEvent.click(screen.getByText('Editar'));
        fireEvent.click(screen.getByTestId('mock-modal-editar-excluir'));
        expect(screen.getByTestId('mock-modal-delete')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByTestId('mock-modal-delete-confirmar'));
        });

        expect(deleteComentarioDeAnalise).toHaveBeenCalledWith('com-1');
        expect(getComentariosDeAnalise).toHaveBeenCalledTimes(2);
    });

    it('fecha o modal de exclusão sem excluir', async () => {
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        fireEvent.click(screen.getByText('Editar'));
        fireEvent.click(screen.getByTestId('mock-modal-editar-excluir'));
        fireEvent.click(screen.getByTestId('mock-modal-delete-fechar'));

        expect(screen.queryByTestId('mock-modal-delete')).not.toBeInTheDocument();
        expect(deleteComentarioDeAnalise).not.toHaveBeenCalled();
    });

    it('seleciona comentários via checkbox e notifica a associação', async () => {
        getComentariosDeAnalise.mockResolvedValue(
            respostaComentarios([buildComentario(), buildComentario({ uuid: 'com-2', comentario: 'Segundo comentário', ordem: 2 })])
        );
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        const botaoNotificar = screen.getByText('Notificar a Associação');
        expect(botaoNotificar).toBeDisabled();

        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        fireEvent.click(screen.getAllByRole('checkbox')[1]);
        // desmarca o primeiro para exercer o ramo de remoção da lista de selecionados
        fireEvent.click(screen.getAllByRole('checkbox')[0]);

        expect(screen.getByText('Notificar a Associação')).not.toBeDisabled();

        fireEvent.click(screen.getByText('Notificar a Associação'));
        expect(screen.getByTestId('mock-modal-notificar')).toBeInTheDocument();

        await act(async () => {
            fireEvent.click(screen.getByTestId('mock-modal-notificar-confirmar'));
        });

        expect(postNotificarComentarios).toHaveBeenCalledWith(
            expect.objectContaining({ associacao: 'assoc-1', periodo: 'periodo-1', comentarios: ['com-2'] })
        );
        expect(getComentariosDeAnalise).toHaveBeenCalledTimes(2);
    });

    it('notifica usando associação/período do prop quando não há prestação de contas', async () => {
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent({ prestacaoDeContas: null, associacaoUuid: 'assoc-2', periodoUuid: 'periodo-2' });
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        fireEvent.click(screen.getByText('Notificar a Associação'));

        await act(async () => {
            fireEvent.click(screen.getByTestId('mock-modal-notificar-confirmar'));
        });

        expect(postNotificarComentarios).toHaveBeenCalledWith(
            expect.objectContaining({ associacao: 'assoc-2', periodo: 'periodo-2' })
        );
    });

    it('trata erro ao notificar comentários', async () => {
        postNotificarComentarios.mockRejectedValue(new Error('falhou'));
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        fireEvent.click(screen.getByText('Notificar a Associação'));

        await act(async () => {
            fireEvent.click(screen.getByTestId('mock-modal-notificar-confirmar'));
        });

        expect(postNotificarComentarios).toHaveBeenCalled();
        expect(screen.queryByTestId('mock-modal-notificar')).not.toBeInTheDocument();
    });

    it('fecha o modal de notificação', async () => {
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        fireEvent.click(screen.getAllByRole('checkbox')[0]);
        fireEvent.click(screen.getByText('Notificar a Associação'));
        fireEvent.click(screen.getByTestId('mock-modal-notificar-fechar'));

        expect(screen.queryByTestId('mock-modal-notificar')).not.toBeInTheDocument();
    });

    it('desabilita os controles quando editavel é falso', async () => {
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent({ editavel: false });
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        expect(screen.getByText('+ Adicionar novo comentário')).toBeDisabled();
        expect(screen.getByText('Editar')).toBeDisabled();
        expect(screen.getByText('Notificar a Associação')).toBeDisabled();
        expect(screen.getAllByRole('checkbox')[0]).toBeDisabled();
    });

    it('reordena os comentários via drag and drop e persiste a nova ordem', async () => {
        getComentariosDeAnalise.mockResolvedValue(
            respostaComentarios([buildComentario(), buildComentario({ uuid: 'com-2', comentario: 'Segundo comentário', ordem: 2 })])
        );
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        await act(async () => {
            mockCapturedOnDragEnd({ active: { id: 'com-2' }, over: { id: 'com-1' } });
        });

        await waitFor(() => {
            expect(getReordenarComentarios).toHaveBeenCalledWith({
                comentarios_de_analise: [
                    { prestacao_conta: 'pc-1', ordem: 1, comentario: 'Segundo comentário', uuid: 'com-2' },
                    { prestacao_conta: 'pc-1', ordem: 2, comentario: 'Primeiro comentário', uuid: 'com-1' },
                ],
            });
        });
    });

    it('não reordena quando o item é solto na mesma posição', async () => {
        getComentariosDeAnalise.mockResolvedValue(respostaComentarios([buildComentario()]));
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        act(() => {
            mockCapturedOnDragEnd({ active: { id: 'com-1' }, over: { id: 'com-1' } });
        });

        expect(getReordenarComentarios).not.toHaveBeenCalled();
    });

    it('trata erro ao reordenar comentários', async () => {
        getReordenarComentarios.mockRejectedValue(new Error('falhou'));
        getComentariosDeAnalise.mockResolvedValue(
            respostaComentarios([buildComentario(), buildComentario({ uuid: 'com-2', comentario: 'Segundo comentário', ordem: 2 })])
        );
        renderComponent();
        await waitForCarregado();
        await screen.findByText('Primeiro comentário');

        await act(async () => {
            mockCapturedOnDragEnd({ active: { id: 'com-2' }, over: { id: 'com-1' } });
            await Promise.resolve();
        });

        expect(getReordenarComentarios).toHaveBeenCalled();
    });

    it('não renderiza a lista arrastável quando não há comentários', async () => {
        renderComponent();
        await waitForCarregado();

        await waitFor(() => {
            expect(screen.queryByTestId('mock-sortable-context')).not.toBeInTheDocument();
        });
    });
});

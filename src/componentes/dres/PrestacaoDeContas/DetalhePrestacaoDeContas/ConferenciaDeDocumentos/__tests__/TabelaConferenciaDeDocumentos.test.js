import { render, screen, act, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TabelaConferenciaDeDocumentos from '../TabelaConferenciaDeDocumentos';
import {
    postDocumentosParaConferenciaMarcarComoCorreto,
    postDocumentosParaConferenciaMarcarNaoConferido,
} from '../../../../../../services/dres/PrestacaoDeContas.service';
import { addDetalharAcertosDocumentos, limparDetalharAcertosDocumentos } from '../../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/DetalharAcertosDocumentos/actions';

jest.mock('../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    postDocumentosParaConferenciaMarcarComoCorreto: jest.fn(),
    postDocumentosParaConferenciaMarcarNaoConferido: jest.fn(),
}));

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
}));

jest.mock('../../../../../../store/reducers/componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/DetalharAcertosDocumentos/actions', () => ({
    addDetalharAcertosDocumentos: jest.fn((payload) => ({ type: 'ADD_DETALHAR_ACERTOS_DOCUMENTOS', payload })),
    limparDetalharAcertosDocumentos: jest.fn(() => ({ type: 'LIMPAR_DETALHAR_ACERTOS_DOCUMENTOS' })),
}));

jest.mock('../../../../../../hooks/dres/PrestacaoDeContas/ConferenciaDeLancamentos/useConferidoTemplate', () => () => (rowData) => `conferido-${rowData?.uuid_documento}`);

jest.mock('../../../../../../utils/Loading', () => () => <div data-testid="mock-loading">Carregando...</div>);

let mockCapturedDataTableProps = null;
jest.mock('primereact/datatable', () => ({
    DataTable: (props) => {
        mockCapturedDataTableProps = props;
        return <div data-testid="mock-datatable">{props.children}</div>;
    },
}));

let mockCapturedColumnProps = [];
jest.mock('primereact/column', () => ({
    Column: (props) => {
        mockCapturedColumnProps.push(props);
        return <div data-testid={`mock-column-${props.field || 'selecionar'}`} />;
    },
}));

let mockCapturedModalCheck = null;
jest.mock('../ModalCheckNaoPermitidoConfererenciaDeDocumentos', () => ({
    ModalCheckNaoPermitidoConfererenciaDeDocumentos: (props) => {
        mockCapturedModalCheck = props;
        return props.show ? (
            <div data-testid="mock-modal-check">
                {props.texto}
                <button data-testid="mock-modal-check-fechar" onClick={props.handleClose}>Fechar</button>
            </div>
        ) : null;
    },
}));

let mockCapturedModalLegenda = null;
jest.mock('../Modais/ModalLegendaConferenciaDocumentos', () => ({
    ModalLegendaConferenciaDocumentos: (props) => {
        mockCapturedModalLegenda = props;
        return props.show ? <div data-testid="mock-modal-legenda" /> : null;
    },
}));

const buildDocumento = (overrides = {}) => ({
    uuid_documento: 'doc-1',
    tipo_documento_prestacao_conta: { uuid: 'tipo-1', conta_associacao: 'conta-1', nome: 'Nota fiscal' },
    analise_documento: null,
    selecionado: false,
    ...overrides,
});

const baseProps = {
    carregaListaDeDocumentosParaConferencia: jest.fn(),
    setListaDeDocumentosParaConferencia: jest.fn(),
    listaDeDocumentosParaConferencia: [],
    rowsPerPage: 10,
    prestacaoDeContas: { uuid: 'pc-1', analise_atual: { uuid: 'analise-1' } },
    loadingDocumentosParaConferencia: false,
    editavel: true,
};

const renderComponent = (overrideProps = {}) =>
    render(<TabelaConferenciaDeDocumentos {...baseProps} {...overrideProps} />);

// Extrai o onChange do checkbox de linha diretamente do elemento JSX retornado por
// `body={selecionarTemplate}` e chama dentro de act() — evita renderizar em um root
// separado (ver [[coverage-prestacaodecontas-dres-detalhe]] / [[testing-patterns-general]]).
const marcarCheckboxDoDocumento = (documento, checked = true) => {
    const selecionarTemplate = mockCapturedColumnProps.filter((c) => !c.field && c.body).pop().body;
    const inputElement = selecionarTemplate(documento).props.children;
    act(() => {
        inputElement.props.onChange({ target: { checked } });
    });
};

const clicarItemMenuSelecionarHeader = (index) => {
    const header = mockCapturedColumnProps.filter((c) => !c.field && c.header).pop().header;
    const dropdownMenu = header.props.children.props.children[1];
    const item = dropdownMenu.props.children[index];
    act(() => {
        item.props.onClick({ preventDefault: () => {} });
    });
};

describe('TabelaConferenciaDeDocumentos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedDataTableProps = null;
        mockCapturedColumnProps = [];
        mockCapturedModalCheck = null;
        mockCapturedModalLegenda = null;
        postDocumentosParaConferenciaMarcarComoCorreto.mockResolvedValue({});
        postDocumentosParaConferenciaMarcarNaoConferido.mockResolvedValue({});
    });

    it('exibe o Loading quando loadingDocumentosParaConferencia é true', () => {
        renderComponent({ loadingDocumentosParaConferencia: true });

        expect(screen.getByTestId('mock-loading')).toBeInTheDocument();
        expect(screen.queryByTestId('mock-datatable')).not.toBeInTheDocument();
    });

    it('renderiza a tabela e a mensagem de quantidade quando não está carregando', () => {
        renderComponent({ listaDeDocumentosParaConferencia: [buildDocumento(), buildDocumento({ uuid_documento: 'doc-2' })] });

        expect(screen.getByTestId('mock-datatable')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
        expect(screen.getByText(/documentos$/)).toBeInTheDocument();
    });

    it('seleciona um documento ao marcar o checkbox e exibe a barra de seleção', () => {
        const setListaDeDocumentosParaConferencia = jest.fn();
        const documento = buildDocumento();
        renderComponent({ listaDeDocumentosParaConferencia: [documento], setListaDeDocumentosParaConferencia });

        marcarCheckboxDoDocumento(documento);

        expect(setListaDeDocumentosParaConferencia).toHaveBeenCalledWith([
            expect.objectContaining({ selecionado: true }),
        ]);
        expect(screen.getByText(/1 documento selecionado/)).toBeInTheDocument();
    });

    it('não altera a seleção quando editavel é falso', () => {
        const setListaDeDocumentosParaConferencia = jest.fn();
        const documento = buildDocumento();
        renderComponent({ listaDeDocumentosParaConferencia: [documento], setListaDeDocumentosParaConferencia, editavel: false });

        marcarCheckboxDoDocumento(documento);

        expect(setListaDeDocumentosParaConferencia).not.toHaveBeenCalled();
    });

    it('permite cancelar a seleção via botão Cancelar', () => {
        const setListaDeDocumentosParaConferencia = jest.fn();
        const documento = buildDocumento();
        renderComponent({ listaDeDocumentosParaConferencia: [documento], setListaDeDocumentosParaConferencia });

        marcarCheckboxDoDocumento(documento);
        fireEvent.click(screen.getByText('Cancelar'));

        expect(screen.getByText(/Exibindo/)).toBeInTheDocument();
    });

    it('seleciona todos corretos, com ajuste e não conferidos, e desmarca todos pelo menu do cabeçalho', () => {
        const documentoCorreto = buildDocumento({ analise_documento: { resultado: 'CORRETO' } });
        const documentoAjuste = buildDocumento({ uuid_documento: 'doc-ajuste', analise_documento: { resultado: 'AJUSTE' } });
        const documentoNaoConferido = buildDocumento({ uuid_documento: 'doc-nao-conferido' });
        renderComponent({ listaDeDocumentosParaConferencia: [documentoCorreto, documentoAjuste, documentoNaoConferido] });

        clicarItemMenuSelecionarHeader(2); // não conferidos
        expect(screen.getByText(/1 documento selecionado/)).toBeInTheDocument();

        clicarItemMenuSelecionarHeader(0); // corretos
        expect(screen.getByText(/1 documento selecionado/)).toBeInTheDocument();

        clicarItemMenuSelecionarHeader(1); // ajuste
        expect(screen.getByText(/1 documento selecionado/)).toBeInTheDocument();

        clicarItemMenuSelecionarHeader(3); // desmarcar todos
        expect(screen.getByText(/Exibindo/)).toBeInTheDocument();
    });

    it('marca os documentos selecionados como corretos e recarrega a lista', async () => {
        const carregaListaDeDocumentosParaConferencia = jest.fn();
        const documento = buildDocumento();
        renderComponent({ listaDeDocumentosParaConferencia: [documento], carregaListaDeDocumentosParaConferencia });

        marcarCheckboxDoDocumento(documento);

        await act(async () => {
            fireEvent.click(screen.getByText('Marcar como Correto'));
        });

        expect(postDocumentosParaConferenciaMarcarComoCorreto).toHaveBeenCalledWith(
            'pc-1',
            expect.objectContaining({
                analise_prestacao: 'analise-1',
                documentos_corretos: [{ tipo_documento: 'tipo-1', conta_associacao: 'conta-1' }],
            })
        );
        expect(carregaListaDeDocumentosParaConferencia).toHaveBeenCalled();
    });

    it('trata erro ao marcar como correto', async () => {
        postDocumentosParaConferenciaMarcarComoCorreto.mockRejectedValue(new Error('falhou'));
        const documento = buildDocumento();
        renderComponent({ listaDeDocumentosParaConferencia: [documento] });

        marcarCheckboxDoDocumento(documento);

        await act(async () => {
            fireEvent.click(screen.getByText('Marcar como Correto'));
        });

        expect(postDocumentosParaConferenciaMarcarComoCorreto).toHaveBeenCalled();
    });

    it('marca um documento já correto como não conferido e recarrega a lista', async () => {
        const carregaListaDeDocumentosParaConferencia = jest.fn();
        const documento = buildDocumento({ analise_documento: { resultado: 'CORRETO' } });
        renderComponent({ listaDeDocumentosParaConferencia: [documento], carregaListaDeDocumentosParaConferencia });

        marcarCheckboxDoDocumento(documento);

        await act(async () => {
            fireEvent.click(screen.getByText('Marcar como Não conferido'));
        });

        expect(postDocumentosParaConferenciaMarcarNaoConferido).toHaveBeenCalledWith(
            'pc-1',
            expect.objectContaining({ analise_prestacao: 'analise-1' })
        );
        expect(carregaListaDeDocumentosParaConferencia).toHaveBeenCalled();
    });

    it('trata erro ao marcar como não conferido', async () => {
        postDocumentosParaConferenciaMarcarNaoConferido.mockRejectedValue(new Error('falhou'));
        const documento = buildDocumento({ analise_documento: { resultado: 'CORRETO' } });
        renderComponent({ listaDeDocumentosParaConferencia: [documento] });

        marcarCheckboxDoDocumento(documento);

        await act(async () => {
            fireEvent.click(screen.getByText('Marcar como Não conferido'));
        });

        expect(postDocumentosParaConferenciaMarcarNaoConferido).toHaveBeenCalled();
    });

    it('bloqueia a seleção de um documento com status incompatível ao já selecionado', () => {
        const documentoCorreto = buildDocumento({ analise_documento: { resultado: 'CORRETO' } });
        const documentoAjuste = buildDocumento({ uuid_documento: 'doc-ajuste', analise_documento: { resultado: 'AJUSTE' } });
        renderComponent({ listaDeDocumentosParaConferencia: [documentoCorreto, documentoAjuste] });

        marcarCheckboxDoDocumento(documentoCorreto);
        marcarCheckboxDoDocumento(documentoAjuste);

        expect(screen.getByTestId('mock-modal-check')).toBeInTheDocument();
        expect(screen.getByText(/1 documento selecionado/)).toBeInTheDocument();
    });

    it('permite selecionar um segundo documento com status compatível ao já selecionado', () => {
        const documentoAjuste = buildDocumento({ analise_documento: { resultado: 'AJUSTE' } });
        const documentoNaoConferido = buildDocumento({ uuid_documento: 'doc-nao-conferido' });
        renderComponent({ listaDeDocumentosParaConferencia: [documentoAjuste, documentoNaoConferido] });

        marcarCheckboxDoDocumento(documentoAjuste);
        marcarCheckboxDoDocumento(documentoNaoConferido);

        expect(screen.queryByTestId('mock-modal-check')).not.toBeInTheDocument();
        expect(screen.getByText(/2 documentos selecionados/)).toBeInTheDocument();
    });

    it('permite desmarcar um documento já selecionado', () => {
        const documento = buildDocumento();
        renderComponent({ listaDeDocumentosParaConferencia: [documento] });

        marcarCheckboxDoDocumento(documento);
        expect(screen.getByText(/1 documento selecionado/)).toBeInTheDocument();

        marcarCheckboxDoDocumento(documento, false);
        expect(screen.getByText(/Exibindo/)).toBeInTheDocument();
    });

    it('fecha o modal de seleção não permitida', () => {
        const documentoCorreto = buildDocumento({ analise_documento: { resultado: 'CORRETO' } });
        const documentoAjuste = buildDocumento({ uuid_documento: 'doc-ajuste', analise_documento: { resultado: 'AJUSTE' } });
        renderComponent({ listaDeDocumentosParaConferencia: [documentoCorreto, documentoAjuste] });

        marcarCheckboxDoDocumento(documentoCorreto);
        marcarCheckboxDoDocumento(documentoAjuste);
        expect(screen.getByTestId('mock-modal-check')).toBeInTheDocument();

        act(() => {
            mockCapturedModalCheck.handleClose();
        });
        expect(screen.queryByTestId('mock-modal-check')).not.toBeInTheDocument();
    });

    it('abre e fecha o modal de legenda', () => {
        renderComponent({ listaDeDocumentosParaConferencia: [buildDocumento()] });

        fireEvent.click(screen.getByText('Legenda conferência'));
        expect(screen.getByTestId('mock-modal-legenda')).toBeInTheDocument();

        act(() => {
            mockCapturedModalLegenda.primeiroBotaoOnclick();
        });
        expect(screen.queryByTestId('mock-modal-legenda')).not.toBeInTheDocument();
    });

    it('redireciona ao clicar em editar (adicionar ajuste) quando editável', () => {
        const documento = buildDocumento();
        renderComponent({ listaDeDocumentosParaConferencia: [documento] });

        const acoesTemplate = mockCapturedColumnProps.find((c) => c.field === 'acoes').body;
        act(() => {
            acoesTemplate(documento).props.onClick();
        });

        expect(limparDetalharAcertosDocumentos).toHaveBeenCalled();
        expect(addDetalharAcertosDocumentos).toHaveBeenCalledWith(documento);
        expect(mockNavigate).toHaveBeenCalledWith('/dre-detalhe-prestacao-de-contas-detalhar-acertos-documentos/pc-1');
    });

    it('não redireciona ao clicar em editar quando não editável', () => {
        const documento = buildDocumento();
        renderComponent({ listaDeDocumentosParaConferencia: [documento], editavel: false });

        const acoesTemplate = mockCapturedColumnProps.find((c) => c.field === 'acoes').body;
        act(() => {
            acoesTemplate(documento).props.onClick();
        });

        expect(mockNavigate).not.toHaveBeenCalled();
        expect(limparDetalharAcertosDocumentos).not.toHaveBeenCalled();
    });

    it('marca a linha de um documento já conferido corretamente com a classe correspondente', () => {
        renderComponent({ listaDeDocumentosParaConferencia: [buildDocumento({ analise_documento: { resultado: 'CORRETO' } })] });

        const rowClassNameFn = mockCapturedDataTableProps.rowClassName;
        expect(rowClassNameFn({ analise_documento: { resultado: 'CORRETO' } })).toEqual({
            'linha-conferencia-de-lancamentos-correto': true,
        });
        expect(rowClassNameFn({})).toBeUndefined();
    });
});

import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Filtros } from '../index';

jest.mock('../../../../../../../services/escolas/Despesas.service', () => ({
    getTagInformacao: jest.fn(),
}));

jest.mock('../../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getTagsConferenciaLancamento: jest.fn(),
}));

const { getTagInformacao } = require('../../../../../../../services/escolas/Despesas.service');
const {
    getTagsConferenciaLancamento,
} = require('../../../../../../../services/dres/PrestacaoDeContas.service');

jest.mock('../FiltroRecolhido', () => ({
    FiltroRecolhido: ({
        stateFiltros,
        tabelasDespesa,
        handleChangeFiltros,
        setBtnMaisFiltros,
        handleSubmitFiltros,
    }) => (
        <div data-testid='filtro-recolhido'>
            <div>stateFiltros: {stateFiltros?.teste}</div>
            <div>tabelasDespesa: {tabelasDespesa?.length}</div>
            <button type='button' onClick={() => setBtnMaisFiltros(true)}>
                Expandir filtros
            </button>
            <button type='button' onClick={() => handleChangeFiltros('tap')}>
                Mudar filtro
            </button>
            <button
                type='button'
                onClick={() => handleSubmitFiltros({ target: { value: 'submetido' } })}
            >
                Enviar filtro
            </button>
            <input
                aria-label='filtro-recolhido-input'
                defaultValue='valor'
                onChange={() => handleChangeFiltros('digitado')}
            />
        </div>
    ),
}));

jest.mock('../FiltroExpandido', () => ({
    FiltroExpandido: (props) => (
        <div data-testid='filtro-expandido'>
            <div>stateFiltros: {props.stateFiltros?.teste}</div>
            <div>tabelasDespesa: {props.tabelasDespesa?.length}</div>
            <button type='button' onClick={() => props.setBtnMaisFiltros(false)}>
                Recolher filtros
            </button>
            <button type='button' onClick={() => props.handleClearDate('2024-05-06')}>
                Limpar data
            </button>
            <button type='button' onClick={() => props.handleChangeFiltroInformacoes('info')}>
                Mudar infos
            </button>
            <button
                type='button'
                onClick={() => props.handleChangeFiltroConferencia('conferencia')}
            >
                Mudar conferencia
            </button>
            <button type='button' onClick={() => props.handleChangeFiltros('changed')}>
                Mudar filtro
            </button>
            <button
                type='button'
                onClick={() => props.handleSubmitFiltros({ target: { value: 'submetido' } })}
            >
                Enviar filtro expandido
            </button>
            <div>
                informacao:{' '}
                {Array.isArray(props.listaTagInformacao)
                    ? props.listaTagInformacao.join(',')
                    : '[]'}
            </div>
            <div>
                conferencia:{' '}
                {Array.isArray(props.listaTagsConferencia)
                    ? props.listaTagsConferencia.join(',')
                    : '[]'}
            </div>
            <div>formatDate: {props.formatDate('2024-05-06').format('YYYY-MM-DD')}</div>
        </div>
    ),
}));

const renderFiltros = (overrideProps = {}) => {
    const defaultProps = {
        stateFiltros: { teste: 'inicial' },
        tabelasDespesa: [{ id: 1 }, { id: 2 }],
        handleClearDate: jest.fn(),
        handleChangeFiltros: jest.fn(),
        handleSubmitFiltros: jest.fn(),
        limpaFiltros: jest.fn(),
        handleChangeFiltroInformacoes: jest.fn(),
        handleChangeFiltroConferencia: jest.fn(),
        btnMaisFiltros: false,
        setBtnMaisFiltros: jest.fn(),
    };

    return render(<Filtros {...defaultProps} {...overrideProps} />);
};

describe('Filtros component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('deve renderizar o filtro recolhido por padrão e carregar as tags ao montar', async () => {
        getTagInformacao.mockResolvedValue(['tag1']);
        getTagsConferenciaLancamento.mockResolvedValue(['tagA']);

        renderFiltros();

        expect(await screen.findByTestId('filtro-recolhido')).toBeInTheDocument();
        expect(screen.queryByTestId('filtro-expandido')).not.toBeInTheDocument();

        await waitFor(() => {
            expect(getTagInformacao).toHaveBeenCalled();
            expect(getTagsConferenciaLancamento).toHaveBeenCalled();
        });

        expect(screen.getByText('stateFiltros: inicial')).toBeInTheDocument();
        expect(screen.getByText('tabelasDespesa: 2')).toBeInTheDocument();
    });

    it('deve permitir expandir os filtros ao clicar no botão', async () => {
        getTagInformacao.mockResolvedValue([]);
        getTagsConferenciaLancamento.mockResolvedValue([]);
        const setBtnMaisFiltros = jest.fn();

        renderFiltros({ btnMaisFiltros: false, setBtnMaisFiltros });

        const button = screen.getByRole('button', { name: /expandir filtros/i });
        fireEvent.click(button);

        expect(setBtnMaisFiltros).toHaveBeenCalledWith(true);
    });

    it('deve renderizar o filtro expandido quando habilitado e exibir os dados da API formatados', async () => {
        getTagInformacao.mockResolvedValue(['tag1', 'tag2']);
        getTagsConferenciaLancamento.mockResolvedValue(['conf1']);

        renderFiltros({ btnMaisFiltros: true });

        expect(await screen.findByTestId('filtro-expandido')).toBeInTheDocument();
        expect(screen.queryByTestId('filtro-recolhido')).not.toBeInTheDocument();

        await waitFor(() => {
            expect(getTagInformacao).toHaveBeenCalled();
            expect(getTagsConferenciaLancamento).toHaveBeenCalled();
        });

        expect(screen.getByText('informacao: tag1,tag2')).toBeInTheDocument();
        expect(screen.getByText('conferencia: conf1')).toBeInTheDocument();
        expect(screen.getByText('formatDate: 2024-05-06')).toBeInTheDocument();
    });

    it('deve propagar corretamente as interações do usuário no filtro expandido', async () => {
        getTagInformacao.mockResolvedValue(['tag1']);
        getTagsConferenciaLancamento.mockResolvedValue(['conf1']);

        const handleClearDate = jest.fn();
        const handleChangeFiltroInformacoes = jest.fn();
        const handleChangeFiltroConferencia = jest.fn();
        const handleSubmitFiltros = jest.fn();
        const handleChangeFiltros = jest.fn();
        const setBtnMaisFiltros = jest.fn();

        renderFiltros({
            btnMaisFiltros: true,
            handleClearDate,
            handleChangeFiltroInformacoes,
            handleChangeFiltroConferencia,
            handleSubmitFiltros,
            handleChangeFiltros,
            setBtnMaisFiltros,
        });

        expect(await screen.findByTestId('filtro-expandido')).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: /limpar data/i }));
        fireEvent.click(screen.getByRole('button', { name: /mudar infos/i }));
        fireEvent.click(screen.getByRole('button', { name: /mudar conferencia/i }));
        fireEvent.click(screen.getByRole('button', { name: /enviar filtro expandido/i }));
        fireEvent.click(screen.getByRole('button', { name: /recolher filtros/i }));
        fireEvent.click(screen.getByRole('button', { name: /mudar filtro/i }));

        expect(handleClearDate).toHaveBeenCalledWith('2024-05-06');
        expect(handleChangeFiltroInformacoes).toHaveBeenCalledWith('info');
        expect(handleChangeFiltroConferencia).toHaveBeenCalledWith('conferencia');
        expect(handleSubmitFiltros).toHaveBeenCalledWith({ target: { value: 'submetido' } });
        expect(setBtnMaisFiltros).toHaveBeenCalledWith(false);
        expect(handleChangeFiltros).toHaveBeenCalledWith('changed');
    });

    it('deve exibir erro no console quando a API de tags de informação falhar', async () => {
        const originalError = console.error;
        console.error = jest.fn();

        getTagInformacao.mockRejectedValue(new Error('falha'));
        getTagsConferenciaLancamento.mockResolvedValue(['conf1']);

        renderFiltros({ btnMaisFiltros: true });

        await waitFor(() => {
            expect(console.error).toHaveBeenCalledWith(
                expect.stringContaining('Erro ao carregar tag informação'),
                expect.any(Error),
            );
        });

        console.error = originalError;
    });
});

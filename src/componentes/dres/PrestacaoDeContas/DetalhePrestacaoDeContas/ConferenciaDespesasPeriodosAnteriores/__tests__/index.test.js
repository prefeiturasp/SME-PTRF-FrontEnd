import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import ConferenciaDespesasPeriodosAnteriores from '../index';
import { useGetContasComMovimentoDespesasPeriodosAnteriores } from '../hooks/useGetContasComMovimentoDespesasPeriodosAnteriores';
import { visoesService } from '../../../../../../services/visoes.service';
import { mantemEstadoAcompanhamentoDePc } from '../../../../../../services/mantemEstadoAcompanhamentoDePc.service';

jest.mock('../hooks/useGetContasComMovimentoDespesasPeriodosAnteriores', () => ({
    useGetContasComMovimentoDespesasPeriodosAnteriores: jest.fn(),
}));

jest.mock('../../../../../../services/visoes.service', () => ({
    visoesService: { getUsuarioLogin: jest.fn() },
}));

jest.mock('../../../../../../services/mantemEstadoAcompanhamentoDePc.service', () => ({
    mantemEstadoAcompanhamentoDePc: {
        getAcompanhamentoDePcUsuarioLogado: jest.fn(),
        limpaAcompanhamentoDePcUsuarioLogado: jest.fn(),
        setAcompanhamentoDePcPorUsuario: jest.fn(),
    },
}));

let mockCapturedTabelaProps = null;
jest.mock('../TabelaConferenciaDeLancamentos/index', () => (props) => {
    mockCapturedTabelaProps = props;
    return <div data-testid="tabela-conferencia" />;
});

describe('ConferenciaDespesasPeriodosAnteriores', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedTabelaProps = null;
        visoesService.getUsuarioLogin.mockReturnValue('usuario-teste');
        mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado.mockReturnValue(undefined);
    });

    it('não renderiza nada enquanto as contas estão carregando', () => {
        useGetContasComMovimentoDespesasPeriodosAnteriores.mockReturnValue({ data: [], isLoading: true });
        const { container } = render(<ConferenciaDespesasPeriodosAnteriores prestacaoDeContas={{ uuid: 'pc-1' }} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('não renderiza nada quando não há contas com movimento', () => {
        useGetContasComMovimentoDespesasPeriodosAnteriores.mockReturnValue({ data: [], isLoading: false });
        const { container } = render(<ConferenciaDespesasPeriodosAnteriores prestacaoDeContas={{ uuid: 'pc-1' }} />);
        expect(container).toBeEmptyDOMElement();
    });

    it('seleciona a primeira conta quando não há filtros salvos e renderiza as abas', () => {
        useGetContasComMovimentoDespesasPeriodosAnteriores.mockReturnValue({
            data: [
                { uuid: 'conta-1', tipo_conta: { nome: 'Cheque' } },
                { uuid: 'conta-2', tipo_conta: { nome: 'Aplicação' } },
            ],
            isLoading: false,
        });
        render(<ConferenciaDespesasPeriodosAnteriores prestacaoDeContas={{ uuid: 'pc-1' }} />);

        expect(screen.getByText('Conta Cheque')).toBeInTheDocument();
        expect(screen.getByText('Conta Aplicação')).toBeInTheDocument();
        expect(mockCapturedTabelaProps.contaUUID).toBe('conta-1');
    });

    it('usa a conta salva no acompanhamento do usuário quando existente e não limpa o estado da mesma prestação', () => {
        mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado.mockReturnValue({
            prestacao_de_conta_uuid: 'pc-1',
            conferencia_despesas_periodos_anteriores: { conta_uuid: 'conta-2', paginacao_atual: 3 },
        });
        useGetContasComMovimentoDespesasPeriodosAnteriores.mockReturnValue({
            data: [
                { uuid: 'conta-1', tipo_conta: { nome: 'Cheque' } },
                { uuid: 'conta-2', tipo_conta: { nome: 'Aplicação' } },
            ],
            isLoading: false,
        });
        render(<ConferenciaDespesasPeriodosAnteriores prestacaoDeContas={{ uuid: 'pc-1' }} />);

        expect(mockCapturedTabelaProps.contaUUID).toBe('conta-2');
        expect(mockCapturedTabelaProps.filters.paginacao_atual).toBe(3);
        expect(mantemEstadoAcompanhamentoDePc.limpaAcompanhamentoDePcUsuarioLogado).not.toHaveBeenCalled();
    });

    it('limpa o acompanhamento salvo quando pertence a outra prestação de contas', () => {
        mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado.mockReturnValue({
            prestacao_de_conta_uuid: 'pc-outra',
            conferencia_despesas_periodos_anteriores: { conta_uuid: 'conta-1' },
        });
        useGetContasComMovimentoDespesasPeriodosAnteriores.mockReturnValue({
            data: [{ uuid: 'conta-1', tipo_conta: { nome: 'Cheque' } }],
            isLoading: false,
        });
        render(<ConferenciaDespesasPeriodosAnteriores prestacaoDeContas={{ uuid: 'pc-1' }} />);

        expect(mantemEstadoAcompanhamentoDePc.limpaAcompanhamentoDePcUsuarioLogado).toHaveBeenCalledWith('usuario-teste');
    });

    it('ao clicar em uma aba, troca a conta selecionada e zera ordenação/paginação', () => {
        useGetContasComMovimentoDespesasPeriodosAnteriores.mockReturnValue({
            data: [
                { uuid: 'conta-1', tipo_conta: { nome: 'Cheque' } },
                { uuid: 'conta-2', tipo_conta: { nome: 'Aplicação' } },
            ],
            isLoading: false,
        });
        render(<ConferenciaDespesasPeriodosAnteriores prestacaoDeContas={{ uuid: 'pc-1' }} />);

        fireEvent.click(screen.getByText('Conta Aplicação'));

        expect(mockCapturedTabelaProps.contaUUID).toBe('conta-2');
        expect(mockCapturedTabelaProps.filters.ordenar_por_imposto).toBe(false);
        expect(mockCapturedTabelaProps.filters.paginacao_atual).toBe(0);
    });

    it('onChangeFilters mescla os novos filtros aos existentes e persiste no acompanhamento do usuário', () => {
        useGetContasComMovimentoDespesasPeriodosAnteriores.mockReturnValue({
            data: [{ uuid: 'conta-1', tipo_conta: { nome: 'Cheque' } }],
            isLoading: false,
        });
        const onCarregaLancamentosParaConferencia = jest.fn();
        render(
            <ConferenciaDespesasPeriodosAnteriores
                prestacaoDeContas={{ uuid: 'pc-1' }}
                onCarregaLancamentosParaConferencia={onCarregaLancamentosParaConferencia}
            />
        );
        mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePcPorUsuario.mockClear();
        onCarregaLancamentosParaConferencia.mockClear();

        act(() => {
            mockCapturedTabelaProps.onChangeFilters({ filtrar_por_nome_fornecedor: 'Fornecedor X' });
        });

        expect(mockCapturedTabelaProps.filters.conta_uuid).toBe('conta-1');
        expect(mockCapturedTabelaProps.filters.filtrar_por_nome_fornecedor).toBe('Fornecedor X');
        expect(mantemEstadoAcompanhamentoDePc.setAcompanhamentoDePcPorUsuario).toHaveBeenCalledWith(
            'usuario-teste',
            expect.objectContaining({ prestacao_de_conta_uuid: 'pc-1' })
        );
        expect(onCarregaLancamentosParaConferencia).toHaveBeenCalled();
    });
});

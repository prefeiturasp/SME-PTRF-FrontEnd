import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabsConferenciaDeLancamentos } from '../TabsConferenciaDeLancamentos';
import { mantemEstadoAcompanhamentoDePc } from '../../../../../../services/mantemEstadoAcompanhamentoDePc.service';

jest.mock('../../../../../../services/mantemEstadoAcompanhamentoDePc.service', () => ({
    mantemEstadoAcompanhamentoDePc: {
        getAcompanhamentoDePcUsuarioLogado: jest.fn(),
    },
}));

jest.mock('../TabelaConferenciaDeLancamentos', () => (props) => (
    <div data-testid="tabela-conferencia-de-lancamentos">{props.contaUuid}</div>
));

jest.mock('../../../../../../utils/Loading', () => () => <div data-testid="loading" />);

const filtrosPadrao = {
    filtrar_por_acao: null,
    filtrar_por_lancamento: null,
    filtrar_por_data_inicio: null,
    filtrar_por_data_fim: null,
    filtrar_por_nome_fornecedor: null,
    filtrar_por_numero_de_documento: null,
    filtrar_por_tipo_de_documento: null,
    filtrar_por_tipo_de_pagamento: null,
    filtrar_por_conferencia: null,
    filtrar_por_informacao: null,
    ordenamento_tabela_lancamentos: null,
};

describe('TabsConferenciaDeLancamentos', () => {
    beforeEach(() => {
        mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado.mockReturnValue({
            conferencia_de_lancamentos: filtrosPadrao,
        });
    });

    it('exibe o Loading quando loadingLancamentosParaConferencia é true', () => {
        render(
            <TabsConferenciaDeLancamentos
                contasAssociacao={[]}
                loadingLancamentosParaConferencia={true}
                setStateCheckBoxOrdenarPorImposto={jest.fn()}
            />
        );
        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(screen.queryByTestId('tabela-conferencia-de-lancamentos')).not.toBeInTheDocument();
    });

    it('renderiza uma aba por conta e a tabela de conferência quando não está carregando', () => {
        const contasAssociacao = [
            { uuid: 'conta-1', tipo_conta: { nome: 'Cheque' } },
            { uuid: 'conta-2', tipo_conta: { nome: 'Aplicação' } },
        ];
        render(
            <TabsConferenciaDeLancamentos
                contasAssociacao={contasAssociacao}
                loadingLancamentosParaConferencia={false}
                clickBtnEscolheConta="conta-1"
                contaUuid="conta-1"
                setStateCheckBoxOrdenarPorImposto={jest.fn()}
            />
        );
        expect(screen.getByText('Conta Cheque')).toHaveClass('btn-escolhe-acao-active');
        expect(screen.getByText('Conta Aplicação')).not.toHaveClass('btn-escolhe-acao-active');
        expect(screen.getByTestId('tabela-conferencia-de-lancamentos')).toHaveTextContent('conta-1');
    });

    it('ao clicar em uma aba, alterna a conta, zera a ordenação por imposto e carrega os lançamentos com os filtros salvos', () => {
        const toggleBtnEscolheConta = jest.fn();
        const setStateCheckBoxOrdenarPorImposto = jest.fn();
        const carregaLancamentosParaConferencia = jest.fn();
        const prestacaoDeContas = { uuid: 'pc-1' };
        const contasAssociacao = [{ uuid: 'conta-1', tipo_conta: { nome: 'Cheque' } }];

        render(
            <TabsConferenciaDeLancamentos
                contasAssociacao={contasAssociacao}
                loadingLancamentosParaConferencia={false}
                toggleBtnEscolheConta={toggleBtnEscolheConta}
                setStateCheckBoxOrdenarPorImposto={setStateCheckBoxOrdenarPorImposto}
                carregaLancamentosParaConferencia={carregaLancamentosParaConferencia}
                prestacaoDeContas={prestacaoDeContas}
            />
        );

        fireEvent.click(screen.getByText('Conta Cheque'));

        expect(toggleBtnEscolheConta).toHaveBeenCalledWith('conta-1');
        expect(setStateCheckBoxOrdenarPorImposto).toHaveBeenCalledWith(false);
        expect(carregaLancamentosParaConferencia).toHaveBeenCalledWith(
            prestacaoDeContas, 'conta-1', null, null, 0, false, null, null, null, null, null, null, null, null, null
        );
    });
});

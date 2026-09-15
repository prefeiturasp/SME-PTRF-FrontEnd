import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import ConferenciaDeLancamentos from '../index';
import {
    getLancamentosParaConferencia,
    getUltimaAnalisePc,
    getContasComMovimentoNaPc,
} from '../../../../../../services/dres/PrestacaoDeContas.service';
import { visoesService } from '../../../../../../services/visoes.service';
import { mantemEstadoAcompanhamentoDePc } from '../../../../../../services/mantemEstadoAcompanhamentoDePc.service';

jest.mock('../../../../../../services/dres/PrestacaoDeContas.service', () => ({
    getLancamentosParaConferencia: jest.fn(),
    getUltimaAnalisePc: jest.fn(),
    getContasComMovimentoNaPc: jest.fn(),
}));

jest.mock('../../../../../../services/visoes.service', () => ({
    visoesService: {
        getUsuarioLogin: jest.fn(),
    },
}));

jest.mock('../../../../../../services/mantemEstadoAcompanhamentoDePc.service', () => ({
    mantemEstadoAcompanhamentoDePc: {
        getAcompanhamentoDePcUsuarioLogado: jest.fn(),
        limpaAcompanhamentoDePcUsuarioLogado: jest.fn(),
        setAcompanhamentoDePcPorUsuario: jest.fn(),
    },
}));

let mockCapturedTabsProps = null;
jest.mock('../TabsConferenciaDeLancamentos', () => ({
    TabsConferenciaDeLancamentos: (props) => {
        mockCapturedTabsProps = props;
        return <div data-testid="tabs-conferencia-de-lancamentos" />;
    },
}));

const filtrosVazios = {
    filtrar_por_acao: null,
    filtrar_por_lancamento: null,
    paginacao_atual: 0,
    filtrar_por_data_inicio: null,
    filtrar_por_data_fim: null,
    filtrar_por_numero_de_documento: null,
    filtrar_por_nome_fornecedor: null,
    filtrar_por_tipo_de_documento: null,
    filtrar_por_tipo_de_pagamento: null,
    filtrar_por_conferencia: null,
    filtrar_por_informacao: null,
    ordenamento_tabela_lancamentos: null,
};

describe('ConferenciaDeLancamentos', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockCapturedTabsProps = null;
        mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado.mockReturnValue({
            prestacao_de_conta_uuid: 'pc-1',
            conferencia_de_lancamentos: { ...filtrosVazios },
        });
        visoesService.getUsuarioLogin.mockReturnValue('usuario-teste');
        getLancamentosParaConferencia.mockResolvedValue([]);
    });

    it('não busca contas nem exibe as abas quando a prestação de contas não tem associação', () => {
        render(<ConferenciaDeLancamentos prestacaoDeContas={{ uuid: 'pc-1' }} />);
        expect(getContasComMovimentoNaPc).not.toHaveBeenCalled();
        expect(screen.getByText('Não houve lançamentos realizados no período.')).toBeInTheDocument();
        expect(screen.queryByTestId('tabs-conferencia-de-lancamentos')).not.toBeInTheDocument();
    });

    it('limpa o acompanhamento salvo quando pertence a outra prestação de contas', () => {
        mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado.mockReturnValue({
            prestacao_de_conta_uuid: 'pc-outra',
            conferencia_de_lancamentos: { ...filtrosVazios },
        });
        render(<ConferenciaDeLancamentos prestacaoDeContas={{ uuid: 'pc-1' }} />);
        expect(mantemEstadoAcompanhamentoDePc.limpaAcompanhamentoDePcUsuarioLogado).toHaveBeenCalledWith('usuario-teste');
    });

    it('não limpa o acompanhamento quando pertence à mesma prestação de contas', () => {
        render(<ConferenciaDeLancamentos prestacaoDeContas={{ uuid: 'pc-1' }} />);
        expect(mantemEstadoAcompanhamentoDePc.limpaAcompanhamentoDePcUsuarioLogado).not.toHaveBeenCalled();
    });

    it('busca as contas da associação e seleciona a primeira conta quando não há conta salva', async () => {
        getContasComMovimentoNaPc.mockResolvedValue([
            { uuid: 'conta-1' }, { uuid: 'conta-2' },
        ]);
        const prestacaoDeContas = { uuid: 'pc-1', associacao: { uuid: 'assoc-1' }, analise_atual: { uuid: 'analise-1' } };
        render(<ConferenciaDeLancamentos prestacaoDeContas={prestacaoDeContas} />);

        expect(getContasComMovimentoNaPc).toHaveBeenCalledWith('pc-1');
        await waitFor(() => expect(screen.getByTestId('tabs-conferencia-de-lancamentos')).toBeInTheDocument());
        await waitFor(() => expect(mockCapturedTabsProps.contaUuid).toBe('conta-1'));
        expect(mockCapturedTabsProps.clickBtnEscolheConta).toBe('conta-1');
    });

    it('usa a conta salva no acompanhamento do usuário quando existente', async () => {
        mantemEstadoAcompanhamentoDePc.getAcompanhamentoDePcUsuarioLogado.mockReturnValue({
            prestacao_de_conta_uuid: 'pc-1',
            conferencia_de_lancamentos: { ...filtrosVazios, conta_uuid: 'conta-salva' },
        });
        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1' }]);
        const prestacaoDeContas = { uuid: 'pc-1', associacao: { uuid: 'assoc-1' }, analise_atual: { uuid: 'analise-1' } };
        render(<ConferenciaDeLancamentos prestacaoDeContas={prestacaoDeContas} />);

        await waitFor(() => expect(mockCapturedTabsProps.contaUuid).toBe('conta-salva'));
        expect(getLancamentosParaConferencia).toHaveBeenCalledWith(
            'pc-1', 'analise-1', 'conta-salva', null, null, false, null, null, null, null, null, null, null, null
        );
    });

    it('busca lançamentos pela análise atual quando editavel e retorna a lista com selecionado=false', async () => {
        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1' }]);
        getLancamentosParaConferencia.mockResolvedValue([{ uuid: 'lanc-1' }, { uuid: 'lanc-2' }]);
        const prestacaoDeContas = { uuid: 'pc-1', associacao: { uuid: 'assoc-1' }, analise_atual: { uuid: 'analise-1' } };
        render(<ConferenciaDeLancamentos prestacaoDeContas={prestacaoDeContas} editavel={true} />);

        await waitFor(() => expect(mockCapturedTabsProps.lancamentosParaConferencia).toEqual([
            { uuid: 'lanc-1', selecionado: false }, { uuid: 'lanc-2', selecionado: false },
        ]));
        expect(getUltimaAnalisePc).not.toHaveBeenCalled();
    });

    it('quando não editavel, busca a última análise antes de buscar os lançamentos', async () => {
        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1' }]);
        getUltimaAnalisePc.mockResolvedValue({ uuid: 'ultima-analise' });
        getLancamentosParaConferencia.mockResolvedValue([{ uuid: 'lanc-1' }]);
        const prestacaoDeContas = { uuid: 'pc-1', associacao: { uuid: 'assoc-1' } };
        render(<ConferenciaDeLancamentos prestacaoDeContas={prestacaoDeContas} editavel={false} />);

        await waitFor(() => expect(getUltimaAnalisePc).toHaveBeenCalledWith('pc-1'));
        // preCarregaLancamentosEToggle, ao usar a primeira conta, chama carregaLancamentosParaConferencia só com (pc, conta_uuid) — o restante cai nos valores-padrão
        await waitFor(() => expect(getLancamentosParaConferencia).toHaveBeenCalledWith(
            'pc-1', 'ultima-analise', 'conta-1', null, null, null, null, null, null, null, null, null, [], []
        ));
    });

    it('quando não editavel e a última análise não existe, não busca lançamentos', async () => {
        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1' }]);
        getUltimaAnalisePc.mockResolvedValue(null);
        const prestacaoDeContas = { uuid: 'pc-1', associacao: { uuid: 'assoc-1' } };
        render(<ConferenciaDeLancamentos prestacaoDeContas={prestacaoDeContas} editavel={false} />);

        await waitFor(() => expect(getUltimaAnalisePc).toHaveBeenCalled());
        await waitFor(() => expect(mockCapturedTabsProps.lancamentosParaConferencia).toEqual([]));
        expect(getLancamentosParaConferencia).not.toHaveBeenCalled();
    });

    it('define lista vazia quando a busca de lançamentos não retorna itens', async () => {
        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1' }]);
        getLancamentosParaConferencia.mockResolvedValue([]);
        const prestacaoDeContas = { uuid: 'pc-1', associacao: { uuid: 'assoc-1' }, analise_atual: { uuid: 'analise-1' } };
        render(<ConferenciaDeLancamentos prestacaoDeContas={prestacaoDeContas} />);

        await waitFor(() => expect(mockCapturedTabsProps.lancamentosParaConferencia).toEqual([]));
    });

    it('chama onCarregaLancamentosParaConferencia quando fornecido', async () => {
        const onCarregaLancamentosParaConferencia = jest.fn();
        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1' }]);
        const prestacaoDeContas = { uuid: 'pc-1', associacao: { uuid: 'assoc-1' }, analise_atual: { uuid: 'analise-1' } };
        render(
            <ConferenciaDeLancamentos
                prestacaoDeContas={prestacaoDeContas}
                onCarregaLancamentosParaConferencia={onCarregaLancamentosParaConferencia}
            />
        );

        await waitFor(() => expect(onCarregaLancamentosParaConferencia).toHaveBeenCalled());
    });

    it('handleChangeCheckBoxOrdenarPorImposto atualiza o estado e recarrega os lançamentos ordenados por imposto', async () => {
        getContasComMovimentoNaPc.mockResolvedValue([{ uuid: 'conta-1' }]);
        const prestacaoDeContas = { uuid: 'pc-1', associacao: { uuid: 'assoc-1' }, analise_atual: { uuid: 'analise-1' } };
        render(<ConferenciaDeLancamentos prestacaoDeContas={prestacaoDeContas} />);

        await waitFor(() => expect(mockCapturedTabsProps.contaUuid).toBe('conta-1'));
        getLancamentosParaConferencia.mockClear();

        await act(async () => {
            mockCapturedTabsProps.handleChangeCheckBoxOrdenarPorImposto(true);
        });

        expect(mockCapturedTabsProps.stateCheckBoxOrdenarPorImposto).toBe(true);
        // filtrar_por_informacoes e filtrar_por_conferencia caem nos valores-padrão ([]) pois não são passados explicitamente aqui
        expect(getLancamentosParaConferencia).toHaveBeenCalledWith(
            'pc-1', 'analise-1', 'conta-1', null, null, true, null, null, null, null, null, null, [], []
        );
    });
});

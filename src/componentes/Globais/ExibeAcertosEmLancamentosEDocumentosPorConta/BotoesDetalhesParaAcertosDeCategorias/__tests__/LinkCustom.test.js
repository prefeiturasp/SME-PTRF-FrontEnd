import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LinkCustom from '../LinkCustom';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock('../../../../../services/visoes.service', () => ({
    visoesService: {
        getItemUsuarioLogado: jest.fn(() => 'UE'),
        getPermissoes: jest.fn(() => true),
    },
}));

jest.mock('../../RetornaSeTemPermissaoEdicaoAjustesLancamentos', () => ({
    RetornaSeTemPermissaoEdicaoAjustesLancamentos: jest.fn(() => true),
}));

import { RetornaSeTemPermissaoEdicaoAjustesLancamentos } from '../../RetornaSeTemPermissaoEdicaoAjustesLancamentos';
import { visoesService } from '../../../../../services/visoes.service';

const analise_lancamento = {
    analise_lancamento: 'uuid-analise-123',
    despesa: 'uuid-despesa-456',
    receita: 'uuid-receita-789',
};

const prestacaoDeContas = {
    status: 'DEVOLVIDA',
    periodo_uuid: 'uuid-periodo-001',
    associacao: { uuid: 'uuid-assoc-002' },
};

const defaultProps = {
    url: '/edicao-de-despesa/uuid-despesa-456',
    analise_lancamento,
    prestacaoDeContasUuid: 'uuid-pc-003',
    prestacaoDeContas,
    classeCssBotao: 'btn btn-outline-success mr-2',
    children: 'Ajustar despesa',
    operacao: 'requer_atualizacao_lancamento_gasto',
    tipo_transacao: 'Gasto',
    analisePermiteEdicao: true,
};

describe('LinkCustom', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);
        visoesService.getItemUsuarioLogado.mockReturnValue('UE');
        delete window.location;
        window.location = { pathname: '/pc/detalhe' };
    });

    it('renderiza o botão com o children correto', () => {
        render(<LinkCustom {...defaultProps} />);
        expect(screen.getByRole('button', { name: 'Ajustar despesa' })).toBeInTheDocument();
    });

    it('aplica a classe CSS correta ao botão', () => {
        render(<LinkCustom {...defaultProps} />);
        expect(screen.getByRole('button')).toHaveClass('btn', 'btn-outline-success', 'mr-2');
    });

    it('ao clicar chama navigate com a url correta', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate).toHaveBeenCalledWith(
            '/edicao-de-despesa/uuid-despesa-456',
            expect.objectContaining({ state: expect.any(Object) })
        );
    });

    it('ao clicar passa analise_lancamento no state', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.analise_lancamento).toEqual(analise_lancamento);
    });

    it('ao clicar passa uuid_analise_lancamento no state', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.uuid_analise_lancamento).toBe('uuid-analise-123');
    });

    it('ao clicar passa uuid_pc no state', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.uuid_pc).toBe('uuid-pc-003');
    });

    it('ao clicar passa uuid_despesa no state', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.uuid_despesa).toBe('uuid-despesa-456');
    });

    it('ao clicar passa uuid_receita no state', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.uuid_receita).toBe('uuid-receita-789');
    });

    it('ao clicar passa uuid_associacao no state', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.uuid_associacao).toBe('uuid-assoc-002');
    });

    it('ao clicar passa operacao no state', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.operacao).toBe('requer_atualizacao_lancamento_gasto');
    });

    it('ao clicar passa tipo_transacao no state', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.tipo_transacao).toBe('Gasto');
    });

    it('ao clicar passa periodo_uuid no state', () => {
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.periodo_uuid).toBe('uuid-periodo-001');
    });

    it('ao clicar passa tem_permissao_de_edicao usando RetornaSeTemPermissaoEdicaoAjustesLancamentos', () => {
        RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.tem_permissao_de_edicao).toBe(true);
    });

    it('ao clicar passa origem_visao usando visoesService.getItemUsuarioLogado', () => {
        visoesService.getItemUsuarioLogado.mockReturnValue('DRE');
        render(<LinkCustom {...defaultProps} />);
        fireEvent.click(screen.getByRole('button'));
        expect(mockNavigate.mock.calls[0][1].state.origem_visao).toBe('DRE');
    });

    describe('getCurrentPathWithoutLastPart', () => {
        it('retorna o pathname completo quando há apenas um "/"', () => {
            window.location = { pathname: '/pc' };
            render(<LinkCustom {...defaultProps} />);
            fireEvent.click(screen.getByRole('button'));
            expect(mockNavigate.mock.calls[0][1].state.origem).toBe('/pc');
        });

        it('retorna o pathname sem a última parte quando há mais de um "/"', () => {
            window.location = { pathname: '/pc/detalhe/ajuste' };
            render(<LinkCustom {...defaultProps} />);
            fireEvent.click(screen.getByRole('button'));
            expect(mockNavigate.mock.calls[0][1].state.origem).toBe('/pc/detalhe');
        });

        it('retorna o pathname sem a última parte para dois níveis', () => {
            window.location = { pathname: '/pc/detalhe' };
            render(<LinkCustom {...defaultProps} />);
            fireEvent.click(screen.getByRole('button'));
            expect(mockNavigate.mock.calls[0][1].state.origem).toBe('/pc');
        });
    });
});

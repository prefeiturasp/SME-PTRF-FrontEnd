import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BotaoAcertosLancamentosConciliacaoGasto from '../BotaoAcertosLancamentosConciliacaoGasto';

jest.mock('../../RetornaSeTemPermissaoEdicaoAjustesLancamentos', () => ({
    RetornaSeTemPermissaoEdicaoAjustesLancamentos: jest.fn(() => true),
}));

jest.mock('../botoesAcertosLancamentosService.service', () => ({
    botoesAcertosLancamentosService: {
        marcarGastoComoConciliado: jest.fn(),
        marcarGastoComoDesconciliado: jest.fn(),
    },
}));

jest.mock('../../../UI/Icon', () => ({
    Icon: ({ icon }) => <span data-testid={`icon-${icon}`} />,
}));

import { RetornaSeTemPermissaoEdicaoAjustesLancamentos } from '../../RetornaSeTemPermissaoEdicaoAjustesLancamentos';
import { botoesAcertosLancamentosService as BtnService } from '../botoesAcertosLancamentosService.service';

const analise_lancamento = {
    analise_lancamento: 'uuid-analise',
    conciliacao_atualizada: false,
};

const prestacaoDeContas = { status: 'DEVOLVIDA', periodo_uuid: 'uuid-periodo' };
const conta = { uuid: 'uuid-conta' };
const carregaAcertosLancamentos = jest.fn();

const defaultProps = {
    analise_lancamento,
    prestacaoDeContas,
    analisePermiteEdicao: true,
    carregaAcertosLancamentos,
    conta,
};

describe('BotaoAcertosLancamentosConciliacaoGasto', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);
    });

    describe('conciliação não atualizada (conciliacao_atualizada=false)', () => {
        it('exibe "Clique para conciliar" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} />);
            expect(screen.getByText('Clique para conciliar')).toBeInTheDocument();
        });

        it('não exibe texto de conciliação quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} />);
            expect(screen.queryByText('Clique para conciliar')).not.toBeInTheDocument();
        });

        it('clique em "Clique para conciliar" chama marcarGastoComoConciliado com os argumentos corretos', () => {
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} />);
            fireEvent.click(screen.getByText('Clique para conciliar'));
            expect(BtnService.marcarGastoComoConciliado).toHaveBeenCalledWith(
                analise_lancamento, prestacaoDeContas, carregaAcertosLancamentos, conta
            );
        });

        it('o botão tem a classe correta', () => {
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} />);
            const btn = screen.getByRole('button');
            expect(btn).toHaveClass('btn', 'btn-link', 'clique-aqui-atualizada', 'font-weight-bold');
        });
    });

    describe('conciliação atualizada (conciliacao_atualizada=true)', () => {
        const analise_atualizada = { ...analise_lancamento, conciliacao_atualizada: true };

        it('exibe "Gasto atualizado." quando tem permissão', () => {
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Gasto atualizado\./)).toBeInTheDocument();
        });

        it('exibe "Clique para desconciliar" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText('Clique para desconciliar')).toBeInTheDocument();
        });

        it('exibe ícone de check quando tem permissão', () => {
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByTestId('icon-faCheckCircle')).toBeInTheDocument();
        });

        it('clique em "Clique para desconciliar" chama marcarGastoComoDesconciliado', () => {
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            fireEvent.click(screen.getByRole('button'));
            expect(BtnService.marcarGastoComoDesconciliado).toHaveBeenCalledWith(
                analise_atualizada, carregaAcertosLancamentos, conta
            );
        });

        it('exibe "Gasto atualizado." como span quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Gasto atualizado\./)).toBeInTheDocument();
            expect(screen.queryByRole('button')).not.toBeInTheDocument();
        });

        it('exibe ícone de check quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosConciliacaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByTestId('icon-faCheckCircle')).toBeInTheDocument();
        });
    });
});

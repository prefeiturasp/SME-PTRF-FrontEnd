import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BotaoAcertosLancamentosDevolucaoAoTesouro from '../BotaoAcertosLancamentosDevolucaoAoTesouro';

let capturedLinkCustomProps = {};

jest.mock('../LinkCustom', () => ({
    __esModule: true,
    default: (props) => {
        capturedLinkCustomProps = props;
        return <button data-testid="link-custom" className={props.classeCssBotao}>{props.children}</button>;
    },
}));

jest.mock('@fortawesome/react-fontawesome', () => ({
    FontAwesomeIcon: () => <span data-testid="fa-icon" />,
}));

jest.mock('@fortawesome/free-solid-svg-icons', () => ({
    faCheckCircle: 'faCheckCircle',
}));

jest.mock('../../RetornaSeTemPermissaoEdicaoAjustesLancamentos', () => ({
    RetornaSeTemPermissaoEdicaoAjustesLancamentos: jest.fn(() => true),
}));

import { RetornaSeTemPermissaoEdicaoAjustesLancamentos } from '../../RetornaSeTemPermissaoEdicaoAjustesLancamentos';

const analise_lancamento = {
    analise_lancamento: 'uuid-analise',
    despesa: 'uuid-despesa-001',
    devolucao_tesouro_atualizada: false,
};

const defaultProps = {
    analise_lancamento,
    prestacaoDeContasUuid: 'uuid-pc',
    prestacaoDeContas: { status: 'DEVOLVIDA' },
    tipo_transacao: 'Gasto',
    analisePermiteEdicao: true,
};

describe('BotaoAcertosLancamentosDevolucaoAoTesouro', () => {
    beforeEach(() => {
        capturedLinkCustomProps = {};
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);
    });

    describe('devolução não atualizada (devolucao_tesouro_atualizada=false)', () => {
        it('exibe "Informar dev. tesouro" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} />);
            expect(screen.getByText('Informar dev. tesouro')).toBeInTheDocument();
        });

        it('exibe "Ver dev. tesouro" quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} />);
            expect(screen.getByText('Ver dev. tesouro')).toBeInTheDocument();
        });

        it('aplica classe btn-outline-success ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} />);
            expect(screen.getByTestId('link-custom')).toHaveClass('btn-outline-success', 'mr-2');
        });

        it('passa a URL correta ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} />);
            expect(capturedLinkCustomProps.url).toBe('/devolucao-ao-tesouro-ajuste/');
        });

        it('passa operacao=requer_atualizacao_devolucao_ao_tesouro ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} />);
            expect(capturedLinkCustomProps.operacao).toBe('requer_atualizacao_devolucao_ao_tesouro');
        });

        it('passa analise_lancamento ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} />);
            expect(capturedLinkCustomProps.analise_lancamento).toEqual(analise_lancamento);
        });
    });

    describe('devolução atualizada (devolucao_tesouro_atualizada=true)', () => {
        const analise_atualizada = { ...analise_lancamento, devolucao_tesouro_atualizada: true };

        it('exibe "Dev.Tesouro atualizada." quando atualizado', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Dev\.Tesouro atualizada\./)).toBeInTheDocument();
        });

        it('exibe "Clique para editar" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Clique para editar/)).toBeInTheDocument();
        });

        it('exibe "Clique para ver" quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Clique para ver/)).toBeInTheDocument();
        });

        it('aplica classe link-green ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByTestId('link-custom')).toHaveClass('link-green', 'text-center');
        });

        it('renderiza o ícone de check', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
        });

        it('passa a URL correta ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosDevolucaoAoTesouro {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(capturedLinkCustomProps.url).toBe('/devolucao-ao-tesouro-ajuste/');
        });
    });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BotaoAcertosLancamentosEdicaoCredito from '../BotaoAcertosLancamentosEdicaoCredito';

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
    receita: 'uuid-receita-001',
    lancamento_atualizado: false,
};

const defaultProps = {
    analise_lancamento,
    prestacaoDeContasUuid: 'uuid-pc',
    prestacaoDeContas: { status: 'DEVOLVIDA' },
    tipo_transacao: 'Crédito',
    analisePermiteEdicao: true,
};

describe('BotaoAcertosLancamentosEdicaoCredito', () => {
    beforeEach(() => {
        capturedLinkCustomProps = {};
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);
    });

    describe('lancamento não atualizado (lancamento_atualizado=false)', () => {
        it('exibe "Ajustar crédito" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} />);
            expect(screen.getByText('Ajustar crédito')).toBeInTheDocument();
        });

        it('exibe "Ver crédito" quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} />);
            expect(screen.getByText('Ver crédito')).toBeInTheDocument();
        });

        it('aplica classe btn-outline-success ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} />);
            expect(screen.getByTestId('link-custom')).toHaveClass('btn-outline-success', 'mr-2');
        });

        it('passa a URL correta ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} />);
            expect(capturedLinkCustomProps.url).toBe('/edicao-de-receita/uuid-receita-001/');
        });

        it('passa operacao=requer_atualizacao_lancamento_credito ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} />);
            expect(capturedLinkCustomProps.operacao).toBe('requer_atualizacao_lancamento_credito');
        });

        it('passa analise_lancamento ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} />);
            expect(capturedLinkCustomProps.analise_lancamento).toEqual(analise_lancamento);
        });
    });

    describe('lancamento atualizado (lancamento_atualizado=true)', () => {
        const analise_atualizada = { ...analise_lancamento, lancamento_atualizado: true };

        it('exibe "Crédito atualizado." quando atualizado', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Crédito atualizado\./)).toBeInTheDocument();
        });

        it('exibe "Clique para editar" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Clique para editar/)).toBeInTheDocument();
        });

        it('exibe "Clique para ver" quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Clique para ver/)).toBeInTheDocument();
        });

        it('aplica classe link-green ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByTestId('link-custom')).toHaveClass('link-green', 'text-center');
        });

        it('renderiza o ícone de check', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
        });

        it('passa a URL correta ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoCredito {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(capturedLinkCustomProps.url).toBe('/edicao-de-receita/uuid-receita-001/');
        });
    });
});

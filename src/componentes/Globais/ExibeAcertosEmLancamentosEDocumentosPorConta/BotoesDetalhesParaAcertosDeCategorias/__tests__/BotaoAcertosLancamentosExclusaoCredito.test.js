import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BotaoAcertosLancamentosExclusaoCredito from '../BotaoAcertosLancamentosExclusaoCredito';

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
    lancamento_excluido: false,
};

const defaultProps = {
    analise_lancamento,
    prestacaoDeContasUuid: 'uuid-pc',
    prestacaoDeContas: { status: 'DEVOLVIDA' },
    tipo_transacao: 'Crédito',
    analisePermiteEdicao: true,
};

describe('BotaoAcertosLancamentosExclusaoCredito', () => {
    beforeEach(() => {
        capturedLinkCustomProps = {};
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);
    });

    describe('lancamento não excluído (lancamento_excluido=false)', () => {
        it('exibe "Excluir crédito" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosExclusaoCredito {...defaultProps} />);
            expect(screen.getByText('Excluir crédito')).toBeInTheDocument();
        });

        it('exibe "Ver crédito a excluir" quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosExclusaoCredito {...defaultProps} />);
            expect(screen.getByText('Ver crédito a excluir')).toBeInTheDocument();
        });

        it('aplica classe btn-outline-success ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosExclusaoCredito {...defaultProps} />);
            expect(screen.getByTestId('link-custom')).toHaveClass('btn-outline-success', 'mr-2');
        });

        it('passa a URL correta ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosExclusaoCredito {...defaultProps} />);
            expect(capturedLinkCustomProps.url).toBe('/edicao-de-receita/uuid-receita-001/');
        });

        it('passa operacao=requer_exclusao_lancamento_credito ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosExclusaoCredito {...defaultProps} />);
            expect(capturedLinkCustomProps.operacao).toBe('requer_exclusao_lancamento_credito');
        });

        it('não renderiza mensagem de excluído', () => {
            render(<BotaoAcertosLancamentosExclusaoCredito {...defaultProps} />);
            expect(screen.queryByText(/Crédito excluído/)).not.toBeInTheDocument();
        });
    });

    describe('lancamento excluído (lancamento_excluido=true)', () => {
        const analise_excluida = { ...analise_lancamento, lancamento_excluido: true };

        it('exibe "Crédito excluído." quando excluído', () => {
            render(<BotaoAcertosLancamentosExclusaoCredito {...defaultProps} analise_lancamento={analise_excluida} />);
            expect(screen.getByText(/Crédito excluído\./)).toBeInTheDocument();
        });

        it('renderiza o ícone de check', () => {
            render(<BotaoAcertosLancamentosExclusaoCredito {...defaultProps} analise_lancamento={analise_excluida} />);
            expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
        });

        it('não renderiza LinkCustom', () => {
            render(<BotaoAcertosLancamentosExclusaoCredito {...defaultProps} analise_lancamento={analise_excluida} />);
            expect(screen.queryByTestId('link-custom')).not.toBeInTheDocument();
        });
    });
});

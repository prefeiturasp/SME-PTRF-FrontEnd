import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BotaoAcertosLancamentosExclusaoGasto from '../BotaoAcertosLancamentosExclusaoGasto';

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
    lancamento_excluido: false,
};

const defaultProps = {
    analise_lancamento,
    prestacaoDeContasUuid: 'uuid-pc',
    prestacaoDeContas: { status: 'DEVOLVIDA' },
    tipo_transacao: 'Gasto',
    analisePermiteEdicao: true,
};

describe('BotaoAcertosLancamentosExclusaoGasto', () => {
    beforeEach(() => {
        capturedLinkCustomProps = {};
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);
    });

    describe('lancamento não excluído (lancamento_excluido=false)', () => {
        it('exibe "Excluir despesa" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosExclusaoGasto {...defaultProps} />);
            expect(screen.getByText('Excluir despesa')).toBeInTheDocument();
        });

        it('exibe "Ver despesa a excluir" quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosExclusaoGasto {...defaultProps} />);
            expect(screen.getByText('Ver despesa a excluir')).toBeInTheDocument();
        });

        it('aplica classe btn-outline-success ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosExclusaoGasto {...defaultProps} />);
            expect(screen.getByTestId('link-custom')).toHaveClass('btn-outline-success', 'mr-2');
        });

        it('passa a URL correta ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosExclusaoGasto {...defaultProps} />);
            expect(capturedLinkCustomProps.url).toBe('/edicao-de-despesa/uuid-despesa-001');
        });

        it('passa operacao=requer_exclusao_lancamento_gasto ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosExclusaoGasto {...defaultProps} />);
            expect(capturedLinkCustomProps.operacao).toBe('requer_exclusao_lancamento_gasto');
        });

        it('não renderiza mensagem de excluído', () => {
            render(<BotaoAcertosLancamentosExclusaoGasto {...defaultProps} />);
            expect(screen.queryByText(/Despesa excluída/)).not.toBeInTheDocument();
        });
    });

    describe('lancamento excluído (lancamento_excluido=true)', () => {
        const analise_excluida = { ...analise_lancamento, lancamento_excluido: true };

        it('exibe "Despesa excluída." quando excluído', () => {
            render(<BotaoAcertosLancamentosExclusaoGasto {...defaultProps} analise_lancamento={analise_excluida} />);
            expect(screen.getByText(/Despesa excluída\./)).toBeInTheDocument();
        });

        it('renderiza o ícone de check', () => {
            render(<BotaoAcertosLancamentosExclusaoGasto {...defaultProps} analise_lancamento={analise_excluida} />);
            expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
        });

        it('não renderiza LinkCustom', () => {
            render(<BotaoAcertosLancamentosExclusaoGasto {...defaultProps} analise_lancamento={analise_excluida} />);
            expect(screen.queryByTestId('link-custom')).not.toBeInTheDocument();
        });
    });
});

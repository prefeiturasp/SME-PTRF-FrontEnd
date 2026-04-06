import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BotaoAcertosLancamentosEdicaoGasto from '../BotaoAcertosLancamentosEdicaoGasto';

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
    lancamento_atualizado: false,
};

const defaultProps = {
    analise_lancamento,
    prestacaoDeContasUuid: 'uuid-pc',
    prestacaoDeContas: { status: 'DEVOLVIDA' },
    tipo_transacao: 'Gasto',
    analisePermiteEdicao: true,
};

describe('BotaoAcertosLancamentosEdicaoGasto', () => {
    beforeEach(() => {
        capturedLinkCustomProps = {};
        jest.clearAllMocks();
        RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(true);
    });

    describe('lancamento não atualizado (lancamento_atualizado=false)', () => {
        it('exibe "Ajustar despesa" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} />);
            expect(screen.getByText('Ajustar despesa')).toBeInTheDocument();
        });

        it('exibe "Ver despesa" quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} />);
            expect(screen.getByText('Ver despesa')).toBeInTheDocument();
        });

        it('aplica classe btn-outline-success ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} />);
            expect(screen.getByTestId('link-custom')).toHaveClass('btn-outline-success', 'mr-2');
        });

        it('passa a URL correta ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} />);
            expect(capturedLinkCustomProps.url).toBe('/edicao-de-despesa/uuid-despesa-001');
        });

        it('passa operacao=requer_atualizacao_lancamento_gasto ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} />);
            expect(capturedLinkCustomProps.operacao).toBe('requer_atualizacao_lancamento_gasto');
        });

        it('passa analise_lancamento ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} />);
            expect(capturedLinkCustomProps.analise_lancamento).toEqual(analise_lancamento);
        });
    });

    describe('lancamento atualizado (lancamento_atualizado=true)', () => {
        const analise_atualizada = { ...analise_lancamento, lancamento_atualizado: true };

        it('exibe "Despesa atualizada." quando atualizado', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Despesa atualizada\./)).toBeInTheDocument();
        });

        it('exibe "Clique para editar" quando tem permissão', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Clique para editar/)).toBeInTheDocument();
        });

        it('exibe "Clique para ver" quando não tem permissão', () => {
            RetornaSeTemPermissaoEdicaoAjustesLancamentos.mockReturnValue(false);
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByText(/Clique para ver/)).toBeInTheDocument();
        });

        it('aplica classe link-green ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByTestId('link-custom')).toHaveClass('link-green', 'text-center');
        });

        it('renderiza o ícone de check', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(screen.getByTestId('fa-icon')).toBeInTheDocument();
        });

        it('passa a URL correta ao LinkCustom', () => {
            render(<BotaoAcertosLancamentosEdicaoGasto {...defaultProps} analise_lancamento={analise_atualizada} />);
            expect(capturedLinkCustomProps.url).toBe('/edicao-de-despesa/uuid-despesa-001');
        });
    });
});

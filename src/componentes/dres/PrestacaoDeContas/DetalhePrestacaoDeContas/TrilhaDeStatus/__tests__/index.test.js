import React from 'react';
import { render } from '@testing-library/react';
import { TrilhaDeStatus } from '../index';

describe('TrilhaDeStatus', () => {
    it('não renderiza nada quando prestacaoDeContas está vazio', () => {
        const { container } = render(<TrilhaDeStatus prestacaoDeContas={{}} />);
        expect(container).toBeEmptyDOMElement();
    });

    it.each(['NAO_RECEBIDA', 'NAO_APRESENTADA'])('renderiza TrilhaDeStatusNaoRecebida para status %s', (status) => {
        const { getByText } = render(<TrilhaDeStatus prestacaoDeContas={{ status }} />);
        expect(getByText('Não recebido')).toBeInTheDocument();
    });

    it('renderiza TrilhaDeStatusRecebida para status RECEBIDA', () => {
        const { getAllByText } = render(<TrilhaDeStatus prestacaoDeContas={{ status: 'RECEBIDA' }} />);
        expect(getAllByText(/Recebida e/).length).toBeGreaterThan(0);
    });

    it('renderiza TrilhaDeStatusEmAnalise para status EM_ANALISE', () => {
        const { getAllByText } = render(<TrilhaDeStatus prestacaoDeContas={{ status: 'EM_ANALISE' }} />);
        expect(getAllByText('Em análise').length).toBeGreaterThan(0);
    });

    it.each(['DEVOLVIDA', 'DEVOLVIDA_RETORNADA', 'DEVOLVIDA_RECEBIDA'])('renderiza TrilhaDeStatusDevolvidaParaAcertos para status %s', (status) => {
        const { getAllByText } = render(<TrilhaDeStatus prestacaoDeContas={{ status }} />);
        expect(getAllByText(/Devolvido/).length).toBeGreaterThan(0);
    });

    it.each(['APROVADA', 'APROVADA_RESSALVA', 'REPROVADA'])('renderiza TrilhaDeStatusAprovada para status %s', (status) => {
        const { container } = render(<TrilhaDeStatus prestacaoDeContas={{ status }} />);
        expect(container).not.toBeEmptyDOMElement();
    });

    it('renderiza TrilhaDeStatusReprovadaNaoApresentacao para status REPROVADA_NAO_APRESENTACAO', () => {
        const { container } = render(<TrilhaDeStatus prestacaoDeContas={{ status: 'REPROVADA_NAO_APRESENTACAO' }} />);
        expect(container).not.toBeEmptyDOMElement();
    });

    it('não renderiza nenhuma trilha para status desconhecido', () => {
        const { container } = render(<TrilhaDeStatus prestacaoDeContas={{ status: 'STATUS_INEXISTENTE' }} />);
        expect(container).toBeEmptyDOMElement();
    });
});

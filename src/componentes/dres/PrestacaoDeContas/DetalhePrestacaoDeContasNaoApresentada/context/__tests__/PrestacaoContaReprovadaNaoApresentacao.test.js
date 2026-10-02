import { useContext } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
    PrestacaoContaReprovadaNaoApresentacaoContext,
    PrestacaoContaReprovadaNaoApresentacaoProvider,
} from '../PrestacaoContaReprovadaNaoApresentacao';

const Consumidor = () => {
    const { prestacaoContaReprovadaNaoApresentacaoUuid, setPrestacaoContaReprovadaNaoApresentacaoUuid } =
        useContext(PrestacaoContaReprovadaNaoApresentacaoContext);

    return (
        <div>
            <span data-testid="valor">{prestacaoContaReprovadaNaoApresentacaoUuid}</span>
            <button onClick={() => setPrestacaoContaReprovadaNaoApresentacaoUuid('uuid-novo')}>
                atualizar
            </button>
        </div>
    );
};

describe('PrestacaoContaReprovadaNaoApresentacaoContext / Provider', () => {
    it('o contexto possui valores padrão quando consumido sem provider', () => {
        const Consumo = () => {
            const ctx = useContext(PrestacaoContaReprovadaNaoApresentacaoContext);
            return <span data-testid="default">{String(ctx.prestacaoContaReprovadaNaoApresentacaoUuid === '')}</span>;
        };

        render(<Consumo />);

        expect(screen.getByTestId('default')).toHaveTextContent('true');
    });

    it('inicia com uuid vazio quando envolto pelo provider', () => {
        render(
            <PrestacaoContaReprovadaNaoApresentacaoProvider>
                <Consumidor />
            </PrestacaoContaReprovadaNaoApresentacaoProvider>
        );

        expect(screen.getByTestId('valor')).toHaveTextContent('');
    });

    it('atualiza o uuid no contexto quando setPrestacaoContaReprovadaNaoApresentacaoUuid é chamado', () => {
        render(
            <PrestacaoContaReprovadaNaoApresentacaoProvider>
                <Consumidor />
            </PrestacaoContaReprovadaNaoApresentacaoProvider>
        );

        fireEvent.click(screen.getByText('atualizar'));

        expect(screen.getByTestId('valor')).toHaveTextContent('uuid-novo');
    });

    it('renderiza os filhos passados para o provider', () => {
        render(
            <PrestacaoContaReprovadaNaoApresentacaoProvider>
                <div data-testid="filho">conteudo</div>
            </PrestacaoContaReprovadaNaoApresentacaoProvider>
        );

        expect(screen.getByTestId('filho')).toBeInTheDocument();
    });
});

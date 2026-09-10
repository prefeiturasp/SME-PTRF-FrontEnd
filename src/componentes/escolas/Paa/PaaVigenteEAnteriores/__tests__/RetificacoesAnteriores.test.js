import React from 'react';

import { render, screen, fireEvent } from '@testing-library/react';

import RetificacoesAnteriores from '../components/PaaCard/RetificacoesAnteriores';

jest.mock(
    '../components/PaaCardBarraTitulo/PaaCardBarraTitulo',
    () => ({
        PaaCardBarraTitulo: ({ titulo, isAberto, onToggle }) => (
            <button
                type="button"
                data-testid="barra-titulo"
                data-aberto={isAberto}
                onClick={onToggle}
            >
                {titulo}
            </button>
        ),
    })
);

const RETIFICACAO_PADRAO = {
    secao_titulo: 'Retificacao #1',
    documento: {
        mensagem: 'Documento gerado com sucesso.',
    },
    ata: {
        mensagem: 'Ata gerada com sucesso.',
        resumo_assembleia: 'Resumo da assembleia.',
    },
};

describe('RetificacoesAnteriores', () => {
    it('renderiza a seção retraída por padrão', () => {
        render(
            <RetificacoesAnteriores
                retificacoesAnteriores={[RETIFICACAO_PADRAO]}
            />
        );

        expect(
            screen.getByText('PAA Retificações anteriores')
        ).toBeInTheDocument();

        expect(screen.getByTestId('barra-titulo')).toHaveAttribute(
            'data-aberto',
            'false'
        );

        expect(screen.queryByText('Retificacao #1')).not.toBeInTheDocument();
    });

    it('expande a seção ao clicar na barra de título', () => {
        render(
            <RetificacoesAnteriores
                retificacoesAnteriores={[RETIFICACAO_PADRAO]}
            />
        );

        fireEvent.click(screen.getByTestId('barra-titulo'));

        expect(screen.getByTestId('barra-titulo')).toHaveAttribute(
            'data-aberto',
            'true'
        );

        expect(screen.getByText('PAA Retificacao #1')).toBeInTheDocument();
    });

    it('retrai a seção ao clicar novamente na barra de título', () => {
        render(
            <RetificacoesAnteriores
                retificacoesAnteriores={[RETIFICACAO_PADRAO]}
            />
        );

        const barraTitulo = screen.getByTestId('barra-titulo');

        fireEvent.click(barraTitulo);

        expect(screen.getByText('PAA Retificacao #1')).toBeInTheDocument();

        fireEvent.click(barraTitulo);

        expect(screen.getByTestId('barra-titulo')).toHaveAttribute(
            'data-aberto',
            'false'
        );

        expect(screen.queryByText('Retificacao #1')).not.toBeInTheDocument();
    });

    it('renderiza os dados da retificação anterior ao expandir', () => {
        render(
            <RetificacoesAnteriores
                retificacoesAnteriores={[RETIFICACAO_PADRAO]}
            />
        );

        fireEvent.click(screen.getByTestId('barra-titulo'));

        expect(screen.getByText('PAA Retificacao #1')).toBeInTheDocument();
        expect(screen.getByText('Plano Anual')).toBeInTheDocument();
        expect(
            screen.getByText('Documento gerado com sucesso.')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Ata de retificaçao do PAA')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Ata gerada com sucesso.')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Resumo da assembleia.')
        ).toBeInTheDocument();
    });

    it('renderiza todas as retificações anteriores', () => {
        const retificacoesAnteriores = [
            {
                ...RETIFICACAO_PADRAO,
                secao_titulo: 'Ret #1',
            },
            {
                ...RETIFICACAO_PADRAO,
                secao_titulo: 'Ret #2',
            },
            {
                ...RETIFICACAO_PADRAO,
                secao_titulo: 'Ret #3',
            },
        ];

        render(
            <RetificacoesAnteriores
                retificacoesAnteriores={retificacoesAnteriores}
            />
        );

        fireEvent.click(screen.getByTestId('barra-titulo'));

        expect(screen.getByText('PAA Ret #1')).toBeInTheDocument();
        expect(screen.getByText('PAA Ret #2')).toBeInTheDocument();
        expect(screen.getByText('PAA Ret #3')).toBeInTheDocument();
    });

    it('renderiza a seção sem itens quando a lista está vazia', () => {
        render(
            <RetificacoesAnteriores retificacoesAnteriores={[]} />
        );

        expect(
            screen.getByText('PAA Retificações anteriores')
        ).toBeInTheDocument();

        expect(screen.getByTestId('barra-titulo')).toHaveAttribute(
            'data-aberto',
            'false'
        );
    });

    it('não renderiza a seção quando retificacoesAnteriores é null', () => {
        const { container } = render(
            <RetificacoesAnteriores retificacoesAnteriores={null} />
        );

        expect(container.firstChild).toBeNull();
    });
});


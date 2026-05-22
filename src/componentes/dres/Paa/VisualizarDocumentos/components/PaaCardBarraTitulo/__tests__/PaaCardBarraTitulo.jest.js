import React from 'react';
import { render, screen } from '@testing-library/react';

import { PaaCardBarraTitulo } from '../PaaCardBarraTitulo';

describe('PaaCardBarraTitulo', () => {
    describe('renderização inicial', () => {
        it('deve renderizar o título informado', () => {
            render(<PaaCardBarraTitulo titulo='PAA 2024' />);

            expect(screen.getByText('PAA 2024')).toBeInTheDocument();
        });

        it('deve renderizar o título dentro de um span', () => {
            render(<PaaCardBarraTitulo titulo='Título do cartão' />);

            const titulo = screen.getByText('Título do cartão');

            expect(titulo.tagName).toBe('SPAN');
        });

        it('deve aplicar corretamente a classe de estilo no container principal', () => {
            const { container } = render(<PaaCardBarraTitulo titulo='Meu título' />);

            const wrapper = container.firstChild;

            expect(wrapper).toHaveClass('paa-card-barra-titulo');

            expect(wrapper).toHaveClass('d-flex');

            expect(wrapper).toHaveClass('justify-content-between');

            expect(wrapper).toHaveClass('align-items-center');

            expect(wrapper).toHaveClass('w-100');
        });

        it('deve aplicar corretamente a classe de estilo no texto do título', () => {
            render(<PaaCardBarraTitulo titulo='Texto estilizado' />);

            expect(screen.getByText('Texto estilizado')).toHaveClass(
                'paa-card-barra-titulo__texto',
            );
        });
    });

    describe('cenários de conteúdo', () => {
        it('deve renderizar títulos com caracteres especiais', () => {
            render(<PaaCardBarraTitulo titulo='PAA - 2024/01' />);

            expect(screen.getByText('PAA - 2024/01')).toBeInTheDocument();
        });

        it('deve renderizar título vazio', () => {
            const { container } = render(<PaaCardBarraTitulo titulo='' />);

            const span = container.querySelector('.paa-card-barra-titulo__texto');

            expect(span).toBeInTheDocument();

            expect(span?.textContent).toBe('');
        });

        it('deve renderizar títulos longos corretamente', () => {
            const tituloLongo =
                'Plano Anual de Atividades Administrativas e Pedagógicas da Diretoria Regional de Educação';

            render(<PaaCardBarraTitulo titulo={tituloLongo} />);

            expect(screen.getByText(tituloLongo)).toBeInTheDocument();
        });
    });
});

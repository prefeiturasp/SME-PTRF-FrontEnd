import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabsArquivosDeReferenciaAccordion } from '../TabsArquivosDeReferenciaAccordion';

describe('TabsArquivosDeReferenciaAccordion', () => {
    const renderComponent = (props = {}) => render(
        <TabsArquivosDeReferenciaAccordion
            name="documentos"
            titulo="Documentos de referência"
            {...props}
        >
            <p>Conteúdo do accordion</p>
        </TabsArquivosDeReferenciaAccordion>
    );

    it('renderiza o título e o conteúdo passado como children', () => {
        renderComponent();
        expect(screen.getByText('Documentos de referência')).toBeInTheDocument();
        expect(screen.getByText('Conteúdo do accordion')).toBeInTheDocument();
    });

    it('inicia com o ícone de seta para baixo (fechado)', () => {
        const { container } = renderComponent();
        expect(container.querySelector('svg[data-icon="chevron-down"]')).toBeInTheDocument();
    });

    it('alterna para o ícone de seta para cima ao clicar no botão do título', () => {
        const { container } = renderComponent();
        const botaoTitulo = screen.getByText('Documentos de referência');
        fireEvent.click(botaoTitulo);
        expect(container.querySelector('svg[data-icon="chevron-up"]')).toBeInTheDocument();
    });

    it('alterna para o ícone de seta para cima ao clicar no botão do ícone', () => {
        const { container } = renderComponent();
        const botoes = container.querySelectorAll('button');
        fireEvent.click(botoes[1]);
        expect(container.querySelector('svg[data-icon="chevron-up"]')).toBeInTheDocument();
    });

    it('volta ao ícone de seta para baixo ao clicar duas vezes', () => {
        const { container } = renderComponent();
        const botaoTitulo = screen.getByText('Documentos de referência');
        fireEvent.click(botaoTitulo);
        fireEvent.click(botaoTitulo);
        expect(container.querySelector('svg[data-icon="chevron-down"]')).toBeInTheDocument();
    });

    it('usa o name recebido para compor os ids do accordion', () => {
        const { container } = renderComponent({ name: 'outronome' });
        expect(container.querySelector('#accordion_outronome')).toBeInTheDocument();
        expect(container.querySelector('#collapse_outronome')).toBeInTheDocument();
    });
});

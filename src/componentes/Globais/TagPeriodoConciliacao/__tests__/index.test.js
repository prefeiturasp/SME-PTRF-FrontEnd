import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TagPeriodoConciliacao from '../index';

jest.mock('../scss/TagPeriodoConciliacao.scss', () => {});

describe('TagPeriodoConciliacao', () => {
    it('deve renderizar o texto do período corretamente', () => {
        render(<TagPeriodoConciliacao periodo="2024.1" index={0} />);

        expect(screen.getByText('Período: 2024.1')).toBeInTheDocument();
    });

    it('deve aplicar o data-testid correto com base no index', () => {
        render(<TagPeriodoConciliacao periodo="2024.1" index={3} />);

        expect(screen.getByTestId('td-periodo-conciliacao-3')).toBeInTheDocument();
    });

    it('deve aplicar a classe extra quando classExtra for fornecido', () => {
        render(<TagPeriodoConciliacao periodo="2024.1" index={0} classExtra="minha-classe" />);

        const container = screen.getByTestId('td-periodo-conciliacao-0');
        expect(container).toHaveClass('minha-classe');
    });

    it('deve renderizar a tag small com a classe tag-periodo-conciliacao', () => {
        const { container } = render(<TagPeriodoConciliacao periodo="2024.2" index={1} />);

        const small = container.querySelector('small.tag-periodo-conciliacao');
        expect(small).toBeInTheDocument();
        expect(small).toHaveTextContent('Período: 2024.2');
    });

    it('deve renderizar sem classExtra sem erro', () => {
        render(<TagPeriodoConciliacao periodo="2023.3" index={2} />);

        const container = screen.getByTestId('td-periodo-conciliacao-2');
        expect(container).toBeInTheDocument();
        expect(container.className).toBe('');
    });
});

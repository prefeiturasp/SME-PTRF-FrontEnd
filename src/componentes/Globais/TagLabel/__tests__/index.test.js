import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TagLabel from '../index';

jest.mock('../scss/TagLabel.scss', () => {});

describe('TagLabel', () => {
    it('deve renderizar o label corretamente', () => {
        render(<TagLabel label="Período: 2024.1" index={0} />);

        expect(screen.getByText('Período: 2024.1')).toBeInTheDocument();
    });

    it('deve aplicar o data-testid correto com base no index', () => {
        render(<TagLabel label="Período: 2024.1" index={3} />);

        expect(screen.getByTestId('tag-label-3')).toBeInTheDocument();
    });

    it('deve aplicar className quando fornecido via rest props', () => {
        render(<TagLabel label="Período: 2024.1" index={0} className="minha-classe" />);

        const container = screen.getByTestId('tag-label-0');
        expect(container).toHaveClass('minha-classe');
    });

    it('deve renderizar o label dentro de uma tag small', () => {
        const { container } = render(<TagLabel label="Período: 2024.2" index={1} />);

        const small = container.querySelector('small');
        expect(small).toBeInTheDocument();
        expect(small).toHaveTextContent('Período: 2024.2');
    });

    it('deve renderizar sem className sem erro', () => {
        render(<TagLabel label="Período: 2023.3" index={2} />);

        const container = screen.getByTestId('tag-label-2');
        expect(container).toBeInTheDocument();
    });
});

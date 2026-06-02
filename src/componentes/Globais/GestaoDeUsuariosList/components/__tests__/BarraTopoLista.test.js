import React from 'react';
import { render, screen } from '@testing-library/react';
import { BarraTopoLista } from '../BarraTopoLista';

jest.mock('../AddUsuario', () => ({
    AddUsuario: () => <button data-testid="add-usuario">Adicionar</button>,
}));

describe('BarraTopoLista', () => {
    it('renderiza o título "Usuários com acesso"', () => {
        render(<BarraTopoLista />);
        expect(screen.getByRole('heading', { name: 'Usuários com acesso' })).toBeInTheDocument();
    });

    it('renderiza o componente AddUsuario', () => {
        render(<BarraTopoLista />);
        expect(screen.getByTestId('add-usuario')).toBeInTheDocument();
    });
});

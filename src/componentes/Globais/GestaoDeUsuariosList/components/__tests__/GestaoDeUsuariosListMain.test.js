import React from 'react';
import { render, screen } from '@testing-library/react';
import { GestaoDeUsuariosListMain } from '../GestaoDeUsuariosListMain';
import { visoesService } from '../../../../../services/visoes.service';
import { useGruposAcesso } from '../../hooks/useGruposAcesso';
import { useUsuarios } from '../../hooks/useUsuarios';

jest.mock('../../../../../services/visoes.service', () => ({
    visoesService: { getItemUsuarioLogado: jest.fn() },
}));

jest.mock('../../hooks/useGruposAcesso', () => ({ useGruposAcesso: jest.fn() }));
jest.mock('../../hooks/useUsuarios', () => ({ useUsuarios: jest.fn() }));

jest.mock('../GruposAcessoInfo', () => ({
    GruposAcessoInfo: ({ grupos }) => (
        <div data-testid="grupos-acesso-info">{grupos ? `${grupos.length} grupos` : '0 grupos'}</div>
    ),
}));

jest.mock('../BarraTopoLista', () => ({
    BarraTopoLista: () => <div data-testid="barra-topo-lista" />,
}));

jest.mock('../FormFiltros', () => ({
    FormFiltros: ({ grupos }) => <div data-testid="form-filtros" />,
}));

jest.mock('../ListaUsuarios', () => ({
    ListaUsuarios: ({ usuarios, isLoading }) => (
        <div data-testid="lista-usuarios">
            {isLoading ? 'carregando' : `${usuarios?.length ?? 0} usuarios`}
        </div>
    ),
}));

jest.mock('../Paginacao', () => ({
    Paginacao: () => <div data-testid="paginacao" />,
}));

jest.mock('../../../MenuInterno', () => ({
    MenuInterno: ({ caminhos_menu_interno }) => (
        <nav data-testid="menu-interno">{caminhos_menu_interno?.length} itens</nav>
    ),
}));

jest.mock('../../context/GestaoDeUsuariosListProvider', () => ({
    GestaoDeUsuariosListContext: { Provider: ({ children }) => children },
    GestaoDeUsuariosListProvider: ({ children }) => children,
}));

const GRUPOS = [{ id: 1, name: 'G1' }, { id: 2, name: 'G2' }];
const USUARIOS_RESULT = { results: [{ id: 1, name: 'Ana' }] };

describe('GestaoDeUsuariosListMain', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        visoesService.getItemUsuarioLogado.mockReturnValue('UE');
        useGruposAcesso.mockReturnValue({ data: GRUPOS });
        useUsuarios.mockReturnValue({ data: USUARIOS_RESULT, isLoading: false });
    });

    it('renderiza a descrição da funcionalidade', () => {
        render(<GestaoDeUsuariosListMain />);
        expect(screen.getByText(/Faça a gestão dos seus usuários/i)).toBeInTheDocument();
    });

    it('renderiza GruposAcessoInfo', () => {
        render(<GestaoDeUsuariosListMain />);
        expect(screen.getByTestId('grupos-acesso-info')).toBeInTheDocument();
    });

    it('renderiza BarraTopoLista', () => {
        render(<GestaoDeUsuariosListMain />);
        expect(screen.getByTestId('barra-topo-lista')).toBeInTheDocument();
    });

    it('renderiza FormFiltros', () => {
        render(<GestaoDeUsuariosListMain />);
        expect(screen.getByTestId('form-filtros')).toBeInTheDocument();
    });

    it('renderiza ListaUsuarios com os dados corretos', () => {
        render(<GestaoDeUsuariosListMain />);
        expect(screen.getByTestId('lista-usuarios')).toHaveTextContent('1 usuarios');
    });

    it('renderiza Paginacao quando não está carregando', () => {
        useUsuarios.mockReturnValue({ data: USUARIOS_RESULT, isLoading: false });
        render(<GestaoDeUsuariosListMain />);
        expect(screen.getByTestId('paginacao')).toBeInTheDocument();
    });

    it('não renderiza Paginacao quando está carregando', () => {
        useUsuarios.mockReturnValue({ data: null, isLoading: true });
        render(<GestaoDeUsuariosListMain />);
        expect(screen.queryByTestId('paginacao')).not.toBeInTheDocument();
    });

    it('exibe MenuInterno quando visão é SME', () => {
        visoesService.getItemUsuarioLogado.mockReturnValue('SME');
        render(<GestaoDeUsuariosListMain />);
        expect(screen.getByTestId('menu-interno')).toBeInTheDocument();
    });

    it('não exibe MenuInterno quando visão é UE', () => {
        visoesService.getItemUsuarioLogado.mockReturnValue('UE');
        render(<GestaoDeUsuariosListMain />);
        expect(screen.queryByTestId('menu-interno')).not.toBeInTheDocument();
    });

    it('não exibe MenuInterno quando visão é DRE', () => {
        visoesService.getItemUsuarioLogado.mockReturnValue('DRE');
        render(<GestaoDeUsuariosListMain />);
        expect(screen.queryByTestId('menu-interno')).not.toBeInTheDocument();
    });

    it('passa grupos para GruposAcessoInfo e FormFiltros', () => {
        render(<GestaoDeUsuariosListMain />);
        expect(screen.getByTestId('grupos-acesso-info')).toHaveTextContent('2 grupos');
    });

    it('renderiza ListaUsuarios em estado de carregamento quando isLoading é true', () => {
        useUsuarios.mockReturnValue({ data: null, isLoading: true });
        render(<GestaoDeUsuariosListMain />);
        expect(screen.getByTestId('lista-usuarios')).toHaveTextContent('carregando');
    });
});

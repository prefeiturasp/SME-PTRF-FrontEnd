import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Switch } from 'react-router-dom';
import {Rotas} from '../index';
import { useSelector } from 'react-redux';
import { Login } from '../../paginas/Login';
import { PainelParametrizacoesPage } from '../../paginas/SME/Parametrizacoes/PainelParametrizacoes';

const PageNotFound = ()=><>Página não encontrada</>

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn(),
}));

jest.mock('../../services/auth.service', () => ({
    authService: {
        isAuthenticated: jest.fn(),
        isLoggedIn: jest.fn(),
    },
}));

jest.mock('../../services/visoes.service', () => ({
    visoesService: {
        getDadosDoUsuarioLogado: jest.fn(),
        getPermissoes: jest.fn(),
        featureFlagAtiva: jest.fn(),
        getItemUsuarioLogado: jest.fn(),
    },
}));

describe('Routes', () => { 

    it('deve renderizar a página de Login corretamente', () => {
        useSelector.mockReturnValue({open: true, options: {}})
        render(
            <MemoryRouter initialEntries={['/login']}>
                <Login {...{location: {redefinicaoDeSenha: '/mock'}}}/>
            </MemoryRouter>
        );
        
        expect(screen.getByText(/Esqueci minha senha/i)).toBeInTheDocument();
        expect(screen.getByText(/Acessar/i)).toBeInTheDocument();
    });

    it('deve renderizar o Tela com autenticação exigida', () => {
        useSelector.mockReturnValue({open: true, options: {}})
        render(
            <MemoryRouter initialEntries={['/painel-parametrizacoes']}>
                <PainelParametrizacoesPage/>
            </MemoryRouter>
        );

        expect(screen.getByText(/Painel de Parametrizações/i)).toBeInTheDocument();
  });

  it('deve renderizar a Página 404 ao acessar uma rota inexistente', () => {
    useSelector.mockReturnValue({open: true, options: {}})
    render(
        <MemoryRouter initialEntries={['/rota-inexistente']}>
            <PageNotFound />
        </MemoryRouter>
    );

    expect(screen.getByText(/Página não encontrada/i)).toBeInTheDocument();
  });
    test('deve renderizar corretamente quando estiver na rota /exemplo', () => {
        const { getByText } = render(
            <MemoryRouter initialEntries={['/exemplo']}>
            <Switch>
                <Route path="/exemplo">
                    <Rotas />
                </Route>
            </Switch>
            </MemoryRouter>
        );

        expect(getByText('Não encontramos a página, clique no link abaixo e seja direcionado para a página inicial')).toBeInTheDocument();
    });

    it('deve renderizar o Tela com autenticação exigida', () => {
        useSelector.mockReturnValue({open: true, options: {}})
        render(
            <MemoryRouter initialEntries={['/painel-parametrizacoes']}>
                <PainelParametrizacoesPage/>
            </MemoryRouter>
        );

        expect(screen.getByText(/Painel de Parametrizações/i)).toBeInTheDocument();
    });
});


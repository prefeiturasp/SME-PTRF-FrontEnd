import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SidebarLeft } from '../index';
import { SidebarContext } from '../../../../context/Sidebar';
import { NotificacaoContext } from '../../../../context/Notificacoes';
import { CentralDeDownloadContext } from '../../../../context/CentralDeDownloads';
import { MemoryRouter } from 'react-router-dom';
import { visoesService } from '../../../../services/visoes.service';


jest.mock('../getUrls', () => ({
    getUrls: {
        GetUrls: () => ({
            default_selected: 'home',
            lista_de_urls: [
                {
                    url: 'home',
                    label: 'Home',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'cadastro-de-despesa-recurso-proprio',
                    label: 'Cadastro Despesa Recurso Proprio',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'cadastro-de-despesa',
                    label: 'Cadastro Despesa',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'edicao-de-despesa',
                    label: 'Edicao Despesa',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'cadastro-de-credito',
                    label: 'Cadastro Credito',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'edicao-de-receita',
                    label: 'Edicao Receita',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'gestao-de-perfis-form',
                    label: 'Gestao de Perfis',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'dre-lista-prestacao-de-contas',
                    label: 'Lista PC',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'dre-detalhe-prestacao-de-contas',
                    label: 'Detalhe PC',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'parametro-acoes',
                    label: 'Param Acoes',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: null
                },
                {
                    url: 'teste-flag',
                    label: 'Teste Flags',
                    icone: 'icone.png',
                    permissoes: ['perm1'],
                    dataFor: 'tooltip1',
                    featureFlag: 'teste',
                },
            ],
            dados_iniciais: {
                default_selected: 'home'
            }
        })
    }
}));

jest.mock('../../../../services/visoes.service', () => ({
    visoesService: {
        getPermissoes: jest.fn(),
        forcarNovoLogin: jest.fn(),
        featureFlagAtiva: jest.fn()
    }
}))

describe('SidebarLeft', () => {
    const sidebarMock = {
        sideBarStatus: true,
        setSideBarStatus: jest.fn(),
        irParaUrl: true,
    };

    const notificacaoMock = {
        getQtdeNotificacoesNaoLidas: jest.fn(),
        getExibeModalErroConcluirPc: jest.fn(),
    };

    const centralDownloadMock = {
        getQtdeNotificacoesNaoLidas: jest.fn()
    };

    const renderWithRouter = (ui, { route = '/' } = {}) => {
        return render(
            <MemoryRouter initialEntries={[route]}>
                <SidebarContext.Provider value={sidebarMock}>
                    <NotificacaoContext.Provider value={notificacaoMock}>
                        <CentralDeDownloadContext.Provider value={centralDownloadMock}>
                            {ui}
                        </CentralDeDownloadContext.Provider>
                    </NotificacaoContext.Provider>
                </SidebarContext.Provider>
            </MemoryRouter>
        );
    };

    it('deve renderizar o componente corretamente', () => {
        visoesService.getPermissoes.mockReturnValue(true);

        renderWithRouter(<SidebarLeft />);
        expect(screen.getByText('Home')).toBeInTheDocument();
    });
    
    it('deve chamar os métodos ao clicar em um item do menu Home', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Home'));

        expect(notificacaoMock.getQtdeNotificacoesNaoLidas).toHaveBeenCalled();
        expect(centralDownloadMock.getQtdeNotificacoesNaoLidas).toHaveBeenCalled();
        expect(notificacaoMock.getExibeModalErroConcluirPc).toHaveBeenCalled();
        expect(visoesService.forcarNovoLogin).toHaveBeenCalled();
    });

    it('deve chamar os métodos ao clicar em um item do menu de url cadastro-de-despesa-recurso-proprio', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Cadastro Despesa Recurso Proprio'));

        expect(screen.getByText('Cadastro Despesa Recurso Proprio')).toBeInTheDocument();
    });

    it('deve chamar os métodos ao clicar em um item do menu de url cadastro-de-despesa', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Cadastro Despesa'));

        expect(screen.getByText('Cadastro Despesa')).toBeInTheDocument();
    });

    it('deve chamar os métodos ao clicar em um item do menu de url edicao-de-despesa', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Edicao Despesa'));

        expect(screen.getByText('Edicao Despesa')).toBeInTheDocument();
    });

    it('deve chamar os métodos ao clicar em um item do menu de url edicao-de-receita', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Edicao Receita'));

        expect(screen.getByText('Edicao Receita')).toBeInTheDocument();
    });

    it('deve chamar os métodos ao clicar em um item do menu de url cadastro-de-credito', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Cadastro Credito'));

        expect(screen.getByText('Cadastro Credito')).toBeInTheDocument();
    });

    it('deve chamar os métodos ao clicar em um item do menu de url gestao-de-perfis-form', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Gestao de Perfis'));

        expect(screen.getByText('Gestao de Perfis')).toBeInTheDocument();
    });

    it('deve chamar os métodos ao clicar em um item do menu de url dre-lista-prestacao-de-contas', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Lista PC'));

        expect(screen.getByText('Lista PC')).toBeInTheDocument();
    });

    it('deve chamar os métodos ao clicar em um item do menu de url dre-detalhe-prestacao-de-contas', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Detalhe PC'));

        expect(screen.getByText('Detalhe PC')).toBeInTheDocument();
    });

    it('deve chamar os métodos ao clicar em um item do menu de url parametro-acoes', () => {
        visoesService.getPermissoes.mockReturnValue(true);
        renderWithRouter(<SidebarLeft />);
        fireEvent.click(screen.getByText('Param Acoes'));

        expect(screen.getByText('Param Acoes')).toBeInTheDocument();
    });


});

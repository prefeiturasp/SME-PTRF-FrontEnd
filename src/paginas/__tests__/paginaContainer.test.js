import React from 'react';
import { render, screen } from '@testing-library/react';
import { PaginasContainer } from './../PaginasContainer';
import { SidebarContext } from '../../context/Sidebar';
import { NotificacaoContext } from '../../context/Notificacoes';
import { MemoryRouter } from 'react-router-dom';
import {visoesService as vs} from '../../services/visoes.service';

jest.mock('../../services/visoes.service', () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    getDadosDoUsuarioLogado: jest.fn(),
  }
}));

jest.mock('./../../componentes/Globais/BarraMensagem', () => ({
    barraMensagemCustom: {
        BarraMensagemSucessLaranja: jest.fn(() => <div>Mensagem de teste</div>)
    }
}));

describe('PaginasContainer', () => {
    beforeEach(() => {
        vs.featureFlagAtiva.mockImplementation((flag) => true);
    });

    afterEach(() => {
        localStorage.clear();
        jest.restoreAllMocks();
    });

    it("renderiza PaginasContainer", () => {
      render(
        <MemoryRouter>
          <SidebarContext.Provider value={{ sideBarStatus: false }}>
            <NotificacaoContext.Provider value={{ exibeMensagemFixaTemDevolucao: false }}>
              <PaginasContainer>
                <div>Conteúdo da Página</div>
              </PaginasContainer>
            </NotificacaoContext.Provider>
          </SidebarContext.Provider>
        </MemoryRouter>
      );

      expect(screen.getByText("Conteúdo da Página")).toBeInTheDocument();
    });
 
});

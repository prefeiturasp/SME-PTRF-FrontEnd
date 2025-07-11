import React from 'react';
import { render, screen } from '@testing-library/react';
import { PaginasContainer } from "../PaginasContainer";
import { NotificacaoContext } from '../../context/Notificacoes';
import {notificaDevolucaoPCService} from "../../services/NotificacaDevolucaoPC.service";
import {visoesService, visoesService as vs} from '../../services/visoes.service';
import {BarraMensagemUnidadeEmSuporte} from "../../componentes/Globais/BarraMensagemUnidadeEmSuporte";
import { BarraMensagemFixa } from "../../componentes/Globais/BarraMensagemFixa";
import { barraMensagemCustom } from "../../componentes/Globais/BarraMensagem";
import { MemoryRouter } from 'react-router-dom';

jest.mock("../../componentes/Globais/BarraMensagemUnidadeEmSuporte", () => ({
  BarraMensagemUnidadeEmSuporte: ()=> <></>,
}));

jest.mock("../../componentes/Globais/BarraMensagemFixa", () => ({
  BarraMensagemFixa: ()=> <></>,
}));

const notificacaoContexto = {
  exibeMensagemFixaTemDevolucao: true,
  setExibeMensagemFixaTemDevolucao: jest.fn(),
  marcaNotificacaoComoLidaERedirecianaParaVerAcertos: jest.fn()
}
jest.mock('../../services/visoes.service', () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(),
    getItemUsuarioLogado: jest.fn(),
    getDadosDoUsuarioLogado: jest.fn(),
  }
}));
jest.mock('../../componentes/Globais/BarraMensagem', () => ({
  barraMensagemCustom: {
    BarraMensagemSucessLaranja: jest.fn()
  }
}));

jest.mock('../../services/NotificacaDevolucaoPC.service', () => ({
  notificaDevolucaoPCService: {
    marcaNotificacaoComoLidaERedirecianaParaVerAcertos: jest.fn()
  }
}));


describe('<PaginasContainer>', () => {
 
  test('Deve renderizar o componente', async () => {
    visoesService.featureFlagAtiva.mockReturnValue(true);
    visoesService.getItemUsuarioLogado.mockReturnValue('UE');
    barraMensagemCustom.BarraMensagemSucessLaranja.mockReturnValue();
    render(
        <MemoryRouter>
          <NotificacaoContext.Provider value={notificacaoContexto}>
            <PaginasContainer/>
          </NotificacaoContext.Provider>
        </MemoryRouter>
    );
  });

});
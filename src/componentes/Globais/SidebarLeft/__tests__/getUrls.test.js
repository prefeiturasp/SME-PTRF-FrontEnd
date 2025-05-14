import { getUrls } from '../getUrls.js';
import { visoesService } from '../../../../services/visoes.service';
import { get } from 'http';

jest.mock('../../../../services/visoes.service');

const GetUrls = getUrls.GetUrls
describe('GetUrls', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('retorna UrlsMenuSME se a visão selecionada for SME', () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
      visao_selecionada: { nome: 'SME' },
      visoes: [],
    });

    const resultado = GetUrls();
    expect(resultado.dados_iniciais.default_selected).toBe('painel-parametrizacoes');
  });

  it('retorna UrlsMenuDres se a visão selecionada for DRE', () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
      visao_selecionada: { nome: 'DRE' },
      visoes: [],
    });

    const resultado = GetUrls();
    expect(resultado.dados_iniciais.default_selected).toBe('dre-dashboard');
  });

  it('retorna UrlsMenuEscolas se a visão selecionada for UE', () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
      visao_selecionada: { nome: 'UE' },
      visoes: [],
    });

    const resultado = GetUrls();
    expect(resultado.dados_iniciais.default_selected).toBe('dados-da-associacao');
  });

  it('retorna UrlsMenuSME se não houver visão selecionada mas houver visão SME disponível', () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
      visoes: [{ tipo: 'SME' }],
    });

    const resultado = GetUrls();
    expect(resultado.dados_iniciais.default_selected).toBe('painel-parametrizacoes');
  });

  it('retorna UrlsMenuDres se não houver visão selecionada mas houver visão DRE disponível', () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
      visoes: [{ tipo: 'DRE' }],
    });

    const resultado = GetUrls();
    expect(resultado.dados_iniciais.default_selected).toBe('dre-dashboard');
  });

  it('retorna UrlsMenuEscolas se não houver visão selecionada mas houver visão UE disponível', () => {
    visoesService.getDadosDoUsuarioLogado.mockReturnValue({
      visoes: [{ tipo: 'UE' }],
    });

    const resultado = GetUrls();
    expect(resultado.dados_iniciais.default_selected).toBe('dados-da-associacao');
  });

});

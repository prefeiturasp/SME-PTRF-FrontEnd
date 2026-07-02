import {
  ataRetificacaoGerada,
  podeExibirBotaoRetificar,
} from '../exibirBotaoRetificarPaa';
import { visoesService } from '../../../../../../services/visoes.service';

jest.mock('../../../../../../services/visoes.service', () => ({
  visoesService: {
    featureFlagAtiva: jest.fn(),
  },
}));

const vigenteBase = {
  uuid: 'u',
  esta_em_retificacao: false,
  pode_retificar: false,
  retificacao: null,
};

describe('podeExibirBotaoRetificar', () => {
  beforeEach(() => {
    visoesService.featureFlagAtiva.mockReturnValue(true);
  });

  it('fora de retificação: usa pode_retificar', () => {
    expect(
      podeExibirBotaoRetificar({
        ...vigenteBase,
        esta_em_retificacao: false,
        pode_retificar: true,
      })
    ).toBe(true);
    expect(
      podeExibirBotaoRetificar({
        ...vigenteBase,
        esta_em_retificacao: false,
        pode_retificar: false,
      })
    ).toBe(false);
  });

  it('sem feature flag: retorna false independente dos demais campos', () => {
    visoesService.featureFlagAtiva.mockReturnValue(false);
    expect(
      podeExibirBotaoRetificar({
        ...vigenteBase,
        pode_retificar: true,
        esta_em_retificacao: true,
      })
    ).toBe(false);
  });

  it('em retificação: false quando documento não está em versão FINAL', () => {
    expect(
      podeExibirBotaoRetificar({
        ...vigenteBase,
        esta_em_retificacao: true,
        pode_retificar: false,
        retificacao: {
          documento: { status: { versao: 'PRELIMINAR' } },
        },
      })
    ).toBe(false);
  });

  it('em retificação: false quando documento está em versão FINAL', () => {
    expect(
      podeExibirBotaoRetificar({
        ...vigenteBase,
        esta_em_retificacao: true,
        pode_retificar: false,
        retificacao: {
          documento: { status: { versao: 'FINAL' } },
        },
      })
    ).toBe(false);
  });
});

describe('ataRetificacaoGerada', () => {
  it('retorna false sem retificacao.ata', () => {
    expect(ataRetificacaoGerada({ retificacao: null })).toBe(false);
    expect(ataRetificacaoGerada({ retificacao: {} })).toBe(false);
  });

  it('retorna false quando ata não tem arquivo ou status diferente de CONCLUIDO', () => {
    expect(
      ataRetificacaoGerada({
        retificacao: {
          ata: { existe_arquivo: false, status: { status_geracao: 'EM_PROCESSAMENTO' } },
        },
      })
    ).toBe(false);
  });

  it('retorna true quando ata tem arquivo e status CONCLUIDO', () => {
    expect(
      ataRetificacaoGerada({
        retificacao: {
          ata: { existe_arquivo: true, status: { status_geracao: 'CONCLUIDO' } },
        },
      })
    ).toBe(true);
  });
});

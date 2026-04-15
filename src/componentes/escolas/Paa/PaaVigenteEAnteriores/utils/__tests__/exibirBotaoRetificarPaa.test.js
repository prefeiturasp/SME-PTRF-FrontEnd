import {
  ataRetificacaoGerada,
  podeExibirBotaoRetificar,
} from '../exibirBotaoRetificarPaa';

const vigenteBase = {
  uuid: 'u',
  esta_em_retificacao: false,
  pode_retificar: false,
  retificacao: null,
};

describe('podeExibirBotaoRetificar', () => {
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

  it('em retificação: só true quando a ata de retificação está gerada (CONCLUIDO + arquivo)', () => {
    expect(
      podeExibirBotaoRetificar({
        ...vigenteBase,
        esta_em_retificacao: true,
        pode_retificar: false,
        retificacao: {
          ata: {
            existe_arquivo: false,
            status: { status_geracao: 'EM_PROCESSAMENTO' },
          },
        },
      })
    ).toBe(false);

    expect(
      podeExibirBotaoRetificar({
        ...vigenteBase,
        esta_em_retificacao: true,
        pode_retificar: false,
        retificacao: {
          ata: {
            existe_arquivo: true,
            status: { status_geracao: 'CONCLUIDO' },
          },
        },
      })
    ).toBe(true);
  });
});

describe('ataRetificacaoGerada', () => {
  it('retorna false sem retificacao.ata', () => {
    expect(ataRetificacaoGerada({ retificacao: null })).toBe(false);
    expect(ataRetificacaoGerada({ retificacao: {} })).toBe(false);
  });
});

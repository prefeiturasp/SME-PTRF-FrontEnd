import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import Relatorios from '../index';

const mockUseGetTextosPaa = jest.fn();
jest.mock('../hooks/useGetTextosPaa', () => ({
  useGetTextosPaa: () => mockUseGetTextosPaa(),
}));

const mockUseGetPaaVigente = jest.fn();
jest.mock('../hooks/useGetPaaVigente', () => ({
  useGetPaaVigente: (...args) => mockUseGetPaaVigente(...args),
}));

const mockPatchPaa = jest.fn();
jest.mock('../hooks/usePatchPaa', () => ({
  usePatchPaa: () => ({ patchPaa: mockPatchPaa }),
}));

var mockToastCustom;
jest.mock('../../../../../../Globais/ToastCustom', () => {
  mockToastCustom = {
    ToastCustomSuccess: jest.fn(),
    ToastCustomError: jest.fn(),
  };
  return {
    toastCustom: mockToastCustom,
  };
});

jest.mock('antd', () => {
  const ReactLib = require('react');
  return {
    Tooltip: ({ title, children }) =>
      ReactLib.createElement('div', { title, 'data-testid': 'tooltip' }, children),
  };
});

jest.mock('@fortawesome/react-fontawesome', () => {
  const ReactLib = require('react');
  return {
    FontAwesomeIcon: () => ReactLib.createElement('span', { 'data-testid': 'font-awesome-icon' }),
  };
});

jest.mock('../../../../../../../assets/img/icone-chevron-up.svg', () => 'chevron-up.svg');
jest.mock('../../../../../../../assets/img/icone-chevron-down.svg', () => 'chevron-down.svg');

let latestEditorProps = null;
const mockEditorWysiwygCustom = jest.fn(props => {
  const ReactLib = require('react');
  latestEditorProps = props;
  return ReactLib.createElement(
    'div',
    { 'data-testid': 'editor-wysiwyg' },
    ReactLib.createElement('div', {
      'data-testid': 'editor-initial-content',
      dangerouslySetInnerHTML: { __html: props.textoInicialEditor },
    }),
    ReactLib.createElement(
      'button',
      {
        type: 'button',
        'data-testid': 'btn-salvar',
        onClick: () => props.handleSubmitEditor('novo texto'),
      },
      'Salvar'
    ),
    ReactLib.createElement(
      'button',
      {
        type: 'button',
        'data-testid': 'btn-salvar-vazio',
        onClick: () => props.handleSubmitEditor(''),
      },
      'Salvar vazio'
    ),
    ReactLib.createElement(
      'button',
      {
        type: 'button',
        'data-testid': 'btn-limpar',
        onClick: () => props.handleLimparEditor('texto atual'),
      },
      'Limpar'
    ),
    ReactLib.createElement(
      'button',
      {
        type: 'button',
        'data-testid': 'btn-mudar',
        onClick: () => props.handleMudancaEditor('<p>conteudo livre</p>'),
      },
      'Mudar'
    )
  );
});

jest.mock('../../../../../../Globais/EditorWysiwygCustom', () => ({
  __esModule: true,
  default: props => mockEditorWysiwygCustom(props),
}));

const textoIntroducaoUm = '<p>Texto de introducao 1</p>';
const textoIntroducaoFixo = '<p>Texto automatico padrao</p>';

const configurarMocks = ({
  textoIntroducao = '<p>Conteudo do PAA</p>',
  textosLoading = false,
  textosError = false,
  paaLoading = false,
  paaVigente = {
    uuid: 'paa-uuid-123',
    texto_introducao: textoIntroducao,
  },
  textosOverrides = {},
} = {}) => {
  mockUseGetTextosPaa.mockReturnValue({
    textosPaa: {
      introducao_do_paa_ue_1: textoIntroducaoUm,
      introducao_do_paa_ue_2: textoIntroducaoFixo,
      ...textosOverrides,
    },
    isLoading: textosLoading,
    isError: textosError,
  });

  mockUseGetPaaVigente.mockReturnValue({
    paaVigente,
    isLoading: paaLoading,
  });

  mockPatchPaa.mockResolvedValue({});
};

describe('Relatorios - Secao Introducao', () => {
  let consoleLogSpy;

  beforeAll(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(key => (key === 'UUID' ? 'associacao-uuid-123' : null)),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      configurable: true,
      writable: true,
    });

    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  beforeEach(() => {
    latestEditorProps = null;
    mockUseGetTextosPaa.mockReset();
    mockUseGetPaaVigente.mockReset();
    mockPatchPaa.mockReset();
    mockEditorWysiwygCustom.mockClear();
    mockToastCustom.ToastCustomSuccess.mockReset();
    mockToastCustom.ToastCustomError.mockReset();

    window.localStorage.getItem.mockImplementation(key => (key === 'UUID' ? 'associacao-uuid-123' : null));

    configurarMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockClear();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  const expandirPlanoAnual = () => {
    fireEvent.click(screen.getByRole('button', { name: /Abrir/i }));
  };

  const expandirSecaoIntroducao = async () => {
    expandirPlanoAnual();
    const introducaoTitulo = await screen.findByText('I. Introdução');
    const introducaoSection = introducaoTitulo.closest('.subsecao-item');
    if (!introducaoSection) {
      throw new Error('Secao de introducao nao encontrada.');
    }
    const botaoIntroducao = introducaoSection.querySelector('button');
    if (!botaoIntroducao) {
      throw new Error('Botao da secao de introducao nao encontrado.');
    }
    fireEvent.click(botaoIntroducao);
    await waitFor(() => {
      expect(mockEditorWysiwygCustom).toHaveBeenCalled();
    });
  };

  const obterPropsEditor = () => {
    const chamadas = mockEditorWysiwygCustom.mock.calls;
    return chamadas.length ? chamadas[chamadas.length - 1][0] : null;
  };

  it('exibe o cabecalho de documentos', () => {
    render(<Relatorios />);

    expect(screen.getByText('Documentos')).toBeInTheDocument();
    expect(screen.getByText('Prévias')).toBeInTheDocument();
    expect(screen.getByText('Gerar')).toBeInTheDocument();
  });

  it('expande o plano anual e mostra o texto de introducao', async () => {
    render(<Relatorios />);
    await expandirSecaoIntroducao();

    expect(screen.getByText('Texto de introducao 1')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toHaveAttribute('title', 'Texto padrão inserido automaticamente no documento');
  });

  it('usa o uuid da associacao ao buscar o paa vigente', () => {
    render(<Relatorios />);

    expect(mockUseGetPaaVigente).toHaveBeenCalledWith('associacao-uuid-123');
  });

  it('renderiza o editor com texto fixo seguido do conteudo do paa', async () => {
    render(<Relatorios />);
    await expandirSecaoIntroducao();

    const editorProps = obterPropsEditor();
    expect(editorProps).not.toBeNull();
    expect(editorProps.textoInicialEditor).toContain('id="texto-automatico-introducao-paa"');
    expect(editorProps.textoInicialEditor).toContain('Texto automatico padrao');
    expect(editorProps.textoInicialEditor).toContain('Conteudo do PAA');
  });

  it('nao duplica o texto fixo quando ja existe no paa', async () => {
    const textoComFixo = '<div id="texto-automatico-introducao-paa">Bloco automatico existente</div><p>Texto adicional</p>';
    configurarMocks({ textoIntroducao: textoComFixo });

    render(<Relatorios />);
    await expandirSecaoIntroducao();

    const editorProps = obterPropsEditor();
    expect(editorProps).not.toBeNull();
    expect(editorProps.textoInicialEditor).toBe(textoComFixo);
  });

  it('limpa o editor mantendo apenas o texto fixo e um paragrafo vazio', async () => {
    render(<Relatorios />);
    await expandirSecaoIntroducao();

    const editorProps = obterPropsEditor();
    expect(editorProps).not.toBeNull();
    const resultado = editorProps.handleLimparEditor('<p>qualquer conteudo</p>');

    expect(resultado).toContain('id="texto-automatico-introducao-paa"');
    expect(resultado.trim().endsWith('<p><br></p>')).toBe(true);
  });

  it('mantem o texto fixo ao alterar o conteudo manualmente', async () => {
    render(<Relatorios />);
    await expandirSecaoIntroducao();

    const editorProps = obterPropsEditor();
    expect(editorProps).not.toBeNull();
    const resultado = editorProps.handleMudancaEditor('<p>conteudo livre</p>');

    expect(resultado.startsWith('<div id="texto-automatico-introducao-paa"')).toBe(true);
    expect(resultado).toContain('<p>conteudo livre</p>');
  });

  it('chama patchPaa com o texto informado ao salvar', async () => {
    render(<Relatorios />);
    await expandirSecaoIntroducao();

    const editorProps = obterPropsEditor();
    expect(editorProps).not.toBeNull();
    await act(async () => {
      await editorProps.handleSubmitEditor('novo texto');
    });

    await waitFor(() => {
      expect(mockPatchPaa).toHaveBeenCalledWith({
        uuid: 'paa-uuid-123',
        payload: { texto_introducao: 'novo texto' },
      });
    });

    expect(mockToastCustom.ToastCustomSuccess).toHaveBeenCalledWith('Sucesso!', 'Item salvo com sucesso!');
  });

  it('usa texto padrao ao salvar campo vazio', async () => {
    render(<Relatorios />);
    await expandirSecaoIntroducao();

    const editorProps = obterPropsEditor();
    expect(editorProps).not.toBeNull();
    await act(async () => {
      await editorProps.handleSubmitEditor('');
    });

    await waitFor(() => {
      expect(mockPatchPaa).toHaveBeenCalledWith({
        uuid: 'paa-uuid-123',
        payload: { texto_introducao: 'Comece a digitar aqui...' },
      });
    });
  });

  it('exibe erro quando nao ha paa vigente ao salvar', async () => {
    configurarMocks({ paaVigente: null });

    render(<Relatorios />);
    await expandirSecaoIntroducao();

    const editorProps = obterPropsEditor();
    expect(editorProps).not.toBeNull();
    await act(async () => {
      await editorProps.handleSubmitEditor('novo texto');
    });

    await waitFor(() => {
      expect(mockPatchPaa).not.toHaveBeenCalled();
      expect(mockToastCustom.ToastCustomError).toHaveBeenCalledWith('Erro!', 'PAA vigente não encontrado.');
    });
  });
});

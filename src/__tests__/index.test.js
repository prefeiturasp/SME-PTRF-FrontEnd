import React from 'react';

// Capturados no ambiente de test (NODE_ENV='test'), antes de qualquer mudança de env.
// Reutilizados como mock para garantir que jsxDEV esteja disponível em todos os testes,
// inclusive nos que mudam NODE_ENV para 'production' (onde a build production exporta jsxDEV=void 0).
const REAL_JSX_DEV_RUNTIME = jest.requireActual('react/jsx-dev-runtime');
const REAL_JSX_RUNTIME = jest.requireActual('react/jsx-runtime');

// Utilitário para percorrer a árvore JSX sem renderizar no DOM
const findInJSX = (jsx, predicate) => {
  if (!jsx || typeof jsx !== 'object' || !jsx.props) return null;
  if (predicate(jsx)) return jsx;
  const children = jsx.props.children;
  if (!children) return null;
  const list = Array.isArray(children) ? children.flat(Infinity) : [children];
  for (const child of list) {
    const found = findInJSX(child, predicate);
    if (found) return found;
  }
  return null;
};

describe('src/index.js', () => {
  const originalEnv = process.env;

  let mockSentryInit;
  let mockUnregister;
  let mockRender;
  let mockCreateRoot;

  // Componente provider genérico passthrough
  const makeProvider = () =>
    ({ children }) => React.createElement(React.Fragment, null, children);

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };

    mockSentryInit = jest.fn();
    mockUnregister = jest.fn();
    mockRender = jest.fn();
    mockCreateRoot = jest.fn(() => ({ render: mockRender }));

    // Garante que o elemento #root exista no DOM
    document.body.innerHTML = '<div id="root"></div>';

    // Em produção, react/jsx-dev-runtime exporta jsxDEV=void 0 (inutilizável).
    // Usa as referências capturadas no topo do arquivo (NODE_ENV='test'), onde jsxDEV está definido.
    jest.doMock('react/jsx-dev-runtime', () => REAL_JSX_DEV_RUNTIME);
    jest.doMock('react/jsx-runtime', () => REAL_JSX_RUNTIME);

    jest.doMock('@sentry/browser', () => ({ init: mockSentryInit }));
    jest.doMock('../serviceWorker', () => ({ unregister: mockUnregister }));
    jest.doMock('react-dom/client', () => ({ createRoot: mockCreateRoot }));
    jest.doMock('../App', () => () => React.createElement('div', null, 'App'));
    jest.doMock('react-router-dom', () => ({
      BrowserRouter: makeProvider(),
    }));
    jest.doMock('../context/Sidebar', () => ({
      SidebarContextProvider: makeProvider(),
    }));
    jest.doMock('../context/Despesa', () => ({
      DespesaContextProvider: makeProvider(),
    }));
    jest.doMock('../context/Notificacoes', () => ({
      NotificacaoContextProvider: makeProvider(),
    }));
    jest.doMock('../context/DataLimiteDevolucao', () => ({
      DataLimiteProvider: makeProvider(),
    }));
    jest.doMock('../context/CentralDeDownloads', () => ({
      CentralDeDownloadContextProvider: makeProvider(),
    }));
    jest.doMock('../context/Tema', () => ({
      ThemeProvider: makeProvider(),
    }));
    jest.doMock('../context/RecursoSelecionado', () => ({
      RecursoSelecionadoProvider: makeProvider(),
    }));
    jest.doMock('react-redux', () => ({
      Provider: makeProvider(),
    }));
    jest.doMock('../store', () => ({ store: {} }));
    jest.doMock('@tanstack/react-query', () => ({
      QueryClient: jest.fn(() => ({})),
      QueryClientProvider: makeProvider(),
    }));
    jest.doMock('@tanstack/react-query-devtools', () => ({
      ReactQueryDevtools: () =>
        React.createElement('div', { 'data-testid': 'react-query-devtools' }),
    }));
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  test('chama serviceWorker.unregister() ao carregar o módulo', () => {
    require('../index');
    expect(mockUnregister).toHaveBeenCalledTimes(1);
  });

  test('cria a raiz React no elemento #root do documento', () => {
    require('../index');
    expect(mockCreateRoot).toHaveBeenCalledWith(document.getElementById('root'));
  });

  test('renderiza o app exatamente uma vez', () => {
    require('../index');
    expect(mockRender).toHaveBeenCalledTimes(1);
  });

  test('não inicializa o Sentry fora do ambiente de produção', () => {
    process.env.NODE_ENV = 'test';
    require('../index');
    expect(mockSentryInit).not.toHaveBeenCalled();
  });

  test('inicializa o Sentry no ambiente de produção com as configurações corretas', () => {
    process.env.NODE_ENV = 'production';
    require('../index');
    expect(mockSentryInit).toHaveBeenCalledTimes(1);
    expect(mockSentryInit).toHaveBeenCalledWith({
      dsn: 'SENTRY_URL_REPLACE_ME',
      environment: 'SENTRY_ENVIRONMENT_REPLACE_ME',
    });
  });

  test('não inclui ReactQueryDevtools quando REACT_APP_NODE_ENV não é local', () => {
    process.env.REACT_APP_NODE_ENV = 'development';
    require('../index');

    const { ReactQueryDevtools } = require('@tanstack/react-query-devtools');
    const renderedJSX = mockRender.mock.calls[0][0];
    const devtools = findInJSX(renderedJSX, (el) => el.type === ReactQueryDevtools);

    expect(devtools).toBeNull();
  });

  test('não inclui ReactQueryDevtools quando a flag está desabilitada no ambiente local', () => {
    process.env.REACT_APP_NODE_ENV = 'local';
    process.env.REACT_APP_REACT_QUERY_DEV_TOOLS = 'false';
    require('../index');

    const { ReactQueryDevtools } = require('@tanstack/react-query-devtools');
    const renderedJSX = mockRender.mock.calls[0][0];
    const devtools = findInJSX(renderedJSX, (el) => el.type === ReactQueryDevtools);

    expect(devtools).toBeNull();
  });

  test('inclui ReactQueryDevtools quando a flag está habilitada no ambiente local', () => {
    process.env.REACT_APP_NODE_ENV = 'local';
    process.env.REACT_APP_REACT_QUERY_DEV_TOOLS = 'true';
    require('../index');

    const { ReactQueryDevtools } = require('@tanstack/react-query-devtools');
    const renderedJSX = mockRender.mock.calls[0][0];
    const devtools = findInJSX(renderedJSX, (el) => el.type === ReactQueryDevtools);

    expect(devtools).not.toBeNull();
    expect(devtools.props.initialIsOpen).toBe(false);
  });

  test('instancia um novo QueryClient', () => {
    require('../index');
    const { QueryClient } = require('@tanstack/react-query');
    expect(QueryClient).toHaveBeenCalledTimes(1);
  });

  test('a árvore de provedores envolve o App corretamente', () => {
    require('../index');
    const { Provider } = require('react-redux');
    const { QueryClientProvider } = require('@tanstack/react-query');
    const { NotificacaoContextProvider } = require('../context/Notificacoes');
    const { SidebarContextProvider } = require('../context/Sidebar');
    const App = require('../App');

    const renderedJSX = mockRender.mock.calls[0][0];

    // Verifica presença dos principais provedores na árvore
    expect(findInJSX(renderedJSX, (el) => el.type === Provider)).not.toBeNull();
    expect(findInJSX(renderedJSX, (el) => el.type === QueryClientProvider)).not.toBeNull();
    expect(findInJSX(renderedJSX, (el) => el.type === NotificacaoContextProvider)).not.toBeNull();
    expect(findInJSX(renderedJSX, (el) => el.type === SidebarContextProvider)).not.toBeNull();
    expect(findInJSX(renderedJSX, (el) => el.type === App.default || el.type === App)).not.toBeNull();
  });
});

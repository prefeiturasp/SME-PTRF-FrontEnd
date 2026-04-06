// serviceWorker.js usa efeitos colaterais no carregamento do módulo (isLocalhost).
// Por isso, todos os testes usam jest.resetModules() + require() dinâmico para
// controlar window.location.hostname ANTES do módulo ser importado.

describe('serviceWorker', () => {
  const originalEnv = process.env;

  let addEventListenerSpy;

  // -------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------

  const setLocation = (hostname) => {
    Object.defineProperty(window, 'location', {
      value: {
        hostname,
        href: `http://${hostname}/`,
        origin: `http://${hostname}`,
        reload: jest.fn(),
      },
      configurable: true,
      writable: true,
    });
  };

  const setupNavigatorSW = (overrides = {}) => {
    const mockUnregister = jest.fn().mockResolvedValue(undefined);
    const sw = {
      ready: Promise.resolve({ unregister: mockUnregister }),
      register: jest.fn().mockResolvedValue({ installing: null }),
      controller: null,
      ...overrides,
    };
    Object.defineProperty(navigator, 'serviceWorker', {
      value: sw,
      configurable: true,
      writable: true,
    });
    return sw;
  };

  // Invoca o handler do evento 'load' capturado pelo spy
  const triggerLoad = () => {
    const loadCall = addEventListenerSpy.mock.calls.find((c) => c[0] === 'load');
    expect(loadCall).toBeDefined();
    loadCall[1]();
  };

  // Drena a fila de microtasks (encadeamentos de Promise)
  const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

  // -------------------------------------------------------------------
  // Setup / Teardown
  // -------------------------------------------------------------------

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv, NODE_ENV: 'production', PUBLIC_URL: '' };

    // Padrão: host externo → isLocalhost = false
    setLocation('example.com');

    addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = jest.fn();
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
    // Remove navigator.serviceWorker caso tenha sido definido no teste
    const desc = Object.getOwnPropertyDescriptor(navigator, 'serviceWorker');
    if (desc && desc.configurable) {
      delete navigator.serviceWorker;
    }
  });

  // ===================================================================
  // unregister()
  // ===================================================================

  describe('unregister()', () => {
    test('não faz nada quando serviceWorker não está disponível no navigator', () => {
      // navigator.serviceWorker não está definido (jsdom padrão)
      const { unregister } = require('../serviceWorker');
      expect(() => unregister()).not.toThrow();
    });

    test('chama registration.unregister() quando serviceWorker está disponível', async () => {
      const mockUnregister = jest.fn().mockResolvedValue(undefined);
      setupNavigatorSW({
        ready: Promise.resolve({ unregister: mockUnregister }),
      });

      const { unregister } = require('../serviceWorker');
      unregister();

      await flushPromises();

      expect(mockUnregister).toHaveBeenCalledTimes(1);
    });

    test('loga o erro no console quando navigator.serviceWorker.ready rejeita', async () => {
      const testError = new Error('SW ready failed');
      setupNavigatorSW({ ready: Promise.reject(testError) });

      const { unregister } = require('../serviceWorker');
      unregister();

      await flushPromises();

      expect(console.error).toHaveBeenCalledWith(testError.message);
    });
  });

  // ===================================================================
  // register() — guards (condições que impedem o registro)
  // ===================================================================

  describe('register() — condições de guarda', () => {
    test('não registra listener de load quando NODE_ENV não é production', () => {
      process.env.NODE_ENV = 'development';
      setupNavigatorSW();

      const { register } = require('../serviceWorker');
      register({});

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('load', expect.any(Function));
    });

    test('não registra listener de load quando serviceWorker não está no navigator', () => {
      // Não chama setupNavigatorSW → 'serviceWorker' não está em navigator
      const { register } = require('../serviceWorker');
      register({});

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('load', expect.any(Function));
    });

    test('não registra listener de load quando PUBLIC_URL tem origem diferente da página', () => {
      process.env.PUBLIC_URL = 'https://cdn.example.com';
      setupNavigatorSW();

      const { register } = require('../serviceWorker');
      register({});

      expect(addEventListenerSpy).not.toHaveBeenCalledWith('load', expect.any(Function));
    });

    test('registra listener de load quando todas as condições são satisfeitas', () => {
      setupNavigatorSW();

      const { register } = require('../serviceWorker');
      register({});

      expect(addEventListenerSpy).toHaveBeenCalledWith('load', expect.any(Function));
    });
  });

  // ===================================================================
  // register() em host externo → registerValidSW
  // ===================================================================

  describe('register() em host externo (isLocalhost=false)', () => {
    // window.location.hostname = 'example.com' já definido no beforeEach externo

    test('chama navigator.serviceWorker.register com a URL correta no evento load', async () => {
      const sw = setupNavigatorSW();

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await flushPromises();

      expect(sw.register).toHaveBeenCalledWith('/service-worker.js');
    });

    test('loga erro quando navigator.serviceWorker.register rejeita', async () => {
      const testError = new Error('Registration failed');
      setupNavigatorSW({
        register: jest.fn().mockRejectedValue(testError),
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await flushPromises();

      expect(console.error).toHaveBeenCalledWith(
        'Error during service worker registration:',
        testError
      );
    });

    test('define registration.onupdatefound após o register ter sucesso', async () => {
      const mockRegistration = { installing: null, onupdatefound: null };
      setupNavigatorSW({
        register: jest.fn().mockResolvedValue(mockRegistration),
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await flushPromises();

      expect(typeof mockRegistration.onupdatefound).toBe('function');
    });

    test('retorna imediatamente quando registration.installing é null', async () => {
      const mockRegistration = { installing: null, onupdatefound: null };
      setupNavigatorSW({
        register: jest.fn().mockResolvedValue(mockRegistration),
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await flushPromises();

      // Invocar onupdatefound com installing=null não deve lançar erro
      expect(() => mockRegistration.onupdatefound()).not.toThrow();
    });

    test('define installingWorker.onstatechange após onupdatefound', async () => {
      const mockInstaller = { state: 'installing', onstatechange: null };
      const mockRegistration = { installing: mockInstaller, onupdatefound: null };
      setupNavigatorSW({
        register: jest.fn().mockResolvedValue(mockRegistration),
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await flushPromises();
      mockRegistration.onupdatefound();

      expect(typeof mockInstaller.onstatechange).toBe('function');
    });

    test('não chama callbacks quando state não é "installed"', async () => {
      const mockInstaller = { state: 'installing', onstatechange: null };
      const mockRegistration = { installing: mockInstaller, onupdatefound: null };
      const mockConfig = { onUpdate: jest.fn(), onSuccess: jest.fn() };
      setupNavigatorSW({
        register: jest.fn().mockResolvedValue(mockRegistration),
      });

      const { register } = require('../serviceWorker');
      register(mockConfig);
      triggerLoad();

      await flushPromises();
      mockRegistration.onupdatefound();
      mockInstaller.onstatechange();

      expect(mockConfig.onUpdate).not.toHaveBeenCalled();
      expect(mockConfig.onSuccess).not.toHaveBeenCalled();
    });

    test('loga e chama config.onUpdate quando state=installed e há controller', async () => {
      const mockInstaller = { state: 'installed', onstatechange: null };
      const mockRegistration = { installing: mockInstaller, onupdatefound: null };
      const mockConfig = { onUpdate: jest.fn() };
      setupNavigatorSW({
        register: jest.fn().mockResolvedValue(mockRegistration),
        controller: {}, // truthy → onUpdate
      });

      const { register } = require('../serviceWorker');
      register(mockConfig);
      triggerLoad();

      await flushPromises();
      mockRegistration.onupdatefound();
      mockInstaller.onstatechange();

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('New content is available')
      );
      expect(mockConfig.onUpdate).toHaveBeenCalledWith(mockRegistration);
    });

    test('não lança erro quando config.onUpdate não está definido', async () => {
      const mockInstaller = { state: 'installed', onstatechange: null };
      const mockRegistration = { installing: mockInstaller, onupdatefound: null };
      setupNavigatorSW({
        register: jest.fn().mockResolvedValue(mockRegistration),
        controller: {},
      });

      const { register } = require('../serviceWorker');
      register(null); // config null

      triggerLoad();
      await flushPromises();
      mockRegistration.onupdatefound();

      expect(() => mockInstaller.onstatechange()).not.toThrow();
    });

    test('loga e chama config.onSuccess quando state=installed e não há controller', async () => {
      const mockInstaller = { state: 'installed', onstatechange: null };
      const mockRegistration = { installing: mockInstaller, onupdatefound: null };
      const mockConfig = { onSuccess: jest.fn() };
      setupNavigatorSW({
        register: jest.fn().mockResolvedValue(mockRegistration),
        controller: null, // falsy → onSuccess
      });

      const { register } = require('../serviceWorker');
      register(mockConfig);
      triggerLoad();

      await flushPromises();
      mockRegistration.onupdatefound();
      mockInstaller.onstatechange();

      expect(console.log).toHaveBeenCalledWith('Content is cached for offline use.');
      expect(mockConfig.onSuccess).toHaveBeenCalledWith(mockRegistration);
    });

    test('não lança erro quando config.onSuccess não está definido', async () => {
      const mockInstaller = { state: 'installed', onstatechange: null };
      const mockRegistration = { installing: mockInstaller, onupdatefound: null };
      setupNavigatorSW({
        register: jest.fn().mockResolvedValue(mockRegistration),
        controller: null,
      });

      const { register } = require('../serviceWorker');
      register({}); // config sem onSuccess

      triggerLoad();
      await flushPromises();
      mockRegistration.onupdatefound();

      expect(() => mockInstaller.onstatechange()).not.toThrow();
    });
  });

  // ===================================================================
  // register() em localhost → checkValidServiceWorker
  // ===================================================================

  describe('register() em localhost (isLocalhost=true)', () => {
    beforeEach(() => {
      // Muda hostname ANTES do require para que isLocalhost=true
      setLocation('localhost');
    });

    test('chama fetch com a URL e header corretos no evento load', () => {
      setupNavigatorSW();
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: { get: () => 'application/javascript' },
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      expect(fetch).toHaveBeenCalledWith('/service-worker.js', {
        headers: { 'Service-Worker': 'script' },
      });
    });

    test('loga mensagem do service worker quando ready resolve', async () => {
      const mockReady = Promise.resolve({ unregister: jest.fn() });
      setupNavigatorSW({ ready: mockReady });
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: { get: () => 'application/javascript' },
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await mockReady;

      expect(console.log).toHaveBeenCalledWith(
        expect.stringContaining('cache-first')
      );
    });

    test('desregistra e recarrega a página quando response tem status 404', async () => {
      const mockUnregister = jest.fn().mockResolvedValue(undefined);
      setupNavigatorSW({
        ready: Promise.resolve({ unregister: mockUnregister }),
      });
      global.fetch = jest.fn().mockResolvedValue({
        status: 404,
        headers: { get: () => 'text/html' },
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await flushPromises();

      expect(mockUnregister).toHaveBeenCalledTimes(1);
      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });

    test('desregistra e recarrega quando content-type não é JavaScript', async () => {
      const mockUnregister = jest.fn().mockResolvedValue(undefined);
      setupNavigatorSW({
        ready: Promise.resolve({ unregister: mockUnregister }),
      });
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: { get: () => 'text/html' }, // não é JS
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await flushPromises();

      expect(mockUnregister).toHaveBeenCalledTimes(1);
      expect(window.location.reload).toHaveBeenCalledTimes(1);
    });

    test('chama registerValidSW quando fetch retorna response válida', async () => {
      const sw = setupNavigatorSW({
        register: jest.fn().mockResolvedValue({ installing: null }),
      });
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: { get: () => 'application/javascript' },
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await flushPromises();

      expect(sw.register).toHaveBeenCalledWith('/service-worker.js');
    });

    test('loga mensagem offline quando fetch falha', async () => {
      setupNavigatorSW();
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      await flushPromises();

      expect(console.log).toHaveBeenCalledWith(
        'No internet connection found. App is running in offline mode.'
      );
    });
  });

  // ===================================================================
  // isLocalhost — variações de hostname
  // ===================================================================

  describe('isLocalhost — variações de hostname', () => {
    const expectLocalhost = (hostname) => {
      setLocation(hostname);
      setupNavigatorSW();
      global.fetch = jest.fn().mockResolvedValue({
        status: 200,
        headers: { get: () => 'application/javascript' },
      });

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      // No caminho localhost, fetch é chamado (checkValidServiceWorker)
      // No caminho não-localhost, navigator.serviceWorker.register é chamado diretamente
      expect(fetch).toHaveBeenCalled();
    };

    const expectNotLocalhost = (hostname) => {
      setLocation(hostname);
      const sw = setupNavigatorSW();

      const { register } = require('../serviceWorker');
      register({});
      triggerLoad();

      // No caminho não-localhost, chama registerValidSW diretamente (sem fetch)
      expect(global.fetch).not.toHaveBeenCalled();
      expect(sw.register).toHaveBeenCalled();
    };

    test('reconhece "localhost" como localhost', () => {
      expectLocalhost('localhost');
    });

    test('reconhece "[::1]" (IPv6 loopback) como localhost', () => {
      expectLocalhost('[::1]');
    });

    test('reconhece "127.0.0.1" como localhost', () => {
      expectLocalhost('127.0.0.1');
    });

    test('reconhece "127.255.255.255" como localhost', () => {
      expectLocalhost('127.255.255.255');
    });

    test('não reconhece "192.168.1.1" como localhost', () => {
      expectNotLocalhost('192.168.1.1');
    });

    test('não reconhece "example.com" como localhost', () => {
      expectNotLocalhost('example.com');
    });
  });
});

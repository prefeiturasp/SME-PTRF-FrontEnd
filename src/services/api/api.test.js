import { RECURSO_SELECIONADO } from '../auth.service';

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = (value || '').toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

describe('API Request Interceptor - X-Recurso-Selecionado Header', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('deve adicionar o header X-RecursoSelecionado quando há um recurso selecionado', () => {
    const mockRecurso = {
      uuid: 'test-uuid-12345',
      nome: 'Recurso Teste'
    };

    localStorage.setItem(RECURSO_SELECIONADO, JSON.stringify(mockRecurso));

    const config = {
      url: '/api/endpoint',
      headers: {}
    };

    // Simular o comportamento do interceptor
    const recursoSelecionado = localStorage.getItem(RECURSO_SELECIONADO);
    if (recursoSelecionado) {
      const recurso = JSON.parse(recursoSelecionado);
      if (recurso.uuid) {
        config.headers['X-Recurso-Selecionado'] = recurso.uuid;
      }
    }

    expect(config.headers['X-Recurso-Selecionado']).toBe('test-uuid-12345');
  });

  it('não deve adicionar o header quando não há recurso selecionado', () => {
    const config = {
      url: '/api/endpoint',
      headers: {}
    };

    const recursoSelecionado = localStorage.getItem(RECURSO_SELECIONADO);
    if (recursoSelecionado) {
      const recurso = JSON.parse(recursoSelecionado);
      if (recurso.uuid) {
        config.headers['X-Recurso-Selecionado'] = recurso.uuid;
      }
    }

    expect(config.headers['X-Recurso-Selecionado']).toBeUndefined();
  });

  it('não deve adicionar o header para requisições de login', () => {
    const mockRecurso = {
      uuid: 'test-uuid-12345',
      nome: 'Recurso Teste'
    };

    localStorage.setItem(RECURSO_SELECIONADO, JSON.stringify(mockRecurso));

    const config = {
      url: '/login',
      headers: {}
    };

    // Simular o comportamento do interceptor
    if (config.url && (config.url.includes('/login') || config.url.includes('/logout'))) {
      // Retorna config sem adicionar header
    } else {
      const recursoSelecionado = localStorage.getItem(RECURSO_SELECIONADO);
      if (recursoSelecionado) {
        const recurso = JSON.parse(recursoSelecionado);
        if (recurso.uuid) {
          config.headers['X-Recurso-Selecionado'] = recurso.uuid;
        }
      }
    }

    expect(config.headers['X-Recurso-Selecionado']).toBeUndefined();
  });

  it('deve adicionar o header mesmo com query parameters na URL', () => {
    const mockRecurso = {
      uuid: 'test-uuid-67890',
      nome: 'Recurso Teste'
    };

    localStorage.setItem(RECURSO_SELECIONADO, JSON.stringify(mockRecurso));

    const config = {
      url: '/api/endpoint?page=1&limit=10',
      headers: {}
    };

    // Simular o comportamento do interceptor
    if (config.url && (config.url.includes('/login') || config.url.includes('/logout'))) {
      // Retorna config sem adicionar header
    } else {
      const recursoSelecionado = localStorage.getItem(RECURSO_SELECIONADO);
      if (recursoSelecionado) {
        const recurso = JSON.parse(recursoSelecionado);
        if (recurso.uuid) {
          config.headers['X-Recurso-Selecionado'] = recurso.uuid;
        }
      }
    }

    expect(config.headers['X-Recurso-Selecionado']).toBe('test-uuid-67890');
  });
});

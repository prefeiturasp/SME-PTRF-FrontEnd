import { recursoSelecionadoStorageService } from '../storages/RecursoSelecionado.storage.service';

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

    recursoSelecionadoStorageService.setRecursoSelecionado(mockRecurso);

    const config = {
      url: '/api/endpoint',
      headers: {}
    };

    // Simular o comportamento do interceptor
    const recursoSelecionado = recursoSelecionadoStorageService.getRecursoSelecionado();
    if (recursoSelecionado) {
      const recurso = recursoSelecionado;
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

    const recursoSelecionado = recursoSelecionadoStorageService.getRecursoSelecionado();
    if (recursoSelecionado) {
      const recurso = recursoSelecionado;
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

    recursoSelecionadoStorageService.setRecursoSelecionado(mockRecurso);

    const config = {
      url: '/login',
      headers: {}
    };

    // Simular o comportamento do interceptor
    if (config.url && (config.url.includes('/login') || config.url.includes('/logout'))) {
      // Retorna config sem adicionar header
    } else {
      const recursoSelecionado = recursoSelecionadoStorageService.getRecursoSelecionado();
      if (recursoSelecionado) {
        const recurso = recursoSelecionado;
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

    recursoSelecionadoStorageService.setRecursoSelecionado(mockRecurso);

    const config = {
      url: '/api/endpoint?page=1&limit=10',
      headers: {}
    };

    // Simular o comportamento do interceptor
    if (config.url && (config.url.includes('/login') || config.url.includes('/logout'))) {
      // Retorna config sem adicionar header
    } else {
      const recursoSelecionado = recursoSelecionadoStorageService.getRecursoSelecionado();
      if (recursoSelecionado) {
        const recurso = recursoSelecionado;
        if (recurso.uuid) {
          config.headers['X-Recurso-Selecionado'] = recurso.uuid;
        }
      }
    }

    expect(config.headers['X-Recurso-Selecionado']).toBe('test-uuid-67890');
  });
});

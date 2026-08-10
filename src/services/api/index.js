import axios from 'axios'
import { recursoSelecionadoStorageService } from '../storages/RecursoSelecionado.storage.service';

let API_URL = "API_URL_REPLACE_ME";

if (process.env.REACT_APP_NODE_ENV === "local") {
  API_URL = process.env.REACT_APP_API_URL;
}

const Api = axios.create({
  baseURL: API_URL
});

// auth.service importa api, então api não pode importar auth.service diretamente.
// O handler é registrado em runtime (auth.service chama registerUnauthorizedHandler(logout)
// no nível do módulo) resolvendo a dependência circular sem acoplamento em tempo de importação.
let unauthorizedHandler = null;

export const registerUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

// Interceptor para adicionar uuid do recurso selecionado como header
Api.interceptors.request.use(
  (config) => {
    // Não adiciona header para requisições de login/logout
    if (config.url && (config.url.includes('/login') || config.url.includes('/logout'))) {
      return config;
    }

    const recursoSelecionado = recursoSelecionadoStorageService.getRecursoSelecionado();

    if (recursoSelecionado) {
      try {
        const recurso = recursoSelecionado;
        if (recurso.uuid) {
          config.headers['X-Recurso-Selecionado'] = recurso.uuid;
        }
      } catch (error) {
        console.warn('Erro ao processar recurso selecionado:', error);
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// isRefreshing evita que múltiplas requisições simultâneas com token expirado
// disparem múltiplos POSTs em /api/token/refresh. A fila acumula as demais
// enquanto o refresh está em andamento e as resolve/rejeita em bloco ao final.
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  failedQueue = [];
};

const callUnauthorizedHandler = () => {
  if (unauthorizedHandler) unauthorizedHandler();
  else window.location.assign('/login');
};

const enqueueRequest = (originalRequest) =>
  new Promise((resolve, reject) => {
    failedQueue.push({ resolve, reject });
  }).then((token) => {
    originalRequest.headers['Authorization'] = `JWT ${token}`;
    return Api(originalRequest);
  });

Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // POST /login com credenciais erradas retorna 401 — não deve acionar refresh.
    // GET demais rotas autenticadas devem tentar refresh normalmente.
    // token/refresh falhando com 401 significa refresh expirado — não deve recursar.
    // _retry impede loop infinito caso o novo token também retorne 401.
    const isAuthEndpoint =
      (originalRequest?.url?.includes('/login') && originalRequest?.method?.toLowerCase() === 'post') ||
      originalRequest?.url?.includes('token/refresh');

    if (error.response?.status !== 401 || isAuthEndpoint || originalRequest?._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return enqueueRequest(originalRequest);
    }

    originalRequest._retry = true;
    isRefreshing = true;

    const refresh = localStorage.getItem('REFRESH_TOKEN');

    if (!refresh) {
      // Sem refresh token armazenado: sessão inválida, força novo login.
      isRefreshing = false;
      callUnauthorizedHandler();
      return Promise.reject(error);
    }

    try {
      const { data } = await Api.post('api/token/refresh', { refresh });
      const newToken = data.access;
      localStorage.setItem('TOKEN', newToken);
      Api.defaults.headers.common['Authorization'] = `JWT ${newToken}`;
      originalRequest.headers['Authorization'] = `JWT ${newToken}`;
      processQueue(null, newToken);
      return Api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);
      callUnauthorizedHandler();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default Api

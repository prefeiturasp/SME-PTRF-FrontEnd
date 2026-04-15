import axios from 'axios'
import { recursoSelecionadoStorageService } from '../storages/RecursoSelecionado.storage.service';

let API_URL = "API_URL_REPLACE_ME";

if (process.env.REACT_APP_NODE_ENV === "local") {
  API_URL = process.env.REACT_APP_API_URL;
}

const Api = axios.create({
  baseURL: API_URL
});

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

export default Api
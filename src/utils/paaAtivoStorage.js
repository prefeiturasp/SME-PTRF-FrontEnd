import { visoesService } from "../services/visoes.service";
import { FEATURE_FLAGS } from "../constantes/featureFlags";

const CHAVE_UUID = "PAA";
const CHAVE_DADOS = "DADOS_PAA";

const armazenamento = () => visoesService.featureFlagAtiva(FEATURE_FLAGS.PAA_PROXIMA_VIGENCIA)
  ? window.sessionStorage
  : window.localStorage;

// Uuid do PAA ativo na aba, ou null
export const getPaaAtivoUuid = () => armazenamento().getItem(CHAVE_UUID);

// Dados do PAA ativo guardados ao abri-lo, ou null
export const getDadosPaaAtivo = () => {
  try {
    return JSON.parse(armazenamento().getItem(CHAVE_DADOS));
  } catch {
    return null;
  }
};

// Define o PAA ativo da aba, substituindo por completo o anterior (uuid e dados).
export const gravarPaaAtivo = (paa) => {
  armazenamento().setItem(CHAVE_UUID, paa.uuid);
  armazenamento().setItem(CHAVE_DADOS, JSON.stringify(paa));
};

// Esquece o PAA ativo da aba (e as chaves antigas do `localStorage`, que não são mais usadas).
export const limparPaaAtivo = () => {
  [CHAVE_UUID, CHAVE_DADOS].forEach((chave) => {
    window.localStorage.removeItem(chave);
    window.sessionStorage.removeItem(chave);
  });
};
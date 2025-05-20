import { store } from '../index';

const mockEqualTo = {
    "DadosAssociacao": {},
    "DetalharAcertos": {
        "lancamentos_para_acertos": [],
    },
    "DetalharAcertosDocumentos": {
        "documentos": [],
    },
    "Modal": {
        "open": false,
        "options": {
            "children": <></>,
        },
    },
    "PendenciaCadastro": {
        "popTo": "",
    }
}
describe('Redux Store', () => {
  it('deve inicializar com o estado padrão', () => {
    const state = store.getState();
    expect(state).toEqual(mockEqualTo);
  });

});
import {combineReducers} from "redux";
import {DetalharAcertos} from "./componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/reducer";
import {DetalharAcertosDocumentos} from "./componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/DetalharAcertosDocumentos/reducer";

export const reducers = combineReducers({
    DetalharAcertos,
    DetalharAcertosDocumentos,
})
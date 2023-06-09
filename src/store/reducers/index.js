import {combineReducers} from "redux";
import {DetalharAcertos} from "./componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeLancamentos/DetalharAcertos/reducer";
import {DetalharAcertosDocumentos} from "./componentes/dres/PrestacaoDeContas/DetalhePrestacaoDeContas/ConferenciaDeDocumentos/DetalharAcertosDocumentos/reducer";
import {DadosAssociacao} from "./componentes/escolas/Associacao/DadosAssociacao/StatusCadastro/reducer";

export const reducers = combineReducers({
    DetalharAcertos,
    DetalharAcertosDocumentos,
    DadosAssociacao
})
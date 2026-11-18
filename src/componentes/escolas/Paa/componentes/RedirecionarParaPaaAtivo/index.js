import { Navigate } from "react-router-dom";
import { getPaaAtivoUuid } from "../../../../../utils/paaAtivoStorage";
import { rotaElaboracaoPaa } from "../../ElaboracaoPaa/utils/rotasPaa";

// Rota antiga, sem uuid: leva ao PAA ativo da aba, ou à escolha do PAA quando não há um.
export const RedirecionarParaPaaAtivo = () => {
  const paaUuid = getPaaAtivoUuid();
  return <Navigate to={paaUuid ? rotaElaboracaoPaa(paaUuid) : "/paa"} replace />;
};
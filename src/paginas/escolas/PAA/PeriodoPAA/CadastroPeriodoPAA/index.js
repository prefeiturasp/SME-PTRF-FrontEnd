import {PaginasContainer} from "../../../../PaginasContainer";
import { PeriodoPAAForm } from "../../../../../componentes/sme/Parametrizacoes/PAA/PeriodosPaa/PeriodoPAAForm";

export const CadastroPeriodoPAAPage = props => {
    return (
        <PaginasContainer>
            <h1 className="titulo-itens-painel mt-5">Adicionar Período PAA</h1>
            <div className="page-content-inner ">
                <PeriodoPAAForm {...props}/>
            </div>
        </PaginasContainer>

    );
}
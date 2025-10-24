import { AcoesPTRFPaaProvider } from "./context/index";

import { PaginasContainer } from "../../../../../paginas/PaginasContainer";
import { Tabela } from "./Tabela";

export const AcoesPTRFPaa = () => {
    
    return (
        <AcoesPTRFPaaProvider>
            <PaginasContainer>
                <h1 className="titulo-itens-painel mt-5">Receitas previstas das Ações PTRF</h1>
                <div className="page-content-inner">
                    <Tabela/>
                </div>
            </PaginasContainer>
        </AcoesPTRFPaaProvider>   
    )
}
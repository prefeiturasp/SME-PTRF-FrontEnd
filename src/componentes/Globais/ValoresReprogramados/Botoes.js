import React from "react";

export const Botoes = ({handleSalvarValoresReprogramados, handleConcluirValoresReprogramados, handleVoltar, permiteSalvarOuConcluir}) => {
    return(
        <>
            <div className="row">
                <div className='col-12 d-flex justify-content-end pt-3'>
                    <button 
                        type="button" 
                        className="btn btn-outline-success mr-2"
                        onClick={handleVoltar}
                    >
                        <strong>Voltar</strong>
                    </button>

                    <button 
                        type="button" 
                        onClick={handleSalvarValoresReprogramados} 
                        className="btn btn-outline-success mr-2"
                        disabled={!permiteSalvarOuConcluir()}
                    >
                        <strong>Salvar</strong>
                    </button>

                    <button 
                        type="button" 
                        className="btn btn-success mr-2"
                        onClick={handleConcluirValoresReprogramados}
                        disabled={!permiteSalvarOuConcluir()}
                    >
                        <strong>Concluir</strong>
                    </button>
                </div>
            </div>
        </>
    )
}
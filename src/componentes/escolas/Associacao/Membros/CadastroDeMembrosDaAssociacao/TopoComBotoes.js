import React from "react";

export const TopoComBotoes = ({onSubmitEditarMembro, visoesService, btnSalvarReadOnly, cpfJaUsado, redirectListaDeMembrosDaAssociacao}) => {

    return (
        <>
            <div className="d-flex bd-highlight align-items-center">
                <div className="p-2 flex-grow-1 bd-highlight">
                    <h5 className="titulo-explicativo mb-0">Editar Membros</h5>
                </div>
                <div className="p-2 bd-highlight">
                    <button
                        onClick={()=>redirectListaDeMembrosDaAssociacao()}
                        className="btn btn btn-outline-success"
                    >
                        Voltar
                    </button>
                </div>
                <div className="p-2 bd-highlight">
                    <button
                        disabled={cpfJaUsado || btnSalvarReadOnly || !visoesService.getPermissoes(['change_associacao'])}
                        onClick={onSubmitEditarMembro}
                        className="btn btn btn-success"
                    >
                        Salvar
                    </button>
                </div>
            </div>

        </>
    );
};

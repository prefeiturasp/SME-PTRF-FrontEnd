import React from "react";
import { useNavigate } from 'react-router-dom';

export const TopoComBotao = () => {
    let navigate = useNavigate();

    return (
        <>
            <section className="row">
                <section className="col-8">
                    <h2 className="mt-2 barra-topo-adicionar-unidades">Adicionar Unidades</h2>
                </section>

                <section className="col-4">
                    <div className="d-flex">
                        <div className="ml-auto bd-highlight">
                            <button
                                onClick={() => {
                                    navigate(-1)
                                }}
                                className="btn btn btn-outline-success"
                            >
                                Voltar
                            </button>
                        </div>
                    </div>
                </section>
            </section>
        </>
    )
}
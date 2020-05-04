import React from "react";

export const PeriodoConta = ({periodoConta, handleChangePeriodoConta, statusPrestacaoConta}) => {

        return(
            <>
            <form id="periodo_conta">
                <div className="row pt-4">
                    <div className="col-md-12 col-lg-7 col-xl-5 mb-md-2">
                        <div className="row">
                            <div className="col-12 col-sm-5 col-md-3 mt-2 pr-0 mr-xl-n3 mr-lg-n2">
                                <label htmlFor="periodo" className="">Período:</label>
                            </div>
                            <div className="col-12 col-sm-7 col-md-9 pl-0">
                                <select
                                    value={periodoConta.periodo}
                                    onChange={(e) => handleChangePeriodoConta(e.target.name, e.target.value)}
                                    name="periodo"
                                    id="periodo"
                                    className="form-control"
                                >
                                    <option value="">Escolha um período</option>
                                    <option value="laranja">Laranja</option>
                                    <option value="limao">Limão</option>
                                    <option value="coco">Coco</option>
                                    <option value="manga">Manga</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-12 col-lg-5 col-xl-4 offset-xl-3">

                        <div className="row">
                            <div className="col-12 col-sm-5 col-md-3 mt-2 pr-0">
                                <label htmlFor="conta" className="">Conta:</label>
                            </div>
                            <div className="col-12 col-sm-7 col-md-9 pl-0">
                                <select
                                    value={periodoConta.conta}
                                    onChange={(e) => handleChangePeriodoConta(e.target.name, e.target.value)}
                                    name="conta"
                                    id="conta"
                                    className="form-control"
                                >
                                    <option value="">Selecione uma conta</option>
                                    <option value="laranja">Laranja</option>
                                    <option value="limao">Limão</option>
                                    <option value="coco">Coco</option>
                                    <option value="manga">Manga</option>
                                </select>
                            </div>

                        </div>
                    </div>
                </div>
            </form>

            {statusPrestacaoConta && (
                <div className='row mt-5'>

                    <div className="col-12 col-md-8">
                        <p><strong>Última conciliação feita em 22/03/2020 10:45</strong></p>
                    </div>

                    <div className="col-12 col-md-4 text-right">
                        <button type="button" className="btn btn btn-success">Iniciar a prestação de contas</button>
                    </div>
                </div>
            )}

        </>

        )
}
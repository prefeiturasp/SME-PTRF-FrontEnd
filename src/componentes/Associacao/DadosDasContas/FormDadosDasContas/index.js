import React from "react";

export const FormDadosDasContas = () =>{
    return(
        <>
            <form>
                <div className="row">
                    <div className='col-12 col-md-3'>
                        <div className="form-group">
                            <label htmlFor="tipo_conta">Email address</label>
                            <input
                                name="tipo_conta"
                                value="tipo_conta"
                                type="text"
                                id="tipo_conta"
                                className="form-control"

                            />
                        </div>
                    </div>
                    <div className='col-12 col-md-3'>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                    </div>
                    <div className='col-12 col-md-3'>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                    </div>
                    <div className='col-12 col-md-3'>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address</label>
                            <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp"/>
                        </div>
                    </div>
                </div>

                <div className="d-flex  justify-content-end pb-3 mt-3">
                    <button type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar</button>
                    <button type="button" className="btn btn-success mt-2">Salvar</button>
                </div>
            </form>
        </>
    )
};
import React from "react";

export const PrestacaoDeContas = () => {

    return (

        <form>


            <div className="row">
                <div className="col-sm-12 col-md-6 col-lg-4">
                    <div className="row">
                    <div className="col-12 col-md-3 mt-2 pr-0">
                        <label htmlFor="inputPassword" className="">Período:</label>
                    </div>
                    <div className="col-12 col-md-9 pl-0">
                        <select id="inputState" className="form-control">
                        <option>Choose...</option>
                        <option>...</option>
                        </select>
                    </div>
                    </div>
                </div>
                <div className="col-12 col-md-5 col-lg-4 offset-md-2 offset-md-4">
                    <label htmlFor="inputPassword" className="col-12 col-md-3 col-form-label pr-0 label-select-superior">Período:</label>
                    <select id="inputState" className="form-control w-75 float-md-right">
                    <option>Choose...</option>
                    <option>...</option>
                </select>
                </div>
            </div>
        </form>


    )
}
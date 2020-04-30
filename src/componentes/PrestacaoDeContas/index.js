import React from "react";

export const PrestacaoDeContas = () => {

    return (

        <form>


            <div className="row">
                <div className="col-md-12 col-lg-7 col-xl-5 mb-md-2">
                    <div className="row">
                        <div className="col-12 col-sm-5 col-md-3 mt-2 pr-0">
                            <label htmlFor="inputPassword" className="">Período:</label>
                        </div>
                        <div className="col-12 col-sm-7 col-md-9 pl-0">
                            <select id="inputState" className="form-control">
                            <option>Choose...</option>
                            <option>...</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-md-12 col-lg-5 col-xl-4 offset-xl-3">

                    <div className="row">
                        <div className="col-12 col-sm-5 col-md-3 mt-2 pr-0">
                            <label htmlFor="inputPassword" className="">Período:</label>
                        </div>
                        <div className="col-12 col-sm-7 col-md-9 pl-0">
                            <select id="inputState" className="form-control">
                                <option>Choose...</option>
                                <option>...</option>
                            </select>
                        </div>

                    </div>
                </div>
            </div>
        </form>


    )
}
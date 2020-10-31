import React from "react";
import {exibeDataPT_BR} from "../../../utils/ValidacoesAdicionaisFormularios";

export const SelectConta = ({contas, contaEscolhida, handleChangeContas}) =>{
    return(

        <div className="row justify-content-between pt-4">
            <div className="col-md-12 col-lg-7 col-xl-5 mb-md-2">
                <div className="row">
                    <div className="col-12 col-sm-5 col-md-3 mt-2 pr-0 mr-xl-n3 mr-lg-n2">
                        <label htmlFor="conta" className="">Conta:</label>
                    </div>
                    <div className="col-12 col-sm-7 col-md-9 pl-0">

{/*                        <select name="conta" id="conta" className="form-control">
                            <option value="">Selecione uma conta</option>
                            <option value="aca9f879-f86e-4446-974e-d0b4fa0cb2b4">Cartão</option>
                            <option value="2fb97e3f-cccf-4843-b2fd-ef396b18e6b9">Cheque</option>
                        </select>*/}

                        <select
                            value={contaEscolhida}
                            onChange={(e) => handleChangeContas(e.target.value)}
                            name="contaEscolhida"
                            id="contaEscolhida"
                            className="form-control"
                        >
                            <option value="">Selecione uma conta</option>
                            <option value="aca9f879-f86e-4446-974e-d0b4fa0cb2b4">Cartão</option>
                            <option value="2fb97e3f-cccf-4843-b2fd-ef396b18e6b9">Cheque</option>
                            {/*{contas && contas.map((conta)=>
                                <option key={conta.uuid} value={conta.uuid}>{conta.nome}</option>
                            )}*/}
                        </select>
                    </div>
                </div>
            </div>
            <div className='col text-right'>
                <button className='btn btn btn btn-success mr-0 mb-2 ml-md-2 mt-2'>Ver relatórios</button>
            </div>
        </div>
    )
};
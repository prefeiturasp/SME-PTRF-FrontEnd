import React, {useState} from "react";
import {filtrosAvancadosRateios} from "../../../services/RateiosDespesas.service";

export const DadosDaAsssociacao = () => {

    const initialState = {
        nome_associacao : "",
        cod_eol_unidade_escolar: "",
        dre: "",
        cnpj: "",
        presidente_apm: "",
        presidente_conselho: "",
    }

    const [state, setState] = useState(initialState);

    const handleSubmit = async (event) => {
        event.preventDefault();

        console.log("nome_associacao ", state.nome_associacao)
        console.log("cod_eol_unidade_escolar ", state.cod_eol_unidade_escolar)
        console.log("dre ", state.dre)
        console.log("cnpj ", state.cnpj)
        console.log("presidente_apm ", state.presidente_apm)
        console.log("presidente_conselho ", state.presidente_conselho)
    }

    const handleChange = (name, value) => {
        setState({
            ...state,
            [name]: value
        });
    }

    return (
        <div className="row">
            <div className="col-12">
                <form onSubmit={handleSubmit}>
                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="nome_associacao"><strong>Nome da Associação</strong></label>
                            <input value={state.nome_associacao} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="nome_associacao" id="nome_associacao" type="text" className="form-control" />
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="cod_eol_unidade_escolar"><strong>Código EOL da Unidade Escolar</strong></label>
                            <input value={state.cod_eol_unidade_escolar} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="cod_eol_unidade_escolar" id="cod_eol_unidade_escolar" type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="dre"><strong>Diretoria Regional de Educação</strong></label>
                            <input value={state.dre} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="dre" id="dre" type="text" className="form-control" />
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="cnpj"><strong>Número do CNPJ</strong></label>
                            <input value={state.cnpj} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="cnpj" id="cnpj" type="text" className="form-control" />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group col-md-6">
                            <label htmlFor="presidente_apm"><strong>Presidente da APM</strong></label>
                            <input value={state.presidente_apm} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="presidente_apm" id="presidente_apm" type="text" className="form-control" />
                        </div>

                        <div className="form-group col-md-6">
                            <label htmlFor="presidente_conselho"><strong>Presidente do Conselho Fiscal</strong></label>
                            <input value={state.presidente_conselho} onChange={(e)=>handleChange(e.target.name, e.target.value)} name="presidente_conselho" id="presidente_conselho" type="text" className="form-control" />
                        </div>
                    </div>
                    <div className="d-flex  justify-content-end pb-3">
                        <button type="reset" className="btn btn btn-outline-success mt-2 mr-2">Cancelar </button>
                        <button type="submit" className="btn btn-success mt-2 ml-2">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}
import React from "react";

export const DadosDoGastoNaoCusteio = (propriedades) => {

    const {dadosDoGastoNao, setDadosDoGastoNao, handleChangeAtualizacaoCadastral} = propriedades

    return (
        <>
            <div className="col-12 col-md-6 mt-4">
                <label htmlFor="tipoCusteio">Tipo de custeio</label>
                <select
                    value={dadosDoGastoNao.tipoCusteio}
                    //onChange={(e)=>setDadosDoGastoNao({tipoCusteio: e.target.value})}
                    onChange={(e) => handleChangeAtualizacaoCadastral(e.target.name, e.target.value)}

                    name='tipoCusteio'
                    id='tipoCusteio'
                    className="form-control"
                >
                    <option value="tipo_custeio_01">Tipo de Custeio 01</option>
                    <option value="tipo_custeio_02">Tipo de Custeio 02</option>
                </select>
            </div>

            <div className="col-12 mt-4">
                <label htmlFor="valorRecursoAcoes">Especificação do material ou serviço</label>
                <select
                    //value={props.values.dadosDoGasto}
                    //onChange={props.handleChange}
                    //onBlur={props.handleBlur}
                    //name='dadosDoGasto'
                    //id='dadosDoGasto'
                    className="form-control"
                >

                    <option value="capital">Serviço</option>
                    <option value="custeio">Mão de obra</option>
                </select>
            </div>

            <div className="col-12 col-md-6 mt-4">
                <label htmlFor="valorRecursoAcoes">Ação</label>
                <select
                    //value={props.values.dadosDoGasto}
                    //onChange={props.handleChange}
                    //onBlur={props.handleBlur}
                    //name='dadosDoGasto'
                    //id='dadosDoGasto'
                    className="form-control"
                >
                    <option value="0">Selecione uma ação</option>
                    <option value="capital">Capital</option>
                    <option value="custeio">Custeio</option>
                </select>
            </div>

            <div className="col-12 col-md-6 mt-4">
                <div className='row'>

                    <div className="col-12 col-md-6">
                        <label htmlFor="valorRecursoAcoes">Tipo de conta utilizada</label>
                        <select
                            //value={props.values.dadosDoGasto}
                            //onChange={props.handleChange}
                            //onBlur={props.handleBlur}
                            //name='dadosDoGasto'
                            //id='dadosDoGasto'
                            className="form-control"
                        >
                            <option value="capital">Conta cheque</option>
                            <option value="custeio">Conta Banco</option>
                        </select>
                    </div>

                    <div className="col-12 col-md-6">
                        <label htmlFor="razaoSocial">Valor do custeio</label>
                        <input
                            className="form-control"
                            //value={props.values.razaoSocial}
                            // onChange={props.handleChange}
                            //onBlur={props.handleBlur}
                            //name="razaoSocial" id="razaoSocial" type="text" className="form-control"
                            placeholder="Escreva o valor total"/>
                    </div>

                </div>

            </div>

        </>

    );
}
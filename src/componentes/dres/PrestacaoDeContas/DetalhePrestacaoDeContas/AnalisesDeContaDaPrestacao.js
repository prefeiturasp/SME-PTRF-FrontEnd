import React from "react";

export const AnalisesDeContaDaPrestacao = ({infoAta, analisesDeContaDaPrestacao, handleChangeAnalisesDeContaDaPrestacao}) => {
    console.log("XXXXXXXXXXXXXXXXXXXXXX ", analisesDeContaDaPrestacao)
    return (
        <>
            <h1>AnalisesDeContaDaPrestacao</h1>
            <form>
                <input value={infoAta.conta} name='conta_associacao' type='hidden'/>
                <div className="form-group">
                    <label htmlFor="data_extrato">Data</label>
                    <input name='data_extrato' type="date" className="form-control" />
                </div>
                <div className="form-group">
                    <label htmlFor="saldo_extrato">Password</label>
                    <input name='saldo_extrato' type="number" className="form-control" />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </>
    )
};
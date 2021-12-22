import React, {useEffect, useState} from "react";
import {getAnosAnaliseRegularidade} from "../../../services/dres/Associacoes.service";

export const SelecaoAnoAnaliseRegularidade = ({handleChangeAnoSelected}) =>{

    const [anosAnaliseRegularidade, setAnosAnaliseRegularidade] = useState({});
    const [anoSelected, setAnoSelected] = useState(null);
    const anoVigente = new Date().getFullYear()

    useEffect(() => {
        buscaAnosAnaliseRegularidade();
    }, []);

    const buscaAnosAnaliseRegularidade = async () => {
        let anosAnaliseRegularidade = await getAnosAnaliseRegularidade();
        anosAnaliseRegularidade = anosAnaliseRegularidade.filter(obj => obj.ano !== anoVigente)
        setAnosAnaliseRegularidade(anosAnaliseRegularidade);
        if (anosAnaliseRegularidade && anosAnaliseRegularidade.length > 0 && !anoSelected) {
            selecionaAno(anosAnaliseRegularidade[0].ano)
        }
    };

    const selecionaAno = (ano) => {
        setAnoSelected(ano)
        handleChangeAnoSelected(ano)
    }

    return(
        <>
            <div className="row">
                <div className="col-md-6">
                    <label htmlFor="ano">Selecione o ano</label>
                    <select
                        value={anoSelected}
                        onChange={(e) => selecionaAno(e.target.value)}
                        name="ano"
                        id="ano"
                        className="form-control"
                    >
                        {anosAnaliseRegularidade && anosAnaliseRegularidade.length > 0 && anosAnaliseRegularidade.map(item => (
                            <option key={item.ano} value={item.ano}>{item.ano}</option>
                        ))}
                    </select>
                </div>
            </div>
        </>
    );
};
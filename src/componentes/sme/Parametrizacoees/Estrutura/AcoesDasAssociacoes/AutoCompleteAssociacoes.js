import React, { useState, memo } from 'react';
import { AutoComplete } from 'primereact/autocomplete';

const AutoCompleteAssociacoes = ({todasAsAcoesAutoComplete}) => {
    const [selectedAcao, setSelectedAcao] = useState(null);
    const [filteredAcoes, setFilteredAcoes] = useState(null);

    console.log("AUTOCOMPLETE todasAsAcoesAutoComplete ", todasAsAcoesAutoComplete);

    const searchAcao = (event) => {
        setTimeout(() => {
            let filteredAcoes;
            if (!event.query.trim().length) {
                filteredAcoes = [...todasAsAcoesAutoComplete];
            }
            else {
                filteredAcoes = todasAsAcoesAutoComplete.filter((acaoAtiva) =>{
                    return acaoAtiva.associacao.unidade.nome_com_tipo.toLowerCase().includes(event.query.toLowerCase())
                })
            }
            setFilteredAcoes(filteredAcoes);
        }, 250);
    };

    const handleSubmit = () =>{
        console.log("handleSubmit ", selectedAcao)
    };

    return (
        <form>
            <div className="form-group">
                <label htmlFor="selectedAcao">Unidade Educacional</label>
                <div className='row'>
                    <div className='col-11 pr-0'>
                        <AutoComplete
                            value={selectedAcao}
                            name='selectedAcao'
                            inputId='selectedAcao'
                            suggestions={filteredAcoes}
                            completeMethod={searchAcao}
                            field="associacao.unidade.nome_com_tipo"
                            onChange={(e) => setSelectedAcao(e.value)}
                            inputClassName="form-control"
                            style={{width: "100%"}}
                        />
                    </div>
                    <div className='col-1 pl-1'>
                        <button className='btn btn-primary ml-2' onClick={handleSubmit} type='button'>Enviar</button>
                    </div>
                </div>

            </div>


        </form>
    )
};

export default memo(AutoCompleteAssociacoes)
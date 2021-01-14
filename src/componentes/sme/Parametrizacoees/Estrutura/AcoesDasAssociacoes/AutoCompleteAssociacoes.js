import React, {useState, memo} from 'react';
import {AutoComplete} from 'primereact/autocomplete';

const AutoCompleteAssociacoes = ({todasAsAcoesAutoComplete, recebeAcaoAutoComplete}) => {
    const [selectedAcao, setSelectedAcao] = useState(null);
    const [filteredAcoes, setFilteredAcoes] = useState(null);

    console.log("AUTOCOMPLETE todasAsAcoesAutoComplete ", todasAsAcoesAutoComplete);

    const searchAcao = (event) => {
        setTimeout(() => {
            let filteredAcoes;
            if (!event.query.trim().length) {
                filteredAcoes = [...todasAsAcoesAutoComplete];
            } else {
                filteredAcoes = todasAsAcoesAutoComplete.filter((acaoAtiva) => {
                    return acaoAtiva.associacao.unidade.nome_com_tipo.toLowerCase().includes(event.query.toLowerCase())
                })
            }
            setFilteredAcoes(filteredAcoes);
        }, 250);
    };

    return (
        <div className="d-flex bd-highlight">
            <div className="flex-grow-1 bd-highlight">
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
            <div className="bd-highlight">
                <button className='btn btn-primary ml-2' onClick={() => recebeAcaoAutoComplete(selectedAcao)} type='button'>Enviar</button>
            </div>
        </div>
    )
};

export default memo(AutoCompleteAssociacoes)
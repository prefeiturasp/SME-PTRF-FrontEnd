import React, {useState, memo} from 'react';
import {AutoComplete} from 'primereact/autocomplete';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faEdit} from "@fortawesome/free-solid-svg-icons";

const AutoCompleteAssociacoes = ({todasAsAcoesAutoComplete, recebeAcaoAutoComplete}) => {
    const [selectedAcao, setSelectedAcao] = useState(null);
    const [filteredAcoes, setFilteredAcoes] = useState(null);

    //console.log("AUTOCOMPLETE todasAsAcoesAutoComplete ", todasAsAcoesAutoComplete);

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
                    style={{width: "100%", borderLeft:'none'}}
                />
            </div>
            <div className="bd-highlight">
                <button className='btn btn-link ml-0 py-1 px-2 ml-n1 border-top border-right border-bottom' onClick={() => recebeAcaoAutoComplete(selectedAcao)} type='button'>
                    <FontAwesomeIcon
                        style={{fontSize: '20px', marginRight: "0", color: "#42474A"}}
                        icon={faSearch}
                    />
                </button>
            </div>
        </div>
    )
};

export default memo(AutoCompleteAssociacoes)
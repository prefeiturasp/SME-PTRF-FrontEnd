import React, {useState, memo} from 'react';
import {AutoComplete} from 'primereact/autocomplete';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

const GestaoDePerfisFormAutocomplete = ({todasAsAcoesAutoComplete, recebeAcaoAutoComplete, index, setFieldValue, inputAutoCompleteDisabled}) => {
    const [selectedAcao, setSelectedAcao] = useState(null);
    const [filteredAcoes, setFilteredAcoes] = useState(null);

    const searchAcao = (event) => {
        setTimeout(() => {
            let filteredAcoes;
            if (!event.query.trim().length) {
                filteredAcoes = [...todasAsAcoesAutoComplete];
            } else {
                filteredAcoes = todasAsAcoesAutoComplete.filter((acaoAtiva) => {
                    return acaoAtiva.nome.toLowerCase().includes(event.query.toLowerCase())
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
                    name={`unidades_vinculadas[${index}].unidade_vinculada`}
                    inputId='selectedAcao'
                    suggestions={filteredAcoes}
                    completeMethod={searchAcao}
                    field="nome"
                    onChange={(e) => setSelectedAcao(e.value)}
                    inputClassName="form-control"
                    onSelect={(e) => recebeAcaoAutoComplete(e.value, {setFieldValue},`unidades_vinculadas[${index}].unidade_vinculada` )}
                    style={{width: "100%", borderLeft:'none'}}
                    disabled={todasAsAcoesAutoComplete.length < 1 || inputAutoCompleteDisabled}
                    placeholder={todasAsAcoesAutoComplete.length < 1 ? "Não existem unidades para o tipo de unidade selecionada" : ""}
                />
            </div>
            <div className="bd-highlight ml-0 py-1 px-3 ml-n3 border-top border-right border-bottom">
                <FontAwesomeIcon
                    style={{fontSize: '18px', marginRight: "0", color: "#42474A"}}
                    icon={faSearch}
                />
            </div>
        </div>
    )
};

export default memo(GestaoDePerfisFormAutocomplete)
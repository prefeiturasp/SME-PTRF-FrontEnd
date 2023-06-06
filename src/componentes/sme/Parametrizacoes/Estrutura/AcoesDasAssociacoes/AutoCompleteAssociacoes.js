import React, {useState, memo} from 'react';
import {AutoComplete} from 'primereact/autocomplete';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import { Tag } from '../../../../Globais/Tag';

const AutoCompleteAssociacoes = ({todasAsAcoesAutoComplete, recebeAcaoAutoComplete}) => {
    const [selectedAcao, setSelectedAcao] = useState(null);
    const [filteredAcoes, setFilteredAcoes] = useState(null);

    const searchAcao = (event) => {
        setTimeout(() => {
            let filteredAcoes;
            if (!event.query.trim().length) {
                filteredAcoes = [...todasAsAcoesAutoComplete];
            } else {
                filteredAcoes = todasAsAcoesAutoComplete.filter((acaoAtiva) => {
                    return acaoAtiva.unidade.nome_com_tipo.toLowerCase().includes(event.query.toLowerCase())
                })
            }
            setFilteredAcoes(filteredAcoes);
        }, 250);
    };

    const itemTemplate = (item) => {
        if(item.encerrada) {
            return (
                <div className='d-flex' style={{opacity: 0.6}}>
                    <span className='mr-3'>{item.unidade.nome_com_tipo}</span>
                    <Tag label='Associação encerrada'/>
                </div>
            )
        } else {
            return item.unidade.nome_com_tipo;
        }
    };
    
    const handleChange = (e) => {
        if(e.value.encerrada){
            setSelectedAcao(null)
        } else {
            setSelectedAcao(e.value)
        }
    };

    const handleSelect = (e) => {
        if(e.value.encerrada){
            recebeAcaoAutoComplete(null)
        } else {
            recebeAcaoAutoComplete(e.value)
        }        
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
                    field="unidade.nome_com_tipo"
                    onChange={handleChange}
                    inputClassName="form-control"
                    onSelect={handleSelect}
                    style={{width: "100%", borderLeft:'none'}}
                    itemTemplate={itemTemplate}
                />
            </div>
            <div className="bd-highlight ml-0 py-1 px-3 ml-n3 border-top border-right border-bottom">
                {/*<button className='btn btn-link ml-0 py-1 px-2 ml-n1 border-top border-right border-bottom' type='button'>*/}
                    <FontAwesomeIcon
                        style={{fontSize: '18px', marginRight: "0", color: "#42474A"}}
                        icon={faSearch}
                    />
                {/*</button>*/}
            </div>
        </div>
    )
};

export default memo(AutoCompleteAssociacoes)
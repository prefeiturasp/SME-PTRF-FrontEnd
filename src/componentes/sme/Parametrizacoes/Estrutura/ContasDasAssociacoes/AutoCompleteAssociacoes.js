import React, {useState, memo} from 'react';
import {AutoComplete} from 'primereact/autocomplete';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import { Tag } from '../../../../Globais/Tag';


const AutoCompleteAssociacoes = ({todasAsAssociacoesAutoComplete, recebeAutoComplete, disabled = false, loadingAssociacoes = false}) => {
    const [selectedAssociacao, setSelectedAssociacao] = useState(null);
    const [filteredAssociacoes, setFilteredAssociacoes] = useState(null);

    const searchAssociacao = (event) => {
        setTimeout(() => {
            let filteredAssociacoes;
            if (!event.query.trim().length) {
                filteredAssociacoes = [...todasAsAssociacoesAutoComplete];
            } else {
                filteredAssociacoes = todasAsAssociacoesAutoComplete.filter((associacaoAtiva) => {
                    return associacaoAtiva.nome.toLowerCase().includes(event.query.toLowerCase())
                })
            }
            setFilteredAssociacoes(filteredAssociacoes);
        }, 250);
    };

    const itemTemplate = (item) => {
        if(item.encerrada) {
            return (
                <div className='d-flex' style={{opacity: 0.6}}>
                    <span className='mr-3'>{item.nome}</span>
                    <Tag label='Associação encerrada'/>
                </div>
            )
        } else {
            return item.nome;
        }
    };
    
    const handleChange = (e) => {
        if(e.value.encerrada){
            setSelectedAssociacao(null)
        } else {
            setSelectedAssociacao(e.value)
        }
    };

    const handleSelect = (e) => {
        if(e.value.encerrada){
            recebeAutoComplete(null)
        } else {
            recebeAutoComplete(e.value)
        }        
    };

    return (
        <div className="d-flex bd-highlight">
            <div className="flex-grow-1 bd-highlight">
                <AutoComplete
                    value={selectedAssociacao}
                    name='associacao_nome'
                    inputId='associacao_nome'
                    suggestions={filteredAssociacoes}
                    completeMethod={searchAssociacao}
                    field="nome"
                    onChange={handleChange}
                    inputClassName="form-control"
                    onSelect={handleSelect}
                    style={{width: "100%", borderLeft:'none'}}
                    itemTemplate={itemTemplate}
                    disabled={disabled || loadingAssociacoes}
                    placeholder={`${loadingAssociacoes ? "Carregando associações" : ""}`}
                />
            </div>
            <div className="bd-highlight ml-0 py-1 px-3 ml-n3 border-top border-right border-bottom">
                <button className='btn btn-link ml-0 py-1 px-2 ml-n1 border-top border-right border-bottom' type='button'>
                    <FontAwesomeIcon
                        style={{fontSize: '18px', marginRight: "0", color: "#42474A"}}
                        icon={faSearch}
                    />
                </button>
            </div>
        </div>
    )
};

export default memo(AutoCompleteAssociacoes)
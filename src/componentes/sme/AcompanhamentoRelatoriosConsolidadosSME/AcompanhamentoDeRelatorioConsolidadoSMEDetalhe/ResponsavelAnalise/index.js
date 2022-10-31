import React, {useState} from 'react'
import {AutoComplete} from 'primereact/autocomplete';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

export const ResponsavelAnalise = ({selectedResponsavel, todosOsResponsaveisAutoComplete, recebeResponsavelAutoComplete, relatorioConsolidado, formataDataInicioAnalise, disableResponsavelAnalise, handleOnChangeResponsavelAnalise}) => {
    const [filteredResponsaveis, setFilteredResponsaveis] = useState(null);

    const searchResponsavel = (event) => {
        setTimeout(() => {
            let filteredResponsaveis;
            if (!event.query.trim().length) {
                filteredResponsaveis = [...todosOsResponsaveisAutoComplete];
            } else {
                filteredResponsaveis = todosOsResponsaveisAutoComplete.filter((responsavel) => {
                    return responsavel.usuario.toLowerCase().includes(event.query.toLowerCase());
                })
            }
            setFilteredResponsaveis(filteredResponsaveis);
        }, 250);
    };

    return(
        <>
        <div className='row'>
            <div className="col-md-6">
                <label htmlFor='responsavel'><strong>Responsável pela análise:</strong></label>

                <div className="d-flex bd-highlight">
                    <div className="flex-grow-1 bd-highlight">
                        <AutoComplete
                            value={selectedResponsavel}
                            name='selectedResponsavel'
                            inputId='selectedAcao'
                            suggestions={filteredResponsaveis}
                            completeMethod={searchResponsavel}
                            field="usuario"
                            onChange={(e) => {handleOnChangeResponsavelAnalise(e.value)}}
                            inputClassName="form-control"
                            onSelect={(e) => recebeResponsavelAutoComplete(e.value)}
                            style={{width: "100%", borderLeft:'none'}}
                            minLength={3}
                            disabled={disableResponsavelAnalise(relatorioConsolidado)}
                        />
                    </div>
                    <div className={`bd-highlight ml-0 py-1 px-3 ml-n3 border-top border-right border-bottom ${disableResponsavelAnalise(relatorioConsolidado) ? 'disable-lupa-auto-complete' : ''}`}>
                        <FontAwesomeIcon
                            style={{fontSize: '18px', marginRight: "0", color: "#42474A"}}
                            icon={faSearch}
                        />
                    </div>
                </div>
            </div>
            {relatorioConsolidado && relatorioConsolidado.data_de_inicio_da_analise &&
                <div className="col-md-3">
                    <label htmlFor="data_analise"><strong>Início da análise</strong></label>
                        <p className='mt-1 data-inicio-analise'>{formataDataInicioAnalise(relatorioConsolidado.data_de_inicio_da_analise)}</p>
                </div>
            }
        </div>
        </>
    )
};
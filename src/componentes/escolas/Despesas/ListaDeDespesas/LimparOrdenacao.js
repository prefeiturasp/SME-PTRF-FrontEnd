import React from "react";

export const LimparArgumentosOrdenacao = ({limparOrdenacao, camposOrdenacao}) => {

    const isEmpty = !Object.values(camposOrdenacao).some(x => (x !== null && x !== '' && x !== false));

    return(
        <>
            {!isEmpty &&
                <button
                    className='legendas-table text-md-start'
                    onClick={limparOrdenacao}
                    style={{
                        color: '#00585D',
                        outline: 'none',
                        border: 0,
                        background: 'inherit',
                        padding: '4px',
                        marginRight: '5px'
                    }}
                >
                    Limpar ordenação
                </button>
            }
        </>
    )
}
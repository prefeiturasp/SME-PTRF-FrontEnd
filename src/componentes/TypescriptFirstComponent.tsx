import React from "react";

interface Props {
    name: string
}

export const TypescriptFirstComponent : React.FC<Props> = ({name}) => {
    return (
        <div>
            <p><strong>Olá, eu sou um componente escrito em Typescript.</strong></p>
            <p>Recebo uma propriedade string herdada de uma Interface</p>
            <p>A string recebida via props é: <strong>{name}</strong></p>
        </div>
    )
}

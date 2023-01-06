export function Ordinais(numero) {
    const numeroString = numero.toString()
    const numerosPrimarios = [
        'Primeira',
        'Segunda',
        'Terceira',
        'Quarta',
        'Quinta',
        'Sexta',
        'Sétima',
        'Oitava',
        'Nona'
    ]
    const numerosCompostos = [
        "Décima ",
        "Vigésima ",
        'Trigésima ',
        'Quadragésima ',
        'Quinquagésima ',
        'Sexagésima ',
        'Septuagésima ',
        'Octogésima ',
        'Nonagésimo '
    ]
    return numeroString.replace(/\d/g, (match, index, numeroCompleto) => {
        const matchNumber = Number(match)

        if(numeroCompleto.length === 1) {
            return numerosPrimarios[matchNumber]
        }
        return index === 1 ? matchNumber ? numerosPrimarios[matchNumber - 1] : '' : numerosCompostos[matchNumber - 1]
    })
}

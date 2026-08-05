/* Comparação profunda de objetos (detecção de alterações no form). */

export const comparaObjetos = (objetoA, objetoB) =>{

  if (objetoA === null  || objetoB === null ){
    // null é um 'object', mas não é possível se obter keys de um null. Tratamento precisa ser distinto.
    return objetoA === objetoB
  }

  let aChaves = Object.keys(objetoA),
      bChaves = Object.keys(objetoB);

  if (aChaves.length !== bChaves.length) {
    return false;
  }

  let saoDiferentes = aChaves.some((chave) => {
    if (typeof objetoA[chave] == "object" && typeof objetoB[chave] == "object" ){
      return !comparaObjetos(objetoA[chave] , objetoB[chave] )
    }
    else {
      return objetoA[chave] !== objetoB[chave];
    }
  });

  return !saoDiferentes;
}


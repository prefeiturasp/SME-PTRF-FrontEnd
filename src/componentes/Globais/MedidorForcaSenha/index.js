// TODO Métodos que verificam se a senha contém ao menos
//  Uma letra minúscula
//  Uma letra maiúscula
//  As senhas devem ser iguais
//  Não pode conter espaço em branco
//  Não podem conter caracteres acentuados
//  Um número ou símbolo (caracter especial)
//  Deve ter no mínimo 8 e no máximo 12 caracteres

export const medidorForcaSenhaVerifica = (senha, regex=null, id_container_msg, confirmacao_senha=null) =>{

    if (id_container_msg.id === 'senhas_iguais'){

        if (senha === confirmacao_senha) {
            id_container_msg.classList.remove("forca-senha-invalida");
            id_container_msg.classList.add("forca-senha-valida");
            return true
        }else {
            id_container_msg.classList.add("forca-senha-invalida");
            return false
        }

    }else if(id_container_msg.id === 'entre_oito_ate_doze'){

        if (senha && (senha.length > 7 && senha.length <= 12 )){
            id_container_msg.classList.remove("forca-senha-invalida");
            id_container_msg.classList.add("forca-senha-valida");
            return true
        }else {
            id_container_msg.classList.add("forca-senha-invalida");
            return false
        }

    }else if (senha && senha.match(regex) ){
        id_container_msg.classList.remove("forca-senha-invalida");
        id_container_msg.classList.add("forca-senha-valida");
        return true
    }else {
        id_container_msg.classList.add("forca-senha-invalida");
        return false
    }
};

export const MedidorForcaSenha = (values) => {
    let senha = values.senha;
    let confirmacao_senha = values.confirmacao_senha;
    let container;

    let contador_forca_senha = 0;
    let letra_minuscula = document.getElementById("letra_minuscula");
    let letra_maiuscula = document.getElementById("letra_maiuscula");
    let senhas_iguais = document.getElementById("senhas_iguais");
    let espaco_em_branco = document.getElementById("espaco_em_branco");
    let caracteres_acentuados = document.getElementById("caracteres_acentuados");
    let numero_ou_caracter_especial = document.getElementById("numero_ou_caracter_especial");
    let entre_oito_ate_doze = document.getElementById("entre_oito_ate_doze");

    container = medidorForcaSenhaVerifica(senha, /(?=.*[a-z])/, letra_minuscula) ? contador_forca_senha +=1 :"";
    container = medidorForcaSenhaVerifica(senha, /(?=.*[A-Z])/, letra_maiuscula) ? contador_forca_senha +=1 : "";
    container = medidorForcaSenhaVerifica(senha, /^(?!.*[ ]).*$/, espaco_em_branco) ? contador_forca_senha +=1 : "";
    container = medidorForcaSenhaVerifica(senha, /^(?!.*[à-úÀ-Ú]).*$/, caracteres_acentuados) ? contador_forca_senha +=1 : "";
    container = medidorForcaSenhaVerifica(senha, /[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/, numero_ou_caracter_especial) || medidorForcaSenhaVerifica(senha, /[0-9]/, numero_ou_caracter_especial) ? contador_forca_senha +=1 : "";
    container = medidorForcaSenhaVerifica(senha, null, senhas_iguais, confirmacao_senha)  ? contador_forca_senha +=1 : "";
    container = medidorForcaSenhaVerifica(senha, null, entre_oito_ate_doze, null)  ? contador_forca_senha +=1 : "";
    localStorage.setItem("medidorSenha",  contador_forca_senha)

};
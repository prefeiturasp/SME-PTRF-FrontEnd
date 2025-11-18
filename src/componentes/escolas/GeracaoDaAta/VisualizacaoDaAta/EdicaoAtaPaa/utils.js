export const getParecerSelecionado = (pareceres, parecerId) => {
    if (!pareceres || pareceres.length === 0) {
        return null;
    }
    return pareceres.find((parecer) => parecer.id === parecerId) || null;
};

export const isParecerReprovado = (parecer) => {
    if (!parecer) {
        return false;
    }
    const identificador = (parecer.id || "").toUpperCase();
    const nome = (parecer.nome || "").toUpperCase();
    return (
        identificador.includes("REPROV") ||
        identificador.includes("REJEIT") ||
        nome.includes("REPROV")
    );
};

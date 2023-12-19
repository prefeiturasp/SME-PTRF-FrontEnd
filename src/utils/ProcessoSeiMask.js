export const processoSeiMask = (value) => {
    // 0000.0000/0000000-0
    let processo = value.replace(/[^\d]+/g, "");

    let mask = [/\d/, /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, '-', /\d/]

    return mask
}

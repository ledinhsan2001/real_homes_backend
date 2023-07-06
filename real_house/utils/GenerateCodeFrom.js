export const GenerateCodeFrom = (str) => {
    str.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f-,]/g, "")
        .replace(/đ/g, "d")
        .split(" ")
        .join("");
    let string = "";
    for (let i = 0; i < str.length; i++) {
        if (i % 2 == 0) {
            string += str.charAt(i);
        }
    }
    return string;
};

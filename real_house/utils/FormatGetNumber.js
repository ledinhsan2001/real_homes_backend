export const FormatGetNummber = (string) => {
    let number = +string.match(/\d+/);
    if (number) {
        return number;
    }
};

function generateCPF() {
    const randomDigit = () => Math.floor(Math.random() * 10);
    const cpfArray = Array.from({ length: 9 }, randomDigit);
    
    function calculateDigit(arr, factor) {
        const sum = arr.reduce((acc, val, idx) => acc + val * (factor - idx), 0);
        const remainder = sum % 11;
        return remainder < 2 ? 0 : 11 - remainder;
    }
    
    cpfArray.push(calculateDigit(cpfArray, 10));
    
    cpfArray.push(calculateDigit(cpfArray, 11));
    
    const cpfString = cpfArray.join('');
    return cpfString.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}
function generateName(sexo) {
    let pool;

    if (sexo === "Masculino") {
        pool = firstNames.masculino;
    } else if (sexo === "Feminino") {
        pool = firstNames.feminino;
    } else {
        // Indiferente → escolhe de qualquer um
        const all = [...firstNames.masculino, ...firstNames.feminino];
        pool = all;
    }

    const firstName = pool[Math.floor(Math.random() * pool.length)];
    const middleName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];

    return `${firstName} ${middleName} ${lastName}`;
}

function generateBirthDate() {

    const year = 1950 + Math.floor(Math.random() * 56);
    const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0');
    const day = String(1 + Math.floor(Math.random() * 28)).padStart(2, '0');
    
    return `${day}/${month}/${year}`;
}
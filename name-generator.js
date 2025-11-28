function generateName() {

    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    
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
const Generators = {
    // CPF corrigido baseado no seu original
    cpf: () => {
        const n = () => Math.floor(Math.random() * 10);
        let a = Array.from({ length: 9 }, n);
        const calc = (arr, f) => {
            const s = arr.reduce((acc, val, idx) => acc + val * (f - idx), 0);
            const r = s % 11;
            return r < 2 ? 0 : 11 - r;
        };
        a.push(calc(a, 10));
        a.push(calc(a, 11));
        return a.join('').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    },

    cnpj: () => {
        const n = () => Math.floor(Math.random() * 9);
        const calc = (a, w) => {
            const s = a.reduce((acc, v, i) => acc + v * w[i], 0);
            const r = s % 11;
            return r < 2 ? 0 : 11 - r;
        };
        let a = [...Array.from({length: 8}, n), 0, 0, 0, 1];
        a.push(calc(a, [5,4,3,2,9,8,7,6,5,4,3,2]));
        a.push(calc(a, [6,5,4,3,2,9,8,7,6,5,4,3,2]));
        return a.join('').replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
    },

    rg: () => Math.floor(Math.random() * 999999999).toString().padStart(9, '0').replace(/(\d{2})(\d{3})(\d{3})(\d{1})/, '$1.$2.$3-$4'),

    cep: () => `${Math.floor(Math.random() * 89999 + 10000)}-${Math.floor(Math.random() * 899 + 100)}`,

    name: (sexo) => {
        let pool = sexo === "Masculino" ? firstNames.masculino : 
                   sexo === "Feminino" ? firstNames.feminino : 
                   [...firstNames.masculino, ...firstNames.feminino];
        
        const fn = pool[Math.floor(Math.random() * pool.length)];
        const sn1 = lastNames[Math.floor(Math.random() * lastNames.length)];
        const sn2 = lastNames[Math.floor(Math.random() * lastNames.length)];
        return `${fn} ${sn1} ${sn2}`;
    },

    birthDate: () => {
        const d = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
        const m = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
        const y = Math.floor(Math.random() * (2005 - 1960) + 1960);
        return `${d}/${m}/${y}`;
    },
    
    guid: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    getSigno: (data) => {
        const [d, m] = data.split('/').map(Number);
        if ((m == 3 && d >= 21) || (m == 4 && d <= 19)) return "Áries";
        if ((m == 4 && d >= 20) || (m == 5 && d <= 20)) return "Touro";
        if ((m == 5 && d >= 21) || (m == 6 && d <= 20)) return "Gêmeos";
        if ((m == 6 && d >= 21) || (m == 7 && d <= 22)) return "Câncer";
        if ((m == 7 && d >= 23) || (m == 8 && d <= 22)) return "Leão";
        if ((m == 8 && d >= 23) || (m == 9 && d <= 22)) return "Virgem";
        if ((m == 9 && d >= 23) || (m == 10 && d <= 22)) return "Libra";
        if ((m == 10 && d >= 23) || (m == 11 && d <= 21)) return "Escorpião";
        if ((m == 11 && d >= 22) || (m == 12 && d <= 21)) return "Sagitário";
        if ((m == 12 && d >= 22) || (m == 1 && d <= 19)) return "Capricórnio";
        if ((m == 1 && d >= 20) || (m == 2 && d <= 18)) return "Aquário";
        return "Peixes";
    },

    cartao: () => {
        // Algoritmo de Luhn para gerar número de cartão válido (Visa)
        let n = [4]; // Visa começa com 4
        while (n.length < 15) n.push(Math.floor(Math.random() * 10));
        
        let s = 0;
        for (let i = 0; i < n.length; i++) {
            let d = parseInt(n[i]);
            if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
            s += d;
        }
        n.push((10 - (s % 10)) % 10);
        
        const numero = n.join('').replace(/(\d{4})/g, '$1 ').trim();
        const validade = `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/${2025 + Math.floor(Math.random() * 5)}`;
        const cvv = Math.floor(Math.random() * 899 + 100);
        
        return {
            numero_cartao: numero,
            validade: validade,
            cvv: cvv,
            bandeira: "Visa"
        };
    },

    password: (len, opts) => {
        let c = "abcdefghijklmnopqrstuvwxyz";
        if (opts.upper) c += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        if (opts.num) c += "0123456789";
        if (opts.sym) c += "!@#$%^&*()_+=-[]{};:,.<>?";
        return Array.from({length: len}, () => c[Math.floor(Math.random() * c.length)]).join('');
    },
    
    getEndereco: () => {
        const base = baseAddresses[Math.floor(Math.random() * baseAddresses.length)];
        return {
            cep: base.cep,
            endereco: base.endereco,
            numero: Math.floor(Math.random() * 2500) + 1,
            bairro: base.bairro,
            cidade: base.cidade,
            uf: base.uf
        };
    },
};
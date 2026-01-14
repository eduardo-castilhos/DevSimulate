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

    pix: () => {
        const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let chave = '';
        // Gera chave EVP (formato UUID-like aleatório)
        for (let i = 0; i < 32; i++) {
            chave += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return chave.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    },

    contaBancaria: () => {
        const bancos = ["001 - BB", "237 - Bradesco", "341 - Itaú", "033 - Santander", "260 - Nubank"];
        return {
            banco: bancos[Math.floor(Math.random() * bancos.length)],
            agencia: Math.floor(1000 + Math.random() * 9000).toString(),
            conta: Math.floor(100000 + Math.random() * 900000).toString() + "-" + Math.floor(Math.random() * 10)
        };
    },

    boleto: () => {
        const n = () => Math.floor(Math.random() * 9);
        let linha = "";
        for(let i=0; i<47; i++) linha += n();
        return linha.replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})/, '$1.$2 $3.$4 $5.$6 $7 $8');
    },

    ie: () => {
        // Exemplo simplificado (padrão 9 dígitos)
        let ie = "";
        for(let i=0; i<9; i++) ie += Math.floor(Math.random() * 10);
        return ie;
    },

    telefone: () => {
        const ddd = [11, 21, 31, 41, 51, 61, 71, 81][Math.floor(Math.random() * 8)];
        const num = Math.floor(900000000 + Math.random() * 100000000);
        return `(${ddd}) ${num.toString().replace(/(\d{5})(\d{4})/, '$1-$2')}`;
    },

    ip: (version = 'v4') => {
        if (version === 'v4') {
            return Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
        }
        const hex = "0123456789abcdef";
        const group = () => Array.from({length: 4}, () => hex[Math.floor(Math.random() * 16)]).join('');
        return Array.from({length: 8}, group).join(':');
    },

    mac: () => {
        const hex = "0123456789ABCDEF";
        const pair = () => hex[Math.floor(Math.random() * 16)] + hex[Math.floor(Math.random() * 16)];
        return Array.from({length: 6}, pair).join(':');
    },

    userAgent: () => {
        const agents = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
        ];
        return agents[Math.floor(Math.random() * agents.length)];
    },

    lorem: () => {
        const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
        return text;
    },

    cor: () => {
        const hex = Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        return `#${hex.toUpperCase()}`;
    },

    coordenadas: () => {
        const lat = (Math.random() * ((-10) - (-30)) + (-30)).toFixed(6);
        const lng = (Math.random() * ((-35) - (-60)) + (-60)).toFixed(6);
        return { latitude: lat, longitude: lng };
    },

    placa: () => {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const nums = "0123456789";
        // Padrão Mercosul: AAA1A11
        let p = letters[Math.floor(Math.random()*26)] + letters[Math.floor(Math.random()*26)] + letters[Math.floor(Math.random()*26)];
        p += nums[Math.floor(Math.random()*10)];
        p += letters[Math.floor(Math.random()*26)];
        p += nums[Math.floor(Math.random()*10)] + nums[Math.floor(Math.random()*10)];
        return p;
    },

    renavam: () => {
        let n = "";
        for(let i=0; i<11; i++) n += Math.floor(Math.random() * 10);
        return n;
    }
};
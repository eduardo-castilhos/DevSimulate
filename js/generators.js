const Generators = {
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
    
    guid: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    }),

    getSigno: (data) => {
        const [d, m] = data.split('/').map(Number);
        const rules = [
            {m:3, d:21, n:"Áries"}, {m:4, d:20, n:"Touro"}, {m:5, d:21, n:"Gêmeos"},
            {m:6, d:21, n:"Câncer"}, {m:7, d:23, n:"Leão"}, {m:8, d:23, n:"Virgem"},
            {m:9, d:23, n:"Libra"}, {m:10, d:23, n:"Escorpião"}, {m:11, d:22, n:"Sagitário"},
            {m:12, d:22, n:"Capricórnio"}, {m:1, d:20, n:"Aquário"}, {m:2, d:19, n:"Peixes"}
        ];
        // Lógica simplificada: retorna o signo baseado no mês se o dia for maior ou igual ao limite
        const s = rules.find((r, i) => {
            const next = rules[(i + 1) % 12];
            return (m === r.m && d >= r.d) || (m === next.m && d < next.d);
        });
        return s ? s.n : "Peixes";
    },

    cartao: () => {
        let n = [4]; // Visa
        while (n.length < 15) n.push(Math.floor(Math.random() * 10));
        let s = 0;
        for (let i = 0; i < n.length; i++) {
            let d = n[i];
            if (i % 2 === 0) { d *= 2; if (d > 9) d -= 9; }
            s += d;
        }
        n.push((10 - (s % 10)) % 10);
        return {
            numero_cartao: n.join('').replace(/(\d{4})/g, '$1 ').trim(),
            validade: `${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}/20${25 + Math.floor(Math.random() * 5)}`,
            cvv: Math.floor(Math.random() * 899 + 100),
            bandeira: "Visa"
        };
    },

    senha: () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        return Array.from({length: 12}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    },

    boleto: () => {
        // Gera uma linha digitável de exemplo (47 dígitos)
        const n = () => Math.floor(Math.random() * 10);
        return Array.from({length: 47}, n).join('').replace(/(\d{5})(\d{5})(\d{5})(\d{6})(\d{5})(\d{6})(\d{1})(\d{14})/, '$1.$2 $3.$4 $5.$6 $7 $8');
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
        let k = '';
        for (let i = 0; i < 32; i++) k += chars.charAt(Math.floor(Math.random() * chars.length));
        return k.replace(/(.{8})(.{4})(.{4})(.{4})(.{12})/, '$1-$2-$3-$4-$5');
    },

    contaBancaria: () => {
        const b = ["001 - BB", "237 - Bradesco", "341 - Itaú", "033 - Santander", "260 - Nubank"];
        return {
            banco: b[Math.floor(Math.random() * b.length)],
            agencia: Math.floor(1000 + Math.random() * 9000).toString(),
            conta: Math.floor(100000 + Math.random() * 900000).toString() + "-" + Math.floor(Math.random() * 10)
        };
    },

    ip: (v = 'v4') => {
        if (v === 'v4') return Array.from({length: 4}, () => Math.floor(Math.random() * 256)).join('.');
        const h = "0123456789abcdef";
        const g = () => Array.from({length: 4}, () => h[Math.floor(Math.random() * 16)]).join('');
        return Array.from({length: 8}, g).join(':');
    },

    mac: () => {
        const h = "0123456789ABCDEF";
        const p = () => h[Math.floor(Math.random() * 16)] + h[Math.floor(Math.random() * 16)];
        return Array.from({length: 6}, p).join(':');
    },

    userAgent: () => {
        const a = [
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
            "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15"
        ];
        return a[Math.floor(Math.random() * a.length)];
    },

    telefone: () => {
        const ddd = [11, 21, 31, 41, 51, 61, 71, 81][Math.floor(Math.random() * 8)];
        return `(${ddd}) 9${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`;
    },

    placa: () => {
        const l = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const n = "0123456789";
        return l[Math.floor(Math.random()*26)] + l[Math.floor(Math.random()*26)] + l[Math.floor(Math.random()*26)] + 
               n[Math.floor(Math.random()*10)] + l[Math.floor(Math.random()*26)] + n[Math.floor(Math.random()*10)] + n[Math.floor(Math.random()*10)];
    },

    renavam: () => Array.from({length: 11}, () => Math.floor(Math.random() * 10)).join(''),
    
    ie: () => Array.from({length: 9}, () => Math.floor(Math.random() * 10)).join(''),

    coordenadas: () => ({
        latitude: (Math.random() * ((-10) - (-30)) + (-30)).toFixed(6),
        longitude: (Math.random() * ((-35) - (-60)) + (-60)).toFixed(6)
    }),

    validadorJson: (input) => {
        try {
            const parsed = JSON.parse(input);
            return { valid: true, data: parsed };
        } catch (e) {
            return { valid: false, error: e.message };
        }
    },

    validadorEmail: (input) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(input);
    },
};
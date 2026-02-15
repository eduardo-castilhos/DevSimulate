const Utils = {
    copyText(text) {
        navigator.clipboard.writeText(text).then(() => {
            const t = document.getElementById('toast');
            if(t) {
                t.classList.add('show');
                setTimeout(() => t.classList.remove('show'), 2000);
            }
        });
    },

    copyFromBase64(base64) {
        const text = decodeURIComponent(escape(atob(base64)));
        this.copyText(text);
    },

    removerAcentos(texto) {
        return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    },

    loadComponent(id, path, callback) {
        fetch(path)
            .then(response => response.text())
            .then(data => {
                document.getElementById(id).innerHTML = data;
                if (callback) callback();
            });
    },

    initTheme() {
        const theme = localStorage.getItem('theme');
        if (theme === 'dark' || theme === null) {
            document.body.classList.add('dark-mode');
        }
        
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-mode');
                const isDark = document.body.classList.contains('dark-mode');
                localStorage.setItem('theme', isDark ? 'dark' : 'light');
                const icon = document.getElementById('theme-icon');
                if (icon) {
                    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
                    lucide.createIcons();
                }
            });
        }
    },

    initSidebar() {
        const menuToggle = document.getElementById('menu-toggle');
        const sidebar = document.getElementById('sidebar');
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
            });
        }

        // Highlight active page in sidebar
        const currentPage = window.location.pathname.split('/').pop().replace('.html', '');
        const navItems = document.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            if (item.getAttribute('data-page') === currentPage) {
                item.classList.add('active');
            }
        });
    }
};

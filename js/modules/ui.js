const UI = {
    buildField(label, value) {
        return `
            <div class="field-box">
                <label>${label.toUpperCase().replace(/_/g, ' ')}</label>
                <div class="field-content">
                    <span>${value}</span>
                    <button class="btn-copy-small" onclick="Utils.copyText('${value}')">
                        <i data-lucide="copy" style="width:14px;height:14px"></i>
                    </button>
                </div>
            </div>`;
    },

    renderVisual(data, containerId) {
        const container = document.getElementById(containerId);
        let html = '<div class="dossie" style="margin-top:20px">';
        for (const [section, values] of Object.entries(data)) {
            if (typeof values === 'object' && values !== null) {
                html += `
                    <section>
                        <h3 class="sec-title" style="text-transform: capitalize;">${section.replace(/_/g, ' ')}</h3>
                        <div class="profile-grid">
                            ${Object.entries(values).map(([k, v]) => this.buildField(k, v)).join('')}
                        </div>
                    </section>`;
            } else {
                html += `<div class="profile-grid" style="margin-top:10px">${this.buildField(section, values)}</div>`;
            }
        }
        container.innerHTML = html + '</div>';
        if(window.lucide) lucide.createIcons();
    },

    renderJson(data, containerId) {
        const container = document.getElementById(containerId);
        const jsonText = JSON.stringify(data, null, 2);
        const encodedJson = btoa(unescape(encodeURIComponent(jsonText)));
        container.innerHTML = `
            <div class="json-box" style="margin-top:20px">
                <button class="btn-copy-all" onclick="Utils.copyFromBase64('${encodedJson}')" style="position: absolute; right: 15px; top: 15px; background: var(--primary); color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Copiar JSON</button>
                <pre><code>${jsonText}</code></pre>
            </div>`;
    }
};

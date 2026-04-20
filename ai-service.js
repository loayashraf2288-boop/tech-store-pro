const AI_KEY = "AIzaSyDuo1bQ4N4WBFmXzHvCW7xQkVyiKuXVIZU";

document.getElementById('ai-btn').onclick = () => {
    const win = document.getElementById('ai-window');
    win.style.display = (win.style.display === 'none' || win.style.display === '') ? 'flex' : 'none';
};

async function askAI() {
    const inp = document.getElementById('ai-input');
    const msgDiv = document.getElementById('ai-messages');
    const txt = inp.value.trim();
    if(!txt) return;

    msgDiv.innerHTML += `<div style="align-self:flex-end; background:var(--primary-blue); padding:8px; border-radius:8px;">${txt}</div>`;
    inp.value = '';

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${AI_KEY}`, {
        method: "POST",
        body: JSON.stringify({ contents: [{ parts: [{ text: `إنت خدمة عملاء متجر TECHSTORE بتاع لؤي. رد بالمصري وبذكاء. لو العميل بيشتكي من حاجة قوله لؤي هيتصل بيك فوراً. العميل بيقول: ${txt}` }] }] })
    });
    const data = await res.json();
    const reply = data.candidates[0].content.parts[0].text;
    
    msgDiv.innerHTML += `<div style="background:#1a2a44; padding:8px; border-radius:8px; border:1px solid var(--primary-blue);">${reply}</div>`;
    msgDiv.scrollTop = msgDiv.scrollHeight;
}

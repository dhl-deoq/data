// Твій Telegram Bot сервер має приймати запити через endpoints
// Для прикладу використовується fetch до /api/...

let currentChannelId = null;

// Авторизація та реєстрація
document.getElementById('loginBtn').onclick = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // POST на сервер (Node.js) який працює з Telegram Bot
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username,password})
    });
    const data = await res.json();
    if(data.ok) showChat();
    else alert(data.error);
};

document.getElementById('registerBtn').onclick = async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('/api/register', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({username,password})
    });
    const data = await res.json();
    if(data.ok) showChat();
    else alert(data.error);
};

function showChat() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('chat').style.display = 'flex';
    loadChannels();
}

// Канали
async function loadChannels() {
    const res = await fetch('/api/channels');
    const channels = await res.json();
    const list = document.getElementById('channelList');
    list.innerHTML = '';
    channels.forEach(c => {
        const li = document.createElement('li');
        li.textContent = c.name + ' (' + c.id + ')';
        li.onclick = () => selectChannel(c.id, c.name);
        list.appendChild(li);
    });
}

document.getElementById('createChannelBtn').onclick = async () => {
    const name = document.getElementById('newChannelName').value;
    if(!name) return alert('Вкажіть назву каналу');
    const res = await fetch('/api/channels', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({name})
    });
    const data = await res.json();
    if(data.ok) { document.getElementById('newChannelName').value=''; loadChannels();}
    else alert(data.error);
};

// Повідомлення
async function selectChannel(id,name) {
    currentChannelId = id;
    document.getElementById('channelTitle').textContent = name;
    loadMessages();
}

async function loadMessages() {
    if(!currentChannelId) return;
    const res = await fetch('/api/channels/'+currentChannelId+'/messages');
    const msgs = await res.json();
    const list = document.getElementById('messageList');
    list.innerHTML = '';
    msgs.forEach(m => {
        const div = document.createElement('div');
        div.textContent = m.from + ': ' + m.text;
        list.appendChild(div);
    });
}

document.getElementById('sendMsgBtn').onclick = async () => {
    const text = document.getElementById('msgText').value;
    if(!text || !currentChannelId) return;
    const res = await fetch('/api/channels/'+currentChannelId+'/messages', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({text})
    });
    const data = await res.json();
    if(data.ok) { document.getElementById('msgText').value=''; loadMessages();}
    else alert(data.error);
};

// Оновлення повідомлень кожні 3 секунди
setInterval(()=>{if(currentChannelId) loadMessages();},3000);

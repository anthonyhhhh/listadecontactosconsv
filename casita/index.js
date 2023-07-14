const loginForm = document.querySelector('#login-form');
const login = document.querySelector('#login');
const registerForm = document.querySelector('#register-form');
const register = document.querySelector('#register');
const notification = document.querySelector('.notification');
const loader = document.querySelector('.loader');
const registerBtn = document.querySelector('#register-btn');
const loginBtn = document.querySelector('#login-btn');
const REGEX = /^.{1,20}$/;

const popUp = async()=>{
    notification.classList.add("show");
    loginBtn.disabled = true;
    registerBtn.disabled = true;
    setTimeout(() => {
    notification.classList.remove("show");
    loginBtn.disabled = false;
    registerBtn.disabled = false;
    }, 3000);
};

registerForm.addEventListener('submit', async e =>{
    e.preventDefault();
    const response = await fetch('http://localhost:3000/users', { method: 'GET' });
    const users = await response.json();
    const user = users.find(user => user.username === register.value);
    const registerLong = register.value;

    if (!register.value) {
        notification.innerHTML = `<span class="noti">aviso</span> el nombre no puede estar vacio.`;
        popUp();
    }else if (!REGEX.test(registerLong)) {
        notification.innerHTML = `<span class="noti">aviso</span> el nombre no puede tener más de 20 caracteres`;
        popUp();
        register.value = '';
    }else if (user) {
        notification.innerHTML = `<span class="noti">aviso</span> el usuario "${register.value}" <br >ya existe`;
        popUp();
        register.value = '';
    }else{
        await fetch('http://localhost:3000/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: register.value}),
        });
    notification.innerHTML = `el usuario "${register.value}" <br>ha sido registrado correctamente`;
    notification.classList.add('showgreen');
    loginBtn.disabled = true;
    registerBtn.disabled = true;
    setTimeout(() =>{
        notification.classList.remove('showgreen');
        loginBtn.disabled = false;
        registerBtn.disabled = false;
    },3000);
    register.value = '';
    };
});
loginForm.addEventListener('submit', async e => {
    e.preventDefault();
    const response = await fetch('http://localhost:3000/users', { method: 'GET' });
    const users = await response.json();
    const user = users.find(user => user.username === login.value);

    if (!login.value) {
        notification.innerHTML =`<span class="noti">aviso</span> no puedes ingresar un nombre vacío. <br>registrese.`;
        popUp();
        login.value = '';
    }else if (!user) {
        notification.innerHTML = `<span class="noti">aviso</span> el usuario no existe. <br>regístrese.`;
        popUp();
        login.value = '';
    }else{
        const minDelay = 500;
        const maxDelay = 3000; 
        const delay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
        localStorage.setItem('user',JSON.stringify(user));
        loader.classList.add('show-loader');
        localStorage.setItem('user',JSON.stringify(user));
        loginBtn.disabled = true;
        registerBtn.disabled = true;
        setTimeout(() => {
            loader.classList.remove('show-loader');
            window.location.href = '../todo/todo.html';
            loginBtn.disabled = false;
            registerBtn.disabled = false;
        }, delay);
        login.value = '';
    };
});
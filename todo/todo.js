const nameInput = document.querySelector('#name-input');
const phoneInput = document.querySelector('#phone-input');
const list = document.querySelector('#list');
const formBtn = document.querySelector('.form-btn');
const user = JSON.parse(localStorage.getItem('user'));
const logoutBtn = document.querySelector('#logout-container')
const logo = document.querySelector('#Logo')

const PHONE_REGEX = /^[0](412|414|416|426|424|212)[0-9]{7}$/;
const NAME_REGEX = /^([A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,15}\s){1}[A-ZÁÉÍÓÚÑ][a-záéíóúñ]{1,15}$/;

let phoneValidation = false;
let miniNameValidation = false;
let nameValidation = false;
let miniPhoneValidation = false;

if (!user) {
    window.location.href = "../casita/index.html"
};
logo.innerHTML = `qué onda, ${user.username}`

const inputValidation = (input, regexValidation) =>{
    const infoText = input.parentElement.children[1];
    formBtn.disabled = nameValidation && phoneValidation? false:true;
    if (input.value === ''){
        input.classList.remove('wrong');
        input.classList.remove('correct');
        infoText.classList.remove('show');
    }else if(regexValidation){
        input.classList.add('correct');
        input.classList.remove('wrong');
        infoText.classList.remove('show');
    }else{
        input.classList.add('wrong');
        input.classList.remove('correct');
        infoText.classList.add('show');
    }
};
nameInput.addEventListener('input', e =>{
    nameValidation = NAME_REGEX.test(nameInput.value);
    inputValidation(nameInput,nameValidation);
});
phoneInput.addEventListener('input', e =>{
    phoneValidation = PHONE_REGEX.test(phoneInput.value);
    inputValidation(phoneInput, phoneValidation);
});
form.addEventListener('submit', async e =>{
    e.preventDefault();
    const responseJSON = await fetch('http://localhost:3000/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({contactName: nameInput.value, phone: phoneInput.value, user: user.username}),
    });
    const response = await responseJSON.json();
    const li = document.createElement('Li');
    li.innerHTML = `
        <li id = "${response.id}" class = "contact-list">
            <div id = "borrar" class = "icons">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <div class = "inputs">
                <input id = "name" class = "contact-list-input" type = "text" value = "${nameInput.value}" readonly autocomplete = "off">
                <input id = "phone" class = "contact-list-input" type = "text" value = "${phoneInput.value}" readonly autocomplete = "off">
            </div>
            <div id = "editar" class = "icons">        
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            </div>
        </li>    
        `;   
    list.append(li);
    nameInput.value = '';
    phoneInput.value = '';
    inputValidation(nameInput);
    inputValidation(phoneInput);
    nameValidation = false;
    phoneValidation = false;
    formBtn.disabled = true;
});
list.addEventListener('click',async (e) => {
    if (e.target.closest('.delete-icon')) {
        const li = e.target.closest('li');
        const id = e.target.parentElement.parentElement.id;
        await fetch(`http://localhost:3000/todos/${id}`, {method: 'DELETE'});
        e.target.parentElement.parentElement.remove();
        li.remove();

    }
  if (e.target.closest('.edit-icon') || e.target.querySelector('.edit-icon')){
    const li = e.target.closest('li');
    const inputs = li.children[1];
    const input = inputs.children[0];
    const phone = inputs.children[1];
    const editIcon = e.target.closest('.edit-icon');
    function validation() {
        const editValidation=(miniInput,miniRegexValidation)=>{
            if (miniRegexValidation) {
                miniInput.classList.add('correct')
                miniInput.classList.remove('wrong')
                if (!input.classList.contains('wrong') && !phone.classList.contains('wrong')){
                    editIcon.classList.remove('hide')
                }
            }else{
                miniInput.classList.remove('correct')
                miniInput.classList.add('wrong')
                editIcon.classList.add('hide')
            }
        }
        input.addEventListener('input', e =>{
            miniNameValidation = NAME_REGEX.test(input.value);
            editValidation(input,miniNameValidation);
        });
        
        phone.addEventListener('input', e =>{
            miniPhoneValidation = PHONE_REGEX.test(phone.value);
            editValidation(phone, miniPhoneValidation);
        })
        input.setAttribute('value', input.value)
        phone.setAttribute('value', phone.value)
        }    
    if (editIcon.classList.contains('editando')){
        editIcon.classList.remove('editando');
        validation();
        input.classList.remove('wrong')
        input.classList.remove('correct')
        phone.classList.remove('wrong')
        phone.classList.remove('correct')
        input.setAttribute('readonly',true);
        phone.setAttribute('readonly',true);
        editIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />`;
        const id = e.target.parentElement.parentElement.id;
        await fetch(`http://localhost:3000/todos/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({contactName: input.value, phone: phone.value}),
        });
      }else{
        const end = input.value.length;
        input.setSelectionRange(end, end);
        input.focus();
        editIcon.classList.add('editando');
        input.removeAttribute('readonly');
        phone.removeAttribute('readonly');
        validation();
        editIcon.innerHTML = `<path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />`;
      };
  }
});
const getTodos = async () =>{
    const response = await fetch('http://localhost:3000/todos', {method: 'GET'});
    const contactos = await response.json();
    const userContactos = contactos.filter(e => e.user === user.username);
    userContactos.forEach(e => {
        const li = document.createElement('li');
        li.innerHTML = `
        <li id = "${e.id}" class = "contact-list">
            <div id = "borrar" class = "icons">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="delete-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
            <div class = "inputs">
                <input id = "name" class = "contact-list-input" type = "text" value = "${e.contactName}" readonly autocomplete = "off">
                <input id = "phone" class = "contact-list-input" type = "text" value = "${e.phone}" readonly autocomplete = "off">
            </div>
            <div id = "editar" class = "icons">        
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="edit-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
            </div>
        </li>    
        `;
        list.append(li);
    });
}
getTodos();
logoutBtn.addEventListener('click', e=>{
    localStorage.removeItem('user')
    window.location.href = '../casita/index.html'
});
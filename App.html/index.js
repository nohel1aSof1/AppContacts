const form = document.querySelector('#main-form');
const nameInput = document.querySelector('#name-input');
const phoneInput = document.querySelector('#input-phone');
const formBtn = document.querySelector('#form-btn');
const list = document.querySelector('#contacts-list');

let nameValidation = false;
let phoneValidation = false;
//Regex

const NAME_REGEX = /^[A-Z][a-z]*[ ][A-Z][a-z]{2,}$/;
const PHONE_REGEX = /^[0](412|414|424|426|416|212)[0-9]{7}$/;




function validateBtn () {
    if (nameValidation && phoneValidation) {
        formBtn.disabled = false;
    }else {
        formBtn.disabled = true;
    }
}


function validateInput (input, validation) {
    const helperText = input.parentElement.children[2];

    if (input.value === '') {
        helperText.classList.remove('show-helper-text');
        input.classList.remove('invalid');
        input.classList.remove('valid');
    } else if (validation) {
        helperText.classList.remove('show-helper-text')
        input.classList.add('valid');
        input.classList.remove('invalid');
    } else {
        helperText.classList.add('show-helper-text');
        input.classList.add('invalid');
        input.classList.remove('valid');
    }
}


function validateEditInput(input, validation) {
    if (!input || !input.classList) {
        return; // Salir de la función antes de tiempo
    } 
    if  (input.value === '') {
        input.classList.remove('invalid');
        input.classList.remove('valid');
    } else if (validation) {
        input.classList.add('valid');
        input.classList.remove('invalid');
    } else {
        input.classList.add('invalid');
        input.classList.remove('valid');
    }
}




const ContactsModuleInit = () => {
    let contacts = [];

    const getContacts = () => {
        return contacts;
    }

    //JSDOC
/**
 * Agrega un nuevo contacto.
 * @param {Object} newContact - El contacto a agregar.
 * @param {string} newContact.id - El id del contacto.
 * @param {string} newContact.name - El nombre del contacto.
 * @param {string} newContact.phone - El telefono del contacto.
 * @returns void.
 */

const addContact = (newContact) => {

    // Verificar si el número ya existe
    const exists = contacts.some(contact => contact.phone === newContact.phone);
    if (exists) {
        alert('Este número de teléfono ya está registrado.');
        return; // Salir de la función si el número ya existe
    }


    contacts = contacts.concat(newContact);
    console.log('Agregado el contacto al array');
}


const saveContactsInBrowser = () => {
    
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

const renderContacts = () => {
    list.innerHTML ='';
    for (const contact of contacts) {
        const li = document.createElement('li');
        li.classList.add('contacts-list-item');
        li.id = contact.id;
        li.innerHTML = `<div class="inputs-container">
          <input class="contacts-list-item-name-input" type="text" value="${contact.name}" readonly>
          <input class="contacts-list-item-phone-input" type="text" value="${contact.phone}" readonly>
        </div>
        <div class="btns-container">
          <button class="edit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
            </svg>            
          </button>
          <button class="delete-btn">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        `;
        list.append(li);
    }
}

const getContactsFromBrowser = () => {
    const contactsLocalStorage = localStorage.getItem('contacts');
    if (contactsLocalStorage) {
        contacts = JSON.parse(contactsLocalStorage)
    }
}

const deleteContact = (id) => {
    contacts = contacts.filter(contact => {
        if (contact.id !== id) {
            return contact
        }
    });
}

const editCantact = (id, name, phone) => {
    contacts = contacts.map (contact => {
        if (id === contact.id) {
            return {...contact, name, phone}
        } else {
            return contact
        }
    });
};



return {
    getContacts,
    addContact,
    saveContactsInBrowser,
    renderContacts,
    getContactsFromBrowser,
    deleteContact,
    editCantact,
}
}

const ContactsModule = ContactsModuleInit();


//Events
nameInput.addEventListener('input', e => {
    nameValidation = NAME_REGEX.test(nameInput.value);
    validateInput(nameInput, nameValidation);
    validateBtn();
});

phoneInput.addEventListener('input', e => {
    phoneValidation = PHONE_REGEX.test(phoneInput.value);
    validateInput(phoneInput, phoneValidation);
    validateBtn();
});


form.addEventListener('submit', e => {
    e.preventDefault();
    //1.Tomar datos del usuario
    const newContact = {
        id: crypto.randomUUID(),
        name: nameInput.value,
        phone: phoneInput.value,
    }

    //2. Agregar el contacto al array
    ContactsModule.addContact(newContact);

    //3. Guardar en el navegador 
    ContactsModule.saveContactsInBrowser();

    //4. Mostrar los contactos en el html
    ContactsModule.renderContacts();
});

list.addEventListener('click', e => {
    const deleteBtn = e.target.closest('.delete-btn');
    const editBtn = e.target.closest('.edit-btn');
  
    if (deleteBtn) {
      const id = deleteBtn.parentElement.parentElement.id;
      ContactsModule.deleteContact(id);
      ContactsModule.saveContactsInBrowser();
      ContactsModule.renderContacts();
    }
  
    if (editBtn) {
        const li = editBtn.parentElement.parentElement;
        const nameEditInput = li.children[0].children[0];
        const phoneEditInput = li.children[0].children[1];
        if (li.classList.contains('editando')) {
          
            if (nameValidation && phoneValidation) {

                
            //Validar antes de guardar
            const prevName = nameEditInput.value;
            const prevPhone = phoneEditInput.value;

            const nameValidation = NAME_REGEX.test(nameEditInput.value) || nameEditInput.value === prevName;
            const phoneValidation = PHONE_REGEX.test(phoneEditInput.value) || phoneEditInput.value === prevPhone;
                
            //Logica de negocio
    
          ContactsModule.editCantact (li.id, nameEditInput.value, phoneEditInput.value);
          ContactsModule.saveContactsInBrowser();
    
    
          //logica rednderizado
    
          editBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
          </svg> 
          `;
          nameEditInput.setAttribute('readonly', true);
          phoneEditInput.setAttribute('readonly', true);
          li.classList.remove('editando');
          ContactsModule.renderContacts();
            } else {
                // Mostrar un mensaje de error más específico
                if (!nameValidation || !phoneValidation) {
                    alert('El nombre o el telefono no tiene el formato correcto.');
                }
            }
          
        } else {

            //Activar el modo edición
          editBtn.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0  24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
          </svg>`;

          nameEditInput.removeAttribute('readonly');
          phoneEditInput.removeAttribute('readonly');
          li.classList.add('editando');
          console.log('EDITANDO')

          
            // Validación en tiempo real
            nameEditInput.addEventListener('input', e => {
                nameValidation = NAME_REGEX.test(nameEditInput.value);
                validateEditInput(nameEditInput, nameValidation);
            });

            phoneEditInput.addEventListener('input', e => {
                phoneValidation = PHONE_REGEX.test(phoneEditInput.value);
                validateEditInput(phoneEditInput, phoneValidation);
            });
        }
      }
      
    });


window.onload = () => {
    ContactsModule.getContactsFromBrowser();
    ContactsModule.renderContacts(); 
}
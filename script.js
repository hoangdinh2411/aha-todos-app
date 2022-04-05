
// Notification

// 1. check  permissions

async function checkPermissions() {
  if (Notification.permission === 'granted') {
    // honk and drive
    return true;
  }
  return false;
}

// 2 . request permissions
async function requestPermissions() {
  let resp = Notification.requestPermission();

  console.log(resp);
}

// 3.  show notification

function showNotification(mess) {
  new Notification('Welcome to Aha Website', {
    icon: 'assets/logo/logo-72.png',
    body: mess
  })
}

window.addEventListener('load', async () => {
  if (await checkPermissions()) {
    // send notification
    showNotification('I love you!!!')
  } else {
    await requestPermissions();
  }
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register(
        '/serviceworker.js'
      );
    } catch (error) {
      console.error('Whooopsie!', error);
    }
  }
});

const API_URL =
  'https://api.jsonbin.io/v3/b/624b4cd61a1b610f084b86a2';
const API_KEY =
  '$2b$10$Vk7WtdXZWVdBZZOg5xtZ7efgP2Vzcm7.0xFShfs68AoRlvxwyv1aW';
const App = {
  els: {
    input: document.querySelector('input'),
    addButton: document.querySelector('button'),
  },
  todos: [],

  fetchingData: async () => {
    const todosOnLocal = JSON.parse(
      localStorage.getItem('todos')
    );

    if (todosOnLocal) {
      App.todos = todosOnLocal;
      App.render();
    }
    await fetch(API_URL, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.record.myTodos.length > 0) {
          const myTodos = data.record.myTodos.slice(
            0,
            data.record.myTodos.length
          );
          App.todos = myTodos;
        }
      })
      .catch((err) => console.log(err));
  },
  setData: async () => {
    await fetch(API_URL, {
      method: 'PUT',
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({myTodos: App.todos}),
    })
      .then(() => {
        App.saveLocal();
      })
      .catch((err) => console.log(err));
  },

  add() {
    const text = this.els.input.value;
    if (text === '') {
      alert('Type something!');
      return;
    }

    this.todos.push({id: Date.now(), text, done: false});
    console.log(this.todos);
    this.render();
    this.setData();
  },

  render() {
    const main = document.querySelector('main');
    this.els.input.value = '';

    const output = this.todos?.map((todo) => {
      return `<article class="${
        todo.done ? 'checked' : ''
      }">
            <section  >
                <aside  class="checkbox" data-id=${
                  todo.id
                } >
                    <div></div>
                </aside>
                <p>${todo.text}</p>
                <aside class="remove" data-id=${todo.id}>
                    <img src="assets/icon-trash.svg" alt="remove todo"  />
                </aside>
            </section>
        </article>
         `;
    });

    main.innerHTML = output.join('');
    const checkBtn = document.querySelectorAll('.checkbox');
    checkBtn?.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.changeStatus(id);
      });
    });
    const removeBtn = document.querySelectorAll('.remove');

    removeBtn?.forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        this.remove(id);
      });
    });
  },

  changeStatus: function (id) {
    const index = this.todos.findIndex(
      (todo) => todo.id === Number(id)
    );
    this.todos[index].done = !this.todos[index].done;
    this.render();
    this.setData();
  },
  remove(id) {
    const index = this.todos.findIndex(
      (todo) => todo.id === Number(id)
    );
    this.todos.splice(index, 1);
    this.render();
    this.setData();
  },
  saveLocal() {
    localStorage.setItem(
      'todos',
      JSON.stringify(this.todos)
    );
  },

  init() {
    this.els.addButton.addEventListener('click', () => {
      this.add();
      this.saveLocal();
    });
    this.fetchingData();
    this.render();
  },
};

App.init();

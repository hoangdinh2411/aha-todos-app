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

  add() {
    const text = this.els.input.value;
    if (text === '') {
      alert('Type something!');
      return;
    }
    this.todos.push({
      id: Date.now(),
      text,
      done: false,
    });
    this.els.input.value = '';
    this.render();
  },

  fetchingData: async () => {
    await fetch(API_URL, {
      headers: {
        'X-Master-Key': API_KEY,
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .then((data) => {
        todos = data.record.myTodos;
      })
      .catch((err) => {
        const todosOnLocal = JSON.parse(
          localStorage.getItem('todos')
        );
        if (todosOnLocal) {
          App.todos = todosOnLocal;
          App.render()
        }
      });
  },
  render() {
    const main = document.querySelector('main');

    const output = this.todos.map((todo) => {
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
    this.saveLocal();
    this.render();
  },
  remove(id) {
    const index = this.todos.findIndex(
      (todo) => todo.id === Number(id)
    );
    this.todos.splice(index, 1);
    this.saveLocal();

    this.render();
  },
  saveLocal() {
    localStorage.setItem(
      'todos',
      JSON.stringify(this.todos)
    );
  },

  init() {
    this.fetchingData();
    this.render();

    this.els.addButton.addEventListener('click', () => {
      this.add();
      this.saveLocal();
    });
  },
};

App.init();

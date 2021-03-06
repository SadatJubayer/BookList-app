// Book Class for representing books 
class Book {
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

// UI class for Handling UI tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();
        books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;
        list.appendChild(row);
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        setTimeout(() => document.querySelector('.alert').remove(), 2000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(e) {
        if (e.classList.contains('delete')) {
            e.parentElement.parentElement.remove();
        }
    }
}

// Storage class for handling Storage 
class Store {
    static getBooks() {
        let books;
        if (localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }
    static addBook(book) {

        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }
    static removeBook(isbn) {
        const books = Store.getBooks();
        books.forEach((book, index) => {
            if (book.isbn === isbn) {
                books.splice(index, 1);
            }
        });
        localStorage.setItem('books', JSON.stringify(books));
    }
}

// Event: Display
document.addEventListener('DOMContentLoaded', UI.displayBooks);

// Event: add Books 
document.querySelector('#book-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // get form values
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;

    // Validate 
    if (title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill out all the fields', 'danger');

    } else {
        // Instantiate Book Class 
        const book = new Book(title, author, isbn);
        // Add book to UI 
        UI.addBookToList(book);
        // Add book to store
        Store.addBook(book);
        // Show alert
        UI.showAlert('Your Book has been added successfully!', 'success');
        // clear input fields 
        UI.clearFields();
    }
})

// Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    // remove from UI
    UI.deleteBook(e.target);
    // remove form Store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // Show Alert
    UI.showAlert('Book Removed!', 'warning');
})
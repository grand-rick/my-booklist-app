 //Book class: Represents a Book
class Book{
    constructor(title, author, isbn) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

 //UI Class: Handle UI Tasks
class UI {
    static displayBooks() {
        const books = Store.getBooks();

        books.forEach((book)=> UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.isbn}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
        `;

        list.appendChild(row);
    }
    //Using event propagation
    static deleteBook(target) {
        if(target.classList.contains('delete')) {
            target.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));

        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);
        //Vanish in 3seconds
        setTimeout(() => {
            document.querySelector('.alert').remove()
        }, 3000);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }
    
}

 //Store Class: Handles Storage
 class Store {
     static getBooks() {
        let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
     }

     static addBook(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books))
     }
 
     static removeBook(isbn) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1)
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
     }
 }

 //Event: Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

 //Event: Add a Book
document.querySelector('#book-form').addEventListener('submit', (e)=> {
    //Prevent Actual Submit
    e.preventDefault();
    //Get Form Values
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;

    //Input Validation
    if(title === '' || author === '' || isbn === '') {
        UI.showAlert('Please fill in all fields', 'danger');
    } else {
        
        //Instantiate Book
    const book = new Book(title, author, isbn);

    //Add Book to UI
    UI.addBookToList(book);

    //Add Book to store
    Store.addBook(book);

    //Show success message
    UI.showAlert('Awesome, your book has been added', 'success');

    //Clear Fields
    UI.clearFields();
    }
});

 //Event: Remove a Book
document.querySelector('#book-list').addEventListener('click', e => {
     //Remove book from UI
    UI.deleteBook(e.target);

    //Remove book from the store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Book Removed!', 'success');
});
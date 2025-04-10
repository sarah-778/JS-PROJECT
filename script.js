// script.js

// Local Storage Helper Functions
const saveToLocalStorage = (key, data) => localStorage.setItem(key, JSON.stringify(data));
const getFromLocalStorage = (key) => JSON.parse(localStorage.getItem(key)) || [];

// DOM Elements
const bookForm = document.getElementById('bookForm');
const bookGrid = document.getElementById('bookGrid');
const favoriteBooks = document.getElementById('favoriteBooks');
const unreadBooks = document.getElementById('unreadBooks');
const readBooks = document.getElementById('readBooks');
const searchBar = document.getElementById('searchBar');

// State
let books = getFromLocalStorage('books');

// Render Books
const renderBooks = () => {
    const allBooksHTML = books.map(bookCard).join('');
    const favoritesHTML = books.filter(b => b.favorite).map(bookCard).join('');
    const unreadHTML = books.filter(b => b.status === 'Unread').map(bookCard).join('');
    const readHTML = books.filter(b => b.status === 'Read').map(bookCard).join('');

    bookGrid.innerHTML = allBooksHTML;
    favoriteBooks.innerHTML = favoritesHTML;
    unreadBooks.innerHTML = unreadHTML;
    readBooks.innerHTML = readHTML;
};

// Book Card Template
const bookCard = (book) => `
    <div class="col-md-4 mb-3">
        <div class="card">
            <img src="${book.image || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${book.title}">
            <div class="card-body">
                <h5 class="card-title">${book.title}</h5>
                <p class="card-text">✍ Author: ${book.author}</p>
                <p class="card-text">📂 Genre: ${book.genre}</p>
                <p class="card-text">📌 Status: ${book.status}</p>
                <button class="btn btn-warning btn-sm" onclick="toggleFavorite('${book.id}')">⭐ ${book.favorite ? 'Unfavorite' : 'Favorite'}</button>
                <button class="btn btn-primary btn-sm" onclick="editBook('${book.id}')">✏ Edit</button>
                <button class="btn btn-danger btn-sm" onclick="deleteBook('${book.id}')">🗑 Delete</button>
            </div>
        </div>
    </div>
`;

// Add or Edit Book
bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('bookId').value || Date.now().toString();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const genre = document.getElementById('genre').value;
    const status = document.getElementById('status').value;
    const image = document.getElementById('image').files[0] ? URL.createObjectURL(document.getElementById('image').files[0]) : '';

    const existingBookIndex = books.findIndex(b => b.id === id);
    const newBook = { id, title, author, genre, status, image, favorite: books[existingBookIndex]?.favorite || false };

    if (existingBookIndex > -1) {
        books[existingBookIndex] = newBook;
    } else {
        books.push(newBook);
    }

    saveToLocalStorage('books', books);
    renderBooks();
    bookForm.reset();
    bootstrap.Modal.getInstance(document.getElementById('bookModal')).hide();
});

// Edit Book
const editBook = (id) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    document.getElementById('bookId').value = book.id;
    document.getElementById('title').value = book.title;
    document.getElementById('author').value = book.author;
    document.getElementById('genre').value = book.genre;
    document.getElementById('status').value = book.status;
    bootstrap.Modal.getOrCreateInstance(document.getElementById('bookModal')).show();
};

// Delete Book
const deleteBook = (id) => {
    books = books.filter(b => b.id !== id);
    saveToLocalStorage('books', books);
    renderBooks();
};

// Toggle Favorite
const toggleFavorite = (id) => {
    const book = books.find(b => b.id === id);
    if (!book) return;

    book.favorite = !book.favorite;
    saveToLocalStorage('books', books);
    renderBooks();
};

// Search Books
searchBar.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase();
    const filteredBooks = books.filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query));
    bookGrid.innerHTML = filteredBooks.map(bookCard).join('');
});

// Initial Render
renderBooks();
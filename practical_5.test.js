/**
 * Unit tests for Library Management System
 * Тести для системи управління бібліотекою
 */

const assert = require('assert');
const { Book, Library } = require('./practical_5');

// Тестовий лічильник
let testsPassed = 0;
let testsFailed = 0;

/**
 * Простий тестовий запуск
 */
function test(name, fn) {
    try {
        fn();
        testsPassed++;
        console.log(`✓ ${name}`);
    } catch (error) {
        testsFailed++;
        console.error(`✗ ${name}`);
        console.error(`  Error: ${error.message}`);
        if (error.stack) {
            console.error(`  ${error.stack.split('\n')[1]}`);
        }
    }
}

console.log('=== Тестування системи управління бібліотекою ===\n');

// ==================== Тести класу Book ====================

console.log('--- Тести класу Book ---\n');

test('Book: Створення книги з усіма параметрами', () => {
    const book = new Book('1', 'Test Book', 'Test Author', '123-456', 2020, 'Fiction', true);
    assert.strictEqual(book.id, '1');
    assert.strictEqual(book.title, 'Test Book');
    assert.strictEqual(book.author, 'Test Author');
    assert.strictEqual(book.isbn, '123-456');
    assert.strictEqual(book.year, 2020);
    assert.strictEqual(book.genre, 'Fiction');
    assert.strictEqual(book.available, true);
});

test('Book: Створення книги зі значенням за замовчуванням для available', () => {
    const book = new Book('2', 'Test Book 2', 'Author', '789', 2021, 'Romance');
    assert.strictEqual(book.available, true);
});

test('Book: Метод borrow() - успішне взяття доступної книги', () => {
    const book = new Book('3', 'Test', 'Author', '111', 2020, 'Fiction', true);
    const result = book.borrow();
    assert.strictEqual(result, true);
    assert.strictEqual(book.available, false);
});

test('Book: Метод borrow() - невдале взяття вже взятої книги', () => {
    const book = new Book('4', 'Test', 'Author', '222', 2020, 'Fiction', false);
    const result = book.borrow();
    assert.strictEqual(result, false);
    assert.strictEqual(book.available, false);
});

test('Book: Метод return() - успішне повернення взятої книги', () => {
    const book = new Book('5', 'Test', 'Author', '333', 2020, 'Fiction', false);
    const result = book.return();
    assert.strictEqual(result, true);
    assert.strictEqual(book.available, true);
});

test('Book: Метод return() - невдале повернення вже доступної книги', () => {
    const book = new Book('6', 'Test', 'Author', '444', 2020, 'Fiction', true);
    const result = book.return();
    assert.strictEqual(result, false);
    assert.strictEqual(book.available, true);
});

test('Book: Метод getAge() - обчислення віку книги', () => {
    const currentYear = new Date().getFullYear();
    const book = new Book('7', 'Test', 'Author', '555', 2000, 'Fiction');
    const age = book.getAge();
    assert.strictEqual(age, currentYear - 2000);
});

test('Book: Метод getInfo() - форматована інформація для доступної книги', () => {
    const book = new Book('8', 'Test Book', 'Test Author', '666', 2020, 'Fiction', true);
    const info = book.getInfo();
    assert(info.includes('Test Book'));
    assert(info.includes('Test Author'));
    assert(info.includes('2020'));
    assert(info.includes('Fiction'));
    assert(info.includes('Доступна'));
});

test('Book: Метод getInfo() - форматована інформація для взятої книги', () => {
    const book = new Book('9', 'Test Book', 'Test Author', '777', 2020, 'Fiction', false);
    const info = book.getInfo();
    assert(info.includes('Взята'));
});

// ==================== Library Class Tests ====================

console.log('\n--- Тести класу Library ---\n');

test('Library: Створення порожньої бібліотеки', () => {
    const library = new Library();
    assert(Array.isArray(library.books));
    assert(Array.isArray(library.borrowHistory));
    assert.strictEqual(library.books.length, 0);
    assert.strictEqual(library.borrowHistory.length, 0);
});

test('Library: addBook() - додавання книги', () => {
    const library = new Library();
    const book = new Book('1', 'Test', 'Author', '111', 2020, 'Fiction');
    const result = library.addBook(book);
    assert.strictEqual(result, true);
    assert.strictEqual(library.books.length, 1);
    assert.strictEqual(library.books[0], book);
});

test('Library: addBook() - невдале додавання книги з існуючим ID', () => {
    const library = new Library();
    const book1 = new Book('1', 'Test 1', 'Author', '111', 2020, 'Fiction');
    const book2 = new Book('1', 'Test 2', 'Author', '222', 2021, 'Romance');
    library.addBook(book1);
    const result = library.addBook(book2);
    assert.strictEqual(result, false);
    assert.strictEqual(library.books.length, 1);
});

test('Library: removeBook() - вилучення існуючої книги', () => {
    const library = new Library();
    const book = new Book('1', 'Test', 'Author', '111', 2020, 'Fiction');
    library.addBook(book);
    const result = library.removeBook('1');
    assert.strictEqual(result, true);
    assert.strictEqual(library.books.length, 0);
});

test('Library: removeBook() - невдале вилучення неіснуючої книги', () => {
    const library = new Library();
    const result = library.removeBook('999');
    assert.strictEqual(result, false);
});

test('Library: findBookByIsbn() - знаходження книги за ISBN', () => {
    const library = new Library();
    const book = new Book('1', 'Test', 'Author', '123-456', 2020, 'Fiction');
    library.addBook(book);
    const found = library.findBookByIsbn('123-456');
    assert.strictEqual(found, book);
});

test('Library: findBookByIsbn() - не знайдена книга', () => {
    const library = new Library();
    const found = library.findBookByIsbn('999-999');
    assert.strictEqual(found, undefined);
});

test('Library: findBooksByAuthor() - знаходження книг за автором', () => {
    const library = new Library();
    const book1 = new Book('1', 'Book 1', 'George Orwell', '111', 1949, 'Dystopian');
    const book2 = new Book('2', 'Book 2', 'George Orwell', '222', 1950, 'Fiction');
    const book3 = new Book('3', 'Book 3', 'Jane Austen', '333', 1813, 'Romance');
    library.addBook(book1);
    library.addBook(book2);
    library.addBook(book3);
    
    const orwellBooks = library.findBooksByAuthor('Orwell');
    assert.strictEqual(orwellBooks.length, 2);
    assert(orwellBooks.includes(book1));
    assert(orwellBooks.includes(book2));
});

test('Library: findBooksByAuthor() - пошук нечутливий до регістру', () => {
    const library = new Library();
    const book = new Book('1', 'Book', 'George Orwell', '111', 1949, 'Dystopian');
    library.addBook(book);
    
    const found = library.findBooksByAuthor('orwell');
    assert.strictEqual(found.length, 1);
});

test('Library: findBooksByGenre() - знаходження книг за жанром', () => {
    const library = new Library();
    const book1 = new Book('1', 'Book 1', 'Author', '111', 2020, 'Fiction');
    const book2 = new Book('2', 'Book 2', 'Author', '222', 2021, 'Fiction');
    const book3 = new Book('3', 'Book 3', 'Author', '333', 2022, 'Romance');
    library.addBook(book1);
    library.addBook(book2);
    library.addBook(book3);
    
    const fictionBooks = library.findBooksByGenre('Fiction');
    assert.strictEqual(fictionBooks.length, 2);
    assert(fictionBooks.includes(book1));
    assert(fictionBooks.includes(book2));
});

test('Library: findBooksByGenre() - пошук нечутливий до регістру', () => {
    const library = new Library();
    const book = new Book('1', 'Book', 'Author', '111', 2020, 'Fiction');
    library.addBook(book);
    
    const found = library.findBooksByGenre('fiction');
    assert.strictEqual(found.length, 1);
});

test('Library: getAvailableBooks() - отримання доступних книг', () => {
    const library = new Library();
    const book1 = new Book('1', 'Book 1', 'Author', '111', 2020, 'Fiction', true);
    const book2 = new Book('2', 'Book 2', 'Author', '222', 2021, 'Fiction', false);
    const book3 = new Book('3', 'Book 3', 'Author', '333', 2022, 'Romance', true);
    library.addBook(book1);
    library.addBook(book2);
    library.addBook(book3);
    
    const available = library.getAvailableBooks();
    assert.strictEqual(available.length, 2);
    assert(available.includes(book1));
    assert(available.includes(book3));
});

test('Library: getBorrowedBooks() - отримання взятих книг', () => {
    const library = new Library();
    const book1 = new Book('1', 'Book 1', 'Author', '111', 2020, 'Fiction', true);
    const book2 = new Book('2', 'Book 2', 'Author', '222', 2021, 'Fiction', false);
    library.addBook(book1);
    library.addBook(book2);
    
    const borrowed = library.getBorrowedBooks();
    assert.strictEqual(borrowed.length, 1);
    assert(borrowed.includes(book2));
});

test('Library: searchBooks() - пошук за заголовком', () => {
    const library = new Library();
    const book1 = new Book('1', 'The Great Gatsby', 'Author', '111', 2020, 'Fiction');
    const book2 = new Book('2', '1984', 'Author', '222', 2021, 'Dystopian');
    library.addBook(book1);
    library.addBook(book2);
    
    const results = library.searchBooks('Gatsby');
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0], book1);
});

test('Library: searchBooks() - пошук за автором', () => {
    const library = new Library();
    const book1 = new Book('1', 'Book 1', 'George Orwell', '111', 2020, 'Fiction');
    const book2 = new Book('2', 'Book 2', 'Jane Austen', '222', 2021, 'Romance');
    library.addBook(book1);
    library.addBook(book2);
    
    const results = library.searchBooks('Orwell');
    assert.strictEqual(results.length, 1);
    assert.strictEqual(results[0], book1);
});

test('Library: searchBooks() - пошук за ISBN', () => {
    const library = new Library();
    const book = new Book('1', 'Book', 'Author', '123-456-789', 2020, 'Fiction');
    library.addBook(book);
    
    const results = library.searchBooks('123-456');
    assert.strictEqual(results.length, 1);
});

test('Library: searchBooks() - пошук нечутливий до регістру', () => {
    const library = new Library();
    const book = new Book('1', 'The Great Gatsby', 'Author', '111', 2020, 'Fiction');
    library.addBook(book);
    
    const results = library.searchBooks('gatsby');
    assert.strictEqual(results.length, 1);
});

// ==================== Borrowing System Tests ====================

console.log('\n--- Тести системи взяття на прокат ---\n');

test('Library: borrowBook() - успішне взяття книги', () => {
    const library = new Library();
    const book = new Book('1', 'Test', 'Author', '111', 2020, 'Fiction', true);
    library.addBook(book);
    
    const result = library.borrowBook('1', 'user1');
    assert.strictEqual(result, true);
    assert.strictEqual(book.available, false);
    assert.strictEqual(library.borrowHistory.length, 1);
    assert.strictEqual(library.borrowHistory[0].bookId, '1');
    assert.strictEqual(library.borrowHistory[0].userId, 'user1');
    assert.strictEqual(library.borrowHistory[0].returnDate, null);
});

test('Library: borrowBook() - невдале взяття неіснуючої книги', () => {
    const library = new Library();
    const result = library.borrowBook('999', 'user1');
    assert.strictEqual(result, false);
    assert.strictEqual(library.borrowHistory.length, 0);
});

test('Library: borrowBook() - невдале взяття вже взятої книги', () => {
    const library = new Library();
    const book = new Book('1', 'Test', 'Author', '111', 2020, 'Fiction', false);
    library.addBook(book);
    
    const result = library.borrowBook('1', 'user1');
    assert.strictEqual(result, false);
    assert.strictEqual(library.borrowHistory.length, 0);
});

test('Library: returnBook() - успішне повернення книги', () => {
    const library = new Library();
    const book = new Book('1', 'Test', 'Author', '111', 2020, 'Fiction', false);
    library.addBook(book);
    library.borrowHistory.push({
        bookId: '1',
        userId: 'user1',
        borrowDate: new Date(),
        returnDate: null
    });
    
    const result = library.returnBook('1');
    assert.strictEqual(result, true);
    assert.strictEqual(book.available, true);
    assert.notStrictEqual(library.borrowHistory[0].returnDate, null);
});

test('Library: returnBook() - невдале повернення неіснуючої книги', () => {
    const library = new Library();
    const result = library.returnBook('999');
    assert.strictEqual(result, false);
});

test('Library: returnBook() - невдале повернення вже доступної книги', () => {
    const library = new Library();
    const book = new Book('1', 'Test', 'Author', '111', 2020, 'Fiction', true);
    library.addBook(book);
    
    const result = library.returnBook('1');
    assert.strictEqual(result, false);
});

test('Library: getUserBooks() - отримання книг користувача', () => {
    const library = new Library();
    const book1 = new Book('1', 'Book 1', 'Author', '111', 2020, 'Fiction');
    const book2 = new Book('2', 'Book 2', 'Author', '222', 2021, 'Fiction');
    const book3 = new Book('3', 'Book 3', 'Author', '333', 2022, 'Romance');
    library.addBook(book1);
    library.addBook(book2);
    library.addBook(book3);
    
    library.borrowBook('1', 'user1');
    library.borrowBook('2', 'user1');
    library.borrowBook('3', 'user2');
    
    const userBooks = library.getUserBooks('user1');
    assert.strictEqual(userBooks.length, 2);
    assert(userBooks.includes(book1));
    assert(userBooks.includes(book2));
});

test('Library: getUserBooks() - повернення книги видаляє її зі списку користувача', () => {
    const library = new Library();
    const book = new Book('1', 'Book', 'Author', '111', 2020, 'Fiction');
    library.addBook(book);
    
    library.borrowBook('1', 'user1');
    assert.strictEqual(library.getUserBooks('user1').length, 1);
    
    library.returnBook('1');
    assert.strictEqual(library.getUserBooks('user1').length, 0);
});

test('Library: getBorrowHistory() - отримання повної історії', () => {
    const library = new Library();
    const book1 = new Book('1', 'Book 1', 'Author', '111', 2020, 'Fiction');
    const book2 = new Book('2', 'Book 2', 'Author', '222', 2021, 'Fiction');
    library.addBook(book1);
    library.addBook(book2);
    
    library.borrowBook('1', 'user1');
    library.borrowBook('2', 'user2');
    library.returnBook('1');
    
    const history = library.getBorrowHistory();
    assert.strictEqual(history.length, 2);
    assert.strictEqual(history[0].bookId, '1');
    assert.strictEqual(history[0].userId, 'user1');
    assert.notStrictEqual(history[0].returnDate, null);
    assert.strictEqual(history[1].bookId, '2');
    assert.strictEqual(history[1].userId, 'user2');
    assert.strictEqual(history[1].returnDate, null);
    assert.strictEqual(history[0].book, book1);
    assert.strictEqual(history[1].book, book2);
});

test('Library: getBorrowHistory() - деструктуризація працює коректно', () => {
    const library = new Library();
    const book = new Book('1', 'Book', 'Author', '111', 2020, 'Fiction');
    library.addBook(book);
    library.borrowBook('1', 'user1');
    
    const history = library.getBorrowHistory();
    const [record] = history;
    const { bookId, userId, borrowDate, returnDate, book: historyBook } = record;
    
    assert.strictEqual(bookId, '1');
    assert.strictEqual(userId, 'user1');
    assert(borrowDate instanceof Date);
    assert.strictEqual(returnDate, null);
    assert.strictEqual(historyBook, book);
});

// ==================== Integration Tests ====================

console.log('\n--- Інтеграційні тести ---\n');

test('Integration: Повний цикл роботи з бібліотекою', () => {
    const library = new Library();
    
    // Додавання книг
    const book1 = new Book('1', 'Book 1', 'Author 1', '111', 2020, 'Fiction');
    const book2 = new Book('2', 'Book 2', 'Author 2', '222', 2021, 'Romance');
    library.addBook(book1);
    library.addBook(book2);
    
    // Взяття на прокат
    library.borrowBook('1', 'user1');
    assert.strictEqual(library.getAvailableBooks().length, 1);
    assert.strictEqual(library.getBorrowedBooks().length, 1);
    
    // Повернення
    library.returnBook('1');
    assert.strictEqual(library.getAvailableBooks().length, 2);
    assert.strictEqual(library.getBorrowedBooks().length, 0);
    
    // Пошук
    const results = library.searchBooks('Book');
    assert.strictEqual(results.length, 2);
});

// ==================== Підсумок тестування ====================

console.log('\n=== Підсумок тестування ===');
console.log(`Пройдено: ${testsPassed}`);
console.log(`Провалено: ${testsFailed}`);
console.log(`Всього: ${testsPassed + testsFailed}`);

if (testsFailed === 0) {
    console.log('\n✓ Всі тести пройдено успішно!');
    process.exit(0);
} else {
    console.log('\n✗ Деякі тести провалились');
    process.exit(1);
}

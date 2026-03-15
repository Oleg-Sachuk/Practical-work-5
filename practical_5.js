/**
 * Library Management System
 * Система управління бібліотекою книг
 */

/**
 * Класс Book репрезентує книгу в бібліотеці
 * @class
 */
class Book {
    /**
     * Створює новий екземпляр Book
     * @param {string} id - Унікальний ідентифікатор для книги
     * @param {string} title - Заголовок книги
     * @param {string} author - Автор книги
     * @param {string} isbn - ISBN номер
     * @param {number} year - Рік випуску
     * @param {string} genre - Жанр книги
     * @param {boolean} [available=true] - Чи доступна книга
     */
    constructor(id, title, author, isbn, year, genre, available = true) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.year = year;
        this.genre = genre;
        this.available = available;
    }

    /**
     * Позначає книгу як взяту
     * @returns {boolean} True якщо успішно, false якщо вже взята
     */
    borrow() {
        if (this.available) {
            this.available = false;
            return true;
        }
        return false;
    }

    /**
     * Позначає книгу як повернену (доступна)
     * @returns {boolean} True якщо успішно, false якщо вже доступна
     */
    return() {
        if (!this.available) {
            this.available = true;
            return true;
        }
        return false;
    }

    /**
     * Обчислює вік книги в роках
     * @returns {number} Вік книги в роках
     */
    getAge() {
        const currentYear = new Date().getFullYear();
        return currentYear - this.year;
    }

    /**
     * Повертає форматовану інформацію про книгу
     * @returns {string} Форматована інформація про книгу
     */
    getInfo() {
        const status = this.available ? 'Доступна' : 'Взята';
        return `${this.title} by ${this.author} (${this.year}) - ${this.genre} [${status}]`;
    }
}

/**
 * Класс Library управляє книгами і операціями взяття на прокат
 * @class
 */
class Library {
    /**
     * Створює новий екземпляр Library
     */
    constructor() {
        /** @type {Book[]} */
        this.books = [];
        
        /** @type {Array<{bookId: string, userId: string, borrowDate: Date, returnDate: Date|null}>} */
        this.borrowHistory = [];
    }

    /**
     * Додає книгу до бібліотеки
     * @param {Book} book - Екземпляр книги для додавання
     * @returns {boolean} True якщо додано успішно, false якщо книга з таким ID вже існує
     */
    addBook(book) {
        if (this.books.find(b => b.id === book.id)) {
            return false;
        }
        this.books.push(book);
        return true;
    }

    /**
     * Вилучає книгу з бібліотеки за ID
     * @param {string} id - ID книги для вилучення
     * @returns {boolean} True якщо вилучено успішно, false якщо книга не знайдена
     */
    removeBook(id) {
        const index = this.books.findIndex(book => book.id === id);
        if (index !== -1) {
            this.books.splice(index, 1);
            return true;
        }
        return false;
    }

    /**
     * Знаходить книгу за ISBN
     * @param {string} isbn - ISBN для пошуку
     * @returns {Book|undefined} Книга якщо знайдена, undefined якщо не знайдена
     */
    findBookByIsbn(isbn) {
        return this.books.find(book => book.isbn === isbn);
    }

    /**
     * Знаходить всі книги за автором
     * @param {string} author - Ім'я автора для пошуку
     * @returns {Book[]} Масив книг за автором
     */
    findBooksByAuthor(author) {
        return this.books.filter(book => 
            book.author.toLowerCase().includes(author.toLowerCase())
        );
    }

    /**
     * Знаходить всі книги за жанром
     * @param {string} genre - Жанр для пошуку
     * @returns {Book[]} Масив книг за жанром
     */
    findBooksByGenre(genre) {
        return this.books.filter(book => 
            book.genre.toLowerCase() === genre.toLowerCase()
        );
    }

    /**
     * Повертає всі доступні книги
     * @returns {Book[]} Масив доступних книг
     */
    getAvailableBooks() {
        return this.books.filter(book => book.available);
    }

    /**
     * Повертає всі взяті на прокат книги
     * @returns {Book[]} Масив взятих на прокат книг
     */
    getBorrowedBooks() {
        return this.books.filter(book => !book.available);
    }

    /**
     * Шукає книги за заголовком, автором або ISBN
     * @param {string} query - Запит для пошуку
     * @returns {Book[]} Масив збігаючихся книг
     */
    searchBooks(query) {
        const lowerQuery = query.toLowerCase();
        return this.books.filter(book => 
            book.title.toLowerCase().includes(lowerQuery) ||
            book.author.toLowerCase().includes(lowerQuery) ||
            book.isbn.toLowerCase().includes(lowerQuery)
        );
    }

    /**
     * Взяти книгу на прокат для користувача
     * @param {string} bookId - ID книги для взяття на прокат
     * @param {string} userId - ID користувача, який бере книгу на прокат
     * @returns {boolean} True якщо взято успішно, false якщо не вдалося
     */
    borrowBook(bookId, userId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) {
            return false;
        }

        if (book.borrow()) {
            this.borrowHistory.push({
                bookId,
                userId,
                borrowDate: new Date(),
                returnDate: null
            });
            return true;
        }
        return false;
    }

    /**
     * Повернути взяту книгу
     * @param {string} bookId - ID книги для повернення
     * @returns {boolean} True якщо повернено успішно, false якщо не вдалося
     */
    returnBook(bookId) {
        const book = this.books.find(b => b.id === bookId);
        if (!book) {
            return false;
        }

        if (book.return()) {
            const borrowRecord = this.borrowHistory.find(
                record => record.bookId === bookId && record.returnDate === null
            );
            if (borrowRecord) {
                borrowRecord.returnDate = new Date();
            }
            return true;
        }
        return false;
    }

    /**
     * Повертає всі книги, які в даний момент взяті на прокат користувачем
     * @param {string} userId - ID користувача
     * @returns {Book[]} Масив книг, які взяті на прокат користувачем
     */
    getUserBooks(userId) {
        const activeBorrows = this.borrowHistory.filter(
            record => record.userId === userId && record.returnDate === null
        );
        
        return activeBorrows.map(record => 
            this.books.find(book => book.id === record.bookId)
        ).filter(book => book !== undefined);
    }

    /**
     * Повертає повний історію взяття на прокат
     * @returns {Array<{bookId: string, userId: string, borrowDate: Date, returnDate: Date|null, book: Book}>} 
     * Повний історію взяття на прокат з деталями книги
     */
    getBorrowHistory() {
        return this.borrowHistory.map(record => {
            const { bookId, ...rest } = record;
            const book = this.books.find(b => b.id === bookId);
            return {
                ...rest,
                bookId,
                book: book || null
            };
        });
    }
}

// Приклад використання та тестування
if (require.main === module) {
    // Створюємо екземпляр бібліотеки
    const library = new Library();

    // Створюємо деякі книги
    const book1 = new Book('1', 'The Great Gatsby', 'F. Scott Fitzgerald', '978-0-7432-7356-5', 1925, 'Fiction');
    const book2 = new Book('2', '1984', 'George Orwell', '978-0-452-28423-4', 1949, 'Dystopian');
    const book3 = new Book('3', 'To Kill a Mockingbird', 'Harper Lee', '978-0-06-112008-4', 1960, 'Fiction');
    const book4 = new Book('4', 'Pride and Prejudice', 'Jane Austen', '978-0-14-143951-8', 1813, 'Romance');

    // Додаємо книги до бібліотеки
    library.addBook(book1);
    library.addBook(book2);
    library.addBook(book3);
    library.addBook(book4);

    console.log('=== Система управління бібліотекою ===\n');

    // Тестуємо методи книги
    console.log('Інформація про книгу:');
    console.log(book1.getInfo());
    console.log(`Вік: ${book1.getAge()} років\n`);

    // Тестуємо методи пошуку в бібліотеці
    console.log('Книги за автором "Orwell":');
    const orwellBooks = library.findBooksByAuthor('Orwell');
    orwellBooks.forEach(book => console.log(book.getInfo()));

    console.log('\nКниги в жанрі "Fiction":');
    const fictionBooks = library.findBooksByGenre('Fiction');
    fictionBooks.forEach(book => console.log(book.getInfo()));

    // Тестуємо систему взяття на прокат
    console.log('\n=== Система взяття на прокат ===');
    library.borrowBook('1', 'user1');
    library.borrowBook('2', 'user1');
    library.borrowBook('3', 'user2');

    console.log('\nДоступні книги:');
    library.getAvailableBooks().forEach(book => console.log(book.getInfo()));

    console.log('\nВзяті на прокат книги:');
    library.getBorrowedBooks().forEach(book => console.log(book.getInfo()));

    console.log('\nКниги, взяті на прокат користувачем "user1":');
    library.getUserBooks('user1').forEach(book => console.log(book.getInfo()));

    // Тестуємо повернення книги
    console.log('\nПовертаємо книгу 1...');
    library.returnBook('1');
    console.log('Доступні книги після повернення:');
    library.getAvailableBooks().forEach(book => console.log(book.getInfo()));

    // Тестуємо пошуку книг
    console.log('\nРезультати пошуку для "kill":');
    library.searchBooks('kill').forEach(book => console.log(book.getInfo()));

    // Показуємо історію взяття на прокат
    console.log('\n=== Історія взяття на прокат ===');
    const history = library.getBorrowHistory();
    history.forEach(record => {
        const { book, userId, borrowDate, returnDate } = record;
        const status = returnDate ? 'Повернена' : 'Активна';
        console.log(`${book?.title || 'Unknown'} - Користувач: ${userId} - ${status} (Взята: ${borrowDate.toLocaleDateString()})`);
    });
}

module.exports = { Book, Library };

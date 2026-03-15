# Система управління бібліотекою (Library Management System)

## Опис

Система управління бібліотекою - це JavaScript-додаток для управління колекцією книг, їх пошуку та системи взяття на прокат. Система реалізована з використанням ES6+ синтаксису та об'єктно-орієнтованого підходу.

## Структури даних

### 1. Клас `Book`

Клас `Book` представляє окрему книгу в бібліотеці.

#### Властивості (Properties)

- **`id`** (string) - Унікальний ідентифікатор книги
- **`title`** (string) - Назва книги
- **`author`** (string) - Автор книги
- **`isbn`** (string) - ISBN номер книги
- **`year`** (number) - Рік випуску книги
- **`genre`** (string) - Жанр книги
- **`available`** (boolean) - Статус доступності книги (за замовчуванням `true`)

#### Методи (Methods)

- **`borrow()`** - Позначає книгу як взяту на прокат
  - Повертає: `boolean` - `true` якщо операція успішна, `false` якщо книга вже взята
  
- **`return()`** - Позначає книгу як повернену (доступну)
  - Повертає: `boolean` - `true` якщо операція успішна, `false` якщо книга вже доступна
  
- **`getAge()`** - Обчислює вік книги в роках
  - Повертає: `number` - Вік книги в роках (поточна дата - рік випуску)
  
- **`getInfo()`** - Повертає форматовану інформацію про книгу
  - Повертає: `string` - Форматований рядок з інформацією про книгу та її статус

#### Приклад структури об'єкта Book:

```javascript
{
  id: "1",
  title: "The Great Gatsby",
  author: "F. Scott Fitzgerald",
  isbn: "978-0-7432-7356-5",
  year: 1925,
  genre: "Fiction",
  available: true
}
```

---

### 2. Клас `Library`

Клас `Library` управляє колекцією книг та операціями взяття на прокат.

#### Внутрішні структури даних

##### `books` (Array<Book>)
Масив об'єктів типу `Book`, що містить всі книги в бібліотеці.

**Структура:**
```javascript
books = [
  Book { id: "1", title: "...", author: "...", ... },
  Book { id: "2", title: "...", author: "...", ... },
  ...
]
```

##### `borrowHistory` (Array<BorrowRecord>)
Масив записів про історію взяття книг на прокат.

**Структура запису BorrowRecord:**
```javascript
{
  bookId: string,        // ID книги
  userId: string,        // ID користувача
  borrowDate: Date,      // Дата взяття на прокат
  returnDate: Date|null  // Дата повернення (null якщо ще не повернена)
}
```

**Приклад:**
```javascript
borrowHistory = [
  {
    bookId: "1",
    userId: "user1",
    borrowDate: new Date("2024-01-15"),
    returnDate: null
  },
  {
    bookId: "2",
    userId: "user1",
    borrowDate: new Date("2024-01-10"),
    returnDate: new Date("2024-01-20")
  }
]
```

#### Методи управління книгами

- **`addBook(book: Book): boolean`**
  - Додає книгу до бібліотеки
  - Повертає `true` якщо книга додана успішно, `false` якщо книга з таким ID вже існує
  
- **`removeBook(id: string): boolean`**
  - Вилучає книгу з бібліотеки за ID
  - Повертає `true` якщо книга вилучена, `false` якщо не знайдена

#### Методи пошуку

- **`findBookByIsbn(isbn: string): Book|undefined`**
  - Знаходить книгу за ISBN номером
  - Повертає об'єкт `Book` або `undefined` якщо не знайдена
  
- **`findBooksByAuthor(author: string): Book[]`**
  - Знаходить всі книги за автором (пошук нечутливий до регістру, частковий збіг)
  - Повертає масив об'єктів `Book`
  
- **`findBooksByGenre(genre: string): Book[]`**
  - Знаходить всі книги за жанром (пошук нечутливий до регістру, точний збіг)
  - Повертає масив об'єктів `Book`
  
- **`searchBooks(query: string): Book[]`**
  - Шукає книги за заголовком, автором або ISBN (пошук нечутливий до регістру)
  - Повертає масив об'єктів `Book`, що містять запит у будь-якому з полів

#### Методи статусу

- **`getAvailableBooks(): Book[]`**
  - Повертає масив всіх доступних книг (де `available === true`)
  
- **`getBorrowedBooks(): Book[]`**
  - Повертає масив всіх взятих на прокат книг (де `available === false`)

#### Методи системи взяття на прокат

- **`borrowBook(bookId: string, userId: string): boolean`**
  - Взяти книгу на прокат для користувача
  - Створює запис в `borrowHistory` з датою взяття
  - Повертає `true` якщо операція успішна, `false` якщо книга не знайдена або вже взята
  
- **`returnBook(bookId: string): boolean`**
  - Повернути взяту книгу
  - Оновлює запис в `borrowHistory`, встановлюючи `returnDate`
  - Повертає `true` якщо операція успішна, `false` якщо книга не знайдена або вже доступна
  
- **`getUserBooks(userId: string): Book[]`**
  - Повертає масив книг, які в даний момент взяті на прокат користувачем
  - Фільтрує `borrowHistory` за `userId` та `returnDate === null`
  - Повертає масив об'єктів `Book`
  
- **`getBorrowHistory(): Array<BorrowHistoryRecord>`**
  - Повертає повну історію взяття на прокат
  - Кожен запис містить деталі книги через посилання на об'єкт `Book`
  - Повертає масив об'єктів типу:
    ```javascript
    {
      bookId: string,
      userId: string,
      borrowDate: Date,
      returnDate: Date|null,
      book: Book|null  // Посилання на об'єкт Book або null
    }
    ```

## Взаємозв'язки структур даних

### Посилання між об'єктами

1. **Library → Books**: Масив `books` містить прямі посилання на об'єкти `Book`
2. **Library → BorrowHistory**: Масив `borrowHistory` містить `bookId`, який використовується для пошуку відповідного об'єкта `Book` в масиві `books`
3. **BorrowHistory → Book**: Метод `getBorrowHistory()` створює посилання на об'єкти `Book` через поле `book`

### Управління станом

- Стан доступності книги зберігається в об'єкті `Book` (властивість `available`)
- Історія операцій зберігається в `Library.borrowHistory`
- При взятті книги на прокат:
  - `Book.available` змінюється на `false`
  - Створюється новий запис в `borrowHistory` з `returnDate: null`
- При поверненні книги:
  - `Book.available` змінюється на `true`
  - Оновлюється відповідний запис в `borrowHistory`, встановлюючи `returnDate`

## Використання

### Базовий приклад

```javascript
const { Book, Library } = require('./practical_5');

// Створення бібліотеки
const library = new Library();

// Створення книги
const book = new Book('1', '1984', 'George Orwell', '978-0-452-28423-4', 1949, 'Dystopian');

// Додавання книги до бібліотеки
library.addBook(book);

// Взяття книги на прокат
library.borrowBook('1', 'user1');

// Пошук книг
const orwellBooks = library.findBooksByAuthor('Orwell');
const availableBooks = library.getAvailableBooks();
```

## Технічні деталі

- **Мова**: JavaScript (ES6+)
- **Підхід**: Об'єктно-орієнтоване програмування з класами
- **Синтаксис**: ES6+ (класи, стрілкові функції, деструктуризація, template literals)
- **Документація**: JSDoc для всіх класів та методів
- **Тестування**: Unit тести для всіх методів (див. `practical_5.test.js`)

## Запуск

```bash
# Запуск основного файлу з прикладами
node practical_5.js

# Запуск тестів
node practical_5.test.js
```

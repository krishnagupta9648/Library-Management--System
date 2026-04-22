const API_BASE_URL = '/api';

// Mock Data for fallback when backend is not running
const getMockData = (key) => JSON.parse(localStorage.getItem(key) || '[]');
const setMockData = (key, data) => localStorage.setItem(key, JSON.stringify(data));

// Initial Mock Seed
if (!localStorage.getItem('mock_books')) {
  setMockData('mock_books', [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565', totalCopies: 5, availableCopies: 5, description: 'A classic novel of the Jazz Age.' },
    { id: 2, title: '1984', author: 'George Orwell', isbn: '9780451524935', totalCopies: 3, availableCopies: 2, description: 'Dystopian social science fiction.' }
  ]);
  setMockData('mock_issues', []);
}

export const apiService = {
  // Books
  getBooks: async (search) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books${search ? `?search=${search}` : ''}`);
      if (!response.ok) throw new Error('Backend error');
      return await response.json();
    } catch {
      let books = getMockData('mock_books');
      if (search) {
        books = books.filter(b => b.title.includes(search) || b.author.includes(search));
      }
      return books;
    }
  },
  getBookById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`);
      return await response.json();
    } catch {
      return getMockData('mock_books').find(b => b.id === id);
    }
  },
  addBook: async (book) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      if (!response.ok) throw new Error('Backend failed');
      return await response.json();
    } catch {
      const books = getMockData('mock_books');
      const newBook = { ...book, id: Date.now(), availableCopies: book.totalCopies };
      setMockData('mock_books', [...books, newBook]);
      return newBook;
    }
  },
  updateBook: async (id, book) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(book)
      });
      if (!response.ok) throw new Error('Backend failed');
    } catch {
      const books = getMockData('mock_books');
      setMockData('mock_books', books.map(b => b.id === id ? { ...b, ...book } : b));
    }
  },
  deleteBook: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Backend failed');
    } catch {
      const books = getMockData('mock_books');
      setMockData('mock_books', books.filter(b => b.id !== id));
    }
  },

  // Issues
  getIssues: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues`);
      if (!response.ok) throw new Error('Backend failed');
      return await response.json();
    } catch {
      return getMockData('mock_issues');
    }
  },
  issueBook: async (bookId, userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/issue?bookId=${bookId}&userId=${userId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Backend failed');
      return await response.json();
    } catch {
      const issues = getMockData('mock_issues');
      const books = getMockData('mock_books');
      const book = books.find(b => b.id === bookId);
      if (book && book.availableCopies > 0) {
        book.availableCopies--;
        const newIssue = { id: Date.now(), bookId, userId, book, user: { name: 'Admin User' }, issueDate: new Date().toISOString(), isReturned: false };
        setMockData('mock_issues', [...issues, newIssue]);
        setMockData('mock_books', books);
        return newIssue;
      }
      throw new Error('No copies available');
    }
  },
  returnBook: async (issueId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/issues/return/${issueId}`, {
        method: 'POST'
      });
      if (!response.ok) throw new Error('Backend failed');
      return await response.json();
    } catch {
      const issues = getMockData('mock_issues');
      const books = getMockData('mock_books');
      const issue = issues.find(i => i.id === issueId);
      if (issue && !issue.isReturned) {
        issue.isReturned = true;
        issue.returnDate = new Date().toISOString();
        const book = books.find(b => b.id === issue.bookId);
        if (book) book.availableCopies++;
        setMockData('mock_issues', issues);
        setMockData('mock_books', books);
        return issue;
      }
      return issue;
    }
  },

  // Stats
  getStats: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/stats`);
      if (!response.ok) throw new Error('Backend failed');
      return await response.json();
    } catch {
      const books = getMockData('mock_books');
      const issues = getMockData('mock_issues');
      return {
        totalBooks: books.length,
        totalIssued: issues.filter(i => !i.isReturned).length,
        totalUsers: 1,
        availableCopies: books.reduce((acc, b) => acc + b.availableCopies, 0)
      };
    }
  }
};

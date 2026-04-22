import React, { useState, useEffect } from 'react'
import { Book as BookIcon, LayoutDashboard, List, BookOpen, Search, Plus, Trash2, Edit3, ArrowUpRight, ArrowDownLeft } from 'lucide-react'
import { apiService } from './services/api'

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [books, setBooks] = useState([])
  const [stats, setStats] = useState({ totalBooks: 0, totalIssued: 0, availableCopies: 0, totalUsers: 0 })
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)

  // Fetch initial data or search results
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery])

  const fetchData = async () => {
    setLoading(true)
    try {
      const b = await apiService.getBooks(searchQuery)
      const s = await apiService.getStats()
      setBooks(b)
      setStats(s)
    } catch (err) {
      console.error("Failed to fetch data", err)
    }
    setLoading(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchData()
  }

  const handleDelete = async (id) => {
    // Console log for debugging
    console.log("Deleting book with ID:", id);
    await apiService.deleteBook(id);
    fetchData();
  }

  const handleIssue = async (bookId) => {
    try {
      await apiService.issueBook(bookId, 1); // Using default Admin User ID
      fetchData();
      alert("Book issued successfully!");
    } catch (err) {
      alert("Failed to issue book: " + err.message);
    }
  }

  return (
    <div className="main-layout">
      {/* Top Navigation */}
      <header className="top-nav">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2 rounded-lg">
            <BookIcon size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold font-heading">LMS Pro</h1>
        </div>

        <nav className="nav-links-container">
          <SidebarLink 
            icon={<LayoutDashboard size={20} />} 
            label="Dashboard" 
            active={activeTab === 'dashboard'} 
            onClick={() => setActiveTab('dashboard')} 
          />
          <SidebarLink 
            icon={<List size={20} />} 
            label="Book Catalog" 
            active={activeTab === 'books'} 
            onClick={() => setActiveTab('books')} 
          />
          <SidebarLink 
            icon={<BookOpen size={20} />} 
            label="Issued Books" 
            active={activeTab === 'issued'} 
            onClick={() => setActiveTab('issued')} 
          />
        </nav>

        <div className="nav-actions-container">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted transition-all" size={18} />
            <input 
              type="text" 
              placeholder="Search books..." 
              className="input-field pl-10 w-full min-w-[200px] md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="btn btn-primary whitespace-nowrap" onClick={() => { setEditingBook(null); setIsModalOpen(true); }}>
            <Plus size={20} />
            <span className="hidden sm:inline">Add New Book</span>
            <span className="sm:hidden text-lg">+</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="content-area">
        <header className="flex justify-between items-center mb-12">
          <div>
            <p className="text-text-muted text-sm capitalize">{activeTab} Section</p>
            <h2 className="text-4xl font-bold mt-2 font-heading">Manage Your {activeTab}</h2>
          </div>
        </header>

        {activeTab === 'dashboard' && <DashboardView stats={stats} books={books.slice(0, 5)} />}
        {activeTab === 'books' && <BooksView books={books} onDelete={handleDelete} onEdit={(b) => { setEditingBook(b); setIsModalOpen(true); }} onIssue={handleIssue} />}
        {activeTab === 'issued' && <IssuedView onReturn={fetchData} />}
      </main>

      {/* Book Modal */}
      {isModalOpen && (
        <BookModal 
          book={editingBook} 
          onClose={() => setIsModalOpen(false)} 
          onSuccess={() => { setIsModalOpen(false); fetchData(); }} 
        />
      )}
    </div>
  )
}

function SidebarLink({ icon, label, active, onClick }) {
  return (
    <button 
      onClick={onClick}
      className={`sidebar-link ${active ? 'active' : ''}`}
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  )
}

function DashboardView({ stats, books }) {
  return (
    <div className="flex flex-col gap-10 animate-fade-in">
      <div className="dashboard-grid">
        <StatCard label="Total Books" value={stats.totalBooks} icon={<List className="text-primary" />} />
        <StatCard label="Issued Books" value={stats.totalIssued} icon={<ArrowUpRight className="text-secondary" />} />
        <StatCard label="Available Copies" value={stats.availableCopies} icon={<ArrowDownLeft className="text-accent" />} />
        <StatCard label="Total Users" value={stats.totalUsers} icon={<BookOpen className="text-success" />} />
      </div>

      <div className="glass-card">
        <h3 className="text-xl font-bold mb-8">Recent Books</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            {books.map(book => (
              <tr key={book.id}>
                <td className="font-medium">{book.title}</td>
                <td>{book.author}</td>
                <td className="text-text-muted">{book.isbn}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${book.availableCopies > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
                    {book.availableCopies} / {book.totalCopies}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon }) {
  return (
    <div className="glass-card flex flex-col gap-4">
      <div className="flex justify-between items-start">
        <div className="p-3 bg-white/5 rounded-xl">
          {icon}
        </div>
      </div>
      <div>
        <p className="text-text-muted text-sm font-medium">{label}</p>
        <h4 className="text-2xl font-bold mt-1">{value}</h4>
      </div>
    </div>
  )
}

function BooksView({ books, onDelete, onEdit, onIssue }) {
  return (
    <div className="glass-card animate-fade-in">
      <table className="data-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Copies</th>
            <th className="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map(book => (
            <tr key={book.id}>
              <td>
                <div className="font-semibold">{book.title}</div>
                <div className="text-xs text-text-muted">{book.description?.substring(0, 50)}</div>
              </td>
              <td className="text-text-muted">{book.author}</td>
              <td className="text-text-muted font-mono text-sm">{book.isbn}</td>
              <td>
                <div className="flex items-center gap-2">
                  <span className="font-bold">{book.availableCopies}</span>
                  <span className="text-text-muted text-xs">/ {book.totalCopies}</span>
                </div>
              </td>
              <td className="text-right">
                <div className="flex justify-end gap-2">
                  <button 
                    onClick={() => onIssue(book.id)} 
                    className="p-2 hover:bg-white/5 rounded-lg text-success"
                    disabled={book.availableCopies <= 0}
                    title="Issue Book"
                  >
                    <BookOpen size={18} />
                  </button>
                  <button onClick={() => onEdit(book)} className="p-2 hover:bg-white/5 rounded-lg text-primary" title="Edit Book">
                    <Edit3 size={18} />
                  </button>
                  <button onClick={() => onDelete(book.id)} className="p-2 hover:bg-white/5 rounded-lg text-error" title="Delete Book">
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BookModal({ book, onClose, onSuccess }) {
  const [formData, setFormData] = useState(book || { title: '', author: '', isbn: '', totalCopies: 1, description: '' })

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (book) {
        await apiService.updateBook(book.id, formData)
      } else {
        await apiService.addBook(formData)
      }
      onSuccess()
    } catch (err) {
      console.error("Submission failed", err)
      alert("Failed to save book. Please ensure the backend server is running and the database is connected.")
      // Optional: Close modal anyway for demo purposes if desired, but better to keep it open
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="glass-card modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="text-2xl font-bold mb-6">{book ? 'Edit Book' : 'Add New Book'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-4">
            <div className="input-group">
              <label className="input-label">Title</label>
              <input 
                type="text" 
                className="input-field" 
                required 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Author</label>
              <input 
                type="text" 
                className="input-field" 
                required 
                value={formData.author} 
                onChange={e => setFormData({ ...formData, author: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="input-group">
                <label className="input-label">ISBN</label>
                <input 
                  type="text" 
                  className="input-field" 
                  value={formData.isbn} 
                  onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Total Copies</label>
                <input 
                  type="number" 
                  min="1" 
                  className="input-field" 
                  required 
                  value={formData.totalCopies} 
                  onChange={e => setFormData({ ...formData, totalCopies: parseInt(e.target.value) })}
                />
              </div>
            </div>
            <div className="input-group">
              <label className="input-label">Description</label>
              <textarea 
                className="input-field h-24 resize-none" 
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>
          <div className="flex justify-end gap-4 mt-8">
            <button type="button" className="btn btn-outline" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{book ? 'Save Changes' : 'Add Book'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
function IssuedView({ onReturn }) {
  const [issues, setIssues] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchIssues()
  }, [])

  const fetchIssues = async () => {
    setLoading(true)
    try {
      const data = await apiService.getIssues()
      setIssues(data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleReturn = async (id) => {
    await apiService.returnBook(id)
    fetchIssues()
    onReturn()
  }

  return (
    <div className="glass-card animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Issued Books Records</h3>
        <button className="btn btn-primary text-sm" onClick={() => fetchIssues()}>
          Refresh
        </button>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Book</th>
            <th>Borrower</th>
            <th>Issue Date</th>
            <th>Status</th>
            <th className="text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {issues.length === 0 ? (
            <tr><td colSpan="5" className="text-center text-text-muted py-8">No issue records found</td></tr>
          ) : (
            issues.map(issue => (
              <tr key={issue.id}>
                <td>
                  <div className="font-medium">{issue.book?.title}</div>
                  <div className="text-xs text-text-muted">ISBN: {issue.book?.isbn}</div>
                </td>
                <td>
                  <div className="font-medium">{issue.user?.name}</div>
                  <div className="text-xs text-text-muted">{issue.user?.email}</div>
                </td>
                <td className="text-text-muted">{new Date(issue.issueDate).toLocaleDateString()}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${issue.isReturned ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary'}`}>
                    {issue.isReturned ? 'Returned' : 'Active'}
                  </span>
                </td>
                <td className="text-right">
                  {!issue.isReturned && (
                    <button onClick={() => handleReturn(issue.id)} className="btn btn-primary text-xs py-1 px-3">
                      Return Book
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

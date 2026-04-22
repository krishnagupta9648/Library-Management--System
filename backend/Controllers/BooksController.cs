using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS.API.Data;
using LMS.API.Models;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // Controller to manage book catalog operations
    public class BooksController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BooksController(AppDbContext context)
        {
            _context = context;
        }

        // Search books by title, author, or ISBN
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetAllBooks(string? search)
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(search))
            {
                query = query.Where(b => b.Title.Contains(search) || b.Author.Contains(search) || b.ISBN.Contains(search));
            }

            return await query.ToListAsync();
        }

        // Get a specific book by its ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBookDetails(int id)
        {
            var book = await _context.Books.FindAsync(id);

            if (book == null) return NotFound();

            return book;
        }

        // Add a new book to the library
        [HttpPost]
        public async Task<ActionResult<Book>> CreateNewBook(Book book)
        {
            book.AvailableCopies = book.TotalCopies;
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBookDetails), new { id = book.Id }, book);
        }

        // Update existing book information
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, Book book)
        {
            if (id != book.Id) return BadRequest("ID mismatch");
            
            // TODO: Add more validation here (e.g. check if total copies decreased below issued count)

            _context.Entry(book).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // Permanently remove a book
        [HttpDelete("{id}")]
        public async Task<IActionResult> RemoveBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(int id)
        {
            return _context.Books.Any(e => e.Id == id);
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS.API.Data;
using LMS.API.Models;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IssuesController : ControllerBase
    {
        private readonly AppDbContext _context;

        public IssuesController(AppDbContext context)
        {
            _context = context;
        }

        // POST: api/Issues/issue
        [HttpPost("issue")]
        public async Task<IActionResult> IssueBook(int bookId, int userId)
        {
            var book = await _context.Books.FindAsync(bookId);
            var user = await _context.Users.FindAsync(userId);

            if (book == null || user == null) return NotFound("Book or User not found");
            if (book.AvailableCopies <= 0) return BadRequest("No copies available");

            var issue = new BookIssue
            {
                BookId = bookId,
                UserId = userId,
                IssueDate = DateTime.UtcNow,
                IsReturned = false
            };

            book.AvailableCopies--;
            _context.BookIssues.Add(issue);
            await _context.SaveChangesAsync();

            return Ok(issue);
        }

        // POST: api/Issues/return/{issueId}
        [HttpPost("return/{issueId}")]
        public async Task<IActionResult> ReturnBook(int issueId)
        {
            var issue = await _context.BookIssues.Include(i => i.Book).FirstOrDefaultAsync(i => i.Id == issueId);

            if (issue == null) return NotFound("Issue record not found");
            if (issue.IsReturned) return BadRequest("Book already returned");

            issue.ReturnDate = DateTime.UtcNow;
            issue.IsReturned = true;

            if (issue.Book != null)
            {
                issue.Book.AvailableCopies++;
            }

            await _context.SaveChangesAsync();

            return Ok(issue);
        }

        // GET: api/Issues
        [HttpGet]
        public async Task<ActionResult<IEnumerable<BookIssue>>> GetIssues()
        {
            return await _context.BookIssues
                .Include(i => i.Book)
                .Include(i => i.User)
                .OrderByDescending(i => i.IssueDate)
                .ToListAsync();
        }
    }
}

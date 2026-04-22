using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using LMS.API.Data;

namespace LMS.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalBooks = await _context.Books.CountAsync();
            var totalIssued = await _context.BookIssues.CountAsync(i => !i.IsReturned);
            var totalUsers = await _context.Users.CountAsync();
            var availableCopies = await _context.Books.SumAsync(b => b.AvailableCopies);

            return Ok(new
            {
                TotalBooks = totalBooks,
                TotalIssued = totalIssued,
                TotalUsers = totalUsers,
                AvailableCopies = availableCopies
            });
        }
    }
}

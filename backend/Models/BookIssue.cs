using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace LMS.API.Models
{
    public class BookIssue
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int BookId { get; set; }

        [ForeignKey("BookId")]
        public Book? Book { get; set; }

        [Required]
        public int UserId { get; set; }

        [ForeignKey("UserId")]
        public User? User { get; set; }

        public DateTime IssueDate { get; set; } = DateTime.UtcNow;

        public DateTime? ReturnDate { get; set; }

        public bool IsReturned { get; set; } = false;
    }
}

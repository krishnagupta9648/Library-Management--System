using System.ComponentModel.DataAnnotations;

namespace LMS.API.Models
{
    public class Book
    {
        [Key]
        public int Id { get; set; }

        [Required]
        [MaxLength(200)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string Author { get; set; } = string.Empty;

        [MaxLength(50)]
        public string ISBN { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public int TotalCopies { get; set; }
        
        public int AvailableCopies { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}

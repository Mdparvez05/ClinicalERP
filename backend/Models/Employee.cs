
namespace backend.Models
{
    public class Employee
    {
        public int Id { get; set; } 

        public string FirstName { get; set; }
        public string LastName { get; set; } = string.Empty;
        public Gender Gender { get; set; }
        public string Email { get; set; }  = string.Empty;
        public string Phone {get; set; }  = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int Position { get; set; }
        public int Department { get; set; }
        public DateTime HireDate { get; set; }
        public int CreatedBy { get; set; }
        public int UpdatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public DateTime UpdatedOn { get; set;} = DateTime.MinValue;
        public bool IsActive { get; set; } = true;

    }
    public enum Gender
    {
        Male = 1,
        Female = 2,
        LGBTQIA = 3
    }
}

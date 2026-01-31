namespace backend.Models
{
    public class Patient
    {
        public int Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; } = string.Empty;

        public string Email { get; set; }  = string.Empty;

        public string Phone {get; set; }  = string.Empty;

        public string Address { get; set; }  = string.Empty;

        public DateTime DateOfBirth { get; set; };

        public string CreatedBy { get; set; } ;

        public string UpdatedBy { get; set; }  = string.Empty;

        public DateTime CreatedOn { get; set; }; 

        public DateTime UpdatedOn { get; set;} = DateTime.MinValue;

        public bool IsActive { get; set; } = true;



    }
}

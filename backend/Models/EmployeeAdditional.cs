namespace backend.Models
{
    public class EmployeeAdditional
    {   
        public int Id { get; set; }
        public string HighestQualification { get; set; } = string.Empty;
        public string BankName { get; set; } = string.Empty;
        public string BankBranch { get; set; } = string.Empty;
        public string BankAccountNumber { get; set; } = string.Empty;
        public string BankIFSC { get; set; } = string.Empty;
    }
}

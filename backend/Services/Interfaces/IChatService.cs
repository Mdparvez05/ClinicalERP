namespace backend.Services.Interfaces
{
    public interface IChatService
    {
        Task<string> AskAI(string message);
    }
}

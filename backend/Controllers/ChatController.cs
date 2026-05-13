using backend.DTOs.Chat;
using backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;


namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatController : ControllerBase
    {

        private readonly IChatService _chatService;
        public ChatController(IChatService chatService) 
        {
            _chatService = chatService;
        }

        [HttpPost("ask")]
        public async Task<IActionResult> Ask(ChatRequestDTO request)
        {
            var response = await _chatService.AskAI(request.Message);

            return Ok(new ChatResponseDto
            {
                Reply = response
            });
        }

    }
}

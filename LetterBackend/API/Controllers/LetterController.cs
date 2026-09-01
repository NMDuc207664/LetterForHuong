using Application.Interfaces;
using Domain.Entities;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class LetterController : ControllerBase
{
    private readonly IEmailService _emailService;

    public LetterController(IEmailService emailService)
    {
        _emailService = emailService;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendLetter([FromBody] LetterPayload payload)
    {
        if (string.IsNullOrWhiteSpace(payload.Content))
        {
            return BadRequest(new { message = "Nội dung thư không được để trống." });
        }

        try
        {
            var isSuccess = await _emailService.SendLetterAsync(payload);
            
            if (isSuccess)
            {
                return Ok(new { message = "Gửi thư thành công!" });
            }
            
            return StatusCode(500, new { message = "Dịch vụ gửi email từ chối request." });
        }
        catch (Exception ex)
        {
            // Trả về lỗi chi tiết để dễ debug trên local
            return StatusCode(500, new { message = "Lỗi server", error = ex.Message });
        }
    }
}
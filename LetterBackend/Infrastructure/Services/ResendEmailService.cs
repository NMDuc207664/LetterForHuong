using Application.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Resend;

namespace Infrastructure.Services;

public class ResendEmailService : IEmailService
{
    private readonly IResend _resend;

    public ResendEmailService(IResend resend)
    {
        _resend = resend;
    }

    public async Task<bool> SendLetterAsync(LetterPayload payload)
    {
        var message = new EmailMessage
        {
            From = $"{payload.From}", // Dùng email test mặc định của Resend
            To = $"{payload.To}", // Điền email thật của bạn vào đây để nhận thư
            Subject = $"{payload.Subject}",
            HtmlBody = $"<p>{payload.Content.Replace("\n", "<br>")}</p>"
        };

        var response = await _resend.EmailSendAsync(message);

        if (!response.Success)
        {
            throw new Exception($"Resend từ chối request: {response.Content}");
        }

        return true;
    }
}
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.Extensions.Configuration;

namespace Infrastructure.Services;

public class ResendEmailService : IEmailService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public ResendEmailService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<bool> SendLetterAsync(LetterPayload payload)
    {
        // Đọc API Key từ biến môi trường (Environment Variables) hoặc appsettings
        var apiKey = _configuration["ResendApiKey"];
        
        if (string.IsNullOrEmpty(apiKey)) 
            throw new Exception("Chưa cấu hình ResendApiKey.");

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", apiKey);

        // Định dạng payload theo chuẩn API của Resend
        var requestBody = new
        {
            from = "onboarding@resend.dev", // Dùng email test mặc định của Resend
            to = "email-cua-ban@gmail.com", // Điền email thật của bạn vào đây để nhận thư
            subject = "Bạn có một tâm thư mới",
            html = $"<p><strong>Nội dung:</strong></p><p>{payload.Content.Replace("\n", "<br>")}</p>"
        };

        var jsonContent = new StringContent(
            JsonSerializer.Serialize(requestBody), 
            Encoding.UTF8, 
            "application/json"
        );

        var response = await _httpClient.PostAsync("https://api.resend.com/emails", jsonContent);

        return response.IsSuccessStatusCode;
    }
}
using Domain.Entities;

namespace Application.Interfaces;

public interface IEmailService
{
    // Hàm gửi email bất đồng bộ, trả về true nếu gửi thành công
    Task<bool> SendLetterAsync(LetterPayload payload);
}
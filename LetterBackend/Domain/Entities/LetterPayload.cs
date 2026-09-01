namespace Domain.Entities;

public class LetterPayload
{
    // Chứa nội dung bức thư người dùng nhập vào text field
    public string From { get; set; } = string.Empty;
    public string To { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
}
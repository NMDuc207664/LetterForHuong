using Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// 1. Đăng ký Controllers
builder.Services.AddControllers();

// 2. Đăng ký các Services từ tầng Infrastructure
builder.Services.AddInfrastructureServices(builder.Configuration);

// 3. Cấu hình CORS cho phép Vue gọi API
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        // Thay bằng domain Vercel sau khi deploy
        policy.WithOrigins("https://letterforhuong.onrender.com") 
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Kích hoạt CORS (Phải đặt trước UseAuthorization và MapControllers)
app.UseCors("AllowFrontend");

app.UseAuthorization();
app.MapControllers();

app.Run();
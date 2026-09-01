using Application.Interfaces;
using Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        // AddHttpClient tự động khởi tạo HttpClient và tiêm vào ResendEmailService
        services.AddHttpClient<IEmailService, ResendEmailService>();
        
        return services;
    }
}
using Application.Interfaces;
using Infrastructure.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Resend;

namespace Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddResend(o =>
        {
            o.ApiToken = configuration["ResendApiKey"]
                ?? throw new InvalidOperationException("Chưa cấu hình ResendApiKey.");
        });

        services.AddScoped<IEmailService, ResendEmailService>();

        return services;
    }
}
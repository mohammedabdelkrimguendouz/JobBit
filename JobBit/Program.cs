
//using System.Text;
//using Microsoft.AspNetCore.Authentication.JwtBearer;
//using Microsoft.IdentityModel.Tokens;
//using JobBit.Token;
using JobBit_Business;
using Microsoft.OpenApi.Models;




var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle



// Configure JWT Authentication
//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//.AddJwtBearer(options =>
//{
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,
//        ValidIssuer = builder.Configuration["Jwt:Issuer"],
//        ValidAudience = builder.Configuration["Jwt:Audience"],
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:SecretKey"]))
//    };

//});

//builder.Services.AddAuthorization(options =>
//{
//    options.AddPolicy(nameof(User.enUserPolicy.JobSeekerPolicy), policy => policy.RequireRole(nameof(User.enUserType.JobSeeker)));
//    options.AddPolicy(nameof(User.enUserPolicy.CompanyPolicy), policy => policy.RequireRole(nameof(User.enUserType.Company)));
//});




builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "JobBit APIs", Version = "v1" });

   
    c.AddServer(new OpenApiServer
    {
        Url = "https://fc4b-197-207-173-91.ngrok-free.app"
    });
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyMethod()
                  .AllowAnyHeader();
        });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();



//app.UseAuthentication();

//app.UseMiddleware<TokenValidationMiddleware>();

app.UseAuthorization();

app.MapControllers();

app.Run();

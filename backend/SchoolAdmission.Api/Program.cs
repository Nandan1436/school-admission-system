using SchoolAdmission.Api.Extensions;
using SchoolAdmission.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddData(builder.Configuration.GetDatabaseConnectionString());
builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();

await app.MigrateDatabaseAsync();
app.Run();

public partial class Program;

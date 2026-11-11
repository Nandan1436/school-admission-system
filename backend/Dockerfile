FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY SchoolAdmission.Api/SchoolAdmission.Api.csproj SchoolAdmission.Api/
COPY SchoolAdmission.Services/SchoolAdmission.Services.csproj SchoolAdmission.Services/
COPY SchoolAdmission.Data/SchoolAdmission.Data.csproj SchoolAdmission.Data/
COPY SchoolAdmission.Domain/SchoolAdmission.Domain.csproj SchoolAdmission.Domain/
RUN dotnet restore SchoolAdmission.Api/SchoolAdmission.Api.csproj

COPY SchoolAdmission.Api/ SchoolAdmission.Api/
COPY SchoolAdmission.Services/ SchoolAdmission.Services/
COPY SchoolAdmission.Data/ SchoolAdmission.Data/
COPY SchoolAdmission.Domain/ SchoolAdmission.Domain/
RUN dotnet publish SchoolAdmission.Api/SchoolAdmission.Api.csproj -c Release -o /app/publish --no-restore /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
ENV ASPNETCORE_HTTP_PORTS=8080
EXPOSE 8080
USER $APP_UID
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "SchoolAdmission.Api.dll"]

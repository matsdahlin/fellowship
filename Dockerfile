FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /source

COPY src/Fellowship/*.csproj ./fellowship/
RUN dotnet restore ./fellowship/Fellowship.csproj

COPY src/Fellowship/. ./fellowship/
WORKDIR /source/fellowship
RUN dotnet publish -c release -o /app --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app ./
ENTRYPOINT ["dotnet", "Fellowship.dll"]
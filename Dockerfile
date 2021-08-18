FROM mcr.microsoft.com/dotnet/aspnet:5.0-buster-slim AS base
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:5.0-buster-slim AS build
WORKDIR /app

COPY ./src/Fellowship/Fellowship.csproj ./
RUN dotnet restore "Fellowship.csproj"

COPY ./src/Fellowship ./
RUN dotnet publish "Fellowship.csproj" -c Release -o out

FROM base
WORKDIR /app
COPY --from=build /app/out .
ENTRYPOINT ["dotnet", "Fellowship.dll"]
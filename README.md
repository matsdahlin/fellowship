# The fellowship of the tretton37

This is a small application that shows a list of consultants and lets the user filter the list by name and/or location.

The backend in this application is a simple dotnet API written in C#, that scrapes the targeted site and returns the formatted data.

The frontend is a static HTML page with some vanilla CSS and JS.

[Cypress](https://www.cypress.io/) is used as a testing framework.

The app is containerized, and gets built and deployed in Azure as a [Docker](https://www.docker.com/products/docker-desktop) container.

See [live demo](https://fellowship.azurewebsites.net) deployed to Azure (note: I used the free f1 tier, so the site can be slow to warm up during the first visit)

## Get started

### Using Docker

If you have docker installed you can easily run the project like this:

Copy `.env.example` and name it `.env.local`.
Run:
`docker compose up`

Access app at `localhost:5000`

### Manually

If you want run the project without Docker, you need to have the dotnet 5 SDK installed, and then follow these instructions:

Update `src/Fellowship/appsettings.json` with a valid `TargetSite`:

```json
ConsultantScraper: {
  "TargetSite": "https://sitetoscrape.com"
}
```

Run:
`npm run dev`

Access app at `localhost:5001`

## Run tests

> running the tests requires that you have Node installed.

This project uses [Cypress](https://www.cypress.io/) for testing.

Before you can run the tests you need to install the cypress dependencies:

```shell
npm install
```

To run the tests:

```shell
npm run cy:run
```

To open the Cypress test runner:

```shell
npm run cy:open
```

## Chosen user stories

- ### No UI framework used (such as Bootstrap, Ant) **(1 pt)**

  I wanted to show that I can use HTML and CSS without a framework, and a framework would be adding to both the complexity and bundle size of this small solution.

- ### Build your own API by scraping the current page **(4 pt)**

  This was a good opportunity to show that I know more languages than javascript, and I still enjoy doing backend development. I used dotnet 5 since I have worked with dotnet many years and like to use dotnet core / 5.

- ### CI/CD pipeline from your repo **(1 pt)**

  I choose this because I feel working CI/CD contributes so much to the overall progress of a project, and it makes everyday life easier for both developers, testers, project management and customers/stakeholders. I used Azure pipelines in this project.

- ### Available on a free public url **(1 pt)**

  For me, the point of CI/CD is to quickly get a deploy out and then iterate often, so I chose this task. I used Azure for this aswell.

- ### End-to-end testing (with an existing framework) **(2 pt)**

  This was chosen because I strongly believe that end-to-end testing is very valuable and delivers more "bang for the buck" than unit tests. Both are important, but if I have to choose only one testing strategy I would go for end-to-end tests.

- ### Filter by name and office **(1 pt)**

  This seemed like a fun thing to implement in vanilla js, and it's something that is many sites require so it was a good task.

- ### Keyboard only function **(1 pt)**

  Being able to navigate a site using only the keyboard is something I really appreciate in web pages, so it felt appropriate to make sure this project did aswell.

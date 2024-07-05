# FAM Website
This is a website for the Faculty of applied mathematics, Kyiv Polytechnic Institute, Ukraine.

## Stack
- Runtime: [Node.js](https://nodejs.org)
- Database: SQLite
- ORM: [Drizzle](https://orm.drizzle.team/docs)
- Framework: [`SolidStart`](https://docs.solidjs.com/solid-start)
- Validation: [Valibot](https://valibot.dev)
- Package manager: [Bun](https://bun.sh)

## Installation
Make sure you have bun installed on your machine

```sh
# macOS, Linux, WSL
curl -fsSL https://bun.sh/install | bash

# Windows
powershell -c "irm bun.sh/install.ps1|iex"
```
To install packages, run

```sh
bun i
```

## Developing
To start project, run

```sh
bun dev
```

To run project in production mode, run

```sh
bun run build
bun run start
```

## Todo
- [x] Add login/register pages
- [ ] Add user profile page
- [x] Protect admin routes
- [ ] Add admin dashboard
- [ ] Generate sitemap.xml and robots.txt
- [ ] Use prepared statements to improve query performance

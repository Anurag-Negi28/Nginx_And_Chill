# Netflix 

A simple Netflix Clone made using [Next.js](https://nextjs.org/).


### Prerequisites

- Node.js (v14.x or later recommended)
- npm - a package manager from Node.js (comes with Node.js).

### Running the app

Install dependencies:

```bash
npm install
```

Build the project by:

```bash
npm run build
```

The app depends on the [NetflixMovieCatalog](https://github.com/exit-zero-academy/NetflixMovieCatalog.git) API service.
Thus, you have to run the NetflixMovieCatalog app first and define the service's URL as an env var, as follows:

```bash
export MOVIE_CATALOG_SERVICE=http://localhost:8080
```

Start the Netflix Frontend app by:
```bash
npm start
```

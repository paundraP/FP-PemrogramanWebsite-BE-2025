# Final Project Website Programming 2025 - WordIT

This is the backend repository for WordIT. A Website where you can play, learn, and having fun at the same time.

## How To Start

1. Make sure you have `Bun` installed. [Bun Website](https://bun.com/)

2. Install the dependencies
```bash
bun install
```

3. Create an env file. For development, name it `.env.development`
```conf
POSTGRES_USER=""       # Hanya gunakan huruf kecil, angka, dan simbol underscore
POSTGRES_PASSWORD=""
POSTGRES_HOST="localhost"
POSTGRES_PORT="5432"
POSTGRES_NAME=""   # Hanya gunakan huruf kecil, angka, dan simbol _ atau -

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_NAME}?schema=public"

JWT_ACCESS_SECRET=""

HOST="localhost"
PORT="4000"
BASE_URL="http://${HOST}:${PORT}"

NODE_ENV="development"
```

4. Create your database on docker
```bash
bun docker:up:dev
```

5. Migrate the `Prisma Schema` to your database
```bash
bun migrate:dev
```

6. Fill your database with dummy data
```bash
bun seed:dev
```

7. Run the project
```bash
bun start:dev
```

## How to Dev

- Please follow the current project format

- There are 2 ways to use validation. First, you can use `validateBody` middleware to validate and rewrite your req.body
```ts
.post(
  '/register',
  validateBody({
    schema: RegisterSchema,
    file_fields: [{ name: 'profile_picture', maxCount: 1 }], // If your req has file field, register the field name like the example on the left. Otherwise, you can remove this entire line
  }),
  async (
    request: Request<{}, {}, IRegister>, // Fill the 3rd spot on Request type generic so your req.body can have the format you want
    response: Response,
    next: NextFunction,
  ) => {
    /* controller logic here... */
  })
```

- Second, you can use `AdditionalValidation.validate` function to validate other thing such as `req.params` or `req.query`
```ts
// Since Pagination query has default value of page and perPage, you can still access query.page and query.perPage eventhough they're not assigned in request.query
const query = AdditionalValidation.validate(
  UserPaginationQuerySchema,
  request.query,
);
```

- Before commiting your work, check your code format
```bash
bun lint
```

- To run a quick fix on your code, run
```bash
bun lint:fix
```

- If you've just create a new prisma model, please create a dummy data in a file and name it using format `[name].data.csv`. Then update the `seeder.ts`

## Folder & Files Explanation

- Check pagination example on `user` module
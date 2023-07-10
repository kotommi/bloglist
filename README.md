# Running the app
Set up a database (see below)

npm i 

npm run dev

# Running the database
Set the DATABASE_URL env variable in .env. For example DATABASE_URL="postgres://postgres:<password>@localhost:5432/postgres"

You can use the local dev database with: docker compose -f docker-compose.yml up -d
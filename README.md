For migrations
  1. npx sequelize-cli migration:create --name create_invalid_tokens
  2. npx sequelize-cli db:migrate
  3. npx sequelize-cli db:migrate:undo
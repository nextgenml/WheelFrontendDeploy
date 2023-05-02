FROM node:16

ENV TZ=UTC

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN cd client \
    && npm i \
    && npm run build \
    && cd ..

CMD ["npm", "run", "deploy"]


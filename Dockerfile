FROM node:16

ENV TZ=America/Chicago

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

RUN cd client \
    && npm i \
    && npm run build \
    && cd ..

CMD ["npm", "run", "deploy"]


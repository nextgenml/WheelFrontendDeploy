FROM node:16

#RUN apk add --no-cache tzdata
ENV TZ=America/Chicago

RUN apt -y update \
  && apt -y upgrade \
  && apt install -y tesseract-ocr \
  tesseract-ocr

WORKDIR /app

COPY package*.json ./


RUN npm i

COPY . .

RUN cd client \
    && npm i \
    && npm run build \
    && cd ..

CMD ["npm", "start"]


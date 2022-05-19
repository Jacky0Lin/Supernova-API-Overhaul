FROM node:16.14.2-alpine3.15

# Set Node to production mode
ENV NODE_ENV=production

# name your working dir
WORKDIR /app

# Copy package.json to container/cur working dir
COPY . .

# install all dependencies
RUN npm install

CMD ["node","index.js"]

# docker build . -t jacky/api_overviews
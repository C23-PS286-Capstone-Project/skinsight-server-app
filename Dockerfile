FROM node:18
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
RUN npx prisma generate
RUN npx prisma migrate dev --name init

# Bundle app source
COPY . .
EXPOSE 8080
CMD ["node", "./src/index.js"]
FROM node:18
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json and package-lock.json are copied
COPY package*.json ./
COPY src ./src/
COPY prisma ./prisma/
COPY public ./public/

RUN npm install
# RUN npx prisma migrate dev --name init
RUN npx prisma db pull
RUN npx prisma db push
RUN npx prisma db seed

# Bundle app source
COPY . .
EXPOSE 8080
CMD ["npm", "run", "deploy"]
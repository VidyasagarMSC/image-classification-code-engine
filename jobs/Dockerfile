FROM node:buster-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# Install pre-requisites for tensorflowJS
RUN apt-get update && \ 
    apt-get install -y build-essential \
    wget \
    python3 \
    make \
    gcc \ 
    libc6-dev 

# If you are building your code for production
RUN npm install --only=production

# Bundle app source
COPY . .

CMD [ "node", "index.js" ]
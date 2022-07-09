FROM node:14

WORKDIR /folder
COPY ./package.json /folder/
COPY ./yarn.lock /folder/
RUN yarn install

COPY . /folder/
CMD yarn start:dev
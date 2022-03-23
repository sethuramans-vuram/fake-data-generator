import { faker } from "@faker-js/faker";
import { writeToStream } from '@fast-csv/format';
import fs from 'fs';
import path from 'path';

const CSV_ROW_COUNT = 10000;

const createUser = () => {
  return {
    name: faker.name.findName(),
    email: faker.internet.email(),
    address: faker.address.streetAddress(),
    bio: faker.lorem.sentence(),
    image: faker.image.avatar(),
  };
};

const createUsers = (numUsers = 5) => {
    return Array.from({length: numUsers}, createUser);
};

writeToStream(fs.createWriteStream(path.resolve(__dirname, 'data.csv')), createUsers(CSV_ROW_COUNT), {
    headers: Object.keys(createUser()),
    quoteColumns: false
});

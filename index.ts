import { faker } from "@faker-js/faker";
import { writeToStream } from '@fast-csv/format';
import fs from 'fs';
import path from 'path';
import pdf from 'html-pdf';

const CSV_ROW_COUNT = 1000;

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

const csvPath = path.resolve(__dirname, 'data.csv');
const rows = createUsers(CSV_ROW_COUNT);
writeToStream(fs.createWriteStream(csvPath), rows, {
    headers: Object.keys(createUser()),
    quoteColumns: false
});

let table_rows = rows.map((row) => {
  return `<tr>
    ${Object.values(row).map((col) => {
      return `<td>${col}</td>`;
    }).join("")}
  </tr>`;
});

let html = `
  <html>
    <head>
      <style>
        table, th, td {
          border: 1px solid black;
          border-collapse: collapse;
        }
      </style>
    </head>
    <body>
      <table>
        <thead>
          <tr>
            ${Object.keys(createUser())
              .map((col) => `<th>${col.charAt(0).toUpperCase() + col.slice(1)}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${table_rows.join("")}
        </tbody>
      </table>
    </body>
  </html>
`;

pdf.create(html, { format: "A4", orientation: "portrait" }).toFile("data.pdf", (err, res) => {
  if (err) console.log(err);
  console.log(res);
});
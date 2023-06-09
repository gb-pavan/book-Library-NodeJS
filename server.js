const express = require("express");
const app = express();

app.get("/", (request, response) => {
  response.send("Hello World!");
});
const path = require("path");
const cors = require("cors");

app.use(express.json())

const corsOptions = {
  origin: 'http://example.com:3004',
};
app.use(cors(corsOptions))

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
/*app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3004')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  next()
})*/


const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "bookDatabase.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3002, () => {
      console.log("Server Running at http://localhost:3002/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();

app.get("/getbooks/", async (request, response) => {
  const getBooksQuery = `
    SELECT
      *
    FROM
      bookdetails;`;
  const booksArray = await db.all(getBooksQuery);
  response.send(booksArray);
});

app.post("/addbook/", async (request, response) => {
  const {bookDetails} = request.body;
  console.log(bookDetails)
  const {
    book_id,
    book_title,
    book_author,
    published,    
    book_description,
  } = bookDetails;
  const addBookQuery = `
    INSERT INTO
      bookdetails (book_id,book_title,book_author,published,book_description)
    VALUES
      (
        ${book_id},
        ${book_title},
        ${book_author},
        ${published},
        ${book_description},
      );`;

  const dbResponse = await db.run(addBookQuery);
  console.log(dbResponse)
});
const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    //Write your code here
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided

    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });

        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({ message: "Unable to register user." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    Promise.resolve(books)
        .then((data) => {
            return res.send(JSON.stringify(data, null, 4));
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error retrieving books",
                error: err.message
            });
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    Promise.resolve(books[isbn])
        .then((data) => {
            return res.send(data);
        })
        .catch((err) => {
            return res.status(500).json({
                message: "Error retrieving book details",
                error: err.message
            });
        });

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const getBooksByAuthor = new Promise((resolve, reject) => {
        let matchedBooks = {}
        const keys = Object.keys(books);

        keys.forEach((key) => {
            if (books[key].author === author) {
                matchedBooks[key] = books[key];
            }
        });

        if (Object.keys(matchedBooks).length > 0) {
            resolve(matchedBooks);
        } else {
            reject("No books found for this author");
        }
    });

    getBooksByAuthor
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json({ message: err }));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const getBooksByTitle = new Promise((resolve, reject) => {
        let matchedTitles = {}
        const keys = Object.keys(books);

        keys.forEach((key) => {
            if (books[key].title === title) {
                matchedTitles[key] = books[key];
            }
        });

        if (Object.keys(matchedTitles).length > 0) {
            resolve(matchedTitles);
        } else {
            reject("No books found for this title");
        }
    });

    getBooksByTitle
        .then((data) => res.json(data))
        .catch((err) => res.status(400).json({ message: err }));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    //Write your code here
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});

module.exports.general = public_users;

const express = require('express')
const app = express()
const bodyParser = require("body-parser");
const port = 8080
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// your code goes here

let data = require("./InitialData")

app.get("/api/student", (req, res) => {
    res.json({
        status: "SUCCESS",
        data: data
    })
})

app.get("/api/student/:id", (req, res) => {
    if (req.params.id <= data.length && req.params.id > 0) {
        if (data[req.params.id - 1] === null) {
            res.status(404).json({
                status: "Failed",
                message: "Data not Found"
            })
        } else {
            res.json({
                status: "SUCCESS",
                data: data[req.params.id - 1]
            })
        }
    } else {
        res.status(404).json({
            status: "Bad Request",
            message: "Invalid input"
        })
    }
})

app.post("/api/student", (req, res) => {

    const student = req.body;

    if (student.name && student.currentClass && student.division) {
        let newStu = {
            id: data.length + 1,
            name: req.body.name,
            currentClass: req.body.currentClass,
            division: req.body.division
        }

        data.push(newStu);
        res.json({
            status: "SUCCESS",
            id: newStu.id
        })
    } else {
        res.status(400).json({
            status: "Failed",
            message: "Invalid Data"
        })
    }
})

app.put("/api/student/:id", (req, res) => {

    const _id = req.params.id;

    if (req.is('application/x-www-form-urlencoded')) {

        let arr = Object.keys(req.body).map(el => Object.keys(data[_id - 1]).includes(el));

        if (!arr.includes(false)) {
            for (let el of Object.keys(req.body)) {
                data[_id - 1][el] = req.body[el];
            }
            res.json({
                status: "SUCCESS",
                data: data[_id - 1]
            })
        } else {
            res.status(400).json({
                status: "Data Not Found",
                message: "invalid input"
            })
        }
    } else {
        res.status(404).json({
            status: "Bad Request",
            message: "invalid input"
        })
    }
})

app.delete("/api/student/:id", (req, res) => {
    if (req.params.id > 0 && req.params.id <= data.length) {
        if (data[req.params.id - 1] !== null) {
            const Obj = data.splice(req.params.id - 1, 1, null);
            res.json({
                status: "SUCCESS",
                data: Obj
            })

        } else {
            res.status(400).json({
                status: "Failed",
                message: "Bad Request"
            })
        }
    } else {
        res.status(404).json({
            status: "Bad Request",
            message: "Invalid input"
        })
    }
})

app.listen(port, () => console.log(`App listening on port ${port}!`))

module.exports = app;   
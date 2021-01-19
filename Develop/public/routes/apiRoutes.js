const { json } = require("express");
var fs = require("fs");
const { parse } = require("path");
var dbFile = "./db/db.json"


module.exports = function (app) {
    // C
    app.post("/api/note/new", async (req, res) => {
        // create new note
        let content = await fs.readFileSync(dbFile, 'utf8')

        if (content.length > 0) {
            content = JSON.parse(content)
            req.body['id'] = content.length
            content[content.length] = req.body
        } else {
            req.body['id'] = 0
            content = [req.body]
        }

        console.log(content);

        fs.writeFile(dbFile, JSON.stringify(content), err => {
            if (err) throw err
        })

        res.status(200).json({
            data: req.body
        });
    });

    // R
    app.get("/api/notes", (req, res) => {
        // create new note
        fs.readFile(dbFile, 'utf-8', (err, data) => {
            console.log(err);
            let content = JSON.parse(data)
            res.json(content);
        })
        res.end
    });

    // U
    app.patch('/api/notes/update/:id', async (req, res) => {
        let id = req.params.id
        let content = JSON.parse(await fs.readFileSync(dbFile, 'utf8'))
        let incomingMsg = req.body

        let incomingKeys = Object.keys(req.body)
        console.log(incomingKeys);

        content.forEach((note) => {
            if (note['id'] === parseInt(id)) {
                let noteKeys = Object.keys(note)

                for (let i = 0; i < noteKeys.length; i++) {

                    for (j = 0; j < incomingKeys.length; j++) {
                        console.log(`elementInNote: ${noteKeys[i]} || checking against: ${incomingKeys[j]}`);
                        if (noteKeys[i] === incomingKeys[j]) {

                            note[noteKeys[i]] = incomingMsg[incomingKeys[j]]

                        }
                    }
                }
            }
        });
        console.log(content);
        fs.writeFile(dbFile, JSON.stringify(content), err => {
            console.log(err);
        })
        res.json(req.body);
    })

    // D
    app.delete('/api/notes/delete/:id', async (req, res) => {
        let id = req.params.id
        let content = JSON.parse(await fs.readFileSync(dbFile, 'utf8'))

        content.forEach((note, i) => {
            if (note['id'] === parseInt(id)) {
                content.splice(i, 1)
            } else {
                res.json({
                    msg: "no record found"
                });
            }
        });

        res.json(content);
    });
};
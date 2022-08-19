const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const pathDesc = path.join(__dirname + "/task/");

const fileExists = (file) => {
    return new Promise((resolve) => {
        fs.access(file, fs.constants.F_OK, (err) => {
            err ? resolve(false) : resolve(true)
        });
    })
}

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Service on.')
})

app.get('/get', (req, res) => {
    fs.readdir(pathDesc, (err, files) => {
        if (err) {
            res.send(err)
        } else {
            res.send(files);
        }
    });
});

app.post('/create', async (req, res) => {
    let inputtask = req.body;

    if (!fs.existsSync(pathDesc)) {
        fs.mkdirSync(pathDesc);
    }
    await fileExists(path.join(pathDesc, `${inputtask.id}.txt`)).then(async (isexists) => {
        if (isexists) {
            res.send("Task ID:" + inputtask.id + " is exists.");
        } else {
            await fs.writeFile(path.join(pathDesc, `${inputtask.id}.txt`), inputtask.content, (err) => {
                if (err) {
                    res.send("Error:" + err);
                } else {
                    res.send("Create success.");
                }
            });
        }
    });
});

app.put('/update/:id', async (req, res) => {
    let taskid = req.params.id;
    let content = req.body.content;
    await fileExists(path.join(pathDesc, `${taskid}.txt`)).then(async (isexists) => {
        if (isexists) {
            await fs.writeFile(path.join(pathDesc, `${taskid}.txt`), content, (err) => {
                if (err) {
                    res.send("Error:" + err);
                } else {
                    res.send("Update success.");
                }
            });
        } else {
            res.send(`Task ID: ${taskid} is not exists.`);
        }
    });
});

app.delete('/delete/:id', async (req, res) => {
    let taskid = req.params.id;
    await fileExists(path.join(pathDesc, `${taskid}.txt`)).then(async (isexists) => {
        if (isexists) {
            fs.unlink(path.join(pathDesc, `${taskid}.txt`), (err) => {
                res.send(`Delete task id ${taskid} success.`);
            });
        } else {
            res.send(`Task ID: ${taskid} is not exists.`);
        }
    });
    
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}...`)
})
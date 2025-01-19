const bodyParser = require("body-parser");
const express = require("express");
const ejs = require('ejs')
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 8000;
app.set("view engine", "ejs");
let items = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
];

 app.get('/',(req, res)=> {
    res.render('home',{items})
 })

 app.post('/items', (req, res) => {
    const newItem = {
        id: items.length + 1,
        name: req.body.name,
    };
    items.push(newItem);
    res.status(201).redirect('/')
 })

 app.delete('/', (req, res) => {
    const id = parseInt(req.body.id);

    items = items.pop(item => item.id !== id);

    res.redirect('/');
 })

app.listen(PORT, () => {
  console.log(`Server startred on port: ${PORT}`);
});

var express = require("express")
var app = express()
var PORT = process.env.PORT || 3000;
var hbs = require('express-handlebars');
var path = require("path");
var formidable = require('formidable');


var data = []

app.get("/", function (req, res) { 
    res.render("index.hbs");  
})

app.get("/FileList", function (req, res) { 
    res.render('FileList.hbs', {"files": data});  
})

app.get("/clear", function (req, res) {
    data = []
    res.render('FileList.hbs', {"files": data});  
})

app.get("/delete", function (req, res) {
    data = data.filter(function(e){
        if(e.id != req.query.id)
        {
            return e;
        }
    })
    res.render('FileList.hbs', {"files": data});  
})

app.get("/info", function (req, res) {
    var id = req.query.id;
    inf = data.filter(function(e){
        if(e.id == req.query.id)
        {
            return e;
        }
    })[0];
    res.render('info.hbs', {"files": inf});  
})

app.get("/download", function (req, res) {
    var id = req.query.id;
    inf = data.filter(function(e){
        if(e.id == req.query.id)
        {
            return e;
        }
    })[0];
    res.download(inf.path);  
})



function get_last_id(){
    var last_id = -1;
    if(data.length > 0)
    {
        last_id = data[data.length - 1].id;
    }
    return last_id;
}

app.post('/handleUpload', function (req, res) {

    let form = formidable({});

    form.uploadDir = __dirname + '/static/upload/'
    form.keepExtensions = true
    form.multiples = true
    
    form.parse(req, function (err, fields, files) {
        if(files.files.length > 0)
        {
            files.files.map(function(e){
                data.push({"id": get_last_id() + 1, "name": e.name, "size": e.size, "type": e.type, "path": e.path, savedate: Date.now()});
            })
        }else{
            data.push({"id": get_last_id() + 1, "name": files.files.name, "size": files.files.size, "type": files.files.type, "path": files.files.path, savedate: Date.now()});
        }
        
        var obj = {"files": data}
        res.render('FileList.hbs', obj)
    });
});

app.use(express.static('static'))

app.set('views', path.join(__dirname, './static/views'));       
app.engine('hbs', hbs({
    defaultLayout: 'main.hbs',
    extname: '.hbs',
    partialsDir: "./static/views/partials",
    helpers: {         
        ext: function (ext) {
            var file_ext = ext.split(".");
            var ext = file_ext[file_ext.length - 1];
            return ext;
        },
    },
}));
app.set('view engine', 'hbs');


app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT )
})
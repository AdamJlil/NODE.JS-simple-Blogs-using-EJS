const express = require('express');
const { result } = require('lodash');
const mongoose = require('mongoose')
const morgan = require('morgan');
const Blog = require('./models/blog');
// express App
const app = express()
app.use(express.urlencoded({extended:true}));
// listen for request

// Connect to Database
const dbURI = "mongodb+srv://blogapp:test12345@myapp.5fghn0j.mongodb.net/?retryWrites=true&w=majority"
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(result =>
        {
            console.log("Connected!");
            app.listen(3007, ()=>{
                console.log('Listening on port 3007');
            });
        })
    .catch(err=> console.log(err))
// register view engine
app.set('view engine', 'ejs') // folder views

// middleware & static files
app.use((req, res, next)=>{
    console.log('New request made:');
    console.log('host: ',req.hostname);
    console.log('path: ',req.path);
    console.log('method: ',req.method);
    next();
});
app.use(morgan('tiny'));
// static files
app.use(express.static('public'));
// mongoose & mongo tests
app.get('/add-blog', (req, res)=>{
    const new_blog = new Blog({
        title: 'Hiba likes Data Analysis',
        snippet: 'About Hiba new Blog',
        body: 'Nothing Special so far'
    });
    new_blog.save()
    .then(result =>{
        console.log(result);
        res.send(result);
    })
    .catch(err =>{
        console.log(err);
    })
})

// Routes
app.get('/', (req, res)=>{
    // const blogs = [
    //     {title: 'Steve is an aberration', snippet: 'Lorem Ipsum is simply dummy text.'},
    //     {title: 'Matthieu likes Linux', snippet: 'Lorem Ipsum is simply dummy text.'},
    //     {title: 'Hanae prefers chocolate', snippet: 'Lorem Ipsum is simply dummy text.'},
    // ];
    // res.render('index',{title:'Home', blogs} );
    res.redirect('/blogs');
});

// Mongoose -- Select *
app.get('/blogs', (req, res)=>{
    Blog.find().sort({createdAt: -1})
    .then(result =>{
        res.render('index',{title:'Home', blogs: result} );
    })
    .catch(err=>{
        console.log(err);
    })
})

app.get('/about', (req, res)=>{
    res.render('about', {title:'About'});
});
// Get form
app.get('/blogs/create', (req, res)=>{
    res.render('create', {title: 'Blogs'});
});
// Post form -- Insert into
app.post('/blogs', (req, res)=>{
    //console.log(req.body);
    form_values = req.body;
    const blog = new Blog(form_values);
    blog.save()
        .then(result =>{
            res.redirect('/blogs');
        })
        .catch(err=>{
            console.log(err);
        });
    // const t = req.body.title;
    // const s = req.body.snippet;
    // const b = req.body.body;
    // console.log(t, s, b);
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    console.log(id)
    Blog.findById(id)
      .then(result => {
        res.render('details', { blog: result, title: 'Blog Details' });
      })
      .catch(err => {
        console.log('Error details')
        console.log(err);
      });
  });

  app.delete('/blogs/:id', (req, res)=>{
    const id = req.params.id;
    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({redirect: '/blogs'});
    })
    .catch(err => {
        console.log(err);
    })

  })
// app.get('/single-blog', (req, res)=>{
    
//     Blog.findById('62d85d2e6d71128c3e4207fd')
//         .then(result =>{
//             console.log(result);
//             //res.render('details', {blog:result, title:'Blog Details'});
//             res.send(result)
//         })
//         .catch(err =>{
//             console.log(err);
//         })
// })

// 404 page
app.use((req, res)=>{
    res.render('404', {title:'404'});
});


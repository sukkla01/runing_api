

const passport = require('passport')
const passportService = require('./service/passport')
const requireSignin = passport.authenticate('local', { session: false })
const requireAuth = passport.authenticate('jwt', { session: false })
const users = require('./controllers/Users')
const Patient = require('./controllers/Patient')
const Getpdf = require('./controllers/GetPdf/getPdf')
const AddLog = require('./controllers/Log/AddLog')
const Post = require('./controllers/Post/post_run')



// const MailSend = require('./controllers/MailSend/Index')




module.exports = function (app) {
    app.get('/', function (req, res) {
        res.send("<h1 style='text-align:center;margin-top:150px; '>Auction Api</h1>")
    })
    app.post('/signin', requireSignin, users.signin)

   
    app.get('/find-hn/:hn',Patient.findPatient)
    app.post('/post-job',Post.create)
    app.post('/post-like',Post.createLike)
    app.get('/post-show/:id',Post.findByImage)
    app.get('/get-post',Post.findPost)
    // app.get('/users',requireAuth, users.findAll)
    

}

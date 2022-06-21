const { indexOf } = require("lodash");

module.exports = function (app, passport, db, multer, ObjectId) {

  // Image Upload Code =========================================================================
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      console.log('dest', file)
      cb(null, `public/folders/`)
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname)
    }
  });
  var upload = multer({
    storage: storage,
    // fileFilter: (req, file, cb) => {
    //   if (file.mimetype == "audio/*" ) {
    //     cb(null, true);
    //   } else {
    //     cb(null, false);
    //     return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    //   }
    // }
  });

  // normal routes ===============================================================

  // show login links
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // Main Projects SECTION =========================
  app.get('/projects', isLoggedIn, function (req, res) {
    db.collection('folders').find({ postedBy: req.user._id }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('projects.ejs', {
        user: req.user,
        folders: result
      })
    })
  });

  // Shared Projects SECTION =========================
  //  app.get('/shared', isLoggedIn, function(req, res) {
  //      db.collection('folders').find({postedBy: req.user._id}).toArray((err, result) => {
  //        if (err) return console.log(err)
  //        res.render('projects.ejs', {
  //          user : req.user,
  //          folders: result
  //        })
  //      })
  //  });
  //main page
  //    app.get('/projects', function(req, res) {
  //      db.collection('projects').find().toArray((err, result) => {
  //        if (err) return console.log(err)
  //        res.render('projects.ejs', {
  //          folders: result
  //        })
  //      })
  //  });
  //post page


  app.get('/folder/:folderID', isLoggedIn, function (req, res) {
    let postId = ObjectId(req.params.folderID)

    db.collection('users').find().toArray((err1, user) => {
      db.collection('folders').find({ _id: postId }).toArray((err, result) => {

        if (err) return console.log(err)
        res.render('folder.ejs', {
          folders: result[0],
          user: req.user
        })
      })
    })
  });
  //profile page
  //  app.get('/page/:id', isLoggedIn, function(req, res) {
  //    let postId = ObjectId(req.params.id)
  //    db.collection('folders').find({postedBy: postId}).toArray((err, result) => {
  //      if (err) return console.log(err)
  //      res.render('page.ejs', {
  //        folders: result
  //      })
  //    })
  //  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
  });
  // post folder routes
  app.post('/makePost', isLoggedIn, upload.array('fileList'), (req, res) => {
    let user = req.user._id
    db.collection('folders').save({
      title: req.body.title,
      folderData: {
        folderPath: 'folders/uploads/' + req.files.filename,
        content: req.files,
      }, postedBy: user, shared: []
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/projects')
    })
  })


  // message board routes ===============================================================

  //  app.post('/folders', (req, res) => {
  //    db.collection('folders').save({name: req.body.name, msg: req.body.msg, thumbUp: 0, thumbDown:0}, (err, result) => {
  //      if (err) return console.log(err)
  //      console.log('saved to database')
  //      res.redirect('/projects')
  //    })
  //  })

  //  app.put('/folders', (req, res) => {
  //    db.collection('folders')
  //    .findOneAndUpdate({id: req.body._id}, {
  //      $set: {
  //        thumbUp:req.body.thumbUp + 1
  //      }
  //    }, {
  //      sort: {_id: -1},
  //      upsert: true
  //    }, (err, result) => {
  //      if (err) return res.send(err)
  //      res.send(result)
  //    })
  //  })
  //  app.put('/folders', (req, res) => {
  //    db.collection('folders')
  //    .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //      $set: {
  //        thumbUp:req.body.thumbUp + 1
  //      }
  //    }, {
  //      sort: {_id: -1},
  //      upsert: true
  //    }, (err, result) => {
  //      if (err) return res.send(err)
  //      res.send(result)
  //    })
  //  })

  app.delete('/folder/deleteFolder', (req, res) => {
    db.collection('folders').findOneAndDelete({ title: req.body.title }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Folder deleted!')
    })
  })
  app.put('/folder/deleteFile', (req, res) => {
    // var interests = db.people.findOne({ "name": "dannie" }).interests;
    // interests.splice(2, 1)
    // db.people.update({ "name": "dannie" }, { "$set": { "interests": interests } });

    let removing = db.collection('folders').findOne({title: req.body.folderName},
      (err,result)=>{
        // let fileSelected = result.folderData.content[req.body.fileIndex]
        let folder = result.folderData.content
        let newFolderWithoutFile = folder.filter((file)=> folder.indexOf(file) !== Number(req.body.fileIndex))
        console.log(newFolderWithoutFile, 'testing')
      })
      
  
    // db.collection('folders').findOneAndUpdate(
    //   {
    //     'folderData.content': {}

    //   }, (err, result) => {
    //     if (err) return res.send(500, err)
    //     console.log(err)
    //     console.log('this is result', result)
    //     res.send('Folder deleted!')
    //   })
  })

  // Notes Routes
  app.post('/notes', (req, res) => {
    db.collection('notes').insertOne({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })

  // app.put('/notes', (req, res) => {
  //   db.collection('notes ')
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbUp:req.body.thumbUp + 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })
  // app.put('/notesDown', (req, res) => {
  //   db.collection('messages')
  //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
  //     $set: {
  //       thumbUp:req.body.thumbUp - 1
  //     }
  //   }, {
  //     sort: {_id: -1},
  //     upsert: true
  //   }, (err, result) => {
  //     if (err) return res.send(err)
  //     res.send(result)
  //   })
  // })

  app.delete('/notes', (req, res) => {
    db.collection('notes').findOneAndDelete({ name: req.body.name, msg: req.body.msg }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Note deleted!')
    })
  })


  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/projects', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash folders
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/projects', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash folders
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

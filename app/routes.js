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
  app.get('/shared', isLoggedIn, function (req, res) {
    db.collection('shared').find({ shareWith: req.user.local.email }).toArray((err, sharedWithMe) => {
      console.log(sharedWithMe, 'is there a post id?')
      if (err) return console.log(err)
      res.render('shared.ejs', {
        user: req.user,
        sharedWithMe
      })
    })
  });




  app.get('/folder/:folderID', isLoggedIn, function (req, res) {
    let postId = ObjectId(req.params.folderID)
    db.collection('folders').find({ _id: postId }).toArray((err, result) => {
      db.collection('notes').find({ id: postId }).toArray((err1, comments) => {
        db.collection('users').find().toArray((err3, userList) => {
          db.collection('addedSongs').find({ folder: postId.toString() }).toArray((err3, newFile) => {

            let newFileContent = []
            newFile.forEach((file)=>{
              newFileContent.push(file.content)
            })
            let correctUserList = userList.filter((user) => user.local.email !== req.user.local.email)
            if (err) return console.log(err)
            res.render('folder.ejs', {
              folders: result[0],
              comments: comments,
              user: req.user,
              correctUserList,
              postId,
              newFileContent
            })
          })
        })
      })
    })
  });




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

  app.post('/add', isLoggedIn, upload.single('file'), (req, res) => {
    console.log('hi', req.file, 'files?')
    console.log(req.body)
    db.collection('addedSongs').insertOne({
      folder: req.body.postId,
      folderPath: 'folders/uploads/' + req.file.filename,
      content: req.file
    })
    res.redirect('back')
    // db.collection('folders').save({
    //   title: req.body.title,
    //   folderData: {
    //     folderPath: 'folders/uploads/' + req.files.filename,
    //     content: req.files,
    //   }, postedBy: user, shared: []
    // }, (err, result) => {
    //   if (err) return console.log(err)
    //   console.log('saved to database')
    //   res.redirect('/projects')
    // })
  })


  app.post('/shared', isLoggedIn, (req, res) => {
    console.log(req.body, 'trying to share')
    db.collection('shared').insertOne({
      postId: req.body.postId,
      shareWith: req.body.shareWith,
      sharer: req.user.local.email,
      title: req.body.title
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('back')
    })
  })


  app.put('/folder/addFile', isLoggedIn, (req, res) => {
    console.log(req.body, 'adding file')
    console.log(req.file)
    db.collection('folders')
      .findOneAndUpdate({ name: req.body.title }, {
        $push: {
          'folderData.content': req.body.newFile
        }
      }, {
        upsert: true
      }, (err, result) => {
        console.log(result.folderData, 'result')
        if (err) return res.send(err)
        res.send(result)
      })
  })

  app.delete('/folder/deleteFolder', (req, res) => {
    db.collection('folders').findOneAndDelete({ title: req.body.title }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Folder deleted!')
    })
  })

  app.delete('/folder/deleteNewFile', (req, res) => {
    console.log(req.body,'deleting this')
    db.collection('addedSongs').findOneAndDelete({ folder: req.body.postId, 'content.originalname': req.body.fileName }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Folder deleted!')
    })
  })

  app.put('/folder/deleteFile', (req, res) => {
    let removing = db.collection('folders').findOne({ title: req.body.folderName },
      (err, result) => {
        let folder = result.folderData.content
        let newFolderWithoutFile = folder.filter((file) => folder.indexOf(file) !== Number(req.body.fileIndex))
        console.log(newFolderWithoutFile, 'testing')
        db.collection('folders').updateOne({ 'title': req.body.folderName }, {
          $set: { 'folderData.content': newFolderWithoutFile }
        }),
          (err, newFolder) => {
            console.log(newFolder)
            res.send(newFolder)
          }
      })
  })

  // Notes Routes
  app.post('/notes', (req, res) => {
    console.log(req.body)
    db.collection('notes').insertOne({ text: req.body.text, commentor: req.user.local.email, time: new Date().toLocaleTimeString(), id: ObjectId(req.body.folderTitle) })
    res.redirect('back');
  })




  app.delete('/folder/deleteComment', (req, res) => {
    console.log(req.body, 'delete this')
    db.collection('notes').findOneAndDelete({ text: req.body.text, commentor: req.body.commentor },
      (err, result) => {
        res.send(result)
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

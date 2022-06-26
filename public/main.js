const thumbUp = document.getElementsByClassName("fa-thumbs-up");
const trash = document.getElementsByClassName("fa fa-trash");
const deleteFolder = document.getElementsByClassName("deleteFolder");
const deleteFile = document.getElementsByClassName("deleteFile");
const thumbDown = document.getElementsByClassName("fa-thumbs-down")
const deleteComments = document.querySelectorAll('.deleteComment')
let deleteNewStuff = document.querySelectorAll('.newDelete')
let filePicker = document.getElementById('filePicker');
let listStuff = document.getElementById('listStuff');

filePicker.addEventListener('change', e => {
  console.log(`we're trying?`)
 
  let fileArr = []
  for (let file of Array.from(e.target.files)) {
    fileArr.push(file)
    let item = document.createElement('li');
    item.textContent = file.webkitRelativePath;
    console.log(listStuff)
    listStuff.appendChild(item);
  };
  console.log(fileArr, 'test')
  fetch('add', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'newFile': fileArr,
    })
  })
});

  

deleteComments.forEach((button) => {
  button.addEventListener('click', () => {
    console.log('button clickced')
    let comment = button.parentNode.childNodes[3].innerText
    let commentor = button.parentNode.childNodes[1].childNodes[1].innerText
    console.log(commentor, comment)
    fetch('deleteComment', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'text': comment,
        'commentor': commentor
      })
    })
      .then((response) => {
        window.location.reload(true)
      })
  })
})
Array.from(thumbUp).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('folders', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp': thumbUp
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});
Array.from(thumbDown).forEach(function (element) {
  element.addEventListener('click', function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText
    const msg = this.parentNode.parentNode.childNodes[3].innerText
    const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
    fetch('foldersDown', {
      method: 'put',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'name': name,
        'msg': msg,
        'thumbUp': thumbUp
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        window.location.reload(true)
      })
  });
});

Array.from(deleteFolder).forEach(function (element) {
  element.addEventListener('click', function () {
    let title = this.parentNode.childNodes[1].innerText
    fetch('deleteFolder', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'title': title
      })
    }).then(function (response) {
      window.location.href = "/projects"
    })
  });
});

Array.from(deleteFile).forEach(function (element) {
  element.addEventListener('click', function () {
    let index = this.parentNode.childNodes[3].childNodes[3].innerText
    let folderName = document.querySelector('.folderTitle').innerText
    console.log(folderName)
    let fileName = this.parentNode.childNodes[3].childNodes[1].innerText
    fetch('deleteFile', {
      method: 'put',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'fileName': fileName,
        'fileIndex': index,
        'folderName': folderName
      })
    })

    setTimeout(function(){
      window.location.reload();
   }, 1000);

  });
});

Array.from(deleteNewStuff).forEach(function (element) {
  element.addEventListener('click', function () {
    let index = this.parentNode.childNodes[3].childNodes[3].innerText
    let postId = document.querySelector('.postId').innerText
    let fileName = element.parentNode.childNodes[3].childNodes[1].innerText
    console.log(postId)
    fetch('deleteNewFile', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'fileName': fileName,
        'fileIndex': index,
        'postId': postId
      })
    })

    window.location.reload(true)

  });
});


let picker = document.getElementById('picker');
let listing = document.getElementById('listing');

picker.addEventListener('change', e => {
  console.log(`we're trying`)
  let fileArr = []
  for (let file of Array.from(e.target.files)) {
    fileArr.push(file)
    let item = document.createElement('li');
    item.textContent = file.webkitRelativePath;
    listing.appendChild(item);
  };
  console.log(fileArr)
});



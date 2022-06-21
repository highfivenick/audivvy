const thumbUp = document.getElementsByClassName("fa-thumbs-up");
const trash = document.getElementsByClassName("fa fa-trash");
const deleteFolder = document.getElementsByClassName("deleteFolder");
const deleteFile = document.getElementsByClassName("deleteFile");
const thumbDown = document.getElementsByClassName("fa-thumbs-down")



Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('folders', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
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
Array.from(thumbDown).forEach(function(element) {
      element.addEventListener('click', function(){
        const name = this.parentNode.parentNode.childNodes[1].innerText
        const msg = this.parentNode.parentNode.childNodes[3].innerText
        const thumbUp = parseFloat(this.parentNode.parentNode.childNodes[5].innerText)
        fetch('foldersDown', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            'name': name,
            'msg': msg,
            'thumbUp':thumbUp
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

// Array.from(trash).forEach(function(element) {
//   element.addEventListener('click', function(){
//     const name = this.parentNode.parentNode.childNodes[1].innerText
//     const msg = this.parentNode.parentNode.childNodes[3].innerText
//     fetch('folders', {
//       method: 'delete',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({
//         'name': name,
//         'msg': msg
//       })
//     }).then(function (response) {
//       window.location.reload()
//     })
//   });

// });

Array.from(deleteFolder).forEach(function(element) {
  element.addEventListener('click', function(){
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
      window.location.href="/projects"
    })
  });
});



Array.from(deleteFile).forEach(function(element) {
  element.addEventListener('click', function(){
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

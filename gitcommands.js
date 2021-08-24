
// push file
// function pushes file to git

async function pushFile(file, commit) {
  
  let content;
  
  // if updating an existing file
  if (file.sha) {

    // if currently editing file
    if (file.selected) {

      // get current value of file
      content = btoa(cd.textContent);

    } else { // else, load from storage

      content = modifiedFiles[file.sha][0];

    }
    
  } else { // if creating a new file
    
    content = file.content;
    file.sha = '';
    
  }
  
  
  let query = 'https://api.github.com/repos/' +
              treeLoc[0] +
              '/' + treeLoc[1] +
              '/contents' + treeLoc[2] + '/' + file.name;
  
  let commitData = {
    message: commit.message,
    content: content,
    sha: file.sha
  };

  // commit file
  var resp = await axios.put(query, githubToken, commitData);
  
  
  // if updating an existing file
  if (file.sha) {
  
    // force-update cache
    var newFile = await axios.get(query, githubToken, file.sha);

    // delete file from modified files
    deleteModifiedFile(file.sha);

    file.element.classList.remove('modified');

  }
  
   
  // update SHA of file
  setAttr(file.element, 'sha', resp.content.sha);

  // if file is selected
  if (file.selected) {
    
    const newSelectedFile = {
      dir: treeLoc.join(),
      sha: resp.content.sha,
      name: file.name,
      exists: true
    };
    
    // update selection SHA
    changeSelectedFile(newSelectedFile);

  }
  

  // set event listener for file change
  cd.addEventListener('keydown', checkBackspace);
  cd.addEventListener('input', fileChange);
  
  
  return resp.content.sha;
  
}


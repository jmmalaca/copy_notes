const AppleNotes = require('./apple-notes-jxa');
const NodeHtmlMarkdown = require('./node_modules/node-html-markdown');
const fs = require('fs');
const location = __dirname + '/exported_notes';

AppleNotes.accounts()
.then((accounts) => {
  console.log('1. Notes Account: ' + accounts[0].name);
  return accounts[0];
})
.then((account) => {
  AppleNotes.folders(account.name)
            .then((folders) => {
              console.log('2. On the account (' + account.name  + ') there are ' + folders.length + ' folders:');
              
              folders.forEach((folder) => {
                console.log('3. Folder ' + folder.name);

                let folder_path = location + '/' + folder.name;
                if (!fs.existsSync(folder_path)) { fs.mkdirSync(folder_path, {recursive: true}); }

                return folder.notes().then((notes) => {
                  console.log('4. Notes ' + notes.length);
                  notes.forEach((note) => {
                    console.log('5. Note ' + note['name']);
                    fs.writeFileSync(
                      folder_path + '/' + note['name'] + '.md',
                      NodeHtmlMarkdown.NodeHtmlMarkdown.translate(note['body'])
                    );
                  });
                });
              });
            })
});

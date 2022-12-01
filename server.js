const express = require("express");
const cors = require('cors');
const pdf = require('pdf-parse');
const multer = require('multer');
const fs = require('fs');
const { parseDocx } = require('docx-parser');

const app = express();
const port = process.env.PORT || 8080;
const upload = multer({ dest: './uploads/'});

app.use(cors());
app.use(express.json())
app.use(express.urlencoded())

app.post('/upload-file', upload.single('file'), async (req, res) => {
  try {
    if (req.file.mimetype === 'application/pdf') {
      const stream = fs.readFileSync(req.file.path);
      const data = await pdf(stream);
      res.setHeader('content-type', 'application/json; charset=ascii');
      res.send({
        status: true,
        message: 'success',
        content: data.text
      });
    } else if (req.file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      parseDocx(req.file.path, data => {
        res.send({
          status: true,
          message: 'success',
          content: data
        });
      }); 
    }
  } catch(error) {
    console.error(error);
    res.send({
      statusCode: 500,
      message: 'cannot read file',
      error: error.message
    });
  }
});

app.listen(port, () => console.log(`HelloNode app listening on port ${port}!`))
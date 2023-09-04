module.exports = function(app,formidable,fs,path){
    //Route to manage image file uploads
    
    app.post('/api/upload', (req, res) => {
      const uploadFolder = path.join(__dirname, "../userimages");
      let options={
        keepExtensions : true,
        uploadDir:uploadFolder,
        allowEmptyFiles:false,
        maxFileSize: 5 * 1024 * 1024
      }
      var form = new formidable.IncomingForm(options);
      form.parse(req, async (err, fields, files)=> {
        console.log(files.image[0].filepath);
        //assuming a single file for this example.
        let oldpath = files.image[0].filepath;
       
        
        let newpath = form.options.uploadDir + "/" + files.image[0].originalFilename;
        fs.rename(oldpath, newpath, function (err) {
          //if an error occurs send message to client
          if (err) {
            console.log("Error parsing the files");
            return res.status(400).json({
              status: "Fail",
              message: "There was an error parsing the files",
              error: err,
            });
          }
          //send result to the client if all is good.
          res.send({
                   result:'OK',
                   data:{'filename':files.image[0].originalFilename,'size':files.image.size},
                   numberOfImages:1,
                   message:"upload successful"
                 });
        
        });
       });
    });
    }
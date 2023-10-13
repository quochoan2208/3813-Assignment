// module.exports = function(app,formidable,fs,path){
// //Route to manage image file uploads

// app.post('/api/upload', (req, res) => {
//   var form = new formidable.IncomingForm();
//   const uploadFolder = path.join(__dirname, "../userimages");
//   form.uploadDir = uploadFolder;
//   form.keepExtensions = true;

//   form.parse(req, async (err, fields, files)=> {

//     //assuming a single file for this example.
//     let oldpath = files.image.filepath;
//     let newpath = form.uploadDir + "/" + files.image.originalFilename;
//     fs.rename(oldpath, newpath, function (err) {
//       //if an error occurs send message to client
//       if (err) {
//         console.log("Error parsing the files");
//         return res.status(400).json({
//           status: "Fail",
//           message: "There was an error parsing the files",
//           error: err,
//         });
//       }
//       //send result to the client if all is good.
//       res.send({
//                result:'OK',
//                data:{'filename':files.image.originalFilename,'size':files.image.size},
//                numberOfImages:1,
//                message:"upload successful"
//              });
    
//     });
//   });
// });
// }

module.exports = function (app, formidable, fs, path) {
  // Route to manage image file uploads
  app.post('/api/upload', (req, res) => {
    var form = new formidable.IncomingForm();
    const uploadFolder = path.join(__dirname, "../userimages");
    form.uploadDir = uploadFolder;
    form.keepExtensions = true;

    form.parse(req, async (err, fields, files) => {
      // Check for errors during file upload
      if (err) {
        console.error("Error parsing the files", err);
        return res.status(400).json({
          status: "Fail",
          message: "There was an error parsing the files",
          error: err,
        });
      }

      // Check if 'image' file exists in 'files' and 'files.image' is defined
      if (files.image && files.image.filepath) {
        let oldpath = files.image.filepath;
        let newpath = form.uploadDir + "/" + files.image.originalFilename;
        fs.rename(oldpath, newpath, function (err) {
          // Handle file renaming errors
          if (err) {
            console.error("Error renaming the file", err);
            return res.status(400).json({
              status: "Fail",
              message: "There was an error renaming the file",
              error: err,
            });
          }
          // Send success response if all is good.
          res.send({
            result: 'OK',
            data: { 'filename': files.image.originalFilename, 'size': files.image.size },
            numberOfImages: 1,
            message: "Upload successful"
          });
        });
      } else {
        // Handle case where 'files.image' is not defined
        console.error("No 'image' file found in the uploaded files.");
        return res.status(400).json({
          status: "Fail",
          message: "No 'image' file found in the uploaded files",
        });
      }
    });
  });
};

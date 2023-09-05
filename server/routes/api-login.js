module.exports = function (app,path,fs) {
    //Route to manage user logins


    app.post('/api/auth', function (req, res) {
        if (!req.body) {
            return res.sendStatus(400)
        }
        fs.readFile('data/users.json','utf8',(err,data)=>{
            if (err) {
              console.error(err)
              return
            }
            try{
                console.log(data);
              let users = JSON.parse(data);
              users = users.people;
              console.log(users);
            var customer = {};
    
            customer.valid = false;
            customer.email = '';
            customer.username = '';
            customer.role = '';
    
            for (let i = 0; i < users.length; i++) {
                if (req.body.email == users[i].email && req.body.upwd == users[i].pwd) {
                    customer.valid = true;
                    customer.email = users[i].email;
                    customer.username = users[i].username;
                    customer.role = users[i].role;
    
                }
            }
            res.send(customer);
            
            }catch(err){
              console.log("Error pasing the userdata");
            }
              
           })
     
       

       

    });
}

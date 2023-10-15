var express = require("express");
var fileuploader = require("express-fileupload");
var app = express();
var mysql = require("mysql2");

app.listen(2004, function () {
    console.log("server started")
})
app.use(express.static("project"));
app.use(fileuploader());

var dbConfig = {
    host: "127.0.0.1",
    user: "root",
    password: "nikhil5757",
    database: "dbcon",
    dateStrings:true
}

var dbCon = mysql.createConnection(dbConfig);
dbCon.connect(function (jasoos) {
    if (jasoos == null)
        console.log("Connected Successfulllyyy...");
    else
        console.log(jasoos);
})

/*app.get("/signup",function(req,resp)
{
    resp.sendFile(process.cwd()+"/my-public/my-signup.html")
})

app.get("/signup-process",function(req,resp)
{
    resp.send("welcome="+req.query.txtName+","+req.query.txtEmail+","+req.query.txtPwd)
})*/
app.get("/", function (req, resp) {
    resp.sendFile(process.cwd() + "/project/home.html");
})
app.get("/signup-secure", function (req, resp) {
    resp.sendFile(process.cwd() + "/my-public/my-secure-signup.html");
})
app.use(express.urlencoded(true));
app.post("/signup-secure-process", function (req, resp) {
    resp.contentType("text/html");
    var quali = "";
    if (req.body.qualib != undefined)
        quali = quali + req.body.qualib + ",";
    if (req.body.qualim != undefined)
        quali = quali + req.body.qualim;
    if (req.body.qualib == undefined && req.body.qualim == undefined)
        quali = "No qualification";
    if (quali.endsWith(","))
        quali = quali.substring(0, quali.length - 1);

    //--------File Uploading---------------
    var filename = "nopic.jpg";
    if (req.files != null) {
        filename = req.files.nppic.name;
        var path = process.cwd() + "/my-public/uploads/" + filename;
        req.files.nppic.mv(path);
    }
    var combobox = req.body.combo;
    var listbox = req.body.list.toString();
    resp.send("welcome=" + req.body.txtName + "<br>" + req.body.txtEmail + "<br>" + req.body.txtPwd + "<br>" + quali + "<br>" + req.body.occu + "<br> image=" + filename
        + "<br>" + combobox + "<br>" + listbox);
    console.log(req.body);
})
app.get("/dbcon-signup-secure", function (req, resp) {
    resp.sendFile(process.cwd() + "/project/index.html");
})
app.post("/db-signup-process-secure", function (req, resp) {
    var email = req.body.txtEmail;
    var name = req.body.txtName;
    var contact = req.body.txtContact;
    var address = req.body.txtAddress;
    var city = req.body.txtCity;
    var id = req.body.txtID;
    var ahours = req.body.t1 + " " + "to" + " " + req.body.t2;
    var filename = "nopic.jpg";
    if (req.files != null) {
        filename = req.files.nppic.name;
        var path = process.cwd() + "/project/uploads/" + filename;
        req.files.nppic.mv(path);
    }
    dbCon.query("insert into donors(email,name,contact,address,city,id,filename,ahours) values(?,?,?,?,?,?,?,?)", [email, name, contact, address, city, id, filename, ahours], function (err) {
        if (err == null)
            resp.send("saved successfully");
        else
            resp.send(err);
    })

})
app.post("/db-signup-delete-secure", function (req, resp) {

    var email = req.body.txtEmail;
    dbCon.query("delete from users where email=?", [email], function (err, result) {
        if (err == null) {
            if (result.affectedRows == 1)
                resp.send("Account removed successfully");
            else
                resp.send("incorrect email id");
        }
        else
            resp.send(err);
    })
}
)
app.get("/chk-email", function (req, resp) {

    dbCon.query("select * from users1 where email=?", [req.query.kuemail], function (err, resultTable) {
        if (err == null) {
            if (resultTable.length == 1) {
                resp.send("email id already taken");
            }
            else {

                resp.send("available");
            }
        }
        else {
            resp.send(err);
        }
    })
})
app.get("/insert-info", function (req, resp) {

    

    dbCon.query("insert into users1(email,password,type,dos,status) values(?,?,?,current_date(),1)", [req.query.kuchemail, req.query.kuchpwd, req.query.kuchtype], function (err) {
        if (err == null)
            resp.send("saved successfully");
        else
            console.log(err.message);
    })

})
app.get("/insert-info-med", function (req, resp) {

    dbCon.query("insert into medsavailable(email,med,expdate,packing,qty) values(?,?,?,?,?)", [req.query.kuchemail, req.query.kuchname, req.query.kuchdate, req.query.kuchtype, req.query.kuchqty], function (err) {
        if (err == null)
            resp.send("saved successfully");
        else
            console.log(err.message);
    })

})
app.get("/search-info", function (req, resp) {

    dbCon.query("select * from users1 where email=? and password=?", [req.query.email, req.query.password], function (err, resutltablejason) {

        if (err == null) {
            if (resutltablejason.length == 1) {
                if (resutltablejason[0].status == 0) {
                    resp.send("you have been blocked by the admin");
                }
                else {
                    resp.send(resutltablejason[0].type);
                }
            }
        }
        else
            resp.send(err);
    })
})
/*app.get("/update-info",function(req,resp)
{
    
    dbCon.query("update users1 set password=?,type=?,filename=? where email=?",[req.query.kuchpwd,req.query.kuchtype,req.query.kuchfile,req.query.kuchemail],function(err)
    {
        if(err==null)
        resp.send("saved successfully");
        else
        console.log(err.message);
    })
    
})*/
app.post("/update-info", function (req, resp) {

    //---------------File Uploading================
    var email = req.body.txtEmail;
    var name = req.body.txtName;
    var contact = req.body.txtContact;
    var address = req.body.txtAddress;
    var city = req.body.txtCity;
    var id = req.body.txtID;
    var ahours = req.body.t1 + " " + "to" + " " + req.body.t2;
    var filename = "nopic.jpg";
    if (req.files != null) {
        filename = req.files.nppic.name;
        var path = process.cwd() + "/project/uploads/" + filename;
        req.files.nppic.mv(path);
    }

    //fixed                             //same seq. as in table
    dbCon.query("update donors set name=?,contact=?,address=?,city=?,id=?,filename=?,ahours=? where email=?", [name, contact, address, city, id, filename, ahours, email], function (err) {
        if (err == null)
            resp.send("Record Updated ");
        else
            resp.send(err);
    })
})
app.get("/get-json-record", function (req, resp) {

    dbCon.query("select * from donors where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
        if (err == null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
app.post("/needy-save", function (req, resp) {
    var email = req.body.txtEmail;
    var name = req.body.txtName;
    var contact = req.body.txtContact;
    var address = req.body.txtAddress;
    var city = req.body.txtCity;
    var id = req.body.txtID;
    var dob=req.body.txtDOB;
    var gender=req.body.txtGender;

    var filename = "nopic.jpg";
    if (req.files != null) {
        filename = req.files.nppic.name;
        var path = process.cwd() + "/project/uploads/" + filename;
        req.files.nppic.mv(path);
    }
    dbCon.query("insert into needy(email,name,contact,address,city,id,filename,DOB,gender) values(?,?,?,?,?,?,?,?,?)", [email, name, contact, address, city, id, filename,dob,gender], function (err) {
        if (err == null)
            resp.send("saved successfully");
        else
            resp.send(err);
    })
})
    app.post("/update-info-needy", function (req, resp) {

        //---------------File Uploading================
        var email = req.body.txtEmail;
        var name = req.body.txtName;
        var contact = req.body.txtContact;
        var address = req.body.txtAddress;
        var city = req.body.txtCity;
        var id = req.body.txtID;
        var dob=req.body.txtDOB;
        var gender=req.body.txtGender;
        var filename;
        if (req.files != null) {
            filename = req.files.nppic.name;
            var path = process.cwd() + "/project/uploads/" + filename;
            req.files.nppic.mv(path);
        }
    
        //fixed                             //same seq. as in table
        dbCon.query("update needy set name=?,contact=?,address=?,city=?,id=?,filename=?,DOB=?,gender=? where email=?", [name, contact, address, city, id, filename,dob,gender,email], function (err) {
            if (err == null)
                resp.send("Record Updated ");
            else
                resp.send(err);
        })
    })

app.get("/get-needy-record", function (req, resp) {

    dbCon.query("select * from needy where email=?", [req.query.kuchEmail], function (err, resultTableJSON) {
        if (err == null)
            resp.send(resultTableJSON);
        else
            resp.send(err);
    })
})
app.get("/update-donor-info-settings", function (req, resp) {
    
    dbCon.query("select * from users1 where email=?", [req.query.kuchemail], function (err, resultTableJSON) {
        if (err == null) {
            if(resultTableJSON.length==1)
            {
                if(req.query.kucholdpwd==req.query.kuchnewpwd)
                {
                    resp.send("Old and new password should not be same");
                }
                else if(req.query.kuchnewpwd!=req.query.kuchconpwd)
                {
                    resp.send("Confirm and new password should be same");
                }
                else{
                    dbCon.query("update users1 set password=? where email=?", [req.query.kuchnewpwd,req.query.kuchemail], function (er) { 
                        if(er==null)
                        {
                            resp.send("record updated");
                        }
                        else
                        {
                            resp.send(er);
                        }
                })
            }
            }
        }
        else
            resp.send(err);
    })
})
app.get("/get-json-record-users-admin",function(req,resp)
{
    dbCon.query("select * from users1",function(err,resultTableJSON)
    {
        if(err==null)
        resp.send(resultTableJSON);
        else
        resp.send(err);
    })
})
app.get("/delete-users-admin",function(req,resp)
{
    var email=req.query.emailkuch;
    dbCon.query("delete from users1 where email=?",[email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("Deleted");
            else
            resp.send("invalid email id");
        }
        else
        resp.send(err);
    })
})
app.get("/block-status-admin",function(req,resp)
{
    
    var email=req.query.emailkuch;
    dbCon.query("update users1 set status=0 where email=?",[email],function(err,result)
    {
        if(err==null)
        {
            
            if(result.affectedRows==1)
            resp.send("Blocked")
            else
            resp.send("invalid email id")
        }
        else
        resp.send(err);
    })
})
app.get("/resume-status-admin",function(req,resp)
{
    var email=req.query.emailkuch;
    dbCon.query("update users1 set status=1 where email=?",[email],function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
           {
            
            resp.send("resumed");
           }
            else
            resp.send("invalid email id")
        }
        else
    resp.send(err);
    })
    
})
app.get("/get-json-record-needy-admin",function(req,resp)
{
    dbCon.query("select * from needy",function(err,resultTableJSON)
    {
        if(err==null)
        resp.send(resultTableJSON);
        else
        resp.send(err);
    })
})
app.get("/get-json-record-donors-admin",function(req,resp)
{
    dbCon.query("select * from donors",function(err,resultTableJSON)
    {
        if(err==null)
        resp.send(resultTableJSON);
        else
        resp.send(err);
    })
})  
app.get("/get-med-record",function(req,resp)
{
    dbCon.query("select * from medsavailable where email=?",[req.query.emailkuch],function(err,resultTableJSON)
    {
        if(err==null)
        {
            resp.send(resultTableJSON);
        }
        else
        resp.send(err);
    })
})
app.get("/delete-med-record",function(req,resp)
{
    dbCon.query("delete from medsavailable where srno=?",[req.query.srnokuch],function(err)
    {
        if(err==null)
        resp.send("deleted");
        else
        resp.send(err);
    })
})
app.get("/get-distinct-city",function(req,resp)
{
    dbCon.query("select distinct city from donors",function(err,resultTableJSON)
    {
        if(err==null)
        resp.send(resultTableJSON);
        else
        resp.send(err);
    })
})
app.get("/get-distinct-med",function(req,resp)
{
    dbCon.query("select distinct med from medsavailable",function(err,resultTableJSON)
    {
        if(err==null)
        resp.send(resultTableJSON);
        else
        resp.send(err);
    })
})
app.get("/delete-expired",function(req,resp)
{
    dbCon.query("delete from medsavailable where expdate<=current_date()",function(err,result)
    {
        if(err==null)
        {
            if(result.affectedRows==1)
            resp.send("deleted");
            else
            resp.send("all medicines are okay")
        }
        else
        resp.send(err);
    })
})
app.get("/find-donors",function(req,resp)
{
    dbCon.query("select donors.email,donors.name,donors.contact,donors.address,donors.city,donors.id,donors.filename,donors.ahours,medsavailable.med from donors inner join medsavailable on donors.email=medsavailable.email where medsavailable.med=? and donors.city=?",[req.query.medkuch,req.query.citykuch],function(err,resultTableJSON)
    {
        if(err==null)
        resp.send(resultTableJSON);
        else
        resp.send(err);
    })
})
import express from 'express';
import mongoClient from '../mongodb.mjs'
import { ObjectId } from 'mongodb';
import admin from "firebase-admin";
import multer, { diskStorage } from 'multer';
import fs from "fs";
import jwt from 'jsonwebtoken';




////////////////////////////////////////////////////////////////
/* Sates */
////////////////////////////////////////////////////////////////

let router = express.Router();
let dbName = 'student-management-app';
let db = mongoClient.db(dbName);
let userCollection = db.collection('registered-users');
let attendancesCollection = db.collection('all-attendances');
let connectMessage = 'Mongo Atlas Connected Successfully';
let disconnectMessage = 'Mongo Atlas *Disconnected* Successfully';
//////////////////////////////////////////////////////////////////
const storageConfig = diskStorage({ // https://www.npmjs.com/package/multer#diskstorage
    destination: './imageUploads/',
    filename: function (req, file, cb) {
        console.log("mul-file: ", file);
        cb(null, `postImg-${new Date().getTime()}-${file.originalname}`)
    }
})
let upload = multer({ storage: storageConfig })
//////////////////////////////////////////////////////////////////
let serviceAccount = {
    "type": "service_account",
    "project_id": "utophoria-multer",
    "private_key_id": "2e2e4226838bde8f59ee8fc164bb9c13b99e83ef",
    "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDO7F/ttNMLqM0e\n71skkugp+PXlGxbmLbMUu3RCHdPZU7EjFajd8Hgdg2j4yXi4AIyi3RJHdBPJGkYn\nAeepOi+i6QXF9LkA8SyG3FAH2dU1cUiaYN16nchgbRYaAm6UEvrHvtD9oGlsUvvR\n89GkDWLf8vBmIU5Tcu3No2HdPA+O0N+RMAle5B2aCQoy4Jf106z1sWts4mDbg/Iu\nMfPDpzgL811zQ0nV9L72z4E2YYZLYWjKi1UtZUCaqchbpIEPKTPynpkKyyscqTQe\nKWGjoHF7atmM5LGtp9OsJnmRRKEMGA0AV9WgUcMMmtj9XFyP8rxj057YyaDnBrmi\n/7aaMu9bAgMBAAECggEAYXh464kNDOXz0YmgXkcRM4xBkC1FiSGnxLFUXzybqTjC\nLSurwvfeLNDU5rRIuCwSEzmdvajRFR7aQs+j51QwUkX/4TKY3ve8KL6ouDoFM8ps\nD8RnL7YZSEq6aYARxJB4LxUUbxRb9JnWYxy9+NARbjqKwSEZOzfdCsvWcpczIOsr\naO2W+yNA29u+Pew/ui/mQ/zkCrnUysMJMNKCXz3OfBqcbAuoB5EzaYpseWoMt4BG\nc4BeyQAxW+RaSRqIZcDqCdc/D3O9Pidpw6GJIoYZZKtJosnjj9ldCDMmAHCm3+FR\nFCYPfTEsAAMOWlzbLm0ezSunSk2pR05TyXro4oItEQKBgQD7TZqZocz9CI0IaNyo\nA6IHb3B3SoNNKC6IazH4NymgLK+Bmh1na6YXvNT8Xdcr/GPXrOBmPVEHVisH5zPM\nRKIGTdKkdfHhSAiDhQojU+/7EzW3Eux5dEiGC44VXbjjaPUUFJlGnVoOH+DnIWMP\nskWkocO1OBEgai3ZFENLgWWRcwKBgQDSym3j1CAKsQp7GHviSvowvbaRJAXNmTal\n6K8SA/Owpqz+9jq5GY1g39s0v87B0fakmNSZ5PeWIqfQq9xsLdIaeSznmQenmpdA\n6dTHLgDAfI1IPXzOgRhpOGfpTxBA4z6x26OYHV+8R1jcT8thOMrcevdWgFjPIF0G\n3u+dGP4QeQKBgBdhC935GIn9zqkWoFidJejNLEhczURTVajpWBfAggXdwmIrRUsG\nz8frkGD+FfOIon1BHwtD7xLgqFYu4znAtNYjTVJxipQr0Gbz7JKGz4+rJNcoUomm\nEM0vrAM+2eGGNS6uD+hq4SLpQlIeYAnoyuPbDMsCMU2zsxo78VrH6fwTAoGAdM4v\nrrvxNXt9b1DV9UPO+Atoi20GujNYkP8rZDREaXMzEeWoDMIYEcJ6WfSfwc9zeSon\nRVAX0l5J19wkPN33OyxCseOe1kVX42Svv9/CEufx8kIAUv4+ZLAZBLQHMa27JBut\nv7EnR9HRb+PXs3whDaQmQwzEKaKpahFHfipHPyECgYEA4MaaGtoKKmwRR5omMAv8\nLDu1e2jiGo5CNKKN02Zv7GGDC/NtDkZddhIM9DHhcgH4gtR91HPCO+HRohY6sAzy\nUol9ANUctep8KXV77hjfWLam3QyX9/5w5ZWDDdyoVaCIMUDScfOGJFvhhflLd4IQ\nvDtLD/5PZ8yC0e0LiSZ44Kw=\n-----END PRIVATE KEY-----\n",
    "client_email": "firebase-adminsdk-dtoz1@utophoria-multer.iam.gserviceaccount.com",
    "client_id": "117815770554791351119",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-dtoz1%40utophoria-multer.iam.gserviceaccount.com",
    "universe_domain": "googleapis.com"
  }

////////////////////////////////////////////////////////////////
/* Firebase Bucket Initialization */
////////////////////////////////////////////////////////////////


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL: "https://smit-b9.firebaseio.com"
});
const bucket = admin.storage().bucket("gs://utophoria-multer.appspot.com");




////////////////////////////////////////////////////////////////
/* Create User API*/
////////////////////////////////////////////////////////////////


router.post('/createuser', upload.any(),

    async (req, res, next) => { 
        console.log("req.body: ", req.body);

        if (
            !req.body.email
            || !req.body.password
            || !req.body.name
            || !req.body.id
            || !req.body.course
        ) {
            res.status(403);
            res.send(`required parameters missing, 
        example request body:
        {
            "name": "John Doe",
            "email": "john.doe@gmail.com",
            "password": "somepassword",
            "id": "someid123",
            "course": "somecourse",

        } `);
            return;
        }


        // TODO: save file in storage bucket and get public url

        console.log("req.files: ", req.files);

        if(req.files && req.files.length > 0) {
            if (req.files[0].size > 10000000) { // size bytes, limit of 2MB
                res.status(403).send({ message: 'File size limit exceed, max limit 2MB' });
                return;
            }

        bucket.upload(
            req.files[0].path,
            {
                destination: `students/${req.files[0].filename}`, // give destination name if you want to give a certain name to file in bucket, include date to make name unique otherwise it will replace previous file with the same name
            },
            function (err, file, apiResponse) {
                if (!err) {
                    // console.log("api resp: ", apiResponse);

                    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#getSignedUrl
                    file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    }).then(async (urlData, err) => {
                        if (!err) {
                            console.log("public downloadable url: ", urlData[0]) // this is public downloadable url 

                            await mongoClient.connect();
                            console.log(connectMessage);
                            console.log("Attempting to create post")

                            try {
                                const insertResponse = await userCollection.insertOne({
                                    img: urlData[0],
                                    name: req.body.name,
                                    email: req.body.email,
                                    course: req.body.course,
                                    studentId: req.body.id,
                                    password: req.body.password,
                                    createdOn: new Date(),
                                    role: "user",
                                });
                                console.log("insertResponse: ", insertResponse);

                                res.send({ message: 'User created' });
                                await mongoClient.close();
                                console.log(disconnectMessage);
                            } catch (e) {
                                console.log("error inserting mongodb: ", e);
                                res.status(500).send({ message: 'server error, please try later' });
                                await mongoClient.close();
                                console.log(disconnectMessage);
                            }



                            // // delete file from folder before sending response back to client (optional but recommended)
                            // // optional because it is gonna delete automatically sooner or later
                            // // recommended because you may run out of space if you dont do so, and if your files are sensitive it is simply not safe in server folder

                            try {
                                fs.unlinkSync(req.files[0].path)
                                //file removed
                            } catch (err) {
                                console.error(err)
                            }
                        }
                    })
                } else {
                    console.log("err: ", err)
                    res.status(500).send({
                        message: "server error"
                    });
                }
            });




        } /// if condition ended successfully
        else {


            await mongoClient.connect();
            console.log(connectMessage);
            console.log("Attempting to create post")

            try {
                const insertResponse = await userCollection.insertOne({
                    name: req.body.name,
                    email: req.body.email,
                    course: req.body.course,
                    studentId: req.body.id,
                    password: req.body.password,
                    createdOn: new Date(),
                    role: "user",
                    img: "https://storage.googleapis.com/utophoria-multer.appspot.com/students/postImg-1702803797365-%C3%A2%C2%80%C2%94Pngtree%C3%A2%C2%80%C2%94businessman%20user%20avatar%20free%20vector_4827807.png?GoogleAccessId=firebase-adminsdk-dtoz1%40utophoria-multer.iam.gserviceaccount.com&Expires=16446999600&Signature=TIQNFX0ntacY3maDO2xYlsjDDn21qYvEx%2FnGr875yocUNYiW%2F6RZnEoBB94wGkXzJ9qtf8S8HwarHtWE3k0R7dXnmn58KKVkSS%2FjzotInlVJru2wETmC%2FBGbdouEcsqHX%2Bro6SJ6uGpOQsDjY6nWoBZWwmBuTOLK56H6m02LT%2Fx9sP7UiPFgkhzh%2FxVkX2mSDLahTfdfAsOdHvcyKQ%2BHRy3iiYZG9Wk4XEBvWhmrTfsXUl4XMcJz52piwzYo1wCsQ0Qsw2jalMhaouEg4J%2BLM14uu%2B7RA4fugMKez4A%2B0KiE2v3ok%2B6LiS4vP%2FZJ3PZWp5iL9512KWS3GWvJiYu6kA%3D%3D"
                });
                console.log("insertResponse: ", insertResponse);

                res.send({ message: 'post created' });
                await mongoClient.close();
                console.log(disconnectMessage);
            } catch (e) {
                console.log("error inserting mongodb: ", e);
                res.status(500).send({ message: 'server error, please try later' });
                await mongoClient.close();
                console.log(disconnectMessage);
            }

        }
    })



////////////////////////////////////////////////////////////////
/* Update User API*/
////////////////////////////////////////////////////////////////

router.put('/updateuser/', upload.any(), async (req, res) => {
    try {
      const userEmail = req.body.email;
      // Connect to MongoDB
      await mongoClient.connect();
  
      const userToUpdate = await userCollection.findOne({ email: userEmail });
  
      if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user fields based on your requirements
      userToUpdate.name = req.body.name || userToUpdate.name;
      userToUpdate.email = req.body.email || userToUpdate.email;
      userToUpdate.course = req.body.course || userToUpdate.course;
      userToUpdate.studentId = req.body.id || userToUpdate.studentId;
      userToUpdate.password = req.body.password || userToUpdate.password;

  
      // Update user image if a new file is uploaded
      if (req.files && req.files.length > 0) {
        if (req.files[0].size > 10000000) { // size bytes, limit of 2MB
            res.status(403).send({ message: 'File size limit exceeded, max limit 2MB' });
            return;
        }

        bucket.upload(
            req.files[0].path,
            {
                destination: `students/${req.files[0].filename}`,
            },
            async (err, file, apiResponse) => {
                if (!err) {
                    const urlData = await file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    });
                    console.log("public downloadable url: ", urlData[0]);

                    // Update user's img field with the new image URL
                    userToUpdate.img = urlData[0] || userToUpdate.img;

                    // Delete file from folder
                    try {
                        fs.unlinkSync(req.files[0].path);
                    } catch (err) {
                        console.error(err);
                    }

                    // Update user in the database
                    await userCollection.updateOne({ email: userEmail }, { $set: userToUpdate });

                    res.json({ message: 'User updated successfully' });
                } else {
                    console.log("err: ", err);
                    res.status(500).json({ message: 'Server error' });
                }
            }
        );
      } else {
        // If no new file uploaded, update user without modifying img field
        await userCollection.updateOne({ email: userEmail }, { $set: userToUpdate });
        res.json({ message: 'User updated successfully' });
      }
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    } finally {
      // Close MongoDB connection
      await mongoClient.close();
    }
});



////////////////////////////////////////////////////////////////
/* Login API */
////////////////////////////////////////////////////////////////


router.post('/login', async(req, res)=>{

    try{

        if (!req.body?.email || !req.body?.password) {

            res.status(403);
            res.send(`required parameters missing, 
            example request body:
            {
                email: "some@email.com",
                password: "some$password",
            } `);
            return;

        }

        req.body.email = req.body.email.toLowerCase();
        await mongoClient.connect();
        let findUser = await userCollection.findOne({ email: req.body.email });
        console.log(findUser);

        if(!findUser){

            res.status(403).send({
                message: "email or password incorrect"
            });

            return;

        }
        if(findUser){

            // const passwordVerification = await varifyHash(req.body.password, findUser.password);

                if(req.body.password === findUser.password){

                    const JSONtoken = jwt.sign(
                        {
                        role: findUser.role,
                        name: findUser.name,
                        email: findUser.email,
                        _id: findUser._id,
                        img: findUser.img,           
                        id: findUser.studentId,
                        course: findUser.course},
                        
                        process.env.SECRET,

                        {
                        expiresIn: '72h',
                        }
                        );       

                        res.cookie('authenticationtoken', JSONtoken,{
                            httpOnly: true,
                            // secure: true,
                            expires: new Date(Date.now() + 259200000),
                            // sameSite: 'None',
                        });

                        res.send({
                            message: "login successful",
                            data: {
                                role: findUser.role,
                                name: findUser.name,
                                email: findUser.email,
                                _id: findUser._id,
                                img: findUser.img,
                                id: findUser.studentId,
                                course: findUser.course
                            }
                        });

                        await mongoClient.close();
                        return;
                
                
                
                
                }else{

                    res.status(401).send({
                        message: "Email or password incorrect",
                    })
                    await mongoClient.close();
                    return;
                }


        }



    }catch(e){

        console.log("Error: " + e)
        res.status(500).send({
            message: "Internal Server Error",
        });
        await mongoClient.close();


    }

})


////////////////////////////////////////////////////////////////
/* Logout API */
////////////////////////////////////////////////////////////////


router.post('/logout', async(req, res)=>{

    res.clearCookie('authenticationtoken')
    res.status(200).send({ message: 'Logout Successful' })

});

////////////////////////////////////////////////////////////////
/* Get All Students API */
////////////////////////////////////////////////////////////////


router.get('/getStudents', async(req, res) => {
    console.log('Get All Post request received @:' + new Date());

    try {
        await mongoClient.connect();
        console.log(connectMessage);

        const cursor = userCollection.find({role: 'user'}).sort({ _id: -1 });
            let results = await cursor.toArray()
            console.log("Results: ", results);
            res.status(200).send(results);
            // await mongoClient.close();
            // console.log(disconnectMessage);

    }
    catch(error){


        console.log("Error: ", error);
        console.log('Error in getting All posts');
        res.status(404).send("Error in getting All Students");
        await mongoClient.close();
        console.log(disconnectMessage);

        
         }


})


////////////////////////////////////////////////////////////////
/* Checkin API */
////////////////////////////////////////////////////////////////


router.post('/checkin/:email', upload.any(), async (req, res) => {

    console.log("***********Checkin API***********");
    try {
      const userEmail = req.params.email;
      // Connect to MongoDB
      await mongoClient.connect();
  
      const userToUpdate = await userCollection.findOne({ email: userEmail });
  
      if (!userToUpdate) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      if (req.files && req.files.length > 0) {
        if (req.files[0].size > 10000000) { // size bytes, limit of 2MB
            res.status(403).send({ message: 'File size limit exceeded, max limit 2MB' });
            return;
        }

        bucket.upload(
            req.files[0].path,
            {
                destination: `students/${req.files[0].filename}`,
            },
            async (err, file, apiResponse) => {
                if (!err) {
                    const urlData = await file.getSignedUrl({
                        action: 'read',
                        expires: '03-09-2491'
                    });
                    console.log("public downloadable url: ", urlData[0]);

                    // Update user's img field with the new image URL

                    // Delete file from folder
                    try {
                        fs.unlinkSync(req.files[0].path);
                    } catch (err) {
                        console.error(err);
                    }

                    // Update user in the database
                    await userCollection.updateOne({ email: userEmail }, {$set: {
                        checkintime: new Date().toISOString(),
                    }});

                    await attendancesCollection.addOne ({
                        email: req.decodedCookie.email,
                        name: req.decodedCookie.name,
                        id: req.decodedCookie.id,
                        img: req.decodedCookie.img,
                        checkintime: new Date().toISOString
                    })

                    res.json({ message: 'User updated successfully' });
                } else {
                    console.log("err: ", err);
                    res.status(500).json({ message: 'Server error' });
                }
            }
        );
      } 
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
});


////////////////////////////////////////////////////////////////
/* Exporting ROUTER */
////////////////////////////////////////////////////////////////



export default router;


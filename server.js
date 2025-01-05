const express = require("express");
const app = express();
const fs = require("fs");
const { log, error, timeStamp } = require("console");
const { type } = require("os");
const { default: mongoose } = require("mongoose");

//middleware inbuilt
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  fs.appendFile(
    "log.txt",
    `\n${Date.now()}: ${req.ip} ${req.method}: ${req.path} `,
    (err, data) => {
      next();
    }
  );
});
//connection 
mongoose
.connect("mongodb://127.0.0.1:27017/learnBD")
.then(() => console.log(`MongoDB Connected!`))
.catch((err)=> console.log("MongoDB Error", err))

//Scehma
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
  },
  lastName: {
    type: String,
    require: false,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  jobTitle: {
    type: String,
    require: false,
  },
  gender: {
    type: String,
  },
},{ timestamps: true,});

const User = mongoose.model('user',userSchema)

//ROutes
app.get("/users",async (req, res) => {
   const allDbUsers = await User.find({})
  const html = `<ul>
    ${allDbUsers.map((user)=> `<li>${user.firstName} - ${user.email}</li>`).join("")}
   </ul>`
  return res.send(html);
});

app.get("/api/users",async (req, res) =>{
    const allDbUsers = await User.find({});
    return res.json(allDbUsers);
})

app
  .route("/api/users/:id")
  .get( async (req, res) => {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "user not found" });
    }
    return res.json(user);
  })
  .patch(async (req, res) => {
      await User.findByIdAndUpdate(req.params.id, { lastName : "Changed"});
      return res.json({ status: "success"})
  })
  .delete(async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
     return res.json({ status: "success Deleted"});

  });

app.post("/api/users",async (req, res) => {
  const body = req.body;
  if (
    !body ||
    !body.first_name ||
    !body.last_name ||
    !body.email ||
    !body.gender ||
    !body.job_title
  ) {
    res.status(400).json({ msg: "All fileds are require" });
  }
 const result = await User.create({
    firstName: body.first_name,
    lastName: body.last_name,
    email: body.email,
    jobTitle: body.job_title,
  })
  console.log("result:", result);
   return res.status(201).json({ msg: "success"})
});

app.listen(8000, () => {
  console.log(`Server listening is 8000`);
});

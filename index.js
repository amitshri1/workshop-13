const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


app.use(express.json());

const users = []

const authenticateToken = (request, response, next) => {
    let jwtToken;
    const authHeader = request.headers["authorization"];
    if (authHeader !== undefined) {
      jwtToken = authHeader.split(" ")[1];
    }
    if (jwtToken === undefined) {
      response.status(401);
      response.send("Invalid JWT Token");
    } else {
      jwt.verify(jwtToken, "MY_SECRET_TOKEN", async (error, payload) => {
        if (error) {
            response.status(401);
            response.send("Invalid Token");
        } else {
            next();
        }
      });
    }
  };

app.get("/users/", (request, response) => {
    response.json(users)
});

app.post("/register", async (request, response) => {
    const { username, password} = request.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const name = users.find(user => user.username = username)
    if (name === undefined){
        const user = {name: username, password: hashedPassword}
        users.push(user)
        response.status(200);
        response.send("Created successfully");
    }
    else{
        response.status(400);
        response.send("Already exists");
    }
  });

app.post("/login", async (request, response) => {
    const { username, password } = request.body;
    let itemIndex = users.findIndex(function(eachItem){
        if (eachItem.name === username){
            return true;
        }else{
            return false;
        }
    })
    if (itemIndex === -1) {
      response.status(400);
      response.send("Invalid");
    } else {
        const databaseUser = users[itemIndex];
        const isPasswordMatched = await bcrypt.compare(
        password,
        databaseUser.password
      );
      if (isPasswordMatched === true) {
        const payload = {
          username: username,
        };
        const jwtToken = jwt.sign(payload, "MY_SECRET_TOKEN");
        response.send({ jwtToken });
      } else {
        response.status(400);
        response.send("Invalid");
      }
    }
  });

  app.get("/auth", authenticateToken, (request, response) => {
    response.status(200).send("Successful!")
  });

app.listen(3000, () => {
      console.log("server is running at http://localhost:3000")
  });
const express = require("express");
const app = express();
const fs = require("fs"); //функция fs
const jsonParser = express.json(); // парсер
const students = "src/students.json"; //json-файл

app.get("/student", function (req, res) {
  const content = fs.readFileSync(students, "utf8");
  const student = JSON.parse(content);
  res.send(student);
});

app.get("/student/:id", function (req, res) {
  const id = req.params.id; // получаем id
  const content = fs.readFileSync(students, "utf8");
  const student = JSON.parse(content);
  let user = null;
  // находим в массиве пользователя по id
  for (var i = 0; i < student.length; i++) {
    if (student[i].id == id) {
      user = student[i];
      break;
    }
  }
  // отправляем пользователя
  if (user) {
    res.send(user);
  } else {
    res.status(404).send();
  }
});
app.get("/", function (req, res) {
  res.send("прикол");
});

app.post("/student", jsonParser, function (req, res) {
  if (!req.body) return res.sendStatus(400); // если не прошел post

  let data = fs.readFileSync(students, "utf8");
  let student = JSON.parse(data);

  var id = student.length + 1;
  var new_profile = {
    id: id,
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    group: req.query.group,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  student.push(new_profile);
  data = JSON.stringify(student);
  fs.writeFileSync(students, data); //ссылка
  res.send(new_profile);
});

app.delete("/student/:id", function (req, res) {
  const id = req.params.id - 1; // получаем id
  let data = fs.readFileSync(students, "utf8");
  let student = JSON.parse(data);

  if (id !== -1) student.splice(id, 1);
  else res.send("Ошибка");
  data = JSON.stringify(student);
  fs.writeFileSync(students, data); //ссылка
  res.send(student);
});

app.put("/student/:id", jsonParser, function (req, res) {
  const id = req.params.id - 1;
  let data = fs.readFileSync(students, "utf8");
  let student = JSON.parse(data);
  for (var i = 0; i < student.length; i++) {
    if (i === id) {
      student[id].firstName = req.query.firstName;
      student[id].lastName = req.query.lastName;
      student[id].group = req.query.group;
      student[id].updatedAt = new Date();
      data = JSON.stringify(student);
      fs.writeFileSync(students, data);
      res.send(student);
      break;
    }
  }
  res.send(students[id]);
});

app.listen(3000, function () {
  console.log("Работаем...");
});

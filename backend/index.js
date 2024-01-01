const express = require("express");
const app = express();
const PORT = 8082;
const sql = require("mssql");
const cors = require("cors");
const nodemailer = require("nodemailer");

app.use(express.json());

app.use(
  express.urlencoded({ extended: false, limit: 10000, parameterLimit: 5 })
);

//SQL Configuration
// const config = {
//   user: "sa",
//   password: "print@123",
//   server: `DESKTOP-R7UKJLG\\SQLEXPRESS`,
//   database: "tkt",
//   options: {
//     encrypt: false, // For secure connection to Azure SQL Database
//   },
// };

const config = {
  user: "abhi007_tkt",
  password: "sa1",
  server: `sql.bsite.net\\MSSQL2016`,
  database: "abhi007_tkt",
  options: {
    encrypt: false, // For secure connection to Azure SQL Database
  },
};

// Transporter object for mail settings
const transporter = nodemailer.createTransport({
  host: "mail.printbaroda.com",
  port: 99,
  secure: false,
  auth: {
    user: "techsupport@printbaroda.com",
    pass: "L9q%3ta1",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// enable cors
app.use(cors());
app.options("*", cors());

// Connect to database
// sql.connect(config, (err) => {
//   if (err) console.log(err);
//   else console.log("Connected to database !!");
// });

async function connectToDB() {
  try {
    await sql.connect(config);
    console.log("Connected to Database !!");
  } catch (err) {
    console.log(err);
  }
}

connectToDB();

// For checking
app.get("/", (req, res) => {
  res.status(200).json({"message": "Site connected"});
});

// Selection of from to and content
// const mailOptions = {
//   from: "techsupport@printbaroda.com",
//   to: "techsupport@printbaroda.com",
//   subject: "Mail testing",
//   text: "This is a test mail sent from techsupport to techsupport",
// };

// sendMail function to be called
const sendMail = (remarks, email, user, company) => {
  let mailOptions = {};
  // console.log("Email = ",email,"Mail options = " ,mailOptions);
  if (remarks) {
    mailOptions = {
      from: "techsupport@printbaroda.com",
      to: `${email}`,
      subject: `[SOLVED] Request fullfilled for ${company}`,
      text: `
  Dear ${user},\n \n
  Your request is marked as completed.\n \n Regards,\nSmile Computers`,
    };
  } else {
    // console.log("Reached here. Mail ID is ", email);
    mailOptions = {
      from: "techsupport@printbaroda.com",
      to: `${email}`,
      subject: `Request submitted for ${company}`,
      text: `
    Dear ${user},\n\n
    Your request for support is successfully submitted at Smile Computers.\nOur engineer will call / visit you shortly.\n\n Regards,\nSmile Computers`,
    };
  }
  transporter.sendMail(mailOptions, (error, info) => {
    // console.log(info);
    if (error) {
      console.log("Mail not sent", error);
      console.log(mailOptions);
      return 0; // 0 means mail is not sent
    } else {
      console.log("Mail sent");
      return 1; // 1 means mail is  sent
    }
  });
};

//Formatting date before sending over API
const dateFormatter = (arr) => {
  const newArr = arr.map((item) => {
    const strItem = JSON.stringify(item.date);
    // console.log(strItem);
    let newDate = strItem.replace("T00:00:00.000Z", "");
    let finalDate = newDate.replace('"', "");
    let date = finalDate.replace('"', "");
    // console.log("new Date = ",newDate);
    item.date = date;
    return item;
  });
  return newArr;
  //  console.log(newArr);
};

// Complaints endpoint to send all the complaints
app.get("/complaints", (req, res) => {
  new sql.Request().query("select * FROM complaints1 order by RecordID desc", (err, result) => {
    if (err) console.log(err);
    else {
      let { recordset } = result;
      let finalData = dateFormatter(recordset);
      // console.log("Following complaints sent: \n", finalData);
      res.send(finalData);
    }
  });
});

// Receiving complaints
// Define a route to handle the form submission
app.post("/submit-complaint", (req, res) => {
  // Extract data from the POST request
  // console.log("Request body: ", req.body);
  const { clientname, name, email, problem, issue, file } = req.body;

  // Create a SQL query to insert the form data into the database
  const sqlQuery = `INSERT INTO complaints1 (company, ussr, email ,problem, remarks, errFile) VALUES ('${clientname}', '${name}', '${email}' ,'${problem}', '${issue}', '${file}')`;
  const request = new sql.Request();
  request.query(sqlQuery, (err) => {
    if (err) {
      // console.error("SQL query execution failed:", err);
      return res.status(500).send("SQL query execution failed");
    }
    //sending 0 in sendMail to tell the function to send request submitted mail.
    // sendMail(0, email, name, clientname);
    res.status(200).send("Complaint submitted successfully");
  });
});
// sql.close();

//Updating complaints, set status from pending to completed
app.patch("/status-update/", (req, res) => {
  // const cardID = parseInt(req.params.RecordID);
  const { remarks, ID, company, email, user } = req.body;
  // console.log(remarks, ID);
  const sqlQuery = `update complaints1 set status = 1,remarks = '${remarks}' where RecordID = ${ID}`;
  const request = new sql.Request();
  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.error("Query execution failed:", err);
      return res.status(500).json({ message: "Query execution failed" });
    } else if (result.rowsAffected[0] == 0) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    // sendMail(remarks, email, user, company);
    return res.status(200).json({ message: "Status set to completed!!" });
  });
});

//Getting data for calls schedule from frontend
app.post("/submit-entry/", (req, res) => {
  const { companyName, entryType, remarks } = req.body;

  // Process the entry data (saving it to a database)
  const sqlQuery = `INSERT INTO schedule (company,engr,rmrk) VALUES ('${companyName}', ${entryType}, '${remarks}')`;
  // console.log("Query: ", sqlQuery);
  const request = new sql.Request();
  request.query(sqlQuery, (err, result) => {
    if (err) {
      console.log("Query execution failed: ", err);
      return res.status(500).json({ message: "Query execution failed" });
    }
    return res.status(200).json({ message: "Schedule updated!" });
  });
  // console.log("Received Entry:", { companyName, entryType, remarks });

  // Respond to the client
  // res.json({ message: "Entry submitted successfully" });
});

// Sending the scheduler log
app.get("/getScheduleData/", (req, res) => {
  new sql.Request().query(
    "select * FROM schedule",
    // "SELECT * FROM schedule WHERE CONVERT(DATE, date) = CONVERT(DATE, GETDATE());",
    (err, result) => {
      if (err) console.log(err);
      else {
        let { recordset } = result;
        let finalData = dateFormatter(recordset);
        // console.log("Following complaints sent: \n", finalData);
        res.send(finalData);
      }
    }
  );
});

//Old code for patch
// app.patch("/status-update/:RecordID", (req, res) => {
//   const cardID = parseInt(req.params.RecordID);
//   const { remarks } = req.body;
// console.log(remarks);
//   const sqlQuery = `update complaints1 set status = 1,remarks = '${remarks}' where RecordID = ${cardID}`;
//   const request = new sql.Request();
//   request.query(sqlQuery, (err, result) => {
//     if (err) {
//       console.error("Query execution failed:", err);
//       return res.status(500).json({ message: "Query execution failed" });
//     } else if (result.rowsAffected[0] == 0) {
//       return res.status(404).json({ message: "Complaint not found" });
//     }
//     return res.status(200).json({ message: "Status set to completed!!" });
//   });
// });

//Listen to port
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));

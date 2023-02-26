

module.exports = (req, res) => {
   console.log(req.body);
   const name = req.body.name;

   if (global.userId === undefined) {
      global.userId = 0;
   }
   global.userId = global.userId + 1;

   if (name === "bad") {
      console.log("Who???  " + name);
      return res.status(400).send({
         "error": "who???"
      });
   }
   const response = {
      "userId": global.userId,
      "userName": name,
      "basketId": "mockbasket",
   };

   console.log("HELLO " + name + " response " + JSON.stringify(response));
   return res.status(201).send(response);

}


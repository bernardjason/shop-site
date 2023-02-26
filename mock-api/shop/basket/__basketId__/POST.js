

module.exports = async (req, res) => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000);

    let basketId = 0;
    if (global.counter === undefined) {
        global.counter = 1;
    }
    if (global.basketId === undefined) {
        global.basketId = 0;
    }
    if (global.basket === undefined) {
        global.basket = [];
    }
   basketId = req.body['basketId'];

    if (global.basket[basketId] === undefined) {
        global.basket[basketId] = {
            "basketId": basketId,
            "items": []
        };
        console.log("Create basket for " + basketId);
    }

    console.log("basketID = " + basketId);
    console.log("basket currently " + JSON.stringify(global.basket[basketId]));
    console.log("body is " + JSON.stringify(req.body));
    console.log("Add to " + basketId + " from request " + JSON.stringify(req.body['items']));

    let newBasket = global.basket[basketId];

    req.body['items'].map((i) => {
        let notUpdated=true;
        newBasket['items'].forEach(element => {
           if ( element.stockId === i.stockId  ) {
            element.numberOf = element.numberOf + i.numberOf;
            notUpdated=false;
           }
        });
        if ( notUpdated ) {
            i.key = global.counter;
            newBasket["items"].push(i);
            global.counter = global.counter + 1;
        }
    });

    if (req.body.userId != null && req.body.userId >= 1) {
        global.basket[basketId] = newBasket;
        console.log("User logged in so save");
    } else {
        console.log("User *** NOT *** logged in so *** NOT *** saving");
    }

    const response = {
        "basketId": basketId,
        "message": null,
        "userId": req.body.userId,
        "items": newBasket["items"]
    };

    console.log("POST basket return " + JSON.stringify(response));
    console.log("-----------------------");

    return res.status(201).send(response);
}


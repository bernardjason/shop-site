

module.exports = async (req, res) => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(1000);

    console.log("DELETE from basket " + JSON.stringify(req.body));

    let basketId = 0;
    if (global.counter === undefined) {
        global.counter = 1;
    }
    if (global.basketId === undefined) {
        global.basketId = 0;
    }
    if (global.basket === undefined) {
        console.log("Create basket array");
        global.basket = [];
    }

    if (req.params.basketId === undefined) {
        global.basketId = global.basketId + 1;
        basketId = global.basketId;
    } else {
        basketId = req.params.basketId
    }

    if (global.basket[basketId] === undefined) {
        global.basket[basketId] = {
            "basketId": basketId,
            "items": [
            ]
        };
        console.log("Create basket for " + basketId);
    }

    console.log("basket currently " + JSON.stringify(global.basket[basketId]));
    console.log("add to " + basketId + " from request " + JSON.stringify(req.body['items']));

    req.body['items'].map((i) => {
        global.basket[basketId]["items"] = global.basket[basketId]["items"].filter(item => !(item.stockId == i.stockId && item.key == i.key));
    });

    const response = {
        "basketId": basketId,
        "message": null,
        "items": global.basket[basketId]["items"]
    };

    console.log("DELETE basket return " + JSON.stringify(response));
    console.log("-----------------------");

    return res.status(202).send(response);
}


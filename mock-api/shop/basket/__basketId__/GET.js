

module.exports = async (req, res) => {

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(2000);

    let basketId = 0;
    if (global.basketId === undefined) {
        global.basketId = 0;
    }
    if (global.basket === undefined) {
        console.log("Create basket array");
        global.basket = [];
    }


    basketId = req.params.basketId

    console.log("GET basket for " + basketId);

    if (global.basket[basketId] === undefined) {
        return res.status(400).send({
            "error": "create basket please"
        });
    }

    const response = {
        "basketId": basketId,
        "message": null,
        "items": global.basket[basketId]["items"]
    };

    console.log("basket returned " + JSON.stringify(response));

    return res.status(200).send(response);
}


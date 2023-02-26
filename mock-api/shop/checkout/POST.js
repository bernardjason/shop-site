

module.exports = async (req, res) => {
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    await delay(2000);

    const basket = req.body;
    console.log(JSON.stringify(basket));

    let badRequest = false;

    basket.items.forEach(
        (item) => {
            if (item.name === "failitem") {
                badRequest = true;
            }
        }
    );

    let status = null;
    let response = null;
    if (badRequest) {
        status = 400;
        response = {
            "error": "failed",
            "message": "ERRRRRR!"
        };

    } else {
        status = 201;
        response = {
            "basketId": basket.basketId,
            "message": "Dispatched",
            "address": basket.address,
            "items": []
        };

        global.basket[basket.basketId] = response;
    }


    console.log("POST checkout return " + JSON.stringify(response));
    console.log("-----------------------");

    return res.status(status).send(response);
}


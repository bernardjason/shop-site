

module.exports = (req, res) => {
	console.log("GET STOCK");
	return res.status(200).send(

		{
			"stock": [
				{
					"stockId": 3,
					"name": "failitem",
					"numberOf": 10,
					"description": "this item will fail to checkout"
				},
				{
					"stockId": 1,
					"name": "soap",
					"numberOf": 100,
					"description": "bar of soap"
				},
				{
					"stockId": 2,
					"name": "towel",
					"numberOf": 10,
					"description": "some towels"
				}
			]
		}

	);
}

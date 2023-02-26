import { useState, useEffect } from 'react'; 



const useGetStock = () => {
	const [allStock, setAllStock] = useState([]);

	useEffect(() => {
      	fetch('/shop/stock')
         	.then((response) => response.json())
         	.then((data) => {
            		setAllStock(data['stock']);
			console.log("Got all stock "+JSON.stringify(data));
         	})
         	.catch((err) => {
            	console.log(err.message);
         	});
	}, []);

	return { allStock } ; 
};

export default useGetStock;

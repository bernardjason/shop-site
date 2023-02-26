import { getCookie } from "../App";

const useDeleteFromBasket = () => {

    const doDelete = (basket,setBasket,stockId,key,userId) => {

		const csrftoken = getCookie('csrftoken');

        let item = { "basketId":basket.basketId,"userId":userId,"items":[ {"stockId":stockId,"key":key} ] };

        let url="/shop/basket";

        if ( basket.basketId !== -1 ) {
	        url = url + "/"+basket.basketId;
        }
        console.log("useDeleteFromBasket url is "+url);
        fetch(url , {
            headers: {
  			'Accept': 'application/json',
  			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken
		    },
            body: JSON.stringify(item), method: "delete" })
        .then((response) => {
            if ( ! response.ok ) {
                return response.text().then(text => { throw new Error(text) })
            }
            return response.json();
        })
        .then((data) => {
            console.log('Success:', JSON.stringify(data));
            setBasket(data);
        })
        .catch((error) => {
            console.log('Error:', error);
            alert("Error "+error);
        });
        return  ;
    };
    return doDelete;
};

export default useDeleteFromBasket;

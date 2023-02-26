import { getCookie } from "../App";

const useUpdateBasket = () => {

    const doUpdate = (setBasketCallback,userId,basketId,stockId,name,numberOf,description) => {

		const csrftoken = getCookie('csrftoken');

        let itemData = null;
        if ( stockId === undefined ) {
            itemData = { "items":[]};
        } else {
            itemData = { "items":[ {"stockId":stockId,"name":name,"numberOf":numberOf,"description":description } ] } ;
        }
        const item = {
            "basketId":basketId,
            "userId" : userId,
            ...itemData
         };

        let url="/shop/basket";

        console.log("usePostBasket url is "+url+ " basket is "+JSON.stringify(item));

        fetch(url , {
            headers: {
  			'Accept': 'application/json',
  			'Content-Type': 'application/json',
			'X-CSRFToken': csrftoken
		    },
            body: JSON.stringify(item), method: "post" })
        .then((response) => {
            if ( ! response.ok ) {
                return response.text().then(text => { throw new Error(text) })
            }
            return response.json();
        })
        .then((data) => {
            console.log('Success:', JSON.stringify(data));
            setBasketCallback(data);
        })
        .catch((error) => {
            console.log('Error:'+ error);
            alert('Error:'+ error);
        });
        return  ;
    };
    return doUpdate  ;

};

export default useUpdateBasket;

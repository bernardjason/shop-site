import { useEffect } from 'react';
import {basketContext} from '../App';
import { useContext } from "react";
import emptyBasket from './../helper/GlobalValues';


const useGetBasket = (basketId,currentBasket,loginId,setMessage) => {
    const {basket,setBasket} = useContext(basketContext);

    useEffect( () => {
            if ( loginId != null && basketId != null  && currentBasket != null & currentBasket.basketId === -1 ) {
                console.log("refresh basket useGetBasket "+JSON.stringify(basketId));
                setMessage("Checking for existing basket on backend");
      	        fetch('/shop/basket/'+basketId)
                .then((response) => response.json())
                .then((data) => {
         	        if ( data.error === "create basket please") {
         	            setBasket(emptyBasket);
         	        }  else {
                        setBasket(data);
         	        }
                }).catch((err) => {
                    console.log(err.message);
                })
            } else {
                console.log("Basket seems ok no need to refresh ");
                setMessage("empty basket");
            }
        },[basketId,setBasket,currentBasket]
    );


	return { basket , setBasket  } ;
};

export default useGetBasket;

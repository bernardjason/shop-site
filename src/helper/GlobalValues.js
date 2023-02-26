
const notLoggedOnUserId = -1;
const emptyBasket = {"basketId": -1 , "userId":notLoggedOnUserId, "status":"true", "message":null , "items":[] };

const notLoggedIn = {"userId":null, "userName":"please login","basketId":0 } ;

export {notLoggedIn, notLoggedOnUserId};
export default  emptyBasket ;
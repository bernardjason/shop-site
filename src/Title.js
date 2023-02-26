import { Children } from "react";

const Title = ({  children } ) => {

    return (
        <div className="main">
            <h4 className="containerTitle">{children}</h4>
        </div>
    );
};

export default Title;
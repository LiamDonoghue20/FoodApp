import { useContext } from "react";
import Modal from './UI/Modal.jsx';
import Input from "./UI/Input.jsx";
import Button from "./UI/Button.jsx";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import UserProgressContext from "../store/UserProgressContext.jsx";
import useHttp from "./hooks/useHttp.js";

const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
}

export default function Checkout() {
    const cartContext = useContext(CartContext)
    const progressContext = useContext(UserProgressContext)
    //call custom hook for orders and return the info needed
    const {data, isLoading, error, sendRequest, clearData} = useHttp('http://localhost:3000/orders', requestConfig )

    const cartTotal = cartContext.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity  * item.price,
            0
        )
    function handleClose() {
        progressContext.hideCheckout();
    }

    function handleFinish(){
        progressContext.hideCheckout();
        cartContext.clearCart();
        clearData();
    }

    function handleGoToCheckout() {
        progressContext.showCheckout();
    }

    function handleSubmit(event){
        //stops us submitted uncompleteled forms
        event.preventDefault();

        const fd = new FormData(event.target)
        //create an object with the data submitted via the form
        const customerData = Object.fromEntries(fd.entries())
        //send the request with the items and customer data
        sendRequest(   
            JSON.stringify({
            order:{
                items: cartContext.items,
                customer: customerData
            }
        }))
    }
    //actions or loading span given status of isLoading
    let actions = (
        <>
            <Button type="button" textOnly onClick={handleClose}>Close</Button>
            <Button textOnly onClick={handleGoToCheckout}>Submit Order</Button>
        </>
    )

    if (isLoading) {
        actions = <span>Sending order data...</span>
    }
    //if data is returned with no errors show a success message
    if(data && !error){
        return <Modal open={progressContext.progress==='checkout'} onClose={handleClose}>
        <h2>Success!</h2>
        <p>Your order has been submitted</p>
        <p className="modal-actions">
            <Button onClick={handleFinish}>Okay</Button>
        </p>
        </Modal>
    }

    return <Modal open={progressContext.progress ==='checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout:</h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
            <Input label="Full Name" type="text" id="name"/>
            <Input label="Email" type="email" id="email"/>
            <Input label="Street" type="text" id="street"/>
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code"/>
                <Input label="City" type="text" id="city"/>
            </div>

            {error && <Error title="Failed to submit order" message={error} />}

            <p className="modal-actions">
                {actions}
            </p>
        </form>
    </Modal>
}
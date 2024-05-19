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

    const {data, isLoading, error, sendRequest} = useHttp('http://localhost:3000/orders', requestConfig )

    const cartTotal = cartContext.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity  * item.price,
            0
        )
    function handleClose() {
        progressContext.hideCheckout();
    }

    function handleGoToCheckout() {
        progressContext.showCheckout();
    }

    function handleSubmit(event){
        event.preventDefault();

        const fd = new FormData(event.target)
        const customerData = Object.fromEntries(fd.entries())

        sendRequest()

        fetch('http://localhost:3000/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                order:{
                    items: cartContext.items,
                    customer: customerData
                }
            })
        })
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

            <p className="modal-actions">
                <Button type="button" textOnly onClick={handleClose}>Close</Button>
                <Button textOnly onClick={handleGoToCheckout}>Submit Order</Button>
            </p>
        </form>
    </Modal>
}
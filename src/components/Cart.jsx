import CartContext from '../store/CartContext'
import CartItem from './CartItem'
import Modal from './UI/Modal'
import Button from './UI/Button'
import { currencyFormatter } from '../util/formatting'
import UserProgressContext from '../store/UserProgressContext'
import { useContext } from 'react'

export default function Cart() {

    const cartContext = useContext(CartContext)
    const userProgressContext = useContext(UserProgressContext)

    const cartTotal = cartContext.items.reduce(
        (totalPrice, item) => totalPrice + item.quantity  * item.price,
            0
        )

    function handleCloseCart(){
        userProgressContext.hideCart();

    }


    return (
        <Modal className="cart" open={userProgressContext.progress === 'cart'}> 
            <h2>Your Cart</h2>
            <ul>
                {cartContext.items.map((item) => (
                    <CartItem 
                        key={item.id} 
                        {...item} 
                        name={item.name} 
                        quantity={item.quantity} 
                        price={item.price}
                        onIncrease={() => cartContext.addItem(item)}
                        onDecrease={() => cartContext.removeItem(item.id)}
                    />
                ))}
            </ul>
            <p className='cart-total'>{currencyFormatter.format(cartTotal)}</p>
            <p className='modal-actions'>
                <Button onClick={handleCloseCart}>Close</Button>
                <Button>Go to Checkout</Button>
            </p>
        </Modal>
    )
}
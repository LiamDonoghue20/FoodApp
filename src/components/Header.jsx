import { useContext } from 'react';
import logoImage from '../assets/logo.jpg';
import Button from './UI/Button';
import CartContext from '../store/CartContext';
import UserProgressContext from '../store/UserProgressContext';

export default function Header() {
    const cartCtx = useContext(CartContext);
    const userProgressContext = useContext(UserProgressContext)

    const totalCartItems = cartCtx.items.reduce((totalNumberOfItems, item) => {
        return totalNumberOfItems + item.quantity;
    }, 0)

    function handleShowCart(){
        userProgressContext.showCart();
    }

    return (

    <header id="main-header">
        <div id="title">
                <img src={logoImage} alt="Liam's Logo"/>
                <h1>LiamsFood</h1>
        </div>
        <nav>
            <Button textOnly onClick={handleShowCart}>Cart ({totalCartItems})</Button>
        </nav>
    </header>
    )
}
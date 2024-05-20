import { createContext, useState } from "react";

const UserProgressContext = createContext({
    progress: '',
    showCart: () => {},
    hideCart: () => {},
    showCheckout: () => {},
    hideCheckout: () => {}
})


export function UserProgressContextProvider({children}){
    //updates the different user progress states depending on the users place in the journey
    const [userProgress, setUserProgress] = useState('');

    function showCart() {
        setUserProgress('cart');
    }

    function hideCart() {
        setUserProgress('')
    }

    function showCheckout(){
        setUserProgress('checkout')
    }

    function hideCheckout() {
        setUserProgress('')
    }

    const userProgressContext = {
        progress: userProgress,
        showCart,
        hideCart,
        showCheckout,
        hideCheckout
    }

    return (
        <UserProgressContext.Provider value={userProgressContext}>
            { children }
        </UserProgressContext.Provider>
    )
}

export default UserProgressContext;
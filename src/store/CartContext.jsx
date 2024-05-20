import { createContext, useReducer } from "react";

//these are the functions and items array that are exposed in the Cart Context
const CartContext = createContext({
    items: [],
    addItem: (item) => {},
    removeItem: (id) => {},
    clearCart: () => {}
});

function cartReducer(state, action){
    if(action.type ==='ADD_ITEM'){
        //update state to add new item
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.item.id
        );
       //create new variable for update items array with old items spreadto it
        const updatedItems = [...state.items];

        //if the item already exists in the items array, increase the quantity by 1
        //otherwise just add the new object for the item
        if (existingCartItemIndex > -1){
            const existingItem = state.items[existingCartItemIndex]
            const updatedItem = {
                ...existingItem,
                quantity: existingItem.quantity + 1
            }
            updatedItems[existingCartItemIndex] = updatedItem
        } else {
            updatedItems.push({...action.item, quantity: 1});
        }

        return {...state,items: updatedItems};
    } 
    if(action.type ==='REMOVE_ITEM'){
        //update state to remove item
        const existingCartItemIndex = state.items.findIndex(
            (item) => item.id === action.id
        );

        const existingCartItem = state.items[existingCartItemIndex];
        const updatedItems = [...state.items];
            //if there is only 1 of the item in the cart remove it completely
            //otherwise just reduce the quantity by 1
        if(existingCartItem.quantity === 1) {
            updatedItems.splice(existingCartItemIndex, 1);
        } else {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity -1
            }
            updatedItems[existingCartItemIndex] = updatedItem

        }
        return {...state,items: updatedItems};

    } 
    //empties out all the items in the cart
    if(action.type === 'CLEAR_CART'){
        return {...state, items: [] };
    }
    return state;
}

export function CartContextProvider({children}){
   const [cart, dispatchCartAction] = useReducer(cartReducer, { items: []});



   function addItem(item){
    dispatchCartAction({type: 'ADD_ITEM', item})
   }

   function removeItem(id){
    dispatchCartAction({type: 'REMOVE_ITEM', id})
   }

   function clearCart(){
    dispatchCartAction({type: 'CLEAR_CART'})
   }

   const cartContext = {
    items: cart.items,
    addItem,
    removeItem,
    clearCart
};

    return <CartContext.Provider value={cartContext}>{children}</CartContext.Provider>
}

export default CartContext;
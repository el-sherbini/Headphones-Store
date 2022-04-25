import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQuantities, setTotalQuantities] = useState(0);
  const [qty, setQty] = useState(1);

  let foundProduct;
  let index;

  // Add item to cart
  const onAdd = (product, quantity) => {
    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    ); // Check if product is already in cart

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    ); // Update total price
    setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + quantity); // Update total quantities

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id)
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          }; // Update quantity
      });

      setCartItems(updatedCartItems); // Update cart items
    } else {
      product.quantity = quantity; // Add quantity

      setCartItems([...cartItems, { ...product }]); // Add product to cart
    }
    toast.success(`${qty} ${product.name} added to the cart.`); // Show toast
  };

  // Remove item from cart
  const onRemove = (product) => {
    foundProduct = cartItems.find((item) => item._id === product._id); // Find product in cart
    const newCartItems = cartItems.filter((item) => item._id !== product._id); // Remove product from cart

    setTotalPrice(
      (prevTotalPrice) =>
        prevTotalPrice - foundProduct.price * foundProduct.quantity
    ); // Update total price
    setTotalQuantities(
      (prevTotalQuantities) => prevTotalQuantities - foundProduct.quantity
    ); // Update total quantities
    setCartItems(newCartItems); // Update cart items
  };

  // Update cart item quantity
  const toggleCartItemQuantity = (id, value) => {
    foundProduct = cartItems.find((item) => item._id === id); // Find product in cart
    index = cartItems.findIndex((product) => product._id === id); // Find index of product in cart
    const newCartItems = cartItems.filter((item) => item._id !== id); // Remove product from cart

    if (value === "inc") {
      setCartItems([
        ...newCartItems,
        { ...foundProduct, quantity: foundProduct.quantity + 1 },
      ]); // Update cart items
      setTotalPrice((prevTotalPrice) => prevTotalPrice + foundProduct.price); // Update total price
      setTotalQuantities((prevTotalQuantities) => prevTotalQuantities + 1); // Update total quantities
    } else if (value === "dec") {
      if (foundProduct.quantity > 1) {
        setCartItems([
          ...newCartItems,
          { ...foundProduct, quantity: foundProduct.quantity - 1 },
        ]); // Update cart items
        setTotalPrice((prevTotalPrice) => prevTotalPrice - foundProduct.price); // Update total price
        setTotalQuantities((prevTotalQuantities) => prevTotalQuantities - 1); // Update total quantities
      }
    }
  };

  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;

      return prevQty - 1;
    });
  };

  return (
    <Context.Provider
      value={{
        showCart,
        setShowCart,
        cartItems,
        setCartItems,
        totalPrice,
        setTotalPrice,
        totalQuantities,
        setTotalQuantities,
        qty,
        incQty,
        decQty,
        onAdd,
        onRemove,
        toggleCartItemQuantity,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);

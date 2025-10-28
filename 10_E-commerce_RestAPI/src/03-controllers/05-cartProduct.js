import {
  deleteOldCart,
  emptyCartProductTable,
  getAllCartProducts,
  updateCartProduct,
} from "../02-models/03-cartPorduct.js";

export async function addCartProduct(req, res) {
  try {
    const userId = req.userId;
    const { cartItems } = req.body;

    

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
        await emptyCartProductTable(userId);
      return res
        .status(400)
        .json({ success: false, message: "Cart items are empty or invalid" });
    }

    // 1️⃣ Delete old cart items not in Redux
    await deleteOldCart(userId, cartItems);

    for (const { productId, quantity } of cartItems) {
      await updateCartProduct(userId, productId, quantity);
    }

    return res.json({ success: true, message: "Cart synced successfully" });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function getCartProducts(req, res) {
  try {


    const results=await getAllCartProducts(req.userId);
    if(!results || results.length ===0 ){
        return res.json({ success: true, cartItems: {} }); // empty cart
    }


    console.log("cart id")
    // Transform results to Redux cart format: { productId: { count, name, image, unit, price, discount } }
    const cartItems = {};

    results.forEach((item) => {
      cartItems[item.productId] = {
        count: item.count,
        name: item.name,
        image: item.image,
        unit: item.unit,
        price: item.price,
        discount: item.discount,
      };
    });

      return res.json({ success: true, cartItems });


  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

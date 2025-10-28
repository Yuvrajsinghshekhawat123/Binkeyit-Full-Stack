import Stripe from "stripe";

const stripe = Stripe(process.env.Secret_key);

import { v4 as uuidv4 } from "uuid";
import {
  getOrderDetailsById,
  insertDataOfCOD,
  insertDataOfOnlinePayment,
} from "../02-models/06-order.js";
import { emptyCartProductTable } from "../02-models/03-cartPorduct.js";
import { getAddressById } from "../02-models/02-address.js";
import { json } from "zod";
export async function COD(req, res) {
  try {
    const { product_details, address, subTotalAmt, totalAmt } = req.body;
    const userId = req.userId;
    const orderId = `ORD-${uuidv4()}`; // e.g. ORD-22b69d7a-6e2b-4908-a839-04ad9f442a4d

    await insertDataOfCOD(
      userId,
      orderId,
      product_details,
      address,
      subTotalAmt,
      totalAmt
    );

    await emptyCartProductTable(userId);

    // Respond to frontend with order info
    return res.status(201).json({
      success: true,
      message: "COD order created. Payment pending.",
      orderId,
      payment_status: "Pending",
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export const priceWithDiscount = (price, dis = 0) => {
  const numericPrice = Number(price);
  const numericDiscount = Number(dis);

  const discountAmount = (numericPrice * numericDiscount) / 100;
  const actualPrice = numericPrice - discountAmount;

  return Math.round(actualPrice); // rounds to nearest integer
};

export async function onlinePayment(req, res) {
  try {
    const { product_details, addressId, subTotalAmt, totalAmt } = req.body;
    const userId = req.userId;
    const userEmail = req.user?.email || "customer@example.com";

    const orderId = `ORD-${uuidv4()}`;

    // Parse product details and prepare line items
    const line_items = JSON.parse(product_details).map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.Name,
          images: [item.image],
        },
        unit_amount: Math.round(item.Price * 100), // in paise
      },
      quantity: item.Quantity,
    }));

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      customer_email: userEmail,
      metadata: {
        userId,
        addressId,
        orderId,
      },
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/cancel",
    });

    // Return the session URL to the frontend
    return res.json({ url: session.url });
  } catch (err) {
    console.error("Stripe Payment Error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}

export async function webhookStripe(request, response) {
  const endPointSecret = process.env.STRIPE_ENPOINT_WEBHOOK_SECRET_KEY;
  const event = request.body;

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object;

      // Get all line items from checkout session
      const lineItems = await stripe.checkout.sessions.listLineItems(
        session.id
      );

      // Prepare product details array
      const products_detilas = await Promise.all(
        lineItems.data.map(async (item) => {
          // Fetch product details from Stripe
          
          /*
          Each lineItem returned by Stripe contains a price object,
          and inside that price object is the product ID (like "prod_ABC123").


          Notice — there’s no images field in the line item or price object.
          It only gives you the product ID (e.g., "prod_XYZ123").
          The image is stored inside the Stripe Product object.
          It is not automatically included inside line_items.
          This "prod_XYZ123" is a reference ID to a Product object stored on Stripe’s servers.
          */
          const product = await stripe.products.retrieve(item.price.product); // item.price.product->give the product id, and from this product id will get  The Product object is where Stripe keeps all your product metadata: images,name,active/inactive status

          return {
            Name: item.description,
            Quantity: item.quantity,
            amount_total: item.amount_total,
            currency: item.currency,
            price_id: item.price.id,
            ProductId: item.price.product,
            Image: product.images?.[0] || null, // ✅ safe access
          };
        })
      );

      console.log("✅ Products Details:", products_detilas);

      const userId = session.metadata.userId;
      const orderId = session.metadata.orderId;
      const paymentId = session.payment_intent; // Stripe payment intent ID
      const paymentStatus = "Completed";
      const deliveryAddress = session.metadata.addressId || "";
      const subTotalAmt = session.amount_subtotal / 100; // convert paise to INR
      const totalAmt = session.amount_total / 100;

      await insertDataOfOnlinePayment(
        userId,
        orderId,
        products_detilas,
        paymentId,
        paymentStatus,
        deliveryAddress,
        subTotalAmt,
        totalAmt
      );

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({ received: true });
}

export async function getOrderDetails(req, res) {
  try {
    const result = await getOrderDetailsById(req.userId); // ✅ added await

    return res.status(200).json({
      success: true, // ✅ success should be true
      orders: result, // ✅ renamed for clarity
    });
  } catch (err) {
    console.error("Error fetching order details:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
}





[
  {
    Name: "Baby Clothing Set",
    Image:
      "http://res.cloudinary.com/dgmfti7ms/image/upload/v1759927400/Products/cucfhqhi4ddq1bqyzj00.png",
    Quantity: 1,
    currency: "inr",
    price_id: "price_1SMjbhCRW6iXXpbIGqxu9sQr",
    ProductId: "prod_TIy0x159WbEtqs",
    amount_total: 20000,
  },
];

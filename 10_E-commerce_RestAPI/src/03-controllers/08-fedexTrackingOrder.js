import axios from "axios"




/*
to use ANY FedEx API, the first mandatory step is to generate an access token.
Without this token, FedEx will reject all API requests with:
*/
export async function getFedexAccessToken() {
  try {
    const response = await axios.post(
      `${process.env.FEDEX_BASE_API_URL}/oauth/token`,
      {
        grant_type: "client_credentials",
        client_id: process.env.FEDEX_API_KEY,
        client_secret: process.env.FEDEX_SECRET_KEY,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = response.data;
    return token;

  } catch (error) {
    console.error("FedEx Token Error:", error.response?.data || error);
    throw new Error("Failed to generate FedEx token");
  }
}












// awb==tracking id or tracking no.

 export async function fedexTrackingOrder(req, res) {
  try {
    const awb = req.params.awb || req.body.awb;

    if (!awb) {
      return res.status(400).json({ message: "Tracking number required" });
    }

    console.log(awb);

    // Step 1: Get FedEx token
    const authRes = await getFedexAccessToken();

    // Step 2: Build Payload
    const inputPayload = {
      includeDetailedScans: true,
      trackingInfo: [
        {
          trackingNumberInfo: {
            trackingNumber: awb,
          },
        },
      ],
    };

    // Step 3: Headers
    const headers = {
      "Content-Type": "application/json",
      "X-locale": "en_US",
      Authorization: `Bearer ${authRes.access_token}`,
    };

    // Step 4: API Call
    const response = await axios.post(
      `${process.env.FEDEX_BASE_API_URL}/track/v1/trackingnumbers`,
      inputPayload,
      { headers }
    );



 


  const events =
  response.data?.output?.completeTrackResults?.[0]?.trackResults?.[0]?.scanEvents || [];


 const trackingDetails = events.map((item) => ({
  eventDescription:
    item.eventDescription || item.statusByLocale || item.status || "Unknown",
  city: item.scanLocation?.city || "Unknown",
  state: item.scanLocation?.state || "Unknown",
  date: item.date || item.scanDateTime,
}));

res.json(trackingDetails);



  } catch (error) {
    console.error("Tracking Error:", error.response?.data || error);
    res.status(500).json({ message: "FedEx tracking failed" });
  }
}



 



/*
✅ 1. If YOU create shipments using FedEx API
FedEx will return:

{
  "trackingNumber": "772298437855"
}

You must store this number in your database (order.trackingNumber).





*/
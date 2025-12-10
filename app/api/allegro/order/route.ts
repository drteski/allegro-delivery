import { NextResponse } from "next/server";
import axios from "axios";
import { ConfigAllegro } from "@/lib/types";
import fs from "node:fs";

export async function POST(request: Request) {
  const { orderId, accountId } = await request.json();

  const savedConfig = JSON.parse(fs.readFileSync("./config.json", "utf-8"));
  const existingConfig = savedConfig.accounts.find(
    (item: ConfigAllegro) => item.id === parseInt(accountId, 10),
  );

  try {
    const orderInfo = await axios
      .get(`https://api.allegro.pl/order/checkout-forms/${orderId}`, {
        headers: {
          Authorization: `Bearer ${existingConfig.accessToken}`,
          Accept: "application/vnd.allegro.public.v1+json",
        },
      })
      .then((res) => res.data);
    return new NextResponse(
      JSON.stringify({
        id: orderInfo.id,
        login: orderInfo.buyer.login,
        email: orderInfo.buyer.email,
        deliveryId: orderInfo.delivery.method.id,
        deliveryName: orderInfo.delivery.method.name,
      }),
      {
        status: 200,
      },
    );
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return new NextResponse(
        JSON.stringify({
          message: err.response?.data.errors[0].message.replace(
            "Checkout form",
            "Order",
          ),
        }),
        {
          status: 404,
        },
      );
    } else {
      return new NextResponse(JSON.stringify({}), {
        status: 500,
      });
    }
  }
}

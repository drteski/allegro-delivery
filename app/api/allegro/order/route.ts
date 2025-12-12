import { NextResponse } from "next/server";
import axios from "axios";
import prisma from "@/lib/db";

export async function POST(request: Request) {
  const { orderId, accountId } = await request.json();

  const existingConfig = await prisma.account.findUnique({
    where: { id: accountId },
  });
  console.log(existingConfig);
  try {
    const orderInfo = await axios
      .get(`https://api.allegro.pl/order/checkout-forms/${orderId}`, {
        headers: {
          Authorization: `Bearer ${existingConfig?.accessToken}`,
          Accept: "application/vnd.allegro.public.v1+json",
        },
      })
      .then((res) => res.data);
    console.log(orderInfo);
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
      console.log(err.response?.data);
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

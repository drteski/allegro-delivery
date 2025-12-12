"use client";
import { useState } from "react";
import { ConfigAllegro, OrderInfo } from "@/lib/types";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useAccounts from "@/hooks/useAccounts";
import { useMutation } from "@tanstack/react-query";

const AllegroOrderInfo = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [orderInfo, setOrderInfo] = useState<OrderInfo>(null);
  const [error, setError] = useState<string>("");

  const { accounts, isLoading } = useAccounts();
  const mutation = useMutation({
    mutationFn: async () =>
      await axios
        .post(`/api/allegro/order/`, { orderId, accountId: selectedAccount })
        .then((res) => res.data),
    onSuccess: (data) => setOrderInfo(data),
    onError: (err) => {
      setError(err.message);
      setTimeout(() => setError(""), 1000);
    },
  });

  return (
    <div className="w-full h-full flex flex-col gap-12">
      <div className="grid grid-cols-[200px_1fr_auto] justify-between items-center gap-4 max-w-[832px]">
        {isLoading ? (
          <Skeleton className="w-[200px] h-9" />
        ) : (
          <Select onValueChange={(value) => setSelectedAccount(Number(value))}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Wybierz konto" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {accounts.map((item: ConfigAllegro) => {
                  if (item.name === "") return;
                  if (item.accessToken === "")
                    return (
                      <SelectItem key={item.id} value={`${item.id}`}>
                        {item.name}{" "}
                        <span className="text-neutral-400">(Unauthorized)</span>
                      </SelectItem>
                    );
                  return (
                    <SelectItem key={item.id} value={`${item.id}`}>
                      {item.name}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        )}

        <Input
          className="max-w-[500px]"
          placeholder={"Order ID"}
          onChange={(e) => setOrderId(e.target.value.replace(/\s/gm, ""))}
        />
        {isLoading ? (
          <Skeleton className="w-[100px] h-9" />
        ) : (
          orderId !== "" && (
            <Button
              className="cursor-pointer w-[100px]"
              onClick={() => {
                setOrderInfo(null);
                mutation.mutate();
              }}
            >
              Check
            </Button>
          )
        )}
      </div>
      <div className="max-w-[800px]">
        {error !== "" ? (
          <span className="flex justify-center text-xl items-center w-full">
            {error}
          </span>
        ) : (
          orderInfo !== null && (
            <div className="flex flex-col gap-6">
              <p className="flex flex-col gap-1">
                <strong className="text-xs">Order ID:</strong>
                {orderInfo.id}
              </p>
              <p className="flex flex-col gap-1">
                <strong className="text-xs">Login:</strong>
                {orderInfo.login}
              </p>
              <p className="flex flex-col gap-1">
                <strong className="text-xs">Email:</strong>
                {orderInfo.email}
              </p>
              <p className="flex flex-col gap-1">
                <strong className="text-xs">Delivery ID:</strong>
                {orderInfo.deliveryId}
              </p>
              <p className="flex flex-col gap-1">
                <strong className="text-xs">Delivery Name:</strong>
                {orderInfo.deliveryName}
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default AllegroOrderInfo;

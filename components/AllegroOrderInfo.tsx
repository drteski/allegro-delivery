"use client";
import { useEffect, useState } from "react";
import { Config, OrderInfo } from "@/lib/types";
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

const AllegroOrderInfo = () => {
  const [config, setConfig] = useState<Config>({ scope: "", accounts: [] });
  const [orderId, setOrderId] = useState<string>("");
  const [selectedAccount, setSelectedAccount] = useState<number>(0);
  const [orderInfo, setOrderInfo] = useState<OrderInfo>(null);
  const [error, setError] = useState<string>("");
  useEffect(() => {
    const getConfigs = async () => {
      await axios.get("/api/allegro/config").then((res) => {
        setConfig(res.data);
      });
    };
    getConfigs();
  }, []);
  return (
    <div className="w-full h-full flex flex-col gap-12">
      <div className="flex justify-between items-center gap-4">
        <Select onValueChange={(value) => setSelectedAccount(Number(value))}>
          <SelectTrigger className="w-[300px]">
            <SelectValue placeholder="Wybierz konto" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {config.accounts.map((item) => {
                if (item.accessToken === "") return;
                if (item.name === "") return;
                return (
                  <SelectItem key={item.id} value={`${item.id}`}>
                    {item.name}
                  </SelectItem>
                );
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          placeholder={"Order ID"}
          onChange={(e) => setOrderId(e.target.value.replace(/\s/gm, ""))}
        />
        <Button
          className="cursor-pointer"
          onClick={() => {
            setError("");
            setOrderInfo(null);
            axios
              .post("/api/allegro/order", {
                orderId,
                accountId: selectedAccount,
              })
              .then((res) => setOrderInfo(res.data))
              .catch((e) => setError(e.response.data.message));
          }}
        >
          Check
        </Button>
      </div>
      <div>
        {error !== ""
          ? error
          : orderInfo !== null && (
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
            )}
      </div>
    </div>
  );
};

export default AllegroOrderInfo;

/* const express = require("express");
const fs = require("fs").promises;
const fsync = require("fs"); */

import express from 'express'
import { promises as fs } from "fs";
import * as fsync from "fs";

const router = express.Router();

let carts = [];

router.post("/carts", async (req, res) => {
  const { products } = req.body;
  if (!fsync.existsSync("carritos.json"))
    fs.writeFile("carritos.json", JSON.stringify(carts, null, 2));
  const data = await fs.readFile("carritos.json", "utf8");
  carts = JSON.parse(data);
  const CartId = carts.length + 1;
  const newCart = {
    CartId,
    products: products ? products : [],
  };
  carts.push(newCart);

  await fs.writeFile("carritos.json", JSON.stringify(carts, null, 2));
  return res.json(newCart);
});

router.get("/carts/:cid", async (req, res) => {
  const data = await fs.readFile("carritos.json", "utf8");
  const carts = JSON.parse(data);
  const cartId = parseInt(req.params.cid);
  const cart = carts.find((cart) => cart.CartId === cartId);

  if (cart) {
    res.json(cart.products);
  } else {
    res.status(404).json({ msg: "carrito no encontrado" });
  }
});

router.put("/carts/:cid/product/:pid", async (req, res) => {
  const pdata = await fs.readFile("productos.json", "utf8");
  let products = JSON.parse(pdata);

  const cdata = await fs.readFile("carritos.json", "utf8");
  let carts = JSON.parse(cdata);

  const productId = parseInt(req.params.pid);
  const cartId = parseInt(req.params.cid);

  const product = products.find((product) => product.id === productId);
  const cart = carts.find((cart) => cart.CartId === cartId);

  const checkProduct = cart.products.find(
    (product) => product.productId === productId
  );

  if (checkProduct) {
    checkProduct.quantity++;
  } else {
    cart.products.push({ productId, quantity: 1 });
  }

  await fs.writeFile("carritos.json", JSON.stringify(carts, null, 2));

  res.json({ msg: "producto agregado al carrito" });
});

export default router;

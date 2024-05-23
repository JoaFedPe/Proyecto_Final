/* const express = require("express");
const fs = require("fs").promises;
const fsync = require("fs"); */

import express from 'express'
import { promises as fs } from "fs";
import * as fsync from "fs";
const router = express.Router();

let products = [];

router.post("/products", async (req, res) => {
  const { title, description, code, price, status, stock, category } = req.body;
  if (!fsync.existsSync("productos.json"))
    fs.writeFile("productos.json", JSON.stringify(products, null, 2));
  const data = await fs.readFile("productos.json", "utf8");
  products = JSON.parse(data);
  const id = products.length + 1;
  const newProduct = {
    id,
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
  };
  products.push(newProduct);

  await fs.writeFile("productos.json", JSON.stringify(products, null, 2));
  return res.json(newProduct);
});

router.get("/products", async (req, res) => {
  const data = await fs.readFile("productos.json", "utf8");
  const products = JSON.parse(data);
  const limit = req.query.limit;
  if (limit) {
    res.json(products.slice(0, limit));
  } else {
    res.json(products);
  }
  console.log(products);
});

router.get("/products/:pid", async (req, res) => {
  const data = await fs.readFile("productos.json", "utf8");
  const products = JSON.parse(data);
  const productId = parseInt(req.params.pid);
  const product = products.find((product) => product.id === productId);

  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ msg: "Producto no encontrado" });
  }
});

router.put("/products/:pid", async (req, res) => {
  const data = await fs.readFile("productos.json", "utf8");
  const products = JSON.parse(data);
  const productId = parseInt(req.params.pid);
  const product = products.find((product) => product.id === productId);

  if (product) {
    const { title, description, code, price, stock, category } = req.body;
    product.title = title;
    product.description = description;
    product.code = code;
    product.price = price;
    product.stock = stock;
    product.category = category;

    await fs.writeFile("productos.json", JSON.stringify(products, null, 2));
    res.json(product);
  } else {
    res.status(404).json({ msg: "Producto no encontrado" });
  }
});

router.delete("/products/:pid", async (req, res) => {
  const data = await fs.readFile("productos.json", "utf8");
  let products = JSON.parse(data);
  const productId = parseInt(req.params.pid);
  const product = products.filter((product) => product.id !== productId);
  if (product) {
    await fs.writeFile("productos.json", JSON.stringify(product, null, 2));
    res.json(product);
  }
});

export default router;

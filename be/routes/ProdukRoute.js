import {
  getProduks,
  getProdukById,
  addProduk,
  editProduk,
  removeProduk
} from "../controller/ProdukController.js";
import express from "express";

const router = express.Router()

router.get('/produk', getProduks)
router.post('/produk', addProduk)
router.get('/produk/:id', getProdukById)
router.patch('/produk/:id', editProduk)
router.delete('/produk/:id', removeProduk)

export default router;

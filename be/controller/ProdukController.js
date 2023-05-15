import Produk from "../model/Produk.js";
import path from "path";
import fs from "fs";
import {allowedType} from "../constant/constants.js";

export const getProduks = async (req, res) => {
  try {
    const respon = await Produk.findAll()
    res.json(respon)
  } catch (e) {
    console.log(e.message)
  }
}

export const getProdukById = async (req, res) => {
  try {
    const respon = await Produk.findOne({
      where: {
        id: req.params.id
      }
    })
    res.json(respon)
  } catch (e) {
    console.log(e.message)
  }
}

export const addProduk = (req, res) => {
  if (req.files === null)
    return res.status(400).json({msg: "Tidak mengupload gambar."})

  const name = req.body.name
  const buyPrice = req.body.buy_price
  const sellPrice = req.body.sell_price
  const stock = req.body.stock

  const file = req.files.file
  const fileSize = file.data.length
  const extension = path.extname(file.name)
  const fileName = /*'Gambar_' +*/ file.md5 + extension
  const url = `${req.protocol}://${req.get("host")}/images/${fileName}`

  // Check the type
  if (!allowedType.includes(extension.toLowerCase()))
    return res.status(422).json({msg: "Tipe gambar tidak valid, hanya boleh JPG/JPEG dan PNG."})
  // Check the size
  if (fileSize > 100_000) // 100KB
    return res.status(422).json({msg: "Ukuran gambar tidak boleh lebih dari 100KB."})

  // Save image to public/images directory
  file.mv(`./public/images/${fileName}`, async (error) => {
    if (error)
      return res.status(500).json({msg: error.message})

    // check if product with the same name already exists
    const existingProduct = await Produk.findOne({
      where: {
        name
      }
    });
    if (existingProduct) {
      throw new Error('Product with the same name already exists');

    } else {
      try {
        await Produk.create({
          name,
          buy_price: buyPrice,
          sell_price: sellPrice,
          stock,
          photo: fileName,
          photo_url: url,
        })
        res.status(201).json({msg: "Produk berhasil ditambahkan."})
      } catch (e) {
        console.log(e.message)
      }
    }
  })
}

export const editProduk = async (req, res) => {
  const produk = await Produk.findOne({
    where: {
      id: req.params.id
    }
  })
  if (!produk)
    return res.status(404).json({msg: "No data found."})

  // Whether user wanna update the image or not
  let photo
  if (req.files === null) {
    photo = Produk.photo
  } else {
    const file = req.files.file
    const size = file.data.length
    const extension = path.extname(file.name)
    photo = /*'Gambar_' +*/ file.md5 + extension

    if (!allowedType.includes(extension.toLowerCase()))
      return res.status(422).json({msg: "Tipe gambar tidak valid, hanya boleh JPG/JPEG dan PNG."})
    if (size > 100_000)
      return res.status(422).json({msg: "Ukuran gambar tidak boleh lebih dari 100KB."})

    // Hapus photo lama
    const filePath = `./public/images/${produk.photo}`
    fs.unlinkSync(filePath)

    file.mv(`./public/images/${photo}`, error => {
      if (error)
        return res.status(500).json({msg: error.message})

    })
  }
  const name = req.body.name
  const buyPrice = req.body.buy_price
  const sellPrice = req.body.sell_price
  const stock = req.body.stock
  const url = `${req.protocol}://${req.get("host")}/images/${photo}`
  try {
    await Produk.update({
      name,
      buy_price: buyPrice,
      sell_price: sellPrice,
      stock,
      photo,
      photo_url: url,
    },{
      where: {
        id: req.params.id
      }
    })
    res.status(200).json({msg: "Produk diperbarui."})
  } catch (e) {
    console.log(e.message)
  }
}

export const removeProduk = async (req, res) => {
  try {
    const produk = await Produk.findOne({
      where: {
        id: req.params.id
      }
    })
    if (!produk)  // if product isn't found
      return res.status(404).json({msg: "No data found."})

    // if found then delete the image file
    try {
      // delete locally
      const filePath = `./public/images/${produk.photo}`
      fs.unlinkSync(filePath)

      // delete on db also
      await Produk.destroy({
        where: {
          id: req.params.id
        }
      })
      res.status(200).json({msg: "Produk dihapus."})
    } catch (e) {
      console.log(e.message)
    }
  } catch (e) {
    console.log(e.message)
  }
}

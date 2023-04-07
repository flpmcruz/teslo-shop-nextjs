import { db } from "@/database";
import { IProduct } from "@/interfaces";
import Product from "@/models/Product";

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  if (!product) return null;

  product.images = product.images.map( image => image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`)

  return JSON.parse(JSON.stringify(product));
};

//Get all products slugs
interface ProductSlug {
  slug: string;
}

export const getAllProductsSlugs = async (): Promise<ProductSlug[]> => {
  await db.connect();
  const products = await Product.find().select("slug -_id").lean();
  await db.disconnect();

  //hago el parse para que no me devuelva un objeto de mongoose
  return JSON.parse(JSON.stringify(products));
};

export const getProductByTerm = async (term: string): Promise<IProduct[] | []> => {
 
  term = term.toString().toLowerCase();
  await db.connect();

  const products = await Product.find({
    $text: { $search: term },
  })
  .select("title images inStock slug -_id")
  .lean();
  await db.disconnect();

  //Hago esto para arreglar la url de las imagenes si es local o es de cloudinary
  const updatedProducts = products.map( product => {
    product.images = product.images.map( image => image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`)
    return product
  })

  return updatedProducts
};

export const getAllProducts = async (): Promise<IProduct[]> => {
 
  await db.connect();
  const products = await Product.find()
  .lean();
  await db.disconnect();

  const updatedProducts = products.map( product => {
    product.images = product.images.map( image => image.includes("http") ? image : `${process.env.HOST_NAME}products/${image}`)
    return product
  })

  return JSON.parse(JSON.stringify(updatedProducts));
};
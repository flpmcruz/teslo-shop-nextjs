import { db } from "@/database";
import { IProduct } from "@/interfaces";
import Product from "@/models/Product";

export const getProductBySlug = async (slug: string): Promise<IProduct | null> => {

  await db.connect();
  const product = await Product.findOne({ slug }).lean();
  await db.disconnect();

  if (!product) return null;

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

  return products
};

export const getAllProducts = async (): Promise<IProduct[]> => {
 
  await db.connect();
  const products = await Product.find()
  .lean();
  await db.disconnect();

  return JSON.parse(JSON.stringify(products));
};
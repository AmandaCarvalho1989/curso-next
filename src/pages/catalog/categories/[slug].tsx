import { GetStaticPaths, GetStaticProps } from "next";
import { useRouter } from "next/router";
import { client } from "../../../lib/prismic";
import Prismic from "prismic-javascript";
import PrismicDOM from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";
import Link from "next/link";

interface IProduct {
  title: string;
  id: number;
}

interface CategoryProps {
  products: Document[];
  category: Document;
}

export default function Product({ products, category }: CategoryProps) {
  const router = useRouter();

  if (router.isFallback) {
    //verifica se está sendo gerada estáticamente
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1> {PrismicDOM.RichText.asText(category.data.title)}</h1>
      <ul>
        {products.map((item) => (
         <li key={item.id}>
         <Link href={`/catalog/products/${item.uid}`}>
           <a>
             {PrismicDOM.RichText.asText(item.data.title)}
             </a>
         </Link>
       </li>
        ))}
      </ul>
    </div>
  );
}

//Página dinamica de forma estática
//Retornar categorias da aplicação
export const getStaticPaths: GetStaticPaths = async () => {
  // const response = await fetch(`http://localhost:3333/categories`);

  // const categories = await response.json();

  const categories = await client().query([
    Prismic.Predicates.at("document.type", "category"),
  ]);

  const paths = categories.results.map((category) => {
    return {
      params: { slug: category.uid },
    };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<CategoryProps> = async (
  context
) => {
  const { slug } = context.params;

  const category = await client().getByUID("category", String(slug), {});

  const products = await client().query([
    Prismic.Predicates.at("document.type", "product"),
    Prismic.Predicates.at("my.product.category", category.id),
  ]);

  // const response = await fetch(
  //   `http://localhost:3333/products?category_id=${slug}`
  // );
  // const products = await response.json();

  return {
    props: {
      category, 
      products: products.results
    },
    revalidate: 60,
  };
};

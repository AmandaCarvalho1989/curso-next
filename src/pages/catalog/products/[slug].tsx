import { useRouter } from "next/router";
import { GetStaticPaths, GetStaticProps } from "next";
import { useState } from "react";
import { client } from "../../../lib/prismic";
import PrismicDOM from "prismic-dom";
import { Document } from "prismic-javascript/types/documents";

interface ProductProps {
  product: Document;
}
//Lazy Load de componentes
// const AddToCartModal = dynamic(
//     () => import("../../components/AddToCartModal"),
//     {loading: () => <p>Carregando...</p>, ssr: false}

//     //ssrc=> faz com que o componente seja renderizado somente no lado do cliente
//     //variaveis do browser que o node n tem
// )

export default function Product({ product }: ProductProps) {
  const router = useRouter();

  const [isAddToCartModalVisible, setIsAddToCartModalVisible] = useState(false);

  function handleAddToCart() {
    setIsAddToCartModalVisible(true);
  }
  if (router.isFallback) {
    //verifica se está sendo gerada estáticamente
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1> {PrismicDOM.RichText.asText(product.data.title)}</h1>

      <img src={product.data.thumbnail.url} alt="" width="300" />
      <div
        dangerouslySetInnerHTML={{
          __html: PrismicDOM.RichText.asHtml(product.data.description),
        }}
      ></div>
      <p>Price: ${product.data.price}</p>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps<ProductProps> = async (context) => {
  const { slug } = context.params;

  const product = await client().getByUID("product", String(slug), {});

  return {
    props: {
      product,
    },
    revalidate: 10,
  };
};

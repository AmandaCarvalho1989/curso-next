import { GetServerSideProps } from "next";
import Link from "next/link";
import SEO from "../components/SEO";
import { client } from "../lib/prismic";
import Prismic from "prismic-javascript";
import PrismicDOM from 'prismic-dom'
import { Document } from "prismic-javascript/types/documents";
import { Title } from "../styles/pages/Home";

interface IHomeProps {
  recommendedProducts: Document[];
}

// TTFB - Time To First Byte (2s)

export default function Home({ recommendedProducts }: IHomeProps) {
  // async function handleSum() {
  //   // import dinâmico para libs que não são muito utlizados pelos usuários
  //   const math = (await import("../lib/math")).default;
  //   alert(math.sum(3, 5));
  // }

  return (
    <div>
      <SEO title="DevCommerce, your best ecommerce!" shouldExcludeTitleSuffix />
      <section>
        <Title>Products</Title>
        <ul>
          {recommendedProducts.map((item) => (
            <li key={item.id}>
              <Link href={`/catalog/products/${item.uid}`}>
                <a>
                  {PrismicDOM.RichText.asText(item.data.title)}
                  </a>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<IHomeProps> = async () => {
  const recommendedProducts = await client().query([
    Prismic.Predicates.at("document.type", "product"),
  ]);
  // const recommendedProducts = await response.json();

  // const response = await fetch('http://localhost:3333/recommended')
  // const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts: recommendedProducts.results,
    },
  };
};

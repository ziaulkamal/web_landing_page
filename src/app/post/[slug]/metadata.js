// Simulasi fungsi untuk mengambil data berdasarkan slug
const fetchPostData = async (slug) => {
  const response = await fetch(`https://api.example.com/posts/${slug}`);
  const data = await response.json();
  return data;
};

// Metadata dinamis
export async function generateMetadata({ params }) {
  const postData = await fetchPostData(params.slug);

  return {
    title: postData.title,
    description: postData.description,
    openGraph: {
      title: postData.title,
      description: postData.description,
      type: 'website',
      url: `https://example.com/post/${params.slug}`,
      images: [
        {
          url: postData.image,
          alt: postData.description
        }
      ],
      locale: 'id_ID',
      siteName: 'Rencong'
    },
    twitter: {
      card: 'summary_large_image',
      title: postData.title,
      description: postData.description,
      images: [postData.image]
    }
  };
}

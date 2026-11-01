export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LocalBusiness',
        '@id': 'https://appambattumuttamittai.com/#business',
        name: 'Appambattu Mutta Mittai',
        alternateName: ['அப்பம்பட்டு முட்டை மிட்டாய்', 'Mutta Mittai'],
        description:
          'Traditional Tamil Nadu egg sweet made with milk, egg, cashew nut paste and sugar. Available for pickup in Meenambur, Appambattu, Villupuram.',
        url: 'https://appambattumuttamittai.com',
        telephone: '+917871949015',
        image: 'https://appambattumuttamittai.com/images/brochure-main.jpeg',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Meenambur, Appambattu',
          addressLocality: 'Villupuram',
          addressRegion: 'Tamil Nadu',
          postalCode: '605601',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '11.9399',
          longitude: '79.4945',
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '20:00',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Mutta Mittai Packs',
          itemListElement: [
            { '@type': 'Offer', name: '250gm Mutta Mittai', price: '150', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
            { '@type': 'Offer', name: '500gm Mutta Mittai', price: '300', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
            { '@type': 'Offer', name: '750gm Mutta Mittai', price: '450', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
            { '@type': 'Offer', name: '1kg Mutta Mittai', price: '600', priceCurrency: 'INR', availability: 'https://schema.org/InStock' },
          ],
        },
        sameAs: ['https://wa.me/917871949015'],
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Mutta Mittai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Mutta Mittai (முட்டை மிட்டாய்) is a traditional Tamil Nadu egg sweet made with milk, egg, cashew nut paste and sugar. Appambattu Mutta Mittai from Meenambur, Villupuram is famous for its soft, fresh and delicious taste.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer home delivery?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'No. Courier service is currently unavailable. Orders must be picked up from our store at Meenambur, Appambattu, Villupuram.',
            },
          },
          {
            '@type': 'Question',
            name: 'How can I order Mutta Mittai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can order online at appambattumuttamittai.com or contact us on WhatsApp at +91 7871949015. Only store pickup is available.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the prices?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '250gm – ₹150, 500gm – ₹300, 750gm – ₹450, 1kg – ₹600.',
            },
          },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

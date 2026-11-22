export function LocalBusinessSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'FoodEstablishment',
        '@id': 'https://appambattumuttamittai.com/#business',
        name: 'Appampattu Mutta Mittai',
        alternateName: [
          'அப்பம்பட்டு முட்டை மிட்டாய்',
          'Mutta Mittai',
          'Appambattu Mutta Mittai',
          'Appampattu Egg Sweet',
          'Muttai Mittai Villupuram',
        ],
        description:
          'Appampattu Mutta Mittai is the original traditional Tamil Nadu egg sweet (முட்டை மிட்டாய்) made fresh daily in Meenambur, Appampattu, Villupuram. Made with milk, egg, cashew nut paste and sugar. Available for home delivery within Villupuram city and also on Swiggy.',
        url: 'https://appambattumuttamittai.com',
        telephone: '+917871949015',
        email: 'appambattumuttamittai@gmail.com',
        image: 'https://appambattumuttamittai.com/images/logo.jpg',
        priceRange: '₹150–₹600',
        servesCuisine: ['Tamil Nadu', 'Indian Traditional', 'Egg Sweet'],
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Villupuram Railway Station, 1st Platform',
          addressLocality: 'Villupuram',
          addressRegion: 'Tamil Nadu',
          postalCode: '605602',
          addressCountry: 'IN',
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '11.93990',
          longitude: '79.49450',
        },
        areaServed: {
          '@type': 'City',
          name: 'Villupuram',
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
            {
              '@type': 'Offer',
              name: '250gm Appampattu Mutta Mittai',
              description: 'Small pack of traditional Appampattu egg sweet — 250 grams',
              price: '150',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: 'https://appambattumuttamittai.com/order',
            },
            {
              '@type': 'Offer',
              name: '500gm Appampattu Mutta Mittai',
              description: 'Medium pack of traditional Appampattu egg sweet — 500 grams',
              price: '300',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: 'https://appambattumuttamittai.com/order',
            },
            {
              '@type': 'Offer',
              name: '750gm Appampattu Mutta Mittai',
              description: 'Large pack of traditional Appampattu egg sweet — 750 grams',
              price: '450',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: 'https://appambattumuttamittai.com/order',
            },
            {
              '@type': 'Offer',
              name: '1kg Appampattu Mutta Mittai',
              description: 'Family pack of traditional Appampattu egg sweet — 1 kilogram',
              price: '600',
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
              url: 'https://appambattumuttamittai.com/order',
            },
          ],
        },
        sameAs: [
          'https://wa.me/917871949015',
        ],
        hasMap: 'https://maps.app.goo.gl/villupuram-railway-station',
      },
      {
        '@type': 'Product',
        '@id': 'https://appambattumuttamittai.com/#product',
        name: 'Appampattu Mutta Mittai (முட்டை மிட்டாய்)',
        description:
          'Traditional Tamil Nadu egg sweet made with milk, egg, cashew nut paste and sugar. The original Appampattu Mutta Mittai from Meenambur, Villupuram — also known as Muttai Mittai. Order online or on Swiggy.',
        brand: {
          '@type': 'Brand',
          name: 'Appampattu Mutta Mittai',
        },
        image: 'https://appambattumuttamittai.com/images/product-main.jpg',
        url: 'https://appambattumuttamittai.com/order',
        offers: [
          {
            '@type': 'Offer',
            name: '250gm Pack',
            price: '150',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: 'Appampattu Mutta Mittai' },
          },
          {
            '@type': 'Offer',
            name: '500gm Pack',
            price: '300',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: 'Appampattu Mutta Mittai' },
          },
          {
            '@type': 'Offer',
            name: '750gm Pack',
            price: '450',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: 'Appampattu Mutta Mittai' },
          },
          {
            '@type': 'Offer',
            name: '1kg Pack',
            price: '600',
            priceCurrency: 'INR',
            availability: 'https://schema.org/InStock',
            seller: { '@type': 'Organization', name: 'Appampattu Mutta Mittai' },
          },
        ],
        keywords: 'appampattu, appambattu, mutta mittai, egg sweet, villupuram sweet, muttai mittai, traditional egg sweet, sweet villupuram',
      },
      {
        '@type': 'WebSite',
        '@id': 'https://appambattumuttamittai.com/#website',
        url: 'https://appambattumuttamittai.com',
        name: 'Appampattu Mutta Mittai',
        description: 'Official website of Appampattu Mutta Mittai — the original traditional egg sweet from Villupuram, Tamil Nadu.',
        publisher: { '@id': 'https://appambattumuttamittai.com/#business' },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: 'https://appambattumuttamittai.com/order',
          },
          'query-input': 'required name=search_term_string',
        },
        inLanguage: ['en-IN', 'ta'],
      },
      {
        '@type': 'QAPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'What is Appampattu Mutta Mittai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Appampattu Mutta Mittai (அப்பம்பட்டு முட்டை மிட்டாய்) is a traditional Tamil Nadu egg sweet made with milk, egg, cashew nut paste and sugar. It originates from Meenambur, Appampattu near Villupuram and is famous for its soft, fresh and delicious taste.',
            },
          },
          {
            '@type': 'Question',
            name: 'Where can I buy Appampattu egg sweet in Villupuram?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'You can order Appampattu Mutta Mittai online at appambattumuttamittai.com, on Swiggy (search "Appampattu Mutta Mittai"), via WhatsApp at +91 7871949015, or pick up from Villupuram Railway Station, 1st Platform.',
            },
          },
          {
            '@type': 'Question',
            name: 'Do you offer home delivery for Mutta Mittai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Home delivery is available within Villupuram city. You can also order on Swiggy for delivery. For customers outside Villupuram, pickup is available at Villupuram Railway Station, 1st Platform.',
            },
          },
          {
            '@type': 'Question',
            name: 'What are the prices of Appampattu Mutta Mittai?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: '250gm – ₹150 (Small), 500gm – ₹300 (Medium), 750gm – ₹450 (Large), 1kg – ₹600 (Family Pack). Fresh batch made daily.',
            },
          },
          {
            '@type': 'Question',
            name: 'Is Appampattu Mutta Mittai available on Swiggy?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Yes! Appampattu Mutta Mittai is now available on Swiggy. Search for "Appampattu Mutta Mittai" or "egg sweet Villupuram" on Swiggy to order.',
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

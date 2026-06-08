export interface Listing {
  id: string;
  address: string;
  city: string;
  state: string;
  price: number;
  image: string;
  description: string;
  amenities: string[];
  gallery?: string[];
}

export const listings: Listing[] = [
  {
    id: '926-poinsettia',
    address: '926 E Poinsettia Ave',
    city: 'Tampa',
    state: 'FL',
    price: 850,
    image: './assets/images/926-poinsettia/1000002510.jpg',
    description: 'Comfortable all-inclusive housing in central Tampa designed to provide a stable and supportive living environment.',
    amenities: [
      'Washer & dryer access, high-speed Wi-Fi, utilities included, and parking available',
      'Shared kitchen and common areas in a clean, maintained home'
    ],
    gallery: [
      './assets/images/926-poinsettia/1000002510.jpg'
    ]
  },
  {
    id: '1142-7th-street',
    address: '1142 7th Street NW',
    city: 'Largo',
    state: 'FL',
    price: 1000,
    image: './assets/images/1142-7th-street/889bbd8f-3c61-431a-9da7-d21e0738ec8c.jpg',
    description: 'Quiet and comfortable housing in Largo offering a stable home base near the Gulf Coast.',
    amenities: [
      'Utilities included, washer & dryer access, high-speed Wi-Fi, and parking available',
      'Shared kitchen access in a structured and respectful home setting'
    ],
    gallery: [
      './assets/images/1142-7th-street/db43caca-6cf5-44db-9977-ea590b416bca.jpg',
      './assets/images/1142-7th-street/9b5c9a4e-78cf-4b3d-bc58-2e63de8971a7.jpg',
      './assets/images/1142-7th-street/01b83773-5e20-4b83-8da4-13719a8e1a5a.jpg',
      './assets/images/1142-7th-street/3c2f9c29-7787-42df-a5ef-57727fd00951.jpg',
      './assets/images/1142-7th-street/b4ad39de-6b72-45c7-adf3-862acac5e5b5.jpg',
      './assets/images/1142-7th-street/8dce806b-e552-47b7-bd41-07017c8792ca.jpg',
      './assets/images/1142-7th-street/1d5c47cd-7d54-446f-82eb-ea1d7a089b30.jpg',
      './assets/images/1142-7th-street/1940a088-9629-4609-b018-523611119aa0.jpg',
      './assets/images/1142-7th-street/7a984ab5-2ec7-4211-bc99-ad8eadec9936.jpg',
      './assets/images/1142-7th-street/ff665772-3e1e-45e2-9937-2ba09c754d7b.jpg',
      './assets/images/1142-7th-street/eb85c854-4d64-4e6f-a981-632d7af77ca1.jpg',
      './assets/images/1142-7th-street/57d23a1f-270e-4583-b04b-753286f8dd80.jpg'
    ]
  },
  {
    id: '1144-7th-street',
    address: '1144 7th Street NW',
    city: 'Largo',
    state: 'FL',
    price: 850,
    image: './assets/images/1144-7th-street/1144-7th-street-largo.jpg',
    description: 'Spacious shared housing adjacent to the primary Largo property with access to the same supportive and all-inclusive amenities.',
    amenities: [
      'Full kitchen access, washer & dryer, high-speed Wi-Fi, utilities included, and parking available',
      'Spacious shared layout with stable and supportive community living'
    ],
    gallery: [
      './assets/images/1144-7th-street/image.jpg',
      './assets/images/1144-7th-street/image_67125505.JPG',
      './assets/images/1144-7th-street/image_67145217.JPG',
      './assets/images/1144-7th-street/image_67164161.JPG',
      './assets/images/1144-7th-street/image_67166209.JPG',
      './assets/images/1144-7th-street/image_67169793.JPG',
      './assets/images/1144-7th-street/image_67172609.JPG',
      './assets/images/1144-7th-street/image_67178497.JPG',
      './assets/images/1144-7th-street/image_67217665.JPG',
      './assets/images/1144-7th-street/IMG_2467.jpg',
      './assets/images/1144-7th-street/IMG_2469.jpg',
      './assets/images/1144-7th-street/IMG_2474.jpg'
    ]
  }
];

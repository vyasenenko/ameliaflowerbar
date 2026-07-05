export type GalleryItem = {
  src: string;
  cat: "weddings" | "commercial";
  w: number;
  h: number;
};

export const GALLERY: GalleryItem[] = [
  { src: "/gallery/w_01.jpg", cat: "weddings", w: 1500, h: 1000 },
  { src: "/gallery/w_02.jpg", cat: "weddings", w: 1500, h: 2250 },
  { src: "/gallery/w_03.jpg", cat: "weddings", w: 1500, h: 1000 },
  { src: "/gallery/w_04.jpg", cat: "weddings", w: 1500, h: 2250 },
  { src: "/gallery/w_05.jpg", cat: "weddings", w: 1024, h: 683 },
  { src: "/gallery/w_06.jpg", cat: "weddings", w: 1500, h: 1006 },
  { src: "/gallery/w_07.jpg", cat: "weddings", w: 1500, h: 1000 },
  { src: "/gallery/w_08.jpg", cat: "weddings", w: 1500, h: 1000 },
  { src: "/gallery/w_09.jpg", cat: "weddings", w: 1500, h: 2250 },
  { src: "/gallery/w_10.jpg", cat: "weddings", w: 1067, h: 1600 },
  { src: "/gallery/w_11.jpg", cat: "weddings", w: 1500, h: 1000 },
  { src: "/gallery/w_12.jpg", cat: "weddings", w: 1500, h: 1000 },
  { src: "/gallery/w_13.jpg", cat: "weddings", w: 1500, h: 1000 },
  { src: "/gallery/w_14.jpg", cat: "weddings", w: 1500, h: 2250 },
  { src: "/gallery/c_01.jpg", cat: "commercial", w: 1500, h: 1000 },
  { src: "/gallery/c_02.jpg", cat: "commercial", w: 1500, h: 1000 },
  { src: "/gallery/c_03.jpg", cat: "commercial", w: 1500, h: 1000 },
  { src: "/gallery/c_04.jpg", cat: "commercial", w: 1024, h: 683 },
  { src: "/gallery/c_05.jpg", cat: "commercial", w: 1500, h: 2250 },
  { src: "/gallery/c_06.jpg", cat: "commercial", w: 1440, h: 1800 },
];

export type Lang = "en" | "pt";

export type Copy = {
  nav: { inicio: string; sobre: string; servicos: string; galeria: string; contactos: string };
  headerCta: string;
  openMenu: string;
  closeMenu: string;
  hero: {
    eyebrow: string;
    headingTop: string;
    headingBottom: string;
    paragraph: string;
    cta: string;
    signature: string;
    since: string;
    scroll: string;
  };
  about: { label: string; heading: string; p1: string; p2: string; imgAlt: string };
  clients: { label: string };
  services: { label: string; items: { title: string; desc: string }[] };
  quote: { line1: string; em: string; sub: string };
  gallery: {
    label: string;
    heading: string;
    intro: string;
    filters: { all: string; weddings: string; commercial: string };
    loadMore: (n: number) => string;
    zoom: string;
  };
  contact: {
    label: string;
    heading: string;
    text: string;
    addressLines: string[];
    viewMap: string;
    imgAlt: string;
  };
  footer: (year: number) => string;
  lightbox: { close: string; prev: string; next: string };
};

export const COPY: Record<Lang, Copy> = {
  en: {
    nav: {
      inicio: "Home",
      sobre: "About",
      servicos: "Services",
      galeria: "Work",
      contactos: "Contact",
    },
    headerCta: "Get in Touch",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    hero: {
      eyebrow: "Premium Floral Design · Cascais",
      headingTop: "Exquisite Blooms",
      headingBottom: "for Every Occasion",
      paragraph:
        "Signature floral design for weddings, brands and unforgettable celebrations across Portugal and Spain — we don't just arrange flowers, we craft atmospheres.",
      cta: "Explore Our Work",
      signature: "we craft atmospheres",
      since: "— since 2020",
      scroll: "Scroll to discover",
    },
    about: {
      label: "About Us",
      heading: "Two Sisters, One Passion",
      p1: "D. Amélia Flower Bar is the result of a shared passion between two sisters — one rooted in the vibrant energy of Madrid, the other settled in the timeless charm of Portugal.",
      p2: "With over a decade of expertise in premium floral design for weddings, corporate functions and special occasions, we don't just arrange flowers — we craft atmospheres and celebrate life's moments, beautifully.",
      imgAlt: "A D. Amélia Flower Bar floral installation",
    },
    clients: { label: "Trusted by" },
    services: {
      label: "What We Do",
      items: [
        {
          title: "Weddings",
          desc: "One-of-a-kind celebrations — from bridal bouquets and boutonnières to breathtaking installations, designed entirely around your love story.",
        },
        {
          title: "Flower Design & Event Decor",
          desc: "Centerpieces, large-scale installations and personal flowers for corporate functions and private events, styled around a cohesive vision.",
        },
        {
          title: "Editorial & Production",
          desc: "Concept development, art direction and full production for editorial content and photographic shoots.",
        },
        {
          title: "Workshops",
          desc: "Hands-on floral workshops — installations, dried flowers, creative tablescapes and the essentials of arrangement.",
        },
      ],
    },
    quote: {
      line1: "Made with our hands, our minds and",
      em: "our hearts.",
      sub: "Over a decade crafting atmospheres across Portugal & Spain.",
    },
    gallery: {
      label: "Our Work",
      heading: "Selected Work",
      intro:
        "A glimpse of the weddings, brand events and installations we design and produce.",
      filters: { all: "All", weddings: "Weddings", commercial: "Commercial" },
      loadMore: (n) => `Show more (${n})`,
      zoom: "Enlarge image",
    },
    contact: {
      label: "Contact",
      heading: "Visit Our Studio",
      text: "Tell us about your celebration, schedule a meeting, or arrange a visit to our studio in Cascais.",
      addressLines: ["Av. Mal. Carmona 160 A", "2750-309 Cascais, Portugal"],
      viewMap: "View on Google Maps",
      imgAlt: "A D. Amélia Flower Bar floral design",
    },
    footer: (year) =>
      `© ${year} D. Amélia Flower Bar · Cascais, Portugal. All rights reserved.`,
    lightbox: { close: "Close", prev: "Previous", next: "Next" },
  },
  pt: {
    nav: {
      inicio: "Início",
      sobre: "Sobre",
      servicos: "Serviços",
      galeria: "Trabalhos",
      contactos: "Contactos",
    },
    headerCta: "Fale Connosco",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    hero: {
      eyebrow: "Design Floral Premium · Cascais",
      headingTop: "Flores Deslumbrantes",
      headingBottom: "para Cada Ocasião",
      paragraph:
        "Design floral de autor para casamentos, marcas e celebrações inesquecíveis em Portugal e Espanha — não arranjamos apenas flores, criamos atmosferas.",
      cta: "Ver o Nosso Trabalho",
      signature: "criamos atmosferas",
      since: "— desde 2020",
      scroll: "Deslize para descobrir",
    },
    about: {
      label: "Sobre Nós",
      heading: "Duas Irmãs, Uma Paixão",
      p1: "A D. Amélia Flower Bar nasce da paixão partilhada entre duas irmãs — uma enraizada na energia vibrante de Madrid, a outra no encanto intemporal de Portugal.",
      p2: "Com mais de uma década de experiência em design floral premium para casamentos, eventos corporativos e ocasiões especiais, não arranjamos apenas flores — criamos atmosferas e celebramos os momentos da vida, com beleza.",
      imgAlt: "Uma instalação floral da D. Amélia Flower Bar",
    },
    clients: { label: "Confiam em nós" },
    services: {
      label: "O Que Fazemos",
      items: [
        {
          title: "Casamentos",
          desc: "Celebrações únicas — de bouquets de noiva e boutonnières a instalações deslumbrantes, desenhadas em torno da vossa história de amor.",
        },
        {
          title: "Design Floral & Decoração",
          desc: "Centros de mesa, instalações de grande escala e flores personalizadas para eventos corporativos e privados, com uma visão coesa.",
        },
        {
          title: "Editorial & Produção",
          desc: "Desenvolvimento de conceito, direção de arte e produção completa para conteúdo editorial e produções fotográficas.",
        },
        {
          title: "Workshops",
          desc: "Workshops de floristaria — instalações, flores secas, mesas criativas e os fundamentos dos arranjos.",
        },
      ],
    },
    quote: {
      line1: "Feito com as nossas mãos, a mente e",
      em: "o coração.",
      sub: "Mais de uma década a criar atmosferas em Portugal e Espanha.",
    },
    gallery: {
      label: "O Nosso Trabalho",
      heading: "Trabalhos Selecionados",
      intro:
        "Um vislumbre dos casamentos, eventos de marca e instalações que criamos e produzimos.",
      filters: { all: "Tudo", weddings: "Casamentos", commercial: "Comercial" },
      loadMore: (n) => `Mostrar mais (${n})`,
      zoom: "Ampliar imagem",
    },
    contact: {
      label: "Contactos",
      heading: "Visite o Nosso Estúdio",
      text: "Conte-nos sobre a sua celebração, agende uma reunião ou marque uma visita ao nosso estúdio em Cascais.",
      addressLines: ["Av. Mal. Carmona 160 A", "2750-309 Cascais, Portugal"],
      viewMap: "Ver no Google Maps",
      imgAlt: "Um trabalho floral da D. Amélia Flower Bar",
    },
    footer: (year) =>
      `© ${year} D. Amélia Flower Bar · Cascais, Portugal. Todos os direitos reservados.`,
    lightbox: { close: "Fechar", prev: "Anterior", next: "Seguinte" },
  },
};

export const BRANDS = ["L'Oréal", "IKEA", "Pestana Hotels & Resorts", "Vista Alegre", "NetJets"];

export const CONTACT = {
  phone: "+351 919 265 376",
  phoneHref: "tel:+351919265376",
  email: "geral@2for1design.com",
  instagram: "https://www.instagram.com/d.ameliaflowerbar/",
  maps:
    "https://www.google.com/maps/search/?api=1&query=Av.%20Mal.%20Carmona%20160%20A%2C%202750-309%20Cascais",
};

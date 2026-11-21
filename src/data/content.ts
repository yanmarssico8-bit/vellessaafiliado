import serum from "@/assets/vellessa-serum.jpg";
import cover3 from "@/assets/cover-3.jpg";

export const images = { serum, cover3 };

export const affiliate = {
  name: "",
  first: "Afiliado",
  level: "Afiliado Oficial",
  email: "",
  id: "",
};

export type LessonMaterial = {
  id: string;
  title: string;
  url: string;
  type?: "pdf" | "sheet" | "doc" | "drive" | "link";
};

export type Lesson = {
  id: string;
  title: string;
  duration: string;
  done?: boolean;
  video_url?: string;
  description?: string;
  materials?: LessonMaterial[];
  contentType?: "video" | "pdf" | "link" | "text";
  contentUrl?: string;
};

export type Module = {
  id: string;
  title: string;
  subtitle: string;
  cover: string;
  lessons: Lesson[];
};

export const modules: Module[] = [
  {
    id: "mod-1795052744275",
    cover: "/covers/Pagamento_na_Entrega_2_sem_modulo.png",
    title: "Logzz - Como vender com pagamento na entrega",
    subtitle: "",
    lessons: [
      {
        id: "l-1795052783437",
        done: false,
        title: "O que é a Logzz",
        duration: "10:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/1ctGCno_yeHkNZjpFQv3oq08rTrVwyAOu/view?usp=drive_link",
        description: "",
      },
      {
        id: "l-1795052990205",
        done: false,
        title: "Como fazer um pedido na Logzz",
        duration: "8:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/1t_NPr_Ym000tfwXu1CaJrIWUE5T4JQqs/view?usp=drive_link",
        description: "",
      },
      {
        id: "l-1795110119641",
        done: false,
        title: "Mais sobre a Logzz",
        duration: "10:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/19QjoK_XlnApg9qisZw7n6a2MBRNjQa2R/view?usp=drive_link",
        contentType: "video",
        description: "",
      },
    ],
  },
  {
    id: "mod-1793736300497",
    cover: "/covers/Trafego_Pago_sem_modulo.png",
    title: "Trafego Pago",
    subtitle: "",
    lessons: [
      {
        id: "l-1795046017569",
        done: false,
        title: "Primeiros Passos - Trafego Pago",
        duration: "10:00",
        video_url: "https://drive.google.com/file/d/1Zi9RPjxeEwuiXxDAZLZ0N1aXHKKusg4n/view?usp=drive_link",
        description: "",
      },
      {
        id: "l-1795047354904",
        done: false,
        title: "Como criar publico no Meta ADS",
        duration: "10:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/1rGRN0_G7S7ZhK5cD8GQD2QQp4GdtJVbl/view?usp=drive_link",
        description: "",
      },
      {
        id: "l-1795047785154",
        done: false,
        title: "Como subir a campanha (campanha e conjunto)",
        duration: "10:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/1b1wtBkt3ADTJhSwb-KchfcuBoz-sL7yK/view?usp=drive_link",
        description: "",
      },
      {
        id: "l-1795049083397",
        done: false,
        title: "Como subir a campanha (o anúncio)",
        duration: "6:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/1y16RdhsnxAK_zgAWEngYxkY-x_FDCqTE/view?usp=drive_link",
        description: "",
      },
      {
        id: "l-1795049127335",
        done: false,
        title: "Como configurar o pixel",
        duration: "6:58",
        materials: [],
        video_url: "https://drive.google.com/file/d/18Nt-dKzrTJHQkCleoeMJvSrpl8RcaTxp/view?usp=drive_link",
        description: "",
      },
    ],
  },
  {
    id: "mod-1795049180873",
    cover: "/covers/Criativos_com_IA_sem_modulo.png",
    title: "Criativos com IA",
    subtitle: "",
    lessons: [
      {
        id: "l-1795049208053",
        done: false,
        title: "Criativos com IA - Aula 1",
        duration: "10:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/1qWtrh2VEWzinHT4HmCqK-JYOaIGxPjdp/view?usp=drive_link",
        description: "",
      },
    ],
  },
  {
    id: "mod-1795110397916",
    cover: "/covers/Configuracao_de_Pagina_no_Facebook_e_Posters.png",
    title: "Configuração de Página no Facebook e Posters",
    subtitle: "",
    lessons: [
      {
        id: "l-1795110438046",
        done: false,
        title: "Como moderar a sua página",
        duration: "10:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/13O9IFGfB07xg6MxNS1nxfnxOPKHFQLbU/view?usp=drive_link",
        contentType: "video",
        description: "",
      },
      {
        id: "l-1795110470191",
        done: false,
        title: "Dark Post (comentários no criativo)",
        duration: "10:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/1q3i6phJxXwRYuht91cXm4CJNaZcYgrES/view?usp=drive_link",
        contentType: "video",
        description: "",
      },
    ],
  },
  {
    id: "mod-1795054686728",
    cover: "/covers/Venda_com_Automacao_Bot_sem_modulo.png",
    title: "Venda com Automações - Facilite seu dia a dia!",
    subtitle: "",
    lessons: [
      {
        id: "l-1795054797148",
        done: false,
        title: "Automação com o ZapData",
        duration: "10:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/1XrRvzdCZWVnRE6E_KYqsjYU16a7YtIz3/view?usp=drive_link",
        description: "",
      },
      {
        id: "l-1795054831787",
        done: false,
        title: "Instalando a automação",
        duration: "10:00",
        materials: [],
        video_url: "https://drive.google.com/file/d/1mAkx8I-pLTJTuon0hOoAmSEy67hGlC6U/view?usp=drive_link",
        description: "",
      },
    ],
  },
  {
    id: "mod-1795089247916",
    cover: "/covers/Grupo_Exclusivo_de_Afiliados_Vellessa.png",
    title: "Grupo Exclusivo Whatsapp",
    subtitle: "",
    lessons: [
      {
        id: "l-1795089304376",
        done: false,
        title: "Entre no Grupo",
        duration: "Link / Ferramenta",
        materials: [],
        video_url: "",
        contentUrl: "https://chat.whatsapp.com/JHD6nniNchYLhQmRnLDZ86?s=cl&p=a&iam=2",
        contentType: "link",
        description: "Clique no Link e acesse o Grupo",
      },
    ],
  },
];

export const allLessons: (Lesson & { module: Module })[] = modules.flatMap((m) =>
  m.lessons.map((l) => ({ ...l, module: m }))
);
export const totalLessons = allLessons.length;
export const doneLessons = 0;

export type Creative = {
  id: string;
  title: string;
  type: "Feed" | "Stories" | "Reels" | "Copy";
  image?: string;
  text?: string;
  format: string;
  folderId?: string;
  fileUrl?: string;
  externalDownloadUrl?: string;
  fileType?: string;
  fileSize?: string;
  storageType?: "supabase" | "indexeddb" | "external";
  storagePath?: string;
};

export const creatives: Creative[] = [];

export interface ContentLink {
  label: string;
  url: string;
  note: string;
}

export const links: ContentLink[] = [];

export interface ContentMaterial {
  title: string;
  kind: string;
  size: string;
}

export const materials: ContentMaterial[] = [];

export interface ContentAnnouncement {
  id: string;
  pinned?: boolean;
  author: string;
  time: string;
  title: string;
  body: string;
}

export const announcements: ContentAnnouncement[] = [];

export interface ContentPost {
  id: string;
  author: string;
  initials: string;
  time: string;
  body: string;
  likes: number;
  replies: number;
}

export const posts: ContentPost[] = [];

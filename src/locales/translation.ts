export type Content = {
  menu: {
    title: string;
    planets: {
      name: string;
      route: string;
    }[];
  };
  descriptions: {
    [planet: string]: string;
  };
  questions: {
    [planet: string]: string;
  };
};

const content: Record<string, Content> = {
  en: {
    menu: {
      title: "Planets",
      planets: [
        { name: "Mercury", route: "mercury" },
        { name: "Venus", route: "venus" }, // Fix: Corrected the route for Venus
        { name: "Earth", route: "earth" },
        { name: "Mars", route: "mars" },
        { name: "Jupiter", route: "jupiter" },
        { name: "Saturn", route: "saturn" },
        { name: "Uranus", route: "uranus" },
        { name: "Neptune", route: "neptune" },
      ],
    },
    descriptions: {
      mercury: "The smallest planet in our solar system.",
      venus: "The second planet from the Sun.",
      earth: "Our home planet.",
      mars: "The red planet.",
      jupiter: "The largest planet in our solar system.",
      saturn: "Known for its rings.",
      uranus: "An ice giant.",
      neptune: "The farthest planet from the Sun.",
    },
    questions: {
      mercury: "What is the surface temperature of Mercury?",
      venus: "Why is Venus often called Earth's twin?",
      earth: "What makes Earth unique?",
      mars: "What are the signs of water on Mars?",
      jupiter: "Why is Jupiter so massive?",
      saturn: "What are Saturn's rings made of?",
      uranus: "Why is Uranus tilted on its axis?",
      neptune: "What is the color of Neptune?",
    },
  },
  pt: {
    menu: {
      title: "Planetas",
      planets: [
        { name: "Mercúrio", route: "mercury" },
        { name: "Vênus", route: "venus" },
        { name: "Terra", route: "earth" },
        { name: "Marte", route: "mars" },
        { name: "Júpiter", route: "jupiter" },
        { name: "Saturno", route: "saturn" },
        { name: "Urano", route: "uranus" },
        { name: "Netuno", route: "neptune" },
      ],
    },
    descriptions: {
      mercury: "O menor planeta do nosso sistema solar.",
      venus: "O segundo planeta a partir do Sol.",
      earth: "Nosso planeta natal.",
      mars: "O planeta vermelho.",
      jupiter: "O maior planeta do nosso sistema solar.",
      saturn: "Conhecido pelos seus anéis.",
      uranus: "Um gigante de gelo.",
      neptune: "O planeta mais distante do Sol.",
    },
    questions: {
      mercury: "Qual é a temperatura da superfície de Mercúrio?",
      venus: "Por que Vênus é frequentemente chamado de gêmeo da Terra?",
      earth: "O que torna a Terra única?",
      mars: "Quais são os sinais de água em Marte?",
      jupiter: "Por que Júpiter é tão massivo?",
      saturn: "Do que são feitos os anéis de Saturno?",
      uranus: "Por que Urano é inclinado em seu eixo?",
      neptune: "Qual é a cor de Netuno?",
    },
  },

  es: {
    menu: {
      title: "Planetas",
      planets: [
        { name: "Mercurio", route: "mercury" },
        { name: "Venus", route: "venus" },
        { name: "Tierra", route: "earth" },
        { name: "Marte", route: "mars" },
        { name: "Jupiter", route: "jupiter" },
        { name: "Saturno", route: "saturn" },
        { name: "Urano", route: "uranus" },
        { name: "Neptuno", route: "neptune" },
      ],
    },
    descriptions: {
      mercury: "El planeta más pequeño de nuestro sistema solar.",
      venus: "El segundo planeta desde el sol.",
      earth: "Nuestro planeta hogar.",
      mars: "El planeta rojo.",
      jupiter: "El planeta más grande de nuestro sistema solar.",
      saturn: "Conocido por sus anillos.",
      uranus: "Un gigante de hielo.",
      neptune: "El planeta más lejano del sol.",
    },
    questions: {
      mercury: "¿Cuál es la temperatura en la superficie de Mercurio?",
      venus: "¿Por qué Venus se llama a menudo el gemelo de la Tierra?",
      earth: "¿Qué hace única a la Tierra?",
      mars: "¿Cuáles son las señales de agua en Marte?",
      jupiter: "¿Por qué es Júpiter tan masivo?",
      saturn: "¿De qué están hechos los anillos de Saturno?",
      uranus: "¿Por qué Urano está inclinado en su eje?",
      neptune: "¿De qué color es Neptuno?",
    },
  },

  zh: {
    menu: {
      title: "行星",
      planets: [
        { name: "水星", route: "mercury" },
        { name: "金星", route: "venus" },
        { name: "地球", route: "earth" },
        { name: "火星", route: "mars" },
        { name: "木星", route: "jupiter" },
        { name: "土星", route: "saturn" },
        { name: "天王星", route: "uranus" },
        { name: "海王星", route: "neptune" },
      ],
    },
    descriptions: {
      mercury: "我们太阳系中最小的行星。",
      venus: "离太阳第二近的行星。",
      earth: "我们的家园。",
      mars: "红色的行星。",
      jupiter: "我们太阳系中最大的行星。",
      saturn: "以其环著称。",
      uranus: "一颗冰巨星。",
      neptune: "离太阳最远的行星。",
    },
    questions: {
      mercury: "水星的表面温度是多少？",
      venus: "为什么金星常被称为地球的双胞胎？",
      earth: "是什么让地球与众不同？",
      mars: "火星上有哪些水的迹象？",
      jupiter: "为什么木星这么庞大？",
      saturn: "土星的环是由什么组成的？",
      uranus: "为什么天王星的轴倾斜？",
      neptune: "海王星是什么颜色的？",
    },
  },

  fr: {
    menu: {
      title: "Planètes",
      planets: [
        { name: "Mercure", route: "mercury" },
        { name: "Vénus", route: "venus" },
        { name: "Terre", route: "earth" },
        { name: "Mars", route: "mars" },
        { name: "Jupiter", route: "jupiter" },
        { name: "Saturne", route: "saturn" },
        { name: "Uranus", route: "uranus" },
        { name: "Neptune", route: "neptune" },
      ],
    },
    descriptions: {
      mercury: "La plus petite planète de notre système solaire.",
      venus: "La deuxième planète du Soleil.",
      earth: "Notre planète d'origine.",
      mars: "La planète rouge.",
      jupiter: "La plus grande planète de notre système solaire.",
      saturn: "Célèbre pour ses anneaux.",
      uranus: "Un géant de glace.",
      neptune: "La planète la plus éloignée du Soleil.",
    },
    questions: {
      mercury: "Quelle est la température de surface de Mercure ?",
      venus: "Pourquoi Vénus est-elle souvent appelée la jumelle de la Terre ?",
      earth: "Qu'est-ce qui rend la Terre unique ?",
      mars: "Quels sont les signes de l'eau sur Mars ?",
      jupiter: "Pourquoi Jupiter est-il si massif ?",
      saturn: "De quoi sont faits les anneaux de Saturne ?",
      uranus: "Pourquoi Uranus est-il incliné sur son axe ?",
      neptune: "Quelle est la couleur de Neptune ?",
    },
  },

  ja: {
    menu: {
      title: "惑星",
      planets: [
        { name: "水星", route: "mercury" },
        { name: "金星", route: "venus" },
        { name: "地球", route: "earth" },
        { name: "火星", route: "mars" },
        { name: "木星", route: "jupiter" },
        { name: "土星", route: "saturn" },
        { name: "天王星", route: "uranus" },
        { name: "海王星", route: "neptune" },
      ],
    },
    descriptions: {
      mercury: "太陽系で最も小さな惑星。",
      venus: "太陽から2番目の惑星。",
      earth: "私たちの故郷の惑星。",
      mars: "赤い惑星。",
      jupiter: "太陽系で最大の惑星。",
      saturn: "その環で知られている。",
      uranus: "氷の巨大惑星。",
      neptune: "太陽から最も遠い惑星。",
    },
    questions: {
      mercury: "水星の表面温度はどれくらいですか？",
      venus: "なぜ金星は地球の双子と呼ばれることが多いのですか？",
      earth: "地球の何が特別なのですか？",
      mars: "火星で水の兆候はありますか？",
      jupiter: "なぜ木星はこんなに巨大なのですか？",
      saturn: "土星の環は何でできているのですか？",
      uranus: "なぜ天王星は軸が傾いているのですか？",
      neptune: "海王星の色は何ですか？",
    },
  },
};

export function getContent(lang: string): Content {
  return content[lang] || content["en-US"]; // Return the content for the specified language, fallback to "en-US"
}

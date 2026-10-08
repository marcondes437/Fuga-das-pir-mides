export type ShapeKind =
  | "cube"
  | "box"
  | "prism3"
  | "prism6"
  | "pyramid"
  | "cylinder"
  | "cone"
  | "sphere"
  | "hemisphere"
  | "silo"
  | "cubeHole"
  | "tower"
  | "capsule"
  | "cylSpheres"
  | "sphereInCube"
  | "cubePyramid";

export interface Shape {
  kind: ShapeKind;
  d: Record<string, number>;
}

export interface Challenge {
  id: string;
  title: string;
  story: string;
  prompt: string;
  topic: string;
  type: "numeric" | "choice";
  options?: string[];
  unit: string;
  xp: number;
  shape: Shape;
}

export interface Room {
  id: string;
  name: string;
  topic: string;
  challenges: Challenge[];
}
export interface Pyramid {
  id: "iniciante" | "enigmas" | "guardiao";
  name: string;
  level: string;
  tagline: string;
  sky: string;
  rooms: Room[];
}

export const PYRAMIDS: Pyramid[] = [
  {
    id: "iniciante",
    name: "Pirâmide de Miquerinos",
    level: "Fácil",
    sky: "Deserto iluminado",
    tagline: "Areia dourada, céu claro e os primeiros mecanismos.",
    rooms: [
      {
        id: "s1",
        name: "Câmara dos Cubos",
        topic: "Cubo e paralelepípedo",
        challenges: [
          {
            type: "numeric",
            title: "O bloco de calcário",
            topic: "Volume do cubo",
            story: "Um bloco cúbico trava a passagem. A inscrição pede seu volume.",
            prompt: "Um cubo tem aresta de 4 cm. Qual é o seu volume?",
            unit: "cm³",
            shape: {
              kind: "cube",
              d: {
                a: 4,
              },
            },
            id: "iniciante-s1-d1",
            xp: 10,
          },
          {
            type: "numeric",
            title: "O baú do escriba",
            topic: "Volume do paralelepípedo",
            story: "Um baú de pedra guarda a próxima pista.",
            prompt: "Um paralelepípedo mede 5 cm × 3 cm × 2 cm. Qual é o seu volume?",
            unit: "cm³",
            shape: {
              kind: "box",
              d: {
                a: 5,
                b: 3,
                c: 2,
              },
            },
            id: "iniciante-s1-d2",
            xp: 10,
          },
          {
            type: "numeric",
            title: "O revestimento de ouro",
            topic: "Área total do cubo",
            story: "O faraó mandou cobrir um cubo inteiro com ouro.",
            prompt: "Qual é a área total de um cubo de aresta 3 cm?",
            unit: "cm²",
            shape: {
              kind: "cube",
              d: {
                a: 3,
              },
            },
            id: "iniciante-s1-d3",
            xp: 10,
          },
        ],
      },
      {
        id: "s2",
        name: "Galeria dos Prismas",
        topic: "Prismas",
        challenges: [
          {
            type: "numeric",
            title: "A base triangular",
            topic: "Área da base",
            story: "Um prisma triangular sustenta o teto da galeria.",
            prompt:
              "A base de um prisma é um triângulo retângulo de catetos 6 cm e 8 cm. Qual é a área da base?",
            unit: "cm²",
            shape: {
              kind: "prism3",
              d: {
                a: 6,
                b: 8,
                h: 10,
              },
            },
            id: "iniciante-s2-d1",
            xp: 10,
          },
          {
            type: "numeric",
            title: "O pilar triangular",
            topic: "Volume do prisma",
            story: "Areia precisa encher o pilar para acionar a alavanca.",
            prompt:
              "O mesmo prisma (base: triângulo retângulo de catetos 6 cm e 8 cm) tem altura 10 cm. Qual é o volume?",
            unit: "cm³",
            shape: {
              kind: "prism3",
              d: {
                a: 6,
                b: 8,
                h: 10,
              },
            },
            id: "iniciante-s2-d2",
            xp: 10,
          },
          {
            type: "numeric",
            title: "As paredes pintadas",
            topic: "Área lateral",
            story: "As faces laterais de um pilar quadrado estão cobertas de hieróglifos.",
            prompt:
              "Um prisma reto de base quadrada tem lado da base 4 cm e altura 7 cm. Qual é a área lateral?",
            unit: "cm²",
            shape: {
              kind: "box",
              d: {
                a: 4,
                b: 7,
                c: 4,
              },
            },
            id: "iniciante-s2-d3",
            xp: 10,
          },
        ],
      },
      {
        id: "s3",
        name: "Templo das Pirâmides",
        topic: "Pirâmides",
        challenges: [
          {
            type: "numeric",
            title: "O chão do templo",
            topic: "Área da base",
            story: "Uma pequena pirâmide de base quadrada repousa no altar.",
            prompt: "A base quadrada de uma pirâmide tem lado 6 cm. Qual é a área da base?",
            unit: "cm²",
            shape: {
              kind: "pyramid",
              d: {
                a: 6,
                h: 4,
              },
            },
            id: "iniciante-s3-d1",
            xp: 10,
          },
          {
            type: "numeric",
            title: "O volume sagrado",
            topic: "Volume da pirâmide",
            story: "O altar só se abre quando se conhece o volume da pirâmide.",
            prompt: "A pirâmide de base quadrada de lado 6 cm tem altura 4 cm. Qual é o volume?",
            unit: "cm³",
            shape: {
              kind: "pyramid",
              d: {
                a: 6,
                h: 4,
              },
            },
            id: "iniciante-s3-d2",
            xp: 10,
          },
          {
            type: "choice",
            title: "Altura ou apótema?",
            topic: "Elementos da pirâmide",
            story: "Um escriba confundiu os elementos da pirâmide. Corrija-o.",
            prompt:
              "Na pirâmide de base 6 cm e altura 4 cm, o segmento que vai do vértice ao ponto médio de uma aresta da base mede 5 cm. Esse segmento é:",
            options: [
              "A altura da pirâmide",
              "O apótema da pirâmide",
              "A aresta lateral",
              "O apótema da base",
            ],
            unit: "",
            shape: {
              kind: "pyramid",
              d: {
                a: 6,
                h: 4,
              },
            },
            id: "iniciante-s3-d3",
            xp: 10,
          },
        ],
      },
      {
        id: "s4",
        name: "Câmara dos Cilindros",
        topic: "Cilindros",
        challenges: [
          {
            type: "numeric",
            title: "A tampa do jarro",
            topic: "Área da base",
            story: "Um jarro cilíndrico guarda óleo das tochas.",
            prompt: "Um cilindro tem raio 3 cm. Qual é a área da base? Use π = 3,14.",
            unit: "cm²",
            shape: {
              kind: "cylinder",
              d: {
                r: 3,
                h: 10,
              },
            },
            id: "iniciante-s4-d1",
            xp: 10,
          },
          {
            type: "numeric",
            title: "O óleo das tochas",
            topic: "Volume do cilindro",
            story: "Quanto óleo cabe no jarro?",
            prompt: "O cilindro de raio 3 cm tem altura 10 cm. Qual é o volume? Use π = 3,14.",
            unit: "cm³",
            shape: {
              kind: "cylinder",
              d: {
                r: 3,
                h: 10,
              },
            },
            id: "iniciante-s4-d2",
            xp: 10,
          },
          {
            type: "numeric",
            title: "O papiro enrolado",
            topic: "Área lateral",
            story: "Um papiro envolve completamente a lateral do jarro.",
            prompt: "Qual é a área lateral do cilindro de raio 3 cm e altura 10 cm? Use π = 3,14.",
            unit: "cm²",
            shape: {
              kind: "cylinder",
              d: {
                r: 3,
                h: 10,
              },
            },
            id: "iniciante-s4-d3",
            xp: 10,
          },
        ],
      },
      {
        id: "s5",
        name: "Salão dos Sólidos",
        topic: "Cones e esferas",
        challenges: [
          {
            type: "numeric",
            title: "O cone de incenso",
            topic: "Volume do cone",
            story: "Um cone de incenso queima diante da estátua.",
            prompt: "Um cone tem raio 3 cm e altura 4 cm. Qual é o volume? Use π = 3,14.",
            unit: "cm³",
            shape: {
              kind: "cone",
              d: {
                r: 3,
                h: 4,
              },
            },
            id: "iniciante-s5-d1",
            xp: 10,
          },
          {
            type: "numeric",
            title: "A esfera dourada",
            topic: "Área da esfera",
            story: "Uma esfera precisa ser coberta com folha de ouro.",
            prompt: "Qual é a área da superfície de uma esfera de raio 5 cm? Use π = 3,14.",
            unit: "cm²",
            shape: {
              kind: "sphere",
              d: {
                r: 5,
              },
            },
            id: "iniciante-s5-d2",
            xp: 10,
          },
          {
            type: "numeric",
            title: "O olho de Rá",
            topic: "Volume da esfera",
            story: "O olho de Rá é uma esfera de cristal.",
            prompt: "Qual é o volume de uma esfera de raio 3 cm? Use π = 3,14.",
            unit: "cm³",
            shape: {
              kind: "sphere",
              d: {
                r: 3,
              },
            },
            id: "iniciante-s5-d3",
            xp: 10,
          },
        ],
      },
    ],
  },
  {
    id: "enigmas",
    name: "Pirâmide de Quéfren",
    level: "Intermediário",
    sky: "Entardecer",
    tagline: "Sombras longas, enigmas em várias etapas.",
    rooms: [
      {
        id: "s1",
        name: "Câmara das Superfícies",
        topic: "Área lateral e total de prismas",
        challenges: [
          {
            type: "numeric",
            title: "O sarcófago selado",
            topic: "Área total",
            story: "É preciso selar todas as faces de um sarcófago retangular.",
            prompt: "Um paralelepípedo mede 8 cm × 5 cm × 3 cm. Qual é a área total?",
            unit: "cm²",
            shape: {
              kind: "box",
              d: {
                a: 8,
                b: 3,
                c: 5,
              },
            },
            id: "enigmas-s1-d1",
            xp: 20,
          },
          {
            type: "numeric",
            title: "A coluna hexagonal",
            topic: "Área lateral do prisma",
            story: "Uma coluna hexagonal regular sustenta a câmara.",
            prompt:
              "Um prisma hexagonal regular tem aresta da base 2 cm e altura 10 cm. Qual é a área lateral?",
            unit: "cm²",
            shape: {
              kind: "prism6",
              d: {
                a: 2,
                h: 10,
              },
            },
            id: "enigmas-s1-d2",
            xp: 20,
          },
          {
            type: "numeric",
            title: "O cubo perdido",
            topic: "Área total → aresta",
            story: "Só restou a medida do ouro usado para cobrir um cubo.",
            prompt: "Um cubo tem área total de 150 cm². Qual é a medida da sua aresta?",
            unit: "cm",
            shape: {
              kind: "cube",
              d: {
                a: 5,
              },
            },
            id: "enigmas-s1-d3",
            xp: 20,
          },
        ],
      },
      {
        id: "s2",
        name: "Galeria dos Apótemas",
        topic: "Pirâmides regulares",
        challenges: [
          {
            type: "numeric",
            title: "A face inclinada",
            topic: "Apótema da pirâmide",
            story: "Para escalar a face da pirâmide é preciso saber sua inclinação.",
            prompt:
              "Uma pirâmide quadrangular regular tem aresta da base 10 cm e altura 12 cm. Qual é o apótema da pirâmide?",
            unit: "cm",
            shape: {
              kind: "pyramid",
              d: {
                a: 10,
                h: 12,
              },
            },
            id: "enigmas-s2-d1",
            xp: 20,
          },
          {
            type: "numeric",
            title: "As quatro faces",
            topic: "Área lateral",
            story: "As quatro faces triangulares devem ser polidas.",
            prompt: "Com aresta da base 10 cm e apótema 13 cm, qual é a área lateral da pirâmide?",
            unit: "cm²",
            shape: {
              kind: "pyramid",
              d: {
                a: 10,
                h: 12,
              },
            },
            id: "enigmas-s2-d2",
            xp: 20,
          },
          {
            type: "numeric",
            title: "O revestimento completo",
            topic: "Área total",
            story: "Agora inclua também a base.",
            prompt: "Qual é a área total dessa pirâmide (aresta da base 10 cm, apótema 13 cm)?",
            unit: "cm²",
            shape: {
              kind: "pyramid",
              d: {
                a: 10,
                h: 12,
              },
            },
            id: "enigmas-s2-d3",
            xp: 20,
          },
        ],
      },
      {
        id: "s3",
        name: "Templo dos Reservatórios",
        topic: "Cilindros",
        challenges: [
          {
            type: "numeric",
            title: "A cisterna do templo",
            topic: "Volume",
            story: "Uma cisterna cilíndrica abastece o templo.",
            prompt: "A cisterna tem raio 2 m e altura 5 m. Qual é o volume? Use π = 3,14.",
            unit: "m³",
            shape: {
              kind: "cylinder",
              d: {
                r: 2,
                h: 5,
              },
            },
            id: "enigmas-s3-d1",
            xp: 20,
          },
          {
            type: "numeric",
            title: "Litros do Nilo",
            topic: "Conversão de unidades",
            story: "Os sacerdotes medem água em litros.",
            prompt: "Quantos litros cabem na cisterna de 62,8 m³?",
            unit: "L",
            shape: {
              kind: "cylinder",
              d: {
                r: 2,
                h: 5,
              },
            },
            id: "enigmas-s3-d2",
            xp: 20,
          },
          {
            type: "numeric",
            title: "A impermeabilização",
            topic: "Área total",
            story: "Toda a cisterna, com tampa e fundo, precisa ser impermeabilizada.",
            prompt: "Qual é a área total da cisterna (r = 2 m, h = 5 m)? Use π = 3,14.",
            unit: "m²",
            shape: {
              kind: "cylinder",
              d: {
                r: 2,
                h: 5,
              },
            },
            id: "enigmas-s3-d3",
            xp: 20,
          },
        ],
      },
      {
        id: "s4",
        name: "Câmara das Geratrizes",
        topic: "Cones e Pitágoras",
        challenges: [
          {
            type: "numeric",
            title: "A rampa cônica",
            topic: "Geratriz",
            story: "Um cone de pedra bloqueia o corredor.",
            prompt: "Um cone tem raio 6 cm e altura 8 cm. Qual é a geratriz?",
            unit: "cm",
            shape: {
              kind: "cone",
              d: {
                r: 6,
                h: 8,
              },
            },
            id: "enigmas-s4-d1",
            xp: 20,
          },
          {
            type: "numeric",
            title: "O manto do cone",
            topic: "Área lateral",
            story: "A superfície do cone está coberta de símbolos.",
            prompt: "Qual é a área lateral desse cone (r = 6 cm, g = 10 cm)? Use π = 3,14.",
            unit: "cm²",
            shape: {
              kind: "cone",
              d: {
                r: 6,
                h: 8,
              },
            },
            id: "enigmas-s4-d2",
            xp: 20,
          },
          {
            type: "numeric",
            title: "A altura escondida",
            topic: "Pitágoras no cone",
            story: "Outro cone tem a altura apagada da inscrição.",
            prompt: "Um cone tem geratriz 13 cm e raio 5 cm. Qual é a altura?",
            unit: "cm",
            shape: {
              kind: "cone",
              d: {
                r: 5,
                h: 12,
              },
            },
            id: "enigmas-s4-d3",
            xp: 20,
          },
        ],
      },
      {
        id: "s5",
        name: "Salão das Esferas",
        topic: "Esferas e semiesferas",
        challenges: [
          {
            type: "numeric",
            title: "A cúpula",
            topic: "Volume da semiesfera",
            story: "Uma cúpula semiesférica cobre o salão.",
            prompt: "Qual é o volume de uma semiesfera de raio 6 m? Use π = 3,14.",
            unit: "m³",
            shape: {
              kind: "hemisphere",
              d: {
                r: 6,
              },
            },
            id: "enigmas-s5-d1",
            xp: 20,
          },
          {
            type: "numeric",
            title: "A tigela ritual",
            topic: "Área total da semiesfera",
            story: "Uma tigela maciça semiesférica será pintada inteira, inclusive a face plana.",
            prompt: "Qual é a área total de uma semiesfera maciça de raio 4 cm? Use π = 3,14.",
            unit: "cm²",
            shape: {
              kind: "hemisphere",
              d: {
                r: 4,
              },
            },
            id: "enigmas-s5-d2",
            xp: 20,
          },
          {
            type: "numeric",
            title: "O raio oculto",
            topic: "Volume → raio",
            story: "A inscrição diz apenas: 'meu volume é 288π'.",
            prompt: "Uma esfera tem volume 288π cm³. Qual é o raio?",
            unit: "cm",
            shape: {
              kind: "sphere",
              d: {
                r: 6,
              },
            },
            id: "enigmas-s5-d3",
            xp: 20,
          },
        ],
      },
    ],
  },
  {
    id: "guardiao",
    name: "Pirâmide de Quéops",
    level: "Difícil",
    sky: "Tempestade de areia",
    tagline: "Céu escuro, mecanismos complexos e o Guardião final.",
    rooms: [
      {
        id: "s1",
        name: "Câmara dos Sólidos Compostos",
        topic: "Combinação de sólidos",
        challenges: [
          {
            type: "numeric",
            title: "O silo de grãos",
            topic: "Cilindro + cone",
            story: "Um silo de grãos é um cilindro com um telhado cônico.",
            prompt:
              "Cilindro de raio 3 m e altura 10 m, com cone de mesmo raio e altura 4 m no topo. Qual o volume total? Use π = 3,14.",
            unit: "m³",
            shape: {
              kind: "silo",
              d: {
                r: 3,
                h: 10,
                hc: 4,
              },
            },
            id: "guardiao-s1-d1",
            xp: 30,
          },
          {
            type: "numeric",
            title: "O bloco perfurado",
            topic: "Cubo − cilindro",
            story: "Um cubo de pedra foi atravessado por um túnel cilíndrico.",
            prompt:
              "Cubo de aresta 6 cm com um furo cilíndrico de raio 1 cm atravessando-o de face a face. Qual é o volume restante? Use π = 3,14.",
            unit: "cm³",
            shape: {
              kind: "cubeHole",
              d: {
                a: 6,
                r: 1,
              },
            },
            id: "guardiao-s1-d2",
            xp: 30,
          },
          {
            type: "numeric",
            title: "A torre do vigia",
            topic: "Cubo + pirâmide",
            story: "Uma torre é um cubo coroado por uma pirâmide.",
            prompt:
              "Cubo de aresta 4 m com uma pirâmide de base 4 m × 4 m e altura 3 m no topo. Qual é o volume total?",
            unit: "m³",
            shape: {
              kind: "tower",
              d: {
                a: 4,
                h: 3,
              },
            },
            id: "guardiao-s1-d3",
            xp: 30,
          },
        ],
      },
      {
        id: "s2",
        name: "Galeria dos Volumes",
        topic: "Relações entre volumes",
        challenges: [
          {
            type: "choice",
            title: "Cones e cilindros",
            topic: "Relação de volumes",
            story: "Jarros cônicos enchem um tanque cilíndrico de mesma base e altura.",
            prompt:
              "Quantos cones cheios são necessários para encher um cilindro de mesma base e mesma altura?",
            options: ["2", "3", "4", "π"],
            unit: "",
            shape: {
              kind: "cone",
              d: {
                r: 3,
                h: 6,
              },
            },
            id: "guardiao-s2-d1",
            xp: 30,
          },
          {
            type: "numeric",
            title: "A esfera presa",
            topic: "Esfera inscrita",
            story: "Uma esfera de cristal está presa exatamente dentro de uma caixa cúbica.",
            prompt:
              "Uma esfera está inscrita em um cubo de aresta 6 cm. Qual é o volume do espaço vazio? Use π = 3,14.",
            unit: "cm³",
            shape: {
              kind: "sphereInCube",
              d: {
                a: 6,
              },
            },
            id: "guardiao-s2-d2",
            xp: 30,
          },
          {
            type: "numeric",
            title: "O dobro do raio",
            topic: "Proporção",
            story: "O Guardião dobra o raio de uma esfera.",
            prompt: "Se o raio de uma esfera dobra, seu volume fica multiplicado por quanto?",
            unit: "vezes",
            shape: {
              kind: "sphere",
              d: {
                r: 4,
              },
            },
            id: "guardiao-s2-d3",
            xp: 30,
          },
        ],
      },
      {
        id: "s3",
        name: "Templo das Alturas",
        topic: "Pitágoras no espaço",
        challenges: [
          {
            type: "numeric",
            title: "A lança do faraó",
            topic: "Diagonal do paralelepípedo",
            story: "Uma lança precisa caber na diagonal de um baú.",
            prompt: "Qual é a diagonal de um paralelepípedo de 3 cm × 4 cm × 12 cm?",
            unit: "cm",
            shape: {
              kind: "box",
              d: {
                a: 3,
                b: 12,
                c: 4,
              },
            },
            id: "guardiao-s3-d1",
            xp: 30,
          },
          {
            type: "numeric",
            title: "A altura apagada",
            topic: "Altura e volume",
            story: "Uma pirâmide regular perdeu a medida de sua altura.",
            prompt:
              "Pirâmide quadrangular regular com aresta da base 8 cm e apótema 5 cm. Qual é o volume?",
            unit: "cm³",
            shape: {
              kind: "pyramid",
              d: {
                a: 8,
                h: 3,
              },
            },
            id: "guardiao-s3-d2",
            xp: 30,
          },
          {
            type: "numeric",
            title: "O cone do oráculo",
            topic: "Pitágoras + volume",
            story: "O oráculo é um cone com geratriz 17 cm e raio 8 cm.",
            prompt: "Qual é o volume desse cone? Use π = 3,14.",
            unit: "cm³",
            shape: {
              kind: "cone",
              d: {
                r: 8,
                h: 15,
              },
            },
            id: "guardiao-s3-d3",
            xp: 30,
          },
        ],
      },
      {
        id: "s4",
        name: "Câmara dos Mecanismos",
        topic: "Problemas de área e volume",
        challenges: [
          {
            type: "numeric",
            title: "O tanque de contrapeso",
            topic: "Volume parcial",
            story: "O mecanismo abre com um tanque cilíndrico parcialmente cheio.",
            prompt:
              "Tanque cilíndrico de raio 1 m e altura 2 m, com água até 75% da capacidade. Quantos litros há no tanque? Use π = 3,14.",
            unit: "L",
            shape: {
              kind: "cylinder",
              d: {
                r: 1,
                h: 2,
              },
            },
            id: "guardiao-s4-d1",
            xp: 30,
          },
          {
            type: "numeric",
            title: "A caixa sem tampa",
            topic: "Área de material",
            story: "Construa uma caixa aberta para recolher as engrenagens.",
            prompt:
              "Uma caixa sem tampa mede 10 cm × 6 cm de base e 4 cm de altura. Quanto material (área) é necessário?",
            unit: "cm²",
            shape: {
              kind: "box",
              d: {
                a: 10,
                b: 4,
                c: 6,
              },
            },
            id: "guardiao-s4-d2",
            xp: 30,
          },
          {
            type: "numeric",
            title: "As três esferas",
            topic: "Espaço livre",
            story: "Três esferas descem dentro de um tubo e travam o mecanismo.",
            prompt:
              "Um cilindro de raio 3 cm e altura 18 cm contém 3 esferas de raio 3 cm. Qual é o volume livre? Use π = 3,14.",
            unit: "cm³",
            shape: {
              kind: "cylSpheres",
              d: {
                r: 3,
              },
            },
            id: "guardiao-s4-d3",
            xp: 30,
          },
        ],
      },
      {
        id: "s5",
        name: "Salão do Guardião",
        topic: "Desafios integrados",
        challenges: [
          {
            type: "numeric",
            title: "A cápsula do tempo",
            topic: "Cilindro + semiesferas",
            story: "O Guardião guarda uma cápsula: cilindro com duas tampas semiesféricas.",
            prompt:
              "Cilindro de raio 2 cm e altura 6 cm com uma semiesfera de raio 2 cm em cada ponta. Qual é o volume total? Use π = 3,14. (arredonde para duas casas)",
            unit: "cm³",
            shape: {
              kind: "capsule",
              d: {
                r: 2,
                h: 6,
              },
            },
            id: "guardiao-s5-d1",
            xp: 30,
          },
          {
            type: "numeric",
            title: "Fundição do ouro",
            topic: "Conservação de volume",
            story: "Uma esfera de ouro é derretida e moldada em um cone.",
            prompt:
              "Uma esfera de raio 6 cm é derretida e transformada em um cone de raio 6 cm. Qual é a altura do cone?",
            unit: "cm",
            shape: {
              kind: "cone",
              d: {
                r: 6,
                h: 24,
              },
            },
            id: "guardiao-s5-d2",
            xp: 30,
          },
          {
            type: "numeric",
            title: "O coração da pirâmide",
            topic: "Cubo − pirâmide",
            story:
              "Do bloco final foi escavada uma pirâmide com base em uma face e vértice na face oposta.",
            prompt:
              "Cubo de aresta 6 m. Uma pirâmide com base igual a uma face e altura 6 m é retirada. Qual é o volume restante?",
            unit: "m³",
            shape: {
              kind: "cubePyramid",
              d: {
                a: 6,
              },
            },
            id: "guardiao-s5-d3",
            xp: 30,
          },
        ],
      },
    ],
  },
];

export const getPyramid = (id: string) => PYRAMIDS.find((p) => p.id === id);
export const ALL_CHALLENGES = PYRAMIDS.flatMap((p) => p.rooms.flatMap((r) => r.challenges));

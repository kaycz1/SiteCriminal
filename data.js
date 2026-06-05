/**
 * Jogo Investigativo: A Rosa Negra
 * Banco de Dados de Informações - Versão Híbrida 3D
 */

const GAME_DATA = {
  // Informações básicas do caso
  caseInfo: {
    title: "Caso: A Rosa Negra",
    id: "DH-2023-7789",
    date: "11 de Setembro de 2023",
    time: "03:27 (Chamado)",
    location: "Apto 402, Cidade Jardim - Rio de Janeiro",
    victim: {
      name: "Daniela Alborghetti",
      age: 23,
      occupation: "Auditora Financeira Sênior",
      status: "Óbito Confirmado no Local"
    }
  },

  // As 8 etapas simplificadas da investigação de apoio
  stages: [
    { id: 1, name: "Identificação", key: "identification" },
    { id: 2, name: "Introdução", key: "intro" },
    { id: 3, name: "Cena do Crime 3D", key: "crime_scene" },
    { id: 4, name: "Autópsia 3D", key: "autopsy" },
    { id: 5, name: "Suspeitos", key: "suspects" },
    { id: 6, name: "Interrogatórios", key: "interrogations" },
    { id: 7, name: "Celular da Vítima", key: "phone_bypass" },
    { id: 8, name: "Acusação", key: "accusation" }
  ],

  // Suspeitos com fichas detalhadas e caminhos de imagens Polaroid
  suspects: {
    suspect1: {
      id: "suspect1",
      name: "Juliana Peixoto",
      age: 24,
      role: "Colega de faculdade",
      relation: "Estudava na mesma turma que Daniela. Conhecida por ser discreta e reservada.",
      personality: "Discreta, reservada e isolou-se completamente após receber a notícia do crime.",
      motive: "Desavenças pessoais e conflitos acadêmicos em trabalhos da faculdade.",
      alibi: "Afirma que estava estudando sozinha em casa na noite do crime.",
      initialSuspicion: 30,
      photo: "suspect1.jpg",
      avatar: "👤"
    },
    suspect2: {
      id: "suspect2",
      name: "Bianca Muller",
      age: 23,
      role: "Melhor amiga",
      relation: "Uma das pessoas mais próximas da vítima. Introvertida e extremamente leal.",
      personality: "Introvertida e extremamente leal aos amigos.",
      motive: "Conhecimento de segredos da vítima ou desentendimentos ocultos.",
      alibi: "Afirma que estava em casa dormindo na noite do crime, sem testemunhas.",
      initialSuspicion: 25,
      photo: "suspect2.jpg",
      avatar: "👤"
    },
    suspect3: {
      id: "suspect3",
      name: "Giselle",
      age: 44,
      role: "Mãe",
      relation: "Mãe de Daniela, proprietária de uma conhecida empresa de cosméticos.",
      personality: "Elegante, controlada, reservada e busca evitar conflitos públicos.",
      motive: "Conflitos familiares graves e segredos profundos do passado da família.",
      alibi: "Estava em seu quarto no Hotel Palace. O check-in confirma sua entrada às 21:00.",
      initialSuspicion: 35,
      photo: "suspect3.jpg",
      avatar: "👤"
    },
    suspect4: {
      id: "suspect4",
      name: "Vitor",
      age: 20,
      role: "Irmão-postiço",
      relation: "Passou a viver com a madrasta após a morte do pai. Demonstra antipatia por Daniela.",
      personality: "Personalidade fechada, poucas amizades, costumava descrever Daniela como manipuladora.",
      motive: "Ressentimento familiar e ódio pessoal acumulado ao longo dos anos.",
      alibi: "Estava hospedado no mesmo hotel que Giselle na noite do crime, em outro quarto.",
      initialSuspicion: 50,
      photo: "suspect4.jpg",
      avatar: "👤"
    },
    suspect5: {
      id: "suspect5",
      name: "Ingrid",
      age: 25,
      role: "Colega de quarto",
      relation: "Dividia apartamento com Daniela. Foi quem encontrou o corpo da vítima.",
      personality: "Extrovertida, comunicativa, fã de true crime e documentários investigativos.",
      motive: "Conflitos de convivência, segredos compartilhados ou informações omitidas.",
      alibi: "Afirma que chegou em casa por volta das 02:00 e ligou para a polícia imediatamente.",
      initialSuspicion: 40,
      photo: "suspect5.jpg",
      avatar: "👤"
    },
    suspect6: {
      id: "suspect6",
      name: "Michel Newton",
      age: 26,
      role: "Ex-namorado",
      relation: "Músico com histórico de ciúmes intensos e comportamento agressivo.",
      personality: "Temperamento explosivo, histórico de agressão e ciúmes obsessivos.",
      motive: "Ciúmes doentios e inconformidade com o fim abrupto do relacionamento.",
      alibi: "Alega que estava bebendo sozinho no Bar do Bilhar das 21:00 às 02:00.",
      initialSuspicion: 60,
      photo: "suspect6.jpg",
      avatar: "👤"
    }
  },

  // Pistas no inventário 3D
  clues: {
    rosa_negra: {
      id: "rosa_negra",
      name: "A Rosa Negra",
      category: "fisica",
      description: "Uma rosa negra foi encontrada posicionada acima da vítima, perfeitamente alinhada ao corpo, indicando que sua colocação foi intencional. A precisão da disposição chamou a atenção dos investigadores, que acreditam que a flor possa representar uma assinatura simbólica deixada pelo possível assassino(a), sugerindo planejamento e uma possível mensagem ligada ao crime.",
      relevance: "Alta. Deixada pelo assassino para tentar despistar a polícia e sugerir que o crime foi obra de um maníaco.",
      unlocked: false
    },
    taca_quebrada: {
      id: "taca_quebrada",
      name: "Vidro",
      category: "fisica",
      description: "Um fragmento de vidro foi encontrado próximo ao corpo, apresentando bordas irregulares e vestígios avermelhados em sua superfície. Pelo formato pontiagudo e pelos danos observados, os investigadores acreditam que o objeto possa ter sido utilizado como arma durante o crime.",
      relevance: "Crítica. Contém traços químicos anômalos.",
      unlocked: false
    },
    celular_vitima: {
      id: "celular_vitima",
      name: "Celular de Daniela",
      category: "digital",
      description: "Um celular com a tela parcialmente danificada foi encontrado ao lado da cena do crime. O aparelho estava ligado no momento da perícia, exibindo a tela de bloqueio às 23:30. Os investigadores acreditam que o dispositivo possa conter informações importantes sobre os últimos acontecimentos antes do crime, como mensagens, chamadas ou registros de atividade.",
      relevance: "Crítica. O aparelho contém as últimas interações e descobertas da vítima.",
      unlocked: false
    },
    marcas_chao: {
      id: "marcas_chao",
      name: "Marcas de Fricção",
      category: "fisica",
      description: "Marcas de solados de sapato no piso vinílico da cozinha, sugerindo um breve momento de luta ou empurra-empurra.",
      relevance: "Média.",
      unlocked: false,
      details: "As marcas indicam que a vítima tentou se agarrar a alguém ou resistir a uma abordagem física antes de ingerir o veneno ou cair."
    },
    manchas_sangue: {
      id: "manchas_sangue",
      name: "Manchas no Balcão",
      category: "forense",
      description: "Substância vermelha espirrada na quina do mármore da bancada da cozinha.",
      relevance: "Alta.",
      unlocked: false,
      details: "Amostras revelam que o sangue pertence exclusivamente a Daniela, resultante do impacto de sua cabeça contra o mármore ao cair desmaiada após o envenenamento."
    },
    cadeira_derrubada: {
      id: "cadeira_derrubada",
      name: "Banqueta Tombada",
      category: "fisica",
      description: "Uma banqueta de madeira alta que ficava junto à bancada americana, caída de lado no chão.",
      relevance: "Baixa.",
      unlocked: false,
      details: "Derrubada no momento da queda da vítima ou durante a encenação da cena de luta pelo assassino."
    }
  },

  // Laudo da Autópsia (Organizado por Zonas Clínicas do Boneco 3D)
  autopsy: {
    general: "LAUDO DE NECROPSIA Nº 8821/2023 | IML<br>Vítima: Daniela Alborghetti, 23 anos.<br>Clique nos marcadores vermelhos no boneco 3D para examinar os ferimentos e lesões clínicas detalhadas.",
    markers: {
      head: {
        title: "Região Occipital (Nuca) - Contusão Traumática",
        content: "Lesão contusa leve na região occipital esquerda (nuca), compatível com choque mecânico contra superfície plana e rígida (quina de mármore) após perda de tônus postural. O impacto ocorreu de trás para frente, sugerindo que ela desmaiou e caiu de costas após ser envenenada, colidindo com a bancada antes de atingir o chão."
      },
      wrist: {
        title: "Punho Direito - Escoriações de Contenção",
        content: "Pequenas escoriações epidérmicas lineares no punho direito, sugerindo uma pegada firme e violenta por um terceiro indivíduo minutos antes da morte. Micro-fragmentos de fibras de tecido de lã cinza foram coletados sob as unhas da mão direita da vítima (reação de autodefesa física contra o agressor)."
      },
      lips: {
        title: "Lábios e Extremidades - Cianose por Asfixia Química",
        content: "Cianose intensa em extremidades corporais e coloração azulada/arroxeada marcante nos lábios. Presença de odor sutil de amêndoas amargas durante a abertura da cavidade torácica. <b>Diagnóstico:</b> Intoxicação sistêmica aguda por cianeto de potássio (veneno de ação celular rápida que bloqueia a absorção de oxigênio)."
      },
      neck: {
        title: "Pescoço — Lesão Perfurocortante",
        content: "Observa-se lesão perfurocortante localizada na região cervical anterior, aproximadamente na linha média do pescoço, medindo cerca de 3,5 cm de extensão, com bordas irregulares e sinais de infiltração hemorrágica vital.<br><br>A lesão apresenta trajetória ântero-posterior e discretamente descendente, atingindo tecidos moles cervicais profundos. As características morfológicas são compatíveis com ação produzida por objeto perfurocortante de superfície irregular."
      },
      thigh: {
        title: "Coxa Direita — Equimose (Hematoma)",
        content: "Foi identificada uma equimose (hematoma) arroxeada na face lateral da coxa direita da vítima, medindo aproximadamente 6,0 cm × 4,0 cm. A lesão é compatível com trauma contuso recente, podendo ter sido causada por impacto contra superfície rígida, empurrão ou contenção física.<br><br>A análise pericial indica que o hematoma foi produzido entre 2 e 12 horas antes do óbito, sugerindo possível contato físico ou luta corporal antes da morte.<br><br>A lesão não possui relação direta com a causa da morte, porém constitui um importante vestígio investigativo por indicar possível agressão anterior ao golpe fatal."
      }
    }
  },

  // Interrogatórios interativos
  interrogations: {
    suspect1: {
      title: "Interrogatório: Juliana Peixoto",
      conversations: [
        {
          question: "Qual era a relação acadêmica entre você e Daniela?",
          answer: "Estudávamos na mesma turma e fazíamos trabalhos de grupo. Tivemos algumas discussões sobre notas e tarefas. Ela andava muito estranha nas últimas semanas, participando de fóruns perturbadores sobre comportamento de criminosos na internet. Eu tentei alertá-la, mas ela dizia que as pessoas lá eram mais 'honestas'..."
        },
        {
          question: "Onde você estava na noite de 10 de Setembro?",
          answer: "Fiquei em casa estudando sozinha para uma prova de administração. Como moro sozinha, não tenho testemunhas que possam confirmar."
        },
        {
          question: "Nas mensagens recuperadas do celular de Daniela, você disse que ela estava 'brincando com fogo' e implorou para ela não contar 'aquilo' para as pessoas. O que você estava tentando esconder?",
          answer: "(Juliana empalidece e hesita)... Eu... nós descobrimos uma fraude em um dos projetos da faculdade que envolvia o desvio de verbas de pesquisa. A Daniela queria expor tudo na internet, mas eu implorei para ela não fazer isso, pois arruinaria minha carreira acadêmica antes mesmo de começar. Eu estava desesperada, mas eu juro que não a matei por causa disso!"
        }
      ]
    },
    suspect2: {
      title: "Interrogatório: Bianca Muller",
      conversations: [
        {
          question: "Você era a melhor amiga de Daniela. Ela vinha agindo de forma incomum ultimamente?",
          answer: "Sim, ela andava extremamente tensa e paranoica. Ela me confessou que estava recebendo mensagens anônimas com ameaças dizendo que 'nem toda história fica enterrada'. Ela suspeitava que seu ex-namorado, Michel Newton, a estivesse vigiando."
        },
        {
          question: "Onde você estava na noite de 10 de Setembro?",
          answer: "Estava na minha casa dormindo. Infelizmente moro sozinha e não tenho como provar."
        },
        {
          question: "Você enviou uma mensagem a ela no WhatsApp dizendo que 'tem gente que não gosta de você' e pedindo para ela te ligar se algo acontecesse. Você sabia de algum perigo imediato?",
          answer: "Eu sabia que o Michel estava rondando o prédio dela e que a relação deles tinha acabado muito mal. Ela também tinha desentendimentos graves com a própria mãe, Giselle, e com o irmão-postiço, Vitor, por causa de segredos do passado. Eu só queria protegê-la... sinto muito não ter insistido para que ela passasse a noite comigo."
        }
      ]
    },
    suspect3: {
      title: "Interrogatório: Giselle",
      conversations: [
        {
          question: "Qual o real motivo de sua viagem repentina para a cidade na noite do crime?",
          answer: "Vim tratar de assuntos comerciais da minha marca de cosméticos e tentar convencer Daniela a não revelar certas informações familiares sigilosas. Nós andávamos muito distantes."
        },
        {
          question: "No WhatsApp, você escreveu que estava cansada de 'apagar incêndios' e implorou para Daniela não trazer o passado de volta. A que passado você se referia?",
          answer: "(Giselle mantém a postura rígida, mas suspira)... Daniela descobriu que o capital inicial da minha empresa veio de um esquema de desvio fiscal do falecido pai dela, algo que eu escondi durante anos para proteger nossa reputação social e a herança do Vitor. Ela me chamava de hipócrita e ameaçava revelar tudo para a polícia financeira."
        },
        {
          question: "Você se encontrou com Daniela na noite do crime?",
          answer: "Não. Eu pretendia encontrá-la no dia seguinte. Fiz o check-in no Hotel Palace por volta das 21:00 e fui direto para o meu quarto. O check-in está registrado e as câmeras do hotel confirmam que não saí de lá."
        }
      ]
    },
    suspect4: {
      title: "Interrogatório: Vitor",
      conversations: [
        {
          question: "É verdade que você demonstrava grande antipatia por Daniela?",
          answer: "Sim, ela era insuportável, egoísta e vivia chantageando a minha madrasta, Giselle, ameaçando expor a origem do dinheiro da família. Ela queria destruir a única herança que meu pai me deixou."
        },
        {
          question: "Onde você estava na noite do crime?",
          answer: "Eu estava no meu quarto no Hotel Palace. Viajei com a Giselle e fiz o check-in por volta das 21:15. Fui direto dormir e só soube da tragédia na manhã seguinte."
        },
        {
          question: "Você mandou mensagem para ela no WhatsApp perguntando se ela iria ao hotel. Por que queria encontrá-la?",
          answer: "Eu queria resolver a situação de uma vez por todas. Queria dizer na cara dela para deixar a Giselle em paz e parar com as chantagens familiares. Mas ela me respondeu dizendo que apenas 'tentaria ir' e acabou não aparecendo."
        }
      ]
    },
    suspect5: {
      title: "Interrogatório: Ingrid",
      conversations: [
        {
          question: "Como você encontrou o corpo de Daniela?",
          answer: "Eu saí para jantar com amigos e retornei por volta das 02:00. A porta do apartamento estava destrancada. Quando entrei na cozinha, vi a banqueta derrubada, fragmentos de vidro no chão e Daniela caída. Entrei em pânico e liguei imediatamente para o 190."
        },
        {
          question: "No WhatsApp, você confrontou Daniela sobre ter ficado com seu melhor amigo, Lucas, e disse que ela gostava de 'testar os limites das pessoas'. O clima entre vocês estava hostil?",
          answer: "(Ingrid parece desconfortável)... Sim, eu fiquei com muita raiva dela. Ela sabia o quanto o Lucas era importante para mim e mesmo assim ficou com ele pelas minhas costas, agindo como se não importasse. Mas eu jamais faria mal físico a ela por causa disso. Foi apenas uma briga boba de convivência."
        },
        {
          question: "Você mandou uma mensagem avisando: 'toma cuidado com as coisas que você fala'. Daniela perguntou se era uma ameaça. O que você quis dizer com isso?",
          answer: "Não era uma ameaça física minha! Eu quis alertar ela porque ela andava muito arrogante e falava de forma provocativa com pessoas perigosas, como o ex-namorado dela, Michel, que tem histórico de agressão, e outras pessoas na internet. Eu sabia que a atitude dela de achar que 'consequências nunca chegam' acabaria atraindo problemas."
        }
      ]
    },
    suspect6: {
      title: "Interrogatório: Michel Newton",
      conversations: [
        {
          question: "Seu relacionamento com Daniela terminou de forma conturbada. Havia uma medida protetiva contra você, correto?",
          answer: "Sim, ela terminou comigo repentinamente e me bloqueou de tudo. Eu admito que perdi o controle algumas vezes e fui atrás dela para cobrar explicações, pois estava inconformado. Eu tenho um temperamento explosivo, mas eu a amava!"
        },
        {
          question: "Onde você estava na noite de 10 de Setembro?",
          answer: "Estava bebendo sozinho no Bar do Bilhar das 21:00 às 02:00. O barman estava muito ocupado para notar minha presença e as câmeras do local estavam com problemas técnicos, mas eu estava lá!"
        },
        {
          question: "Confrontamos os dados do celular de Daniela. Às 22:20 daquela noite, você enviou mensagens dizendo: 'Eu já estou aqui no portão. Abre essa porta ou eu vou entrar de qualquer jeito'. Você mentiu sobre o seu álibi?",
          answer: "(Michel começa a suar frio e gagueja)... Eu... c-como vocês conseguiram essas mensagens?... Tá bem, eu confesso! Eu fui até lá sim! Eu vi quando a Ingrid saiu e mandei as mensagens. Mas eu juro por Deus que ela não abriu a porta! Eu fiquei esmurrando o portão, mas ela ameaçou ligar para a polícia e eu fui embora com raiva logo em seguida! Eu não entrei no apartamento!"
        }
      ]
    }
  },

  // Dados liberados do Smartphone de Daniela após desbloquear com 2023
  phoneBypass: {
    solution: "2023", // PIN
    whatsapp: {
      suspect1: [
        { type: "date", text: "10 de Setembro de 2023" },
        { time: "20:14", sender: "Juliana", text: "Você falou sério aquilo que me disse hoje?", isMe: false },
        { time: "20:16", sender: "Daniela", text: "Sobre o quê?", isMe: true },
        { time: "20:17", sender: "Juliana", text: "Você sabe muito bem.", isMe: false },
        { time: "20:18", sender: "Daniela", text: "Não estou a fim de jogar adivinhação.", isMe: true },
        { time: "20:20", sender: "Juliana", text: "Sobre contar aquilo para as pessoas.", isMe: false },
        { time: "20:21", sender: "Daniela", text: "Ainda estou pensando.", isMe: true },
        { time: "20:22", sender: "Juliana", text: "Daniela, por favor.", isMe: false },
        { time: "20:23", sender: "Daniela", text: "Por favor o quê?", isMe: true },
        { time: "20:24", sender: "Juliana", text: "Não faz isso.", isMe: false },
        { time: "20:25", sender: "Daniela", text: "Você está muito nervosa.", isMe: true },
        { time: "20:25", sender: "Juliana", text: "Porque isso não afeta só você.", isMe: false },
        { time: "20:27", sender: "Daniela", text: "Talvez algumas verdades precisem aparecer.", isMe: true },
        { time: "20:28", sender: "Juliana", text: "Nem tudo precisa ser exposto.", isMe: false },
        { time: "20:29", sender: "Daniela", text: "Fácil falar quando não é você carregando isso.", isMe: true },
        { time: "20:45", sender: "Juliana", text: "Você mudou muito.", isMe: false },
        { time: "20:46", sender: "Daniela", text: "As pessoas mudam.", isMe: true },
        { time: "20:47", sender: "Juliana", text: "Não foi isso que eu quis dizer.", isMe: false },
        { time: "20:48", sender: "Daniela", text: "Então diga.", isMe: true },
        { time: "20:49", sender: "Juliana", text: "Você parece gostar de ver as pessoas desesperadas.", isMe: false },
        { time: "20:50", sender: "Daniela", text: "Nossa.", isMe: true },
        { time: "20:51", sender: "Juliana", text: "É verdade.", isMe: false },
        { time: "20:52", sender: "Daniela", text: "Talvez eu só tenha parado de proteger todo mundo.", isMe: true },
        { time: "20:53", sender: "Juliana", text: "Você está brincando com fogo.", isMe: false },
        { time: "20:54", sender: "Daniela", text: "Engraçado você dizer isso.", isMe: true },
        { time: "21:03", sender: "Juliana", text: "Você ainda entra naqueles fóruns estranhos?", isMe: false },
        { time: "21:04", sender: "Daniela", text: "Às vezes.", isMe: true },
        { time: "21:05", sender: "Juliana", text: "Isso não é normal.", isMe: false },
        { time: "21:06", sender: "Daniela", text: "Lá as pessoas são mais honestas do que na vida real.", isMe: true },
        { time: "21:07", sender: "Juliana", text: "São fóruns sobre assassinos.", isMe: false },
        { time: "21:08", sender: "Daniela", text: "São fóruns sobre comportamento humano.", isMe: true },
        { time: "21:09", sender: "Juliana", text: "Você sempre encontra uma forma de justificar tudo.", isMe: false },
        { time: "22:11", sender: "Juliana", text: "Promete que não vai fazer nenhuma loucura?", isMe: false },
        { time: "22:13", sender: "Daniela", text: "Que tipo de loucura?", isMe: true },
        { time: "22:14", sender: "Juliana", text: "Você sabe do que estou falando.", isMe: false },
        { time: "22:14", sender: "Daniela", text: "Relaxa.", isMe: true },
        { time: "22:15", sender: "Juliana", text: "Não estou relaxada.", isMe: false },
        { time: "22:16", sender: "Daniela", text: "Você se preocupa demais.", isMe: true },
        { time: "22:17", sender: "Juliana", text: "E você de menos.", isMe: false },
        { time: "22:18", sender: "Daniela", text: "Boa noite, Ju.", isMe: true },
        { time: "22:18", sender: "Juliana", text: "Boa noite.", isMe: false }
      ],
      suspect2: [
        { type: "date", text: "6 de Setembro de 2023" },
        { time: "21:04", sender: "Bianca", text: "Chegou em casa?", isMe: false },
        { time: "21:05", sender: "Daniela", text: "Cheguei.", isMe: true },
        { time: "21:05", sender: "Bianca", text: "E aí? Como foi?", isMe: false },
        { time: "21:06", sender: "Daniela", text: "Estranho.", isMe: true },
        { time: "21:07", sender: "Bianca", text: "O jantar com sua mãe?", isMe: false },
        { time: "21:08", sender: "Daniela", text: "Também.", isMe: true },
        { time: "21:08", sender: "Bianca", text: "\"Também\"?", isMe: false },
        { time: "21:09", sender: "Daniela", text: "Depois eu te conto.", isMe: true },
        { time: "21:15", sender: "Bianca", text: "Você anda escondendo muita coisa.", isMe: false },
        { time: "21:16", sender: "Daniela", text: "Talvez.", isMe: true },
        { time: "21:17", sender: "Bianca", text: "Isso me preocupa.", isMe: false },
        { time: "21:18", sender: "Daniela", text: "Você se preocupa demais.", isMe: true },
        { time: "21:19", sender: "Bianca", text: "Alguém precisa.", isMe: false },
        { time: "21:20", sender: "Daniela", text: "Eu me viro.", isMe: true },
        { time: "21:21", sender: "Bianca", text: "Nem sempre.", isMe: false },
        { time: "21:22", sender: "Daniela", text: "Recebi mais uma mensagem.", isMe: true },
        { time: "21:23", sender: "Bianca", text: "Daquela conta estranha?", isMe: false },
        { time: "21:24", sender: "Daniela", text: "Sim.", isMe: true },
        { time: "21:24", sender: "Bianca", text: "O que dizia?", isMe: false },
        { time: "21:25", sender: "Daniela", text: "\"Nem toda história fica enterrada.\"", isMe: true },
        { time: "21:26", sender: "Bianca", text: "Isso não é normal.", isMe: false },
        { time: "21:27", sender: "Daniela", text: "Provavelmente alguém tentando me assustar.", isMe: true },
        { time: "21:28", sender: "Bianca", text: "Ou alguém querendo te avisar de alguma coisa.", isMe: false },
        { time: "21:29", sender: "Daniela", text: "Você anda vendo muitos documentários.", isMe: true },
        { time: "21:31", sender: "Bianca", text: "Você mostrou isso para a polícia?", isMe: false },
        { time: "21:32", sender: "Daniela", text: "Claro que não.", isMe: true },
        { time: "21:33", sender: "Bianca", text: "Deveria.", isMe: false },
        { time: "21:34", sender: "Daniela", text: "Não vou fazer um boletim de ocorrência por causa de mensagens anônimas.", isMe: true },
        { time: "21:35", sender: "Bianca", text: "Você não sabe quem está mandando.", isMe: false },
        { time: "21:36", sender: "Daniela", text: "Nem você.", isMe: true },
        { time: "21:40", sender: "Bianca", text: "Dani...", isMe: false },
        { time: "21:41", sender: "Daniela", text: "O quê?", isMe: true },
        { time: "21:42", sender: "Bianca", text: "Tem gente que não gosta de você.", isMe: false },
        { time: "21:43", sender: "Daniela", text: "Nossa, obrigada pela novidade.", isMe: true },
        { time: "21:44", sender: "Bianca", text: "Estou falando sério.", isMe: false },
        { time: "21:45", sender: "Daniela", text: "Eu também.", isMe: true },
        { time: "21:46", sender: "Bianca", text: "Promete que vai tomar cuidado?", isMe: false },
        { time: "21:47", sender: "Daniela", text: "Prometo.", isMe: true },
        { time: "22:13", sender: "Bianca", text: "Se acontecer qualquer coisa, me liga.", isMe: false },
        { time: "22:14", sender: "Daniela", text: "Você fala como se eu estivesse em perigo.", isMe: true },
        { time: "22:15", sender: "Bianca", text: "Só estou sendo sua amiga.", isMe: false },
        { time: "22:16", sender: "Daniela", text: "Eu sei ❤️", isMe: true },
        { time: "22:17", sender: "Bianca", text: "Boa noite.", isMe: false },
        { time: "22:18", sender: "Daniela", text: "Boa noite, Bia.", isMe: true }
      ],
      suspect3: [
        { type: "date", text: "10 de Setembro de 2023" },
        { time: "16:08", sender: "Mãe", text: "Chegamos na cidade.", isMe: false },
        { time: "16:09", sender: "Daniela", text: "Já?", isMe: true },
        { time: "16:10", sender: "Mãe", text: "Seu irmão quis vir junto.", isMe: false },
        { time: "16:11", sender: "Daniela", text: "Que ótimo...", isMe: true },
        { time: "16:11", sender: "Mãe", text: "Daniela.", isMe: false },
        { time: "16:12", sender: "Daniela", text: "O quê?", isMe: true },
        { time: "16:13", sender: "Mãe", text: "Não começa.", isMe: false },
        { time: "16:14", sender: "Daniela", text: "Eu não comecei nada.", isMe: true },
        { time: "16:15", sender: "Mãe", text: "Então vamos manter a paz pelo menos uma vez.", isMe: false },
        { time: "16:16", sender: "Daniela", text: "Depende dele.", isMe: true },
        { time: "16:17", sender: "Mãe", text: "Depende de vocês dois.", isMe: false },
        { time: "18:42", sender: "Mãe", text: "Vamos jantar hoje?", isMe: false },
        { time: "18:43", sender: "Daniela", text: "Posso.", isMe: true },
        { time: "18:44", sender: "Mãe", text: "Sem discussões.", isMe: false },
        { time: "18:45", sender: "Daniela", text: "Sem promessas.", isMe: true },
        { time: "18:45", sender: "Mãe", text: "Você acha engraçado?", isMe: false },
        { time: "18:46", sender: "Daniela", text: "Não.", isMe: true },
        { time: "18:48", sender: "Mãe", text: "Porque eu estou cansada de apagar incêndios nessa família.", isMe: false },
        { time: "18:50", sender: "Daniela", text: "Talvez porque existam coisas que nunca deveriam ter sido escondidas.", isMe: true },
        { time: "18:52", sender: "Mãe", text: "Daniela...", isMe: false },
        { time: "18:53", sender: "Daniela", text: "O quê?", isMe: true },
        { time: "18:53", sender: "Mãe", text: "Não faça isso.", isMe: false },
        { time: "18:54", sender: "Daniela", text: "Fazer o quê?", isMe: true },
        { time: "18:55", sender: "Mãe", text: "Trazer o passado de volta.", isMe: false },
        { time: "19:01", sender: "Daniela", text: "Você sabe que uma hora todo mundo vai descobrir.", isMe: true },
        { time: "19:02", sender: "Mãe", text: "Não por você.", isMe: false },
        { time: "19:03", sender: "Daniela", text: "Você ainda está tentando controlar tudo.", isMe: true },
        { time: "19:04", sender: "Mãe", text: "Estou tentando proteger nossa família.", isMe: false },
        { time: "19:04", sender: "Daniela", text: "Proteger ou esconder?", isMe: true },
        { time: "19:05", sender: "Mãe", text: "Chega.", isMe: false },
        { time: "19:05", sender: "Daniela", text: "Você sempre faz isso quando não tem resposta.", isMe: true },
        { time: "19:06", sender: "Mãe", text: "Conversaremos pessoalmente.", isMe: false },
        { time: "22:36", sender: "Mãe", text: "Chegou em casa?", isMe: false },
        { time: "22:37", sender: "Daniela", text: "Ainda não.", isMe: true },
        { time: "22:38", sender: "Mãe", text: "Me avise quando chegar.", isMe: false },
        { time: "22:39", sender: "Daniela", text: "Pode deixar.", isMe: true },
        { time: "22:40", sender: "Mãe", text: "Boa noite, filha.", isMe: false },
        { time: "22:41", sender: "Daniela", text: "Boa noite.", isMe: true }
      ],
      suspect4: [
        { type: "date", text: "10 de Setembro de 2023" },
        { time: "17:12", sender: "Daniela", text: "Vocês já chegaram?", isMe: true },
        { time: "17:15", sender: "Vitor", text: "Sim.", isMe: false },
        { time: "17:15", sender: "Daniela", text: "E a viagem?", isMe: true },
        { time: "17:16", sender: "Vitor", text: "Normal.", isMe: false },
        { time: "17:17", sender: "Daniela", text: "Tá no hotel?", isMe: true },
        { time: "17:17", sender: "Vitor", text: "Tô.", isMe: false },
        { time: "17:18", sender: "Daniela", text: "Beleza.", isMe: true },
        { time: "20:41", sender: "Vitor", text: "Você vem mesmo?", isMe: false },
        { time: "20:42", sender: "Daniela", text: "Vou tentar.", isMe: true },
        { time: "20:42", sender: "Vitor", text: "👍", isMe: false },
        { time: "20:43", sender: "Daniela", text: "Nossa, que empolgação.", isMe: true },
        { time: "20:43", sender: "Vitor", text: "😐", isMe: false },
        { time: "20:44", sender: "Daniela", text: "kkkk", isMe: true }
      ],
      suspect5: [
        { type: "date", text: "10 de Setembro de 2023" },
        { time: "18:27", sender: "Ingrid", text: "Você vai sair hoje?", isMe: false },
        { time: "18:28", sender: "Daniela", text: "Vou.", isMe: true },
        { time: "18:29", sender: "Ingrid", text: "Com quem?", isMe: false },
        { time: "18:30", sender: "Daniela", text: "Curiosa.", isMe: true },
        { time: "18:30", sender: "Ingrid", text: "Estou perguntando.", isMe: false },
        { time: "18:31", sender: "Daniela", text: "Talvez eu conte depois.", isMe: true },
        { time: "18:32", sender: "Ingrid", text: "Ou talvez não exista ninguém.", isMe: false },
        { time: "18:33", sender: "Daniela", text: "Nossa, que mau humor.", isMe: true },
        { time: "18:34", sender: "Ingrid", text: "Você anda estranha faz semanas.", isMe: false },
        { time: "18:35", sender: "Daniela", text: "Todo mundo fala isso.", isMe: true },
        { time: "18:36", sender: "Ingrid", text: "Porque é verdade.", isMe: false },
        { time: "18:58", sender: "Ingrid", text: "Posso te perguntar uma coisa?", isMe: false },
        { time: "18:59", sender: "Daniela", text: "Depende.", isMe: true },
        { time: "19:00", sender: "Ingrid", text: "Você ficou com o Lucas?", isMe: false },
        { time: "19:00", sender: "Daniela", text: "Quem te contou isso?", isMe: true },
        { time: "19:01", sender: "Ingrid", text: "Então ficou.", isMe: false },
        { time: "19:01", sender: "Daniela", text: "Ingrid...", isMe: true },
        { time: "19:02", sender: "Ingrid", text: "Era meu melhor amigo.", isMe: false },
        { time: "19:02", sender: "Daniela", text: "Vocês nem estavam se falando mais.", isMe: true },
        { time: "19:03", sender: "Ingrid", text: "Não muda nada.", isMe: false },
        { time: "19:03", sender: "Daniela", text: "Eu não fiz por mal.", isMe: true },
        { time: "19:04", sender: "Ingrid", text: "Você nunca faz por mal, né?", isMe: false },
        { time: "19:04", sender: "Daniela", text: "Você está exagerando.", isMe: true },
        { time: "19:05", sender: "Ingrid", text: "Estou?", isMe: false },
        { time: "19:05", sender: "Daniela", text: "Sim.", isMe: true },
        { time: "19:06", sender: "Ingrid", text: "Às vezes parece que você gosta de testar os limites das pessoas.", isMe: false },
        { time: "19:07", sender: "Daniela", text: "Drama.", isMe: true },
        { time: "19:07", sender: "Ingrid", text: "Não é drama.", isMe: false },
        { time: "19:08", sender: "Daniela", text: "Já passou.", isMe: true },
        { time: "19:08", sender: "Ingrid", text: "Para você.", isMe: false },
        { time: "19:11", sender: "Ingrid", text: "Você já percebeu quantas pessoas se afastaram de você ultimamente?", isMe: false },
        { time: "19:12", sender: "Daniela", text: "Nem todas as amizades duram para sempre.", isMe: true },
        { time: "19:13", sender: "Ingrid", text: "Não estou falando só de amizades.", isMe: false },
        { time: "19:14", sender: "Daniela", text: "Então fala logo o que quer dizer.", isMe: true },
        { time: "19:15", sender: "Ingrid", text: "Nada.", isMe: false },
        { time: "19:15", sender: "Daniela", text: "Achei.", isMe: true },
        { time: "19:20", sender: "Ingrid", text: "Só toma cuidado.", isMe: false },
        { time: "19:21", sender: "Daniela", text: "Com o quê?", isMe: true },
        { time: "19:22", sender: "Ingrid", text: "Com as coisas que você fala.", isMe: false },
        { time: "19:23", sender: "Daniela", text: "Isso foi uma ameaça?", isMe: true },
        { time: "19:24", sender: "Ingrid", text: "Claro que não.", isMe: false },
        { time: "19:24", sender: "Daniela", text: "Então pareceu.", isMe: true },
        { time: "19:25", sender: "Ingrid", text: "Estou tentando te dar um conselho.", isMe: false },
        { time: "19:26", sender: "Daniela", text: "Que fofa.", isMe: true },
        { time: "19:26", sender: "Ingrid", text: "Você é impossível.", isMe: false },
        { time: "22:47", sender: "Ingrid", text: "Vou sair agora.", isMe: false },
        { time: "22:48", sender: "Daniela", text: "Boa sorte no encontro.", isMe: true },
        { time: "22:48", sender: "Ingrid", text: "Obrigada.", isMe: false },
        { time: "22:49", sender: "Daniela", text: "Depois me conta se ele é bonito.", isMe: true },
        { time: "22:50", sender: "Ingrid", text: "Se você estiver acordada quando eu voltar.", isMe: false },
        { time: "22:51", sender: "Daniela", text: "Estarei.", isMe: true },
        { time: "22:52", sender: "Ingrid", text: "Boa noite, Dani.", isMe: false },
        { time: "22:53", sender: "Daniela", text: "Boa noite ❤️", isMe: true }
      ],
      suspect6: [
        { type: "date", text: "8 de Setembro de 2023" },
        { time: "22:17", sender: "Michael", text: "Você vai continuar me ignorando?", isMe: false },
        { time: "22:21", sender: "Daniela", text: "Não estou te ignorando, Michael.", isMe: true },
        { time: "22:21", sender: "Michael", text: "Engraçado. Porque parece.", isMe: false },
        { time: "22:23", sender: "Daniela", text: "A gente terminou há meses. Não preciso responder na mesma hora.", isMe: true },
        { time: "22:24", sender: "Michael", text: "Mas você responde todo mundo menos eu.", isMe: false },
        { time: "22:25", sender: "Daniela", text: "Você tá vendo? É exatamente por isso que eu terminei.", isMe: true },
        { time: "22:26", sender: "Michael", text: "Porque eu me importava?", isMe: false },
        { time: "22:27", sender: "Daniela", text: "Porque você queria controlar tudo.", isMe: true },
        { time: "22:28", sender: "Michael", text: "Você sempre exagera.", isMe: false },
        { time: "22:30", sender: "Daniela", text: "Não vou discutir isso de novo.", isMe: true },
        { time: "22:31", sender: "Michael", text: "Então me explica por que estava com aquele cara na faculdade.", isMe: false },
        { time: "22:32", sender: "Daniela", text: "Isso não é da sua conta.", isMe: true },
        { time: "22:33", sender: "Michael", text: "Claro que é.", isMe: false },
        { time: "22:34", sender: "Daniela", text: "Não, não é.", isMe: true },
        { time: "22:35", sender: "Michael", text: "Você me substituiu rápido.", isMe: false },
        { time: "22:36", sender: "Daniela", text: "Michael, segue sua vida.", isMe: true },
        { time: "22:37", sender: "Michael", text: "Talvez eu tentasse se você parasse de aparecer em todo lugar.", isMe: false },
        { time: "22:38", sender: "Daniela", text: "A cidade não gira ao seu redor.", isMe: true },
        { time: "22:39", sender: "Michael", text: "Nem ao seu.", isMe: false },
        { time: "22:40", sender: "Daniela", text: "Boa noite.", isMe: true },
        { type: "date", text: "9 de Setembro de 2023" },
        { time: "18:54", sender: "Michael", text: "A gente precisa conversar pessoalmente.", isMe: false },
        { time: "18:55", sender: "Daniela", text: "Não.", isMe: true },
        { time: "18:55", sender: "Michael", text: "Cinco minutos.", isMe: false },
        { time: "18:56", sender: "Daniela", text: "Já falei tudo o que tinha pra falar.", isMe: true },
        { time: "18:56", sender: "Michael", text: "Tem coisas que você esconde de todo mundo.", isMe: false },
        { time: "18:57", sender: "Daniela", text: "O que isso significa?", isMe: true },
        { time: "18:57", sender: "Michael", text: "Você sabe.", isMe: false },
        { time: "18:58", sender: "Daniela", text: "Se for ameaça, estou tirando print.", isMe: true },
        { time: "18:58", sender: "Michael", text: "Não é ameaça.", isMe: false },
        { time: "18:59", sender: "Daniela", text: "Então para de agir como se fosse.", isMe: true },
        { time: "19:00", sender: "Michael", text: "Só toma cuidado com as pessoas em quem você confia.", isMe: false },
        { time: "19:00", sender: "Daniela", text: "Tá ficando estranho.", isMe: true },
        { time: "19:01", sender: "Michael", text: "Talvez você devesse se preocupar mais com o que fez do que comigo.", isMe: false },
        { time: "19:02", sender: "Daniela", text: "Adeus, Michael.", isMe: true },
        { time: "19:03", sender: "Michael", text: "A gente ainda vai conversar.", isMe: false },
        { type: "date", text: "10 de Setembro de 2023" },
        { time: "22:10", sender: "Michael", text: "Daniela, responde. Eu sei que você está sozinha em casa. A Ingrid acabou de sair de carro.", isMe: false },
        { time: "22:12", sender: "Michael", text: "Você não vai se livrar de mim tão fácil.", isMe: false },
        { time: "22:15", sender: "Daniela", text: "Para de vigiar a minha casa, Michael! Eu vou ligar para a polícia agora mesmo. Eu tenho uma medida protetiva em andamento!", isMe: true },
        { time: "22:17", sender: "Michael", text: "Você acha que um papel de merda vai me parar? Eu vi você na faculdade com aquele cara.", isMe: false },
        { time: "22:18", sender: "Daniela", text: "Não ouse vir aqui. Vou te bloquear e chamar a portaria.", isMe: true },
        { time: "22:20", sender: "Michael", text: "Pode bloquear. Eu já estou aqui no portão. Abre essa porta ou eu vou entrar de qualquer jeito.", isMe: false },
        { time: "22:22", sender: "Daniela", text: "Estou ligando para a polícia agora.", isMe: true }
      ],
      unknown: [
        { type: "date", text: "27 de Agosto de 2023" },
        { time: "21:05", sender: "Desconhecido", text: "Você já contou para alguém o que fez com a Ingrid?", isMe: false },
        { time: "21:07", sender: "Daniela", text: "Quem é você?", isMe: true },
        { time: "21:08", sender: "Desconhecido", text: "Responde a pergunta.", isMe: false },
        { time: "21:09", sender: "Daniela", text: "Não sei do que está falando.", isMe: true },
        { time: "21:11", sender: "Desconhecido", text: "Você ficou com o melhor amigo dela sabendo que isso destruiria a amizade dos dois.", isMe: false },
        { time: "21:12", sender: "Daniela", text: "Isso não é da sua conta.", isMe: true },
        { time: "21:13", sender: "Desconhecido", text: "Mas aconteceu.", isMe: false },
        { type: "date", text: "29 de Agosto de 2023" },
        { time: "21:30", sender: "Desconhecido", text: "E sobre sua mãe?", isMe: false },
        { time: "21:31", sender: "Daniela", text: "Para.", isMe: true },
        { time: "21:32", sender: "Desconhecido", text: "Ela sabe de tudo?", isMe: false },
        { time: "21:33", sender: "Daniela", text: "Não.", isMe: true },
        { time: "21:34", sender: "Desconhecido", text: "Achei que não.", isMe: false },
        { time: "21:35", sender: "Desconhecido", text: "Você deixou ela acreditar em uma versão conveniente durante anos.", isMe: false },
        { time: "21:37", sender: "Daniela", text: "Você não entende nada da minha vida.", isMe: true },
        { time: "21:39", sender: "Desconhecido", text: "Entendo mais do que você imagina.", isMe: false },
        { type: "date", text: "31 de Agosto de 2023" },
        { time: "19:15", sender: "Desconhecido", text: "Você gosta de falar sobre justiça na internet.", isMe: false },
        { time: "19:17", sender: "Daniela", text: "E daí?", isMe: true },
        { time: "19:18", sender: "Desconhecido", text: "Defendendo assassinos.", isMe: false },
        { time: "19:19", sender: "Desconhecido", text: "Tratando criminosos como vítimas.", isMe: false },
        { time: "19:21", sender: "Daniela", text: "Você está exagerando.", isMe: true },
        { time: "19:23", sender: "Desconhecido", text: "Você passava horas defendendo pessoas que destruíram vidas.", isMe: false },
        { time: "19:24", sender: "Daniela", text: "Era só discussão.", isMe: true },
        { time: "19:26", sender: "Desconhecido", text: "Para você sempre é \"só\".", isMe: false },
        { type: "date", text: "2 de Setembro de 2023" },
        { time: "20:02", sender: "Desconhecido", text: "Você sabe qual é o problema?", isMe: false },
        { time: "20:03", sender: "Daniela", text: "Qual?", isMe: true },
        { time: "20:05", sender: "Desconhecido", text: "Você acha que as consequências nunca chegam.", isMe: false },
        { time: "20:06", sender: "Daniela", text: "Nossa.", isMe: true },
        { time: "20:07", sender: "Desconhecido", text: "Você magoa alguém.", isMe: false },
        { time: "20:08", sender: "Desconhecido", text: "Pede desculpas.", isMe: false },
        { time: "20:09", sender: "Desconhecido", text: "E segue em frente.", isMe: false },
        { time: "20:11", sender: "Desconhecido", text: "Enquanto os outros ficam com os pedaços.", isMe: false },
        { type: "date", text: "4 de Setembro de 2023" },
        { time: "22:40", sender: "Desconhecido", text: "Você já pensou no seu irmão?", isMe: false },
        { time: "22:41", sender: "Daniela", text: "Não fala dele.", isMe: true },
        { time: "22:42", sender: "Desconhecido", text: "Por quê?", isMe: false },
        { time: "22:43", sender: "Daniela", text: "Porque não.", isMe: true },
        { time: "22:45", sender: "Desconhecido", text: "Você sempre tratou os sentimentos dos outros como se fossem exagero.", isMe: false },
        { time: "22:46", sender: "Daniela", text: "Chega.", isMe: true },
        { type: "date", text: "6 de Setembro de 2023" },
        { time: "21:50", sender: "Desconhecido", text: "Você tem medo de quê?", isMe: false },
        { time: "21:51", sender: "Daniela", text: "De nada.", isMe: true },
        { time: "21:52", sender: "Desconhecido", text: "Mentira.", isMe: false },
        { time: "21:53", sender: "Desconhecido", text: "Você tem medo que alguém conte quem você realmente é.", isMe: false },
        { time: "21:54", sender: "Daniela", text: "Quem eu realmente sou?", isMe: true },
        { time: "21:56", sender: "Desconhecido", text: "Uma pessoa que faz escolhas e deixa os outros lidarem com as consequências.", isMe: false },
        { type: "date", text: "8 de Setembro de 2023" },
        { time: "22:01", sender: "Desconhecido", text: "Você se lembra do que disse uma vez?", isMe: false },
        { time: "22:02", sender: "Daniela", text: "Não.", isMe: true },
        { time: "22:04", sender: "Desconhecido", text: "\"Se ninguém descobrir, não importa.\"", isMe: false },
        { time: "22:05", sender: "Daniela", text: "Eu nunca disse isso.", isMe: true },
        { time: "22:06", sender: "Desconhecido", text: "Disse.", isMe: false },
        { time: "22:08", sender: "Desconhecido", text: "E foi aí que percebi que você nunca mudaria.", isMe: false },
        { type: "date", text: "10 de Setembro de 2023" },
        { time: "23:11", sender: "Desconhecido", text: "Duas semanas.", isMe: false },
        { time: "23:11", sender: "Daniela", text: "O quê?", isMe: true },
        { time: "23:12", sender: "Desconhecido", text: "Duas semanas tentando fazer você admitir.", isMe: false },
        { time: "23:12", sender: "Daniela", text: "Admitir o quê?", isMe: true },
        { time: "23:13", sender: "Desconhecido", text: "Que você machucou pessoas.", isMe: false },
        { time: "23:13", sender: "Desconhecido", text: "Que mentiu.", isMe: false },
        { time: "23:14", sender: "Desconhecido", text: "Que escondeu coisas.", isMe: false },
        { time: "23:14", sender: "Desconhecido", text: "Que nunca se importou com as consequências.", isMe: false },
        { time: "23:15", sender: "Daniela", text: "Você não sabe nada sobre mim.", isMe: true },
        { time: "23:15", sender: "Desconhecido", text: "Não?", isMe: false },
        { time: "23:16", sender: "Desconhecido", text: "Eu sei da Ingrid.", isMe: false },
        { time: "23:16", sender: "Desconhecido", text: "Eu sei das mentiras que você contou para sua mãe.", isMe: false },
        { time: "23:17", sender: "Desconhecido", text: "Eu sei das pessoas que você descartou quando deixaram de ser úteis.", isMe: false },
        { time: "23:17", sender: "Desconhecido", text: "Eu sei quem você é quando ninguém está olhando.", isMe: false },
        { time: "23:18", sender: "Daniela", text: "Quem é você?", isMe: true },
        { time: "23:18", sender: "Desconhecido", text: "Alguém que cansou de ver você escapar.", isMe: false },
        { time: "23:19", sender: "Daniela", text: "Você está me ameaçando?", isMe: true },
        { time: "23:19", sender: "Desconhecido", text: "Não.", isMe: false },
        { time: "23:20", sender: "Desconhecido", text: "Estou avisando.", isMe: false },
        { time: "23:54", sender: "Desconhecido", text: "Você passou anos controlando a narrativa.", isMe: false },
        { time: "23:54", sender: "Desconhecido", text: "Escolhendo o que as pessoas podiam saber.", isMe: false },
        { time: "23:54", sender: "Desconhecido", text: "Escolhendo quais verdades deveriam morrer.", isMe: false },
        { time: "23:54", sender: "Desconhecido", text: "Mas segredos não desaparecem.", isMe: false },
        { time: "23:54", sender: "Desconhecido", text: "Eles apodrecem.", isMe: false },
        { time: "23:54", sender: "Desconhecido", text: "E, quando finalmente vêm à tona...", isMe: false },
        { time: "23:54", sender: "Desconhecido", text: "Levam tudo junto.", isMe: false },
        { type: "date", text: "Mensagem visualizada às 23:55" }
      ]
    },
    files: {
      ocorrencia: `<b>📁 OCORRENCIA_POLICIAL_AMEACAS.PDF</b><br>
<i>Data de Registro: 08/09/2023</i><br><br>
Ocorrência registrada por Daniela Alborghetti contra o ex-companheiro <b>Michel Newton</b> por assédio, perseguição e ameaças de agressão física após o término do namoro. Medida protetiva de urgência estava em andamento.`,
      laudo_botanica: `<b>📁 RELATÓRIO_QUÍMICO_EVIDENCIA_ROSA.PDF</b><br>
<i>Emitido por Forense Botânica Geral</i><br><br>
- A flor depositada sobre o peito da vítima é uma rosa natural tingida de preto com tinta spray acrílica.<br>
- **ANÁLISE DE SOLO:** Traços do adubo patenteado <b>"Phos-Grow 4"</b> foram achados nas folhas. Este adubo foi proibido pelo IBAMA em 2022. A única estufa com estoque residual licenciado na cidade é a <b>Floricultura Flor de Newton</b>, pertencente à família do suspeito <b>Michel Newton</b>.`,
      logs_geolocalizacao: `<b>📁 LOGS_GEOLOCALIZACAO_GPS.TXT</b><br>
<i>Extração de Dados de Antena Móvel (ERB)</i><br><br>
O log de conexões do celular de <b>Vitor</b> na noite de 10 de Setembro foi analisado digitalmente.<br><br>
<b>Descoberta:</b> Entre 22:30 e 23:45, o aparelho celular de Vitor conectou-se repetidamente à antena 'Cidade Jardim - Leste', registrando sinal de alta intensidade compatível com localização a menos de 150 metros da residência da vítima.<br><br>
<b>Veredito:</b> O álibi físico de que Vitor estava dormindo em seu quarto no Hotel Palace durante toda a noite é FALSO.`
    }
  },

  // Resultados finais da acusação
  accusationAnswers: {
    killer: "suspect4",
    motive: "inheritance", 
    method: "poison"  
  },

  // Detalhes da Revelação Final Cinematográfica
  revelation: {
    killerName: "Vitor",
    textSteps: [
      {
        title: "A Ganância e o Ressentimento",
        content: "Vitor guardava um profundo ressentimento por sua irmã-posta, Daniela Alborghetti. Daniela havia descoberto que o capital inicial da empresa de sua madrasta Giselle provinha de um esquema de desvio fiscal do falecido pai de Daniela, e ameaçava expor tudo à polícia financeira. Vitor temia perder a herança e o patrimônio da família."
      },
      {
        title: "A Farsa do Álibi do Hotel",
        content: "Para planejar o crime, Vitor e Giselle viajaram e fizeram o check-in no Hotel Palace na noite de 10 de Setembro por volta das 21h15. Alegando cansaço, Vitor subiu para seu quarto simulando que iria dormir de imediato. No entanto, ele saiu discretamente do hotel pelos fundos para confrontar Daniela em seu apartamento."
      },
      {
        title: "O Confronto e Envenenamento",
        content: "Vitor chegou ao apartamento de Daniela e iniciou uma discussão violenta exigindo o fim das chantagens. Daniela tentou pedir socorro, mas foi segurada brutalmente pelo punho direito. Vitor colocou uma dose letal de cianeto de potássio líquido na taça de vinho que Daniela consumia. Sob coação e luta, Daniela acabou ingerindo o veneno e desabou sem vida."
      },
      {
        title: "A Encenação e a Rosa Negra",
        content: "Após a morte de Daniela, Vitor derrubou uma banqueta na cozinha para simular uma luta física geral. Para desviar a atenção da polícia de si mesmo e incriminar o ex-namorado agressivo dela, Michel Newton, Vitor colocou sobre o peito de Daniela uma rosa negra que ele havia obtido na Floricultura Flor de Newton, sabendo que isso apontaria as investigações para Michel."
      },
      {
        title: "A Quebra do Álibi de GPS",
        content: "Vitor retornou ao hotel fingindo que nunca havia saído. No entanto, a perícia forense digital extraiu os logs de conexão do GPS de seu celular. As conexões de ERB provaram que seu celular esteve ativo e se conectou repetidamente na antena de telefonia próxima ao prédio de Daniela no horário exato do crime."
      },
      {
        title: "Justiça para Daniela",
        content: "Com a quebra do álibi de GPS de Vitor e a confirmação de sua presença física na cena do crime, além de outros vestígios, Vitor foi formalmente indiciado e preso. A farsa de incriminar Michel Newton foi desfeita e a justiça por Daniela foi finalmente estabelecida."
      }
    ]
  }
};

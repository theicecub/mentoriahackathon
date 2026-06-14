// ─── Types ───────────────────────────────────────────────────────────────────

export type Category =
  | 'Бизнес'
  | 'STEM'
  | 'Социальное влияние'
  | 'Финансы'
  | 'Программирование'
  | 'Наука'
  | 'Английский'
  | 'Подготовка к экзаменам'
  | 'Поступление в университет'

export type Format = 'Онлайн' | 'Офлайн' | 'Гибридный'
export type Grade = '7' | '8' | '9' | '10' | '11' | 'Студент'
export type Difficulty = 'Начальный' | 'Средний' | 'Продвинутый'

export interface Opportunity {
  id: string
  title: string
  organization: string
  category: Category
  format: Format
  deadline: string
  description: string
  requirements: string[]
  grades: Grade[]
  tags: string[]
  link: string
  logo: string
  featured?: boolean
}

export interface Lesson {
  id: string
  title: string
  duration: string
  type: 'video' | 'reading' | 'quiz' | 'assignment'
  description: string
  content?: string
  videoUrl?: string
  quiz?: { question: string; options: string[]; answer: number }[]
}

export interface Course {
  id: string
  title: string
  description: string
  category: Category
  difficulty: Difficulty
  grades: Grade[]
  duration: string
  lessons: Lesson[]
  tags: string[]
  instructor: string
  thumbnail: string
  featured?: boolean
}

// ─── Opportunities Data ───────────────────────────────────────────────────────

export const opportunities: Opportunity[] = [
  {
    id: 'op-1',
    title: 'Diamond Challenge — Международный стартап-конкурс',
    organization: 'University of Delaware',
    category: 'Бизнес',
    format: 'Онлайн',
    deadline: '2025-03-15',
    description:
      'Международный конкурс для школьников, где команды разрабатывают бизнес-планы и презентуют их перед жюри из предпринимателей и инвесторов. Призовой фонд $100 000.',
    requirements: ['9–12 класс', 'Команда 2–5 человек', 'Бизнес-план на английском'],
    grades: ['9', '10', '11'],
    tags: ['Бизнес', 'Стартап', 'Английский', 'Конкурс'],
    link: '#',
    logo: 'D',
    featured: true,
  },
  {
    id: 'op-2',
    title: 'ISEF — Международная научная выставка и ярмарка',
    organization: 'Society for Science',
    category: 'Наука',
    format: 'Гибридный',
    deadline: '2025-01-30',
    description:
      'Крупнейший в мире научный конкурс для старшеклассников. Участники представляют исследовательские проекты в области естественных наук, инженерии и математики.',
    requirements: ['8–12 класс', 'Научный проект', 'Отбор через местные туры'],
    grades: ['8', '9', '10', '11'],
    tags: ['Наука', 'Исследования', 'STEM'],
    link: '#',
    logo: 'I',
    featured: true,
  },
  {
    id: 'op-3',
    title: 'Google CS First — Программа по программированию',
    organization: 'Google',
    category: 'Программирование',
    format: 'Онлайн',
    deadline: '2025-02-28',
    description:
      'Бесплатная программа Google для обучения основам программирования на Scratch и Python. Включает менторство от сотрудников Google.',
    requirements: ['5–8 класс', 'Базовое владение компьютером'],
    grades: ['7', '8', '9'],
    tags: ['Программирование', 'Google', 'Бесплатно'],
    link: '#',
    logo: 'G',
  },
  {
    id: 'op-4',
    title: 'Young Entrepreneurs Program — INJAZ',
    organization: 'INJAZ Kazakhstan',
    category: 'Бизнес',
    format: 'Гибридный',
    deadline: '2025-04-10',
    description:
      'Программа INJAZ для молодых предпринимателей: создание мини-компании, управление финансами, презентация продукта инвесторам.',
    requirements: ['10–11 класс', 'Заявление на английском или русском', 'Мотивационное письмо'],
    grades: ['10', '11'],
    tags: ['Бизнес', 'Предпринимательство', 'Финансы'],
    link: '#',
    logo: 'Y',
  },
  {
    id: 'op-5',
    title: 'Зимняя школа НИШ по физике и математике',
    organization: 'Назарбаев Интеллектуальные Школы',
    category: 'STEM',
    format: 'Офлайн',
    deadline: '2024-12-20',
    description:
      'Интенсивная зимняя школа для одарённых учеников по физике, математике и информатике. Занятия ведут профессора ведущих университетов.',
    requirements: ['9–11 класс', 'Средний балл 4.5+', 'Тест по математике и физике'],
    grades: ['9', '10', '11'],
    tags: ['STEM', 'Физика', 'Математика', 'Казахстан'],
    link: '#',
    logo: 'Н',
    featured: true,
  },
  {
    id: 'op-6',
    title: 'Harvard Secondary School Program',
    organization: 'Harvard University',
    category: 'Поступление в университет',
    format: 'Офлайн',
    deadline: '2025-05-01',
    description:
      'Летняя программа Гарварда для старшеклассников. Участники берут университетские курсы, живут в кампусе и получают зачётные единицы.',
    requirements: ['10–11 класс', 'GPA 3.5+', 'Эссе на английском', 'Рекомендательное письмо'],
    grades: ['10', '11'],
    tags: ['США', 'Гарвард', 'Летняя программа', 'Английский'],
    link: '#',
    logo: 'H',
  },
  {
    id: 'op-7',
    title: 'Kazakh-British Technical University Olympiad',
    organization: 'KBTU',
    category: 'Программирование',
    format: 'Онлайн',
    deadline: '2025-02-15',
    description:
      'Олимпиада по программированию для школьников Казахстана. Победители получают скидки на обучение в KBTU и призы от партнёров.',
    requirements: ['9–11 класс', 'Знание Python, C++ или Java'],
    grades: ['9', '10', '11'],
    tags: ['Олимпиада', 'Программирование', 'Казахстан'],
    link: '#',
    logo: 'K',
  },
  {
    id: 'op-8',
    title: 'Финансовая Академия — Школа молодого инвестора',
    organization: 'FinАкадемия',
    category: 'Финансы',
    format: 'Онлайн',
    deadline: '2025-03-01',
    description:
      'Трёхмесячная программа по финансовой грамотности, инвестициям и фондовому рынку для школьников. Симулятор биржевой торговли.',
    requirements: ['8–11 класс', 'Интерес к финансам'],
    grades: ['8', '9', '10', '11'],
    tags: ['Финансы', 'Инвестиции', 'Биржа'],
    link: '#',
    logo: 'Ф',
  },
  {
    id: 'op-9',
    title: 'Social Innovation Lab — ООН Молодёжь',
    organization: 'UNDP Youth',
    category: 'Социальное влияние',
    format: 'Гибридный',
    deadline: '2025-04-30',
    description:
      'Лаборатория социальных инноваций ООН: участники разрабатывают проекты для решения социальных проблем, получают менторство и гранты до $5000.',
    requirements: ['16–25 лет', 'Проектное предложение', 'Командная работа'],
    grades: ['10', '11', 'Студент'],
    tags: ['Социальное влияние', 'ООН', 'Грант', 'Лидерство'],
    link: '#',
    logo: 'У',
    featured: true,
  },
  {
    id: 'op-10',
    title: 'MIT Launch — Летняя программа предпринимательства',
    organization: 'MIT',
    category: 'Бизнес',
    format: 'Гибридный',
    deadline: '2025-03-20',
    description:
      'MIT Launch помогает старшеклассникам запустить реальный стартап за 4 недели. Менторство от предпринимателей Кремниевой долины.',
    requirements: ['9–12 класс', 'Английский B2+', 'Идея для стартапа'],
    grades: ['9', '10', '11'],
    tags: ['MIT', 'Стартап', 'США', 'Предпринимательство'],
    link: '#',
    logo: 'M',
  },
  {
    id: 'op-11',
    title: 'EcoHack — Экологический хакатон',
    organization: 'GreenTech Foundation',
    category: 'STEM',
    format: 'Офлайн',
    deadline: '2025-05-15',
    description:
      'Хакатон по разработке технологических решений для экологических проблем. 48 часов, команды из 3–4 человек, призы от экологических организаций.',
    requirements: ['14–19 лет', 'Базовое программирование или дизайн'],
    grades: ['8', '9', '10', '11'],
    tags: ['Экология', 'Хакатон', 'STEM', 'Технологии'],
    link: '#',
    logo: 'E',
  },
  {
    id: 'op-12',
    title: 'Bolashak — Президентская программа стипендий',
    organization: 'Центр «Болашак»',
    category: 'Поступление в университет',
    format: 'Офлайн',
    deadline: '2025-06-01',
    description:
      'Государственная программа стипендий для обучения в ведущих университетах мира. Полное покрытие расходов на обучение, проживание и перелёты.',
    requirements: ['Гражданство РК', 'GPA 3.5+', 'IELTS 6.5+ или TOEFL 79+', 'Стаж работы (для магистратуры)'],
    grades: ['11', 'Студент'],
    tags: ['Казахстан', 'Стипендия', 'Зарубежное образование'],
    link: '#',
    logo: 'Б',
    featured: true,
  },
]

// ─── Courses Data ─────────────────────────────────────────────────────────────

export const courses: Course[] = [
  {
    id: 'course-1',
    title: 'Основы математики для школьников',
    description:
      'Углублённый курс по алгебре, геометрии и теории чисел. Охватывает все темы, необходимые для олимпиад и экзаменов.',
    category: 'STEM',
    difficulty: 'Средний',
    grades: ['8', '9', '10'],
    duration: '8 недель',
    thumbnail: '/thumbnails/math.jpg',
    instructor: 'Айжан Сейткали',
    tags: ['Математика', 'Алгебра', 'Геометрия', 'Олимпиада'],
    featured: true,
    lessons: [
      {
        id: 'l1-1',
        title: 'Введение: числа и множества',
        duration: '25 мин',
        type: 'video',
        description: 'Натуральные, целые, рациональные и иррациональные числа. Операции над множествами.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l1-2',
        title: 'Линейные уравнения и системы',
        duration: '30 мин',
        type: 'video',
        description: 'Решение линейных уравнений с одной и двумя переменными. Метод подстановки и сложения.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l1-3',
        title: 'Квадратные уравнения',
        duration: '35 мин',
        type: 'video',
        description: 'Дискриминант, формула Виета, графический метод. Разбор задач ЕНТ.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l1-4',
        title: 'Тест: алгебра',
        duration: '20 мин',
        type: 'quiz',
        description: 'Проверочный тест по темам уравнений и систем.',
        quiz: [
          {
            question: 'Решите уравнение: 2x + 6 = 14',
            options: ['x = 4', 'x = 5', 'x = 3', 'x = 10'],
            answer: 0,
          },
          {
            question: 'Дискриминант уравнения x² - 5x + 6 = 0 равен:',
            options: ['1', '25', 'D = 1', '49'],
            answer: 0,
          },
          {
            question: 'Корни уравнения x² - 5x + 6 = 0:',
            options: ['2 и 3', '1 и 6', '-2 и -3', '4 и 1'],
            answer: 0,
          },
        ],
      },
      {
        id: 'l1-5',
        title: 'Функции и их графики',
        duration: '40 мин',
        type: 'video',
        description: 'Понятие функции, область определения и значений. Линейная, квадратичная, обратная функции.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l1-6',
        title: 'Геометрия: треугольники и окружности',
        duration: '45 мин',
        type: 'video',
        description: 'Теорема Пифагора, теоремы косинусов и синусов. Вписанные и описанные окружности.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l1-7',
        title: 'Практическое задание: решение задач',
        duration: '60 мин',
        type: 'assignment',
        description: 'Набор из 15 задач олимпиадного уровня для самостоятельного решения.',
      },
    ],
  },
  {
    id: 'course-2',
    title: 'Английский для академического успеха',
    description:
      'Комплексный курс академического английского: чтение научных текстов, написание эссе, подготовка к IELTS/TOEFL и устная речь.',
    category: 'Английский',
    difficulty: 'Средний',
    grades: ['9', '10', '11'],
    duration: '10 недель',
    thumbnail: '/thumbnails/english.jpg',
    instructor: 'Дана Исатаева',
    tags: ['Английский', 'IELTS', 'TOEFL', 'Академическое письмо'],
    featured: true,
    lessons: [
      {
        id: 'l2-1',
        title: 'Academic Reading: стратегии чтения',
        duration: '30 мин',
        type: 'video',
        description: 'Skimming, scanning, детальное чтение. Работа с академическими текстами.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l2-2',
        title: 'Essay Writing: структура и аргументация',
        duration: '40 мин',
        type: 'video',
        description: 'Введение, основная часть, заключение. Тезис и аргументы. Академический стиль.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l2-3',
        title: 'IELTS Writing Task 2 — разбор образцов',
        duration: '35 мин',
        type: 'video',
        description: 'Анализ эссе на Band 7 и Band 8. Типичные ошибки и как их избежать.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l2-4',
        title: 'Тест: академическая лексика',
        duration: '15 мин',
        type: 'quiz',
        description: 'Проверка знания академического словаря (Academic Word List).',
        quiz: [
          {
            question: 'Выберите академический синоним слова "show":',
            options: ['demonstrate', 'tell', 'say', 'make'],
            answer: 0,
          },
          {
            question: 'Что означает слово "albeit"?',
            options: ['хотя / несмотря на то что', 'потому что', 'следовательно', 'например'],
            answer: 0,
          },
        ],
      },
      {
        id: 'l2-5',
        title: 'Speaking: презентация идей',
        duration: '25 мин',
        type: 'video',
        description: 'Структура устной презентации. Linking words для речи. Практика IELTS Speaking Part 3.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l2-6',
        title: 'Задание: написать эссе',
        duration: '90 мин',
        type: 'assignment',
        description: 'Напишите эссе IELTS Task 2 на 250+ слов по предложенной теме. Пришлите на проверку.',
      },
    ],
  },
  {
    id: 'course-3',
    title: 'Основы физики: механика и термодинамика',
    description:
      'Первая часть курса физики для 10–11 класса. Кинематика, динамика, законы Ньютона, работа и энергия, термодинамика.',
    category: 'STEM',
    difficulty: 'Средний',
    grades: ['10', '11'],
    duration: '9 недель',
    thumbnail: '/thumbnails/physics.jpg',
    instructor: 'Нурлан Аймаков',
    tags: ['Физика', 'Механика', 'ЕНТ', 'Олимпиада'],
    featured: false,
    lessons: [
      {
        id: 'l3-1',
        title: 'Кинематика: движение и скорость',
        duration: '35 мин',
        type: 'video',
        description: 'Равномерное и равноускоренное движение. Графики v(t) и x(t). Формулы кинематики.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l3-2',
        title: 'Динамика: законы Ньютона',
        duration: '40 мин',
        type: 'video',
        description: 'Три закона Ньютона. Сила, масса, ускорение. Разбор классических задач.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l3-3',
        title: 'Работа, мощность, энергия',
        duration: '30 мин',
        type: 'video',
        description: 'КПД, потенциальная и кинетическая энергия. Закон сохранения энергии.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l3-4',
        title: 'Тест по механике',
        duration: '20 мин',
        type: 'quiz',
        description: 'Тест по кинематике и динамике.',
        quiz: [
          {
            question: 'Тело движется с ускорением 2 м/с². Через 5 с его скорость равна 10 м/с. Начальная скорость:',
            options: ['0 м/с', '5 м/с', '20 м/с', '2 м/с'],
            answer: 0,
          },
          {
            question: 'Единица измерения силы в системе СИ:',
            options: ['Ньютон (Н)', 'Паскаль (Па)', 'Джоуль (Дж)', 'Ватт (Вт)'],
            answer: 0,
          },
        ],
      },
      {
        id: 'l3-5',
        title: 'Термодинамика: теплота и температура',
        duration: '35 мин',
        type: 'video',
        description: 'Внутренняя энергия, первое начало термодинамики. КПД тепловых машин.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
    ],
  },
  {
    id: 'course-4',
    title: 'Подготовка к SAT / IELTS',
    description:
      'Стратегический курс подготовки к международным экзаменам. Разбор структуры, тренировочные тесты, разбор ошибок и повышение балла.',
    category: 'Подготовка к экзаменам',
    difficulty: 'Продвинутый',
    grades: ['10', '11'],
    duration: '12 недель',
    thumbnail: '/thumbnails/sat.jpg',
    instructor: 'Зарина Бекова',
    tags: ['SAT', 'IELTS', 'Экзамены', 'США', 'Великобритания'],
    featured: true,
    lessons: [
      {
        id: 'l4-1',
        title: 'Структура SAT: обзор и стратегии',
        duration: '45 мин',
        type: 'video',
        description: 'Разделы SAT, система оценки, тайм-менеджмент. Как набрать 1400+.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l4-2',
        title: 'SAT Math: ключевые темы',
        duration: '50 мин',
        type: 'video',
        description: 'Алгебра, статистика, геометрия в SAT. Разбор реальных задач.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l4-3',
        title: 'SAT Reading: работа с текстами',
        duration: '40 мин',
        type: 'video',
        description: 'Evidence-based reading. Стратегии для исторических и научных текстов.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l4-4',
        title: 'IELTS Overview: форматы Academic и General',
        duration: '30 мин',
        type: 'video',
        description: 'Различия Academic и General Training. Баллы и что они означают.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l4-5',
        title: 'Тренировочный тест: SAT Math',
        duration: '40 мин',
        type: 'quiz',
        description: 'Мини-тест из 10 задач SAT Math уровня Medium.',
        quiz: [
          {
            question: 'Если 3x - 7 = 14, то x = ?',
            options: ['7', '3', '21', '5'],
            answer: 0,
          },
        ],
      },
      {
        id: 'l4-6',
        title: 'IELTS Writing Task 1: диаграммы',
        duration: '35 мин',
        type: 'video',
        description: 'Как описывать графики, таблицы и диаграммы. Ключевые фразы и структура.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
    ],
  },
  {
    id: 'course-5',
    title: 'Введение в экономику',
    description:
      'Основы микро- и макроэкономики: спрос и предложение, рынки, ВВП, инфляция. Курс подготовит к олимпиаде по экономике и поступлению на экономические факультеты.',
    category: 'Бизнес',
    difficulty: 'Начальный',
    grades: ['9', '10', '11'],
    duration: '7 недель',
    thumbnail: '/thumbnails/economics.jpg',
    instructor: 'Асель Нурмаганбетова',
    tags: ['Экономика', 'Бизнес', 'Финансы', 'Олимпиада'],
    featured: false,
    lessons: [
      {
        id: 'l5-1',
        title: 'Спрос и предложение',
        duration: '30 мин',
        type: 'video',
        description: 'Закон спроса и предложения. Кривые, равновесие, ценовые эластичности.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l5-2',
        title: 'Рыночные структуры',
        duration: '25 мин',
        type: 'video',
        description: 'Совершенная конкуренция, монополия, олигополия. Плюсы и минусы.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l5-3',
        title: 'Макроэкономика: ВВП и инфляция',
        duration: '35 мин',
        type: 'video',
        description: 'Как измеряется ВВП. Инфляция, дефляция, реальный и номинальный ВВП.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l5-4',
        title: 'Тест по основам экономики',
        duration: '15 мин',
        type: 'quiz',
        description: 'Тест на понимание базовых экономических концепций.',
        quiz: [
          {
            question: 'Что происходит с ценой, если спрос растёт, а предложение остаётся неизменным?',
            options: ['Цена растёт', 'Цена падает', 'Цена не меняется', 'Зависит от эластичности'],
            answer: 0,
          },
          {
            question: 'ВВП измеряет:',
            options: [
              'Стоимость всех товаров и услуг в стране за год',
              'Только экспортируемые товары',
              'Государственные расходы',
              'Прибыль компаний',
            ],
            answer: 0,
          },
        ],
      },
    ],
  },
  {
    id: 'course-6',
    title: 'Основы информатики и алгоритмов',
    description:
      'Курс по основам программирования на Python, алгоритмическому мышлению, структурам данных и решению задач. Отличная подготовка к олимпиадам по информатике.',
    category: 'Программирование',
    difficulty: 'Начальный',
    grades: ['7', '8', '9', '10'],
    duration: '8 недель',
    thumbnail: '/thumbnails/cs.jpg',
    instructor: 'Тимур Касымов',
    tags: ['Python', 'Алгоритмы', 'Программирование', 'Олимпиада'],
    featured: false,
    lessons: [
      {
        id: 'l6-1',
        title: 'Введение в Python',
        duration: '30 мин',
        type: 'video',
        description: 'Переменные, типы данных, ввод/вывод. Первая программа на Python.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l6-2',
        title: 'Условия и циклы',
        duration: '35 мин',
        type: 'video',
        description: 'if/elif/else, while, for. Вложенные конструкции. Практические задачи.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l6-3',
        title: 'Функции и рекурсия',
        duration: '40 мин',
        type: 'video',
        description: 'Определение функций, параметры, возвращаемые значения. Рекурсия на примере факториала.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l6-4',
        title: 'Тест: Python основы',
        duration: '20 мин',
        type: 'quiz',
        description: 'Проверка знаний по переменным, циклам и функциям.',
        quiz: [
          {
            question: 'Что выведет print(2 ** 3)?',
            options: ['8', '6', '9', '5'],
            answer: 0,
          },
          {
            question: 'Как объявить функцию в Python?',
            options: ['def my_func():', 'function my_func():', 'func my_func():', 'define my_func():'],
            answer: 0,
          },
        ],
      },
      {
        id: 'l6-5',
        title: 'Алгоритмы сортировки',
        duration: '45 мин',
        type: 'video',
        description: 'Bubble sort, selection sort, merge sort. Оценка сложности O(n).',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
    ],
  },
  {
    id: 'course-7',
    title: 'Путь в университет: поступление и документы',
    description:
      'Полный гид по поступлению в зарубежные университеты: Common App, личные эссе, рекомендательные письма, интервью и финансовая помощь.',
    category: 'Поступление в университет',
    difficulty: 'Начальный',
    grades: ['10', '11', 'Студент'],
    duration: '6 недель',
    thumbnail: '/thumbnails/uni.jpg',
    instructor: 'Мадина Ержанова',
    tags: ['Поступление', 'Common App', 'Эссе', 'США', 'Великобритания'],
    featured: false,
    lessons: [
      {
        id: 'l7-1',
        title: 'Система поступления в США: обзор',
        duration: '40 мин',
        type: 'video',
        description: 'Regular Decision vs Early Action/Decision. Holistic admissions. Что смотрят приёмные комиссии.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l7-2',
        title: 'Как писать Personal Statement',
        duration: '50 мин',
        type: 'video',
        description: 'Структура сильного эссе. Storytelling. Типичные ошибки и как их избежать.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l7-3',
        title: 'Рекомендательные письма: как просить',
        duration: '25 мин',
        type: 'video',
        description: 'Кого выбирать, когда просить, что им дать. Образцы сильных рекомендаций.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l7-4',
        title: 'Задание: написать черновик эссе',
        duration: '120 мин',
        type: 'assignment',
        description: 'Напишите черновик личного эссе Common App (650 слов) и загрузите для обратной связи.',
      },
    ],
  },
  {
    id: 'course-8',
    title: 'Основы биологии: клетка и генетика',
    description:
      'Курс по молекулярной биологии, клеточным процессам и основам генетики. Подготовка к олимпиадам, ЕНТ и экзаменам AP Biology.',
    category: 'Наука',
    difficulty: 'Средний',
    grades: ['9', '10', '11'],
    duration: '8 недель',
    thumbnail: '/thumbnails/bio.jpg',
    instructor: 'Гульнара Сагынтаева',
    tags: ['Биология', 'Генетика', 'Клетка', 'ЕНТ', 'AP Biology'],
    featured: false,
    lessons: [
      {
        id: 'l8-1',
        title: 'Клетка: структура и органеллы',
        duration: '35 мин',
        type: 'video',
        description: 'Прокариоты и эукариоты. Мембрана, ядро, митохондрии, рибосомы.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l8-2',
        title: 'ДНК, РНК и синтез белка',
        duration: '45 мин',
        type: 'video',
        description: 'Строение ДНК, репликация, транскрипция, трансляция. Генетический код.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l8-3',
        title: 'Генетика Менделя',
        duration: '40 мин',
        type: 'video',
        description: 'Законы Менделя. Моногибридное и дигибридное скрещивание. Таблицы Пеннета.',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      },
      {
        id: 'l8-4',
        title: 'Тест: клетка и генетика',
        duration: '20 мин',
        type: 'quiz',
        description: 'Тест по материалу первых трёх уроков.',
        quiz: [
          {
            question: 'Где происходит синтез белка в клетке?',
            options: ['На рибосомах', 'В ядре', 'В митохондриях', 'В лизосомах'],
            answer: 0,
          },
        ],
      },
    ],
  },
]

// ─── Recommendation Logic ─────────────────────────────────────────────────────

export function getRecommendedOpportunities(interests: string[], grade: string): Opportunity[] {
  return opportunities
    .filter((op) => {
      const matchesGrade = op.grades.includes(grade as Grade)
      const matchesInterest = interests.some((i) =>
        op.tags.some((t) => t.toLowerCase().includes(i.toLowerCase())) ||
        op.category.toLowerCase().includes(i.toLowerCase())
      )
      return matchesGrade || matchesInterest
    })
    .slice(0, 6)
}

export function getRecommendedCourses(interests: string[], grade: string): Course[] {
  return courses
    .filter((c) => {
      const matchesGrade = c.grades.includes(grade as Grade)
      const matchesInterest = interests.some((i) =>
        c.tags.some((t) => t.toLowerCase().includes(i.toLowerCase())) ||
        c.category.toLowerCase().includes(i.toLowerCase())
      )
      return matchesGrade || matchesInterest
    })
    .slice(0, 4)
}

export const categoryColors: Record<string, string> = {
  Бизнес: 'bg-amber-100 text-amber-800',
  STEM: 'bg-blue-100 text-blue-800',
  'Социальное влияние': 'bg-green-100 text-green-800',
  Финансы: 'bg-yellow-100 text-yellow-800',
  Программирование: 'bg-purple-100 text-purple-800',
  Наука: 'bg-cyan-100 text-cyan-800',
  Английский: 'bg-rose-100 text-rose-800',
  'Подготовка к экзаменам': 'bg-orange-100 text-orange-800',
  'Поступление в университет': 'bg-indigo-100 text-indigo-800',
}

export const difficultyColors: Record<string, string> = {
  Начальный: 'bg-green-100 text-green-700',
  Средний: 'bg-amber-100 text-amber-700',
  Продвинутый: 'bg-red-100 text-red-700',
}

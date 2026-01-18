export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  content: string;
}

export const newsItems: NewsItem[] = [
  {
    id: '1',
    title: 'Chinese Political Development: A Historical Overview',
    summary: 'An in-depth look at the evolution of Chinese political systems from ancient times to the modern era.',
    content: 'Chinese political development has undergone significant transformations throughout its long history. From the ancient dynastic systems to the modern governance structure, the country has maintained a unique political tradition while adapting to contemporary challenges. The current political system combines elements of traditional Chinese governance with modern administrative practices, creating a distinctive model of development.',
  },
  {
    id: '2',
    title: 'The Role of Generations in Shaping Modern China',
    summary: 'How different generations have influenced Chinese society and politics over the past decades.',
    content: 'Each generation in modern China has played a crucial role in shaping the country\'s development trajectory. The 80s generation witnessed the early stages of economic reform, the 90s generation experienced rapid urbanization, the 00s generation grew up in an increasingly connected world, and the 10s generation is navigating the challenges and opportunities of the digital age. Together, these generations represent the continuous evolution of Chinese society.',
  },
  {
    id: '3',
    title: 'Key Concepts in Chinese Political Understanding',
    summary: 'Understanding the fundamental concepts that define Chinese political thought and practice.',
    content: 'To fully understand Chinese politics, one must grasp several key concepts: the Party (Chinese Communist Party), the Government, and the Country. These three entities have distinct roles and responsibilities while working together to ensure the nation\'s stability and development. The Party sets policy direction, the Government implements these policies, and the Country represents the broader national identity and interests of the Chinese people.',
  },
];

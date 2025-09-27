// src/socket/questions.data.ts

export interface CardInfo {
  header: string;
  decription: string;
  imageUrl?: string;
  Textimage: string;
  variant: number;
}

export interface Question {
  question: string;
  ListCard: CardInfo[];
}

export const QUESTIONS: Question[] = [
  {
    question: 'จัดเรียงสัตว์จากขนาดเล็กไปใหญ่',
    ListCard: [
      {
        header: 'หนู',
        decription: 'หนูเป็นสัตว์เลี้ยงลูกด้วยนมขนาดเล็ก',
        Textimage: '🐭',
        variant: 1,
      },
      {
        header: 'แมว',
        decription: 'แมวเป็นสัตว์เลี้ยงลูกด้วยนมที่มีขนาดกลาง',
        Textimage: '🐱',
        variant: 2,
      },
      {
        header: 'สุนัข',
        decription: 'สุนัขเป็นสัตว์เลี้ยงลูกด้วยนมที่มีขนาดใหญ่กว่าแมว',
        Textimage: '🐶',
        variant: 3,
      },
      {
        header: 'ช้าง',
        decription:
          'ช้างเป็นสัตว์เลี้ยงลูกด้วยนมที่มีขนาดใหญ่ที่สุดในบรรดาสัตว์บก',
        Textimage: '🐘',
        variant: 4,
      },
    ],
  },
  {
    question: 'จัดเรียงยานพาหนะจากช้าที่สุดไปเร็วที่สุด',
    ListCard: [
      {
        header: 'จักรยาน',
        decription: 'จักรยานเป็นยานพาหนะที่ใช้แรงคนในการขับเคลื่อน',
        Textimage: '🚲',
        variant: 1,
      },
      {
        header: 'มอเตอร์ไซค์',
        decription:
          'มอเตอร์ไซค์เป็นยานพาหนะที่ใช้เครื่องยนต์ขนาดเล็กในการขับเคลื่อน',
        Textimage: '🏍️',
        variant: 2,
      },
      {
        header: 'รถยนต์',
        decription:
          'รถยนต์เป็นยานพาหนะที่ใช้เครื่องยนต์ขนาดใหญ่กว่าและสามารถบรรทุกผู้โดยสารได้หลายคน',
        Textimage: '🚗',
        variant: 3,
      },
      {
        header: 'เครื่องบิน',
        decription:
          'เครื่องบินเป็นยานพาหนะที่สามารถบินได้และมีความเร็วสูงสุดในบรรดายานพาหนะทั้งหมด',
        Textimage: '✈️',
        variant: 4,
      },
    ],
  },
];

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
    }, {
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
                variant: 6,
            },
        ],
    }, {
        question: 'จัดเรียงผลไม้จากขนาดเล็กไปใหญ่',
        ListCard: [{
            header: 'เชอร์รี่',
            decription: 'เชอร์รี่เป็นผลไม้ขนาดเล็กที่มีรสชาติหวานอมเปรี้ยว',
            Textimage: '🍒',
            variant: 0,
        },
        {
            header: 'องุ่น',
            decription: 'องุ่นเป็นผลไม้ขนาดเล็กที่มักใช้ทำไวน์',
            Textimage: '🍇'
            , variant: 1,
        },
        {
            header: 'สตรอว์เบอร์รี',
            decription: 'สตรอว์เบอร์รีเป็นผลไม้ที่มีรสชาติหวานอมเปรี้ยว',
            Textimage: '🍓'
            , variant: 2,
        },
        {
            header: 'แอปเปิ้ล',
            decription: 'แอปเปิ้ลเป็นผลไม้ที่มีรสชาติหวานและกรอบ',
            Textimage: '🍎 '
            , variant: 3,
        },
        {
            header: 'แตงโม',
            decription: 'แตงโมเป็นผลไม้ที่มีขนาดใหญ่และมีรสชาติหวานฉ่ำ',
            Textimage: '🍉'
            , variant: 4,
        },
        {
            header: 'สับปะรด',
            decription: 'สับปะรดเป็นผลไม้ที่มีขนาดใหญ่และมีรสชาติหวานอมเปรี้ยว',
            Textimage: '🍍'
            , variant: 5,
        },

        ],
    },
    {
        question: 'จัดเรียงสัตว์จากขนาดเล็กไปใหญ่',
        ListCard: [
            {
                header: 'มด',
                decription: 'มดเป็นแมลงขนาดเล็กที่มีขนาดเล็กที่สุดในบรรดาสัตว์ทั้งหมด',
                Textimage: '🐜',
                variant: 0.1
            },
            {
                header: 'หนู',
                decription: 'หนูเป็นสัตว์เลี้ยงลูกด้วยนมขนาดเล็ก',
                Textimage: '🐭',
                variant: 1,
            },
            {
                header: "กระต่าย",
                decription: "กระต่ายเป็นสัตว์เลี้ยงลูกด้วยนมที่มีขนาดเล็กถึงกลาง",
                Textimage: "🐰",
                variant: 1.5,
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
                header: 'เสือ',
                decription: 'เสือเป็นสัตว์ป่าที่มีขนาดใหญ่และแข็งแรงที่สุดในบรรดาสัตว์เลี้ยงลูกด้วยนมทั้งหมด',
                Textimage: '🐯',
                variant: 4,
            },
            {
                header: "แรด",
                decription: "แรดเป็นสัตว์เลี้ยงลูกด้วยนมที่มีขนาดใหญ่ที่สุดในบรรดาสัตว์ทั้งหมด",
                Textimage: "🦏",
                variant: 5,
            },
            {
                header: 'ช้าง',
                decription:
                    'ช้างเป็นสัตว์เลี้ยงลูกด้วยนมที่มีขนาดใหญ่ที่สุดในบรรดาสัตว์บก',
                Textimage: '🐘',
                variant: 6,
            },
            {
                header: "วาฬ",
                decription: "วาฬเป็นสัตว์เลี้ยงลูกด้วยนมที่มีขนาดใหญ่ที่สุดในบรรดาสัตว์ทั้งหมด",
                Textimage: "🐋",
                variant: 7,
            },
        ],
    },
];

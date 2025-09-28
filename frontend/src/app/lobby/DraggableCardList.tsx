import React, { use, useState, useEffect } from "react";
import {
    DndContext, closestCenter, PointerSensor,
    useSensor, useSensors, TouchSensor
} from "@dnd-kit/core";
import {
    SortableContext, arrayMove, useSortable,
    horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

interface CardProps {
    id: string;
    content: string;
    header?: string;
    description?: string;
    imageUrl?: string;
    Textimage?: string;
    variant?: number;
    isDraggable?: boolean;
    iswrong?: boolean;
}
type DraggableCardListProps = {
    listCard: any;
    OnSubmitOrder: (order: number[]) => void;
    StatePlaying?: string;
    WrongIndexes: number[]
};

function Card({ id, header, content, description, isDraggable, iswrong }: CardProps,) {

    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        touchAction: "none",
    };
    useEffect(() => {

    }, [iswrong]);
    return (
        <div
            ref={setNodeRef}
            style={style}
            {...(isDraggable ? attributes : {})}
            {...(isDraggable ? listeners : {})}
            className={`lg:p-2   lg:max-w-[240px]  sm:min-w-[120px] 
                 sm:max-w-[120px] sm:max-h-[200px] lg:max-h-[400px]   rounded-xl shadow   border border-2 
                  border-dashed   border-amber-400 select-none  
                  ${isDragging ? "shadow-lg scale-105 bg-blue-100" : ""}`}
        >
            <div className={`lg:p-5 flex flex-col h-full items-center justify-center rounded-xl transition-colors duration-300 ${iswrong ? "bg-red-500 text-white" : "bg-white"
                }`}>
                <p className="px-3 lg:text-lg text-center font-semibold">{header}</p>
                <p className=" lg:text-9xl sm:text-7xl font-semibold mb-2">{content}</p>
                <div className="p-3 border  border border-2 border-dashed rounded-xl border-gray-300 overflow-y-auto lg:flex-grow ">
                    <p className="lg:text-xl sm:text-xs font-semibold ">{description}</p>
                </div>
            </div>
        </div>
    );
}

export default function DraggableCardList({ listCard, OnSubmitOrder, StatePlaying, WrongIndexes }: DraggableCardListProps) {
    const [cards, setCards] = useState([
        { id: "1", content: "🍎 Card 1", variant: 1, header: "", description: "", iswrong: false },
    ]);

    console.log("📥 DraggableCardList:", listCard, cards);
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 100, tolerance: 5 } })
    );
    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id && StatePlaying == "Playing") {
            const oldIndex = cards.findIndex((c) => c.id === active.id);
            const newIndex = cards.findIndex((c) => c.id === over.id);
            setCards(arrayMove(cards, oldIndex, newIndex));
        }
    };
    const SetwrongIndexes = (wrongIndexes: number[]) => {
        let newCards = cards.map((card, index) => ({
            ...card,
            iswrong: wrongIndexes.includes(index),
        }));
        newCards[0].iswrong = true;
    }
    const handleSubmit = () => {
        const orderedVariants = cards.map((card) => card.variant || 0);
        console.log("📤 ส่งลำดับการ์ด:", orderedVariants);

        OnSubmitOrder(orderedVariants);

    };

    // ✅ Update cards from props
    useEffect(() => {
        if (listCard?.ListCard) {
            const newCards = listCard.ListCard.map((card: any, index: number) => ({
                id: (index + 1).toString(),
                content: `${card.Textimage}`,
                header: card.header,
                description: card.decription,
                imageUrl: card.imageUrl,
                Textimage: card.Textimage,
                variant: card.variant,
                iswrong: false,
            }));
            setCards(newCards);
        }
    }, [listCard]);


    useEffect(() => {
        if (WrongIndexes && WrongIndexes.length > 0) {
            setCards((prev) =>
                prev.map((card, index) => ({
                    ...card,
                    iswrong: WrongIndexes.includes(index),
                }))
            );
        }
    }, [WrongIndexes]);

    return (
        <div className="   ">
            <div className="flex flex-row items-center justify-center  space-x-5 overflow-x-auto  mx-5   ">
                {/* <button className="  px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"></button> */}
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                >
                    <SortableContext items={cards.map((c) => c.id)} strategy={horizontalListSortingStrategy}>
                        <div className="w-full lg:space-x-5 sm:space-x-1 sm:py-5 sm:px-30   flex flex-row items-stretch  items-center justify-center overflow-x-auto  mx-15   ">
                            {cards.map((card) => (
                                <Card key={card.id} id={card.id} content={card.content} description={card.description}
                                    header={card.header} isDraggable={StatePlaying == "Playing"} iswrong={card.iswrong} />
                            ))}
                        </div>
                    </SortableContext>
                </DndContext>
                {/* <button className="  px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"></button> */}
            </div>

            {StatePlaying === "Playing" &&
                <div className="flex justify-center items-center ">
                    <button
                        onClick={handleSubmit}
                        disabled={StatePlaying == "Playing" ? false : true}
                        style={{
                            backgroundColor: StatePlaying === "Playing" ? 'blue' : 'red'
                        }}
                        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
                    >
                        ยืนยันคำตอบ
                    </button></div>}
        </div>
    );
}

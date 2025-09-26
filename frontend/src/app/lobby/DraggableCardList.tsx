import React, { useState } from "react";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";

interface CardProps {
    id: string;
    content: string;
}

function Card({ id, content }: CardProps) {
    // ทำให้ Card เคลื่อนตามเมาส์
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`p-4 rounded-xl shadow bg-white border cursor-grab select-none ${isDragging ? "shadow-xl scale-105 bg-blue-100" : "hover:bg-blue-50"
                }`}
        >
            <p className="font-semibold">{content}</p>
        </div>
    );
}

export default function DraggableCardList() {
    const [cards, setCards] = useState([
        { id: "1", content: "🍎 Card 1" },
        { id: "2", content: "🍊 Card 2" },
        { id: "3", content: "🍋 Card 3" },
        { id: "4", content: "🍉 Card 4" },
    ]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 5 },
        })
    );

    const handleDragEnd = (event: any) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            const oldIndex = cards.findIndex((c) => c.id === active.id);
            const newIndex = cards.findIndex((c) => c.id === over.id);
            setCards(arrayMove(cards, oldIndex, newIndex));
        }
    };

    const handleSubmit = () => {
        console.log("📤 ลำดับใหม่:", cards);
        alert("✅ ส่งเรียบร้อย! ดูใน console");
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
            <h1 className="text-2xl font-bold mb-6">🪄 Drag & Drop (Smooth Move)</h1>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    <div className="w-full max-w-sm space-y-3">
                        {cards.map((card) => (
                            <Card key={card.id} id={card.id} content={card.content} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <button
                onClick={handleSubmit}
                className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition"
            >
                Submit ลำดับปัจจุบัน
            </button>
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import { Listbox } from "@headlessui/react";

function generateDynamicTimeSlots(intervalMinutes = 5, totalSlots = 30) {
    const slots: string[] = [];

    const now = new Date();

    const currentMinutes = now.getMinutes();
    const remainder = currentMinutes % intervalMinutes;
    const minutesToRoundUp = remainder === 0 ? 0 : intervalMinutes - remainder;

    now.setMinutes(now.getMinutes() + minutesToRoundUp);
    now.setSeconds(0);

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    for (let i = 0; i < totalSlots; i++) {
        slots.push(timeFormatter.format(now));
        now.setMinutes(now.getMinutes() + intervalMinutes);
    }

    return slots;
}

export default function TimePicker() {
    const [selectedTime, setSelectedTime] = useState("ASAP (~15 mins)");
    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    useEffect(() => {
        const generatedSlots = generateDynamicTimeSlots(5, 30);
        setTimeSlots(generatedSlots);
    }, []);

    const QuickSelectButton = ({ label }: { label: string }) => {
        const isActive = selectedTime === label;
        return (
            <button
                onClick={() => setSelectedTime(label)}
                className={`w-full py-3 rounded-xl font-bold transition-all border-2 ${isActive
                    ? "bg-kae-purple text-white border-kae-purple shadow-md"
                    : "bg-white text-gray-700 border-gray-200 hover:border-kae-purple"
                    }`}
            >
                {label}
            </button>
        );
    };

    return (
        <div className="w-full max-w-sm flex flex-col gap-6">

            {/* 1. The Visual Feedback */}
            <div className="text-center">
                <p className="text-3xl font-bold text-kae-dark mt-1">{selectedTime}</p>
            </div>

            {/* 2. The Quick Selects (High Conversion Zone) */}
            <div className="flex flex-col gap-3">
                <QuickSelectButton label="ASAP (~15 mins)" />
                <QuickSelectButton label="In 30 Minutes" />
                <QuickSelectButton label="In 1 Hour" />
            </div>

            {/* 3. The Headless Dropdown for Specific Times */}
            <div className="relative mt-2 z-10">
                <Listbox value={selectedTime} onChange={setSelectedTime}>
                    <Listbox.Button className="w-full bg-gray-50 border-2 border-gray-200 text-gray-700 py-3 px-4 rounded-xl font-bold text-left hover:border-gray-300 transition-colors flex justify-between items-center">
                        <span>Or choose specific time...</span>
                        <span className="text-gray-400">▼</span>
                    </Listbox.Button>

                    <Listbox.Options className="absolute mt-2 w-full max-h-60 overflow-auto rounded-xl bg-white text-base shadow-xl ring-1 ring-black/5 focus:outline-none sm:text-sm">
                        {timeSlots.map((time, idx) => (
                            <Listbox.Option
                                key={idx}
                                value={time}
                                className={({ active, selected }) =>
                                    `relative cursor-pointer select-none py-4 px-6 transition-colors ${active || selected ? "bg-kae-pink/20 text-kae-purple font-bold" : "text-gray-900"
                                    }`
                                }
                            >
                                {time}
                            </Listbox.Option>
                        ))}
                    </Listbox.Options>
                </Listbox>
            </div>

        </div>
    );
}
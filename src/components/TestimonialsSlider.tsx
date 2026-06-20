"use client";

// 1. IMPORT 'useSwiper' FROM REACT
import { Swiper, SwiperSlide, useSwiper } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

const reviews = [
    { id: 1, name: "Skusta Clee", text: "“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab ”", photoPath: "skusta-clee.png" },
    { id: 2, name: "Skusta Clee", text: "“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab”", photoPath: "skusta-clee.png" },
    { id: 3, name: "Skusta Clee", text: "“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab”", photoPath: "skusta-clee.png" },
    { id: 4, name: "Skusta Clee", text: "“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab”", photoPath: "skusta-clee.png" },
    { id: 5, name: "Skusta Clee", text: "“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab”", photoPath: "skusta-clee.png" }
];

// 2. CREATE A TINY CUSTOM BUTTON COMPONENT
const SliderButtons = () => {
    const swiper = useSwiper(); // This taps directly into Swiper's engine

    return (
        <>
            {/* FORCE slidePrev() on click */}
            <button
                onClick={() => swiper.slidePrev()}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-50 cursor-pointer p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-kae-purple">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
            </button>

            {/* FORCE slideNext() on click */}
            <button
                onClick={() => swiper.slideNext()}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-50 cursor-pointer p-2"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-10 h-10 text-kae-purple">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </>
    );
};

export default function TestimonialSlider() {
    return (
        <div className="w-full max-w-7xl mx-auto py-8 relative">
            <Swiper
                modules={[Pagination, Autoplay]} // Removed Navigation module entirely!
                spaceBetween={30}
                slidesPerView={1}
                loop={true}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{
                    768: { slidesPerView: 2 },
                    1000: { slidesPerView: 3 },
                }}
                className="pb-14 px-14"
            >
                {reviews.map((review) => (
                    <SwiperSlide key={review.id}>
                        <div className="flex flex-col justify-between transition mb-10">
                            <div className='flex flex-col gap-10'>
                                <div className="text-xl mb-4 flex justify-center">
                                    <img className='rounded-full object-cover border-1 w-48 h-48' src={review.photoPath} alt={`Picture of ${review.name}`} />
                                </div>
                                <p className='text-center font-bold text-kae-purple mb-2 text-2xl'>
                                    {review.name}
                                </p>
                                <p className="text-kae-dark font-rounded text-lg mb-6 italic text-center">
                                    {review.text}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}

                {/* 3. DROP THE BUTTONS INSIDE THE SWIPER */}
                <SliderButtons />

            </Swiper>
        </div>
    );
}
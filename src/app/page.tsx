"use client";
import TestimonialSlider from "@/components/TestimonialsSlider"
import { Clock, Mail, MapPin, Phone } from "lucide-react"
import NavBar from "@/components/NavBar"
import { useRouter } from "next/navigation"

export default function Home() {

  const router = useRouter();

  return (
    <div>

      {/*Hero Section*/}
      <section id="home" className="min-h-dvh flex flex-col box-border bg-kae-pink items-center ">
        <NavBar bgColorMobile="bg-kae-light" bgColorMd="bg-kae-pink" />
        <div className="flex flex-1 flex-col pt-20 pb-12 md:flex-row md:justify-evenly md:items-center max-w-7xl">
          <div className="flex justify-center md:order-1 md:pr-10">
            <img className="w-2xl h-2xl md:w-3xl md:h-3xl" src="hero-photo.svg" alt="Kae and Jae food varieties" />
          </div>
          <div className="flex flex-col gap-5 md:order-0 md:max-w-sm md:pl-10">
            <div className="flex flex-col items-center text-center md:items-start">
              <h1 className="text-kae-light font-libertinus-serif text-4xl 2xl:text-6xl">Snacks.</h1>
              <h1 className="text-kae-purple font-libertinus-serif text-4xl 2xl:text-6xl">Sweets.</h1>
              <h1 className="text-kae-light font-libertinus-serif text-4xl 2xl:text-6xl">Street food.</h1>
            </div>
            <p className="text-center text-kae-light px-2 font-roboto md:text-start 2xl:text-xl">Your go-to mobile spot for Korean-inspired bites, classic comfort food, and refreshing, sweet beverages. Catch us serving up your favorites daily.</p>
            <div className="flex justify-center gap-3 md:justify-start">
              <button className="cursor-pointer bg-kae-dark text-kae-light py-3 px-7 rounded-full font-roboto 2xl:text-lg transition-all duration-300 hover:bg-kae-purple hover:scale-105 hover:shadow-xl active:scale-95" onClick={() => router.push("/order")}>Order Now</button>
              <a href="#contact" className="border-2 border-kae-purple text-kae-purple py-3 px-7 rounded-full font-roboto 2xl:text-lg transition-all duration-300 hover:bg-kae-dark hover:text-kae-light hover:scale-105 hover:shadow-xl active:scale-95">Contact Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section id="about" className="flex justify-center bg-kae-light scroll-mt-19 2xl:scroll-mt-60">
        <div className="flex flex-col items-center gap-6 p-7 bg-kae-light md:grid md:grid-cols-2 max-w-7xl md:p-20">
          <div className="flex flex-col gap-6 md:order-1">
            <h2 className="text-center text-xl font-semibold 2xl:text-4xl">ABOUT US</h2>
            <p className="text-center text-lg 2xl:text-xl">What started as a love for good food turned into Camp Tinio's favorite mobile hangout. We realized that the best memories aren't made inside four walls, they happen wherever the food is hot and the drinks are sweet.</p>
          </div>
          <div className="md:order-0 flex justify-center">
            <img className="rounded-full object-cover w-60 h-60" src="about-photo.jpg" alt="Kae and Jae photo of customers" />
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="flex justify-center bg-kae-dark scroll-mt-19">
        <div className="flex flex-col items-center p-6 2xl:pt-15 bg-kae-dark max-w-7xl">
          <h2 className="text-kae-light text-xl font-semibold 2xl:text-4xl 2xl:pb-15">OUR MENU</h2>
          <div className="grid-cols-2 gap-x-20 gap-y-10 md:grid lg:grid-cols-3 2xl:pb-15">
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="chicken-meals.svg" alt="Kae and Jae chicken meals" />
              <p className="menu-label">Chicken Meals</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="waffles.svg" alt="Kae and Jae waffles" />
              <p className="menu-label">Waffles</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="bibimbap.svg" alt="Kae and Jae bibimbap" />
              <p className="menu-label">Bibimbap</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="korean-streetfoods.svg" alt="Kae and Jae korean street foods" />
              <p className="menu-label">Korean Street Foods</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="tofu.svg" alt="Kae and Jae Tofu" />
              <p className="menu-label">Tofu</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="rice-meals.svg" alt="Kae and Jae rice meals" />
              <p className="menu-label">Rice Meals</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="corndogs.svg" alt="Kae and Jae corndogs" />
              <p className="menu-label">Corndogs</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="spicy-noodles-and-ramen.svg" alt="Kae and Jae Spicy Noodles and Ramen" />
              <p className="menu-label">Spicy Noodles and Ramen</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="burgers-and-sandwiches.svg" alt="Kae and Jae Burgers and Sandwiches" />
              <p className="menu-label">Burgers and Sandwiches</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="fries-and-nachos.svg" alt="Kae and Jae Fries and Nachos" />
              <p className="menu-label">Fries and Nachos</p>
            </div>
            <div className="flex flex-col items-center relative group">
              <img className="w-60 h-60 transition-transform duration-500 group-hover:scale-110" src="various-beverages.svg" alt="Kae and Jae Various Beverages" />
              <p className="menu-label">Various Beverages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="flex flex-col items-center bg-kae-light p-6 2xl:pt-15 gap-15 w-full scroll-mt-19 2xl:scroll-mt-40">
        <h2 className="text-kae-dark text-2xl text-center font-bold 2xl:text-4xl">TESTIMONIALS</h2>
        {/*
              <ul className="swiper-wrapper">
                <li className="swiper-slide flex flex-col items-center gap-6">
                  <img className="rounded-full object-cover border-1" src="skusta-clee.png" alt="Skusta Clee" />
                  <h3 className="text-center text-lg font-bold font-roboto">Skusta Clee</h3>
                  <p className="text-center font-roboto font-semibold">“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab”</p>
                </li>
                <li className="swiper-slide flex flex-col items-center gap-6">
                  <img className="rounded-full object-cover border-1" src="skusta-clee.png" alt="Skusta Clee" />
                  <h3 className="text-center text-lg font-bold font-roboto">Skusta Clee</h3>
                  <p className="text-center font-roboto font-semibold">“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab”</p>
                </li>
                <li className="swiper-slide flex flex-col items-center gap-6">
                  <img className="rounded-full object-cover border-1" src="skusta-clee.png" alt="Skusta Clee" />
                  <h3 className="text-center text-lg font-bold font-roboto">Skusta Clee</h3>
                  <p className="text-center font-roboto font-semibold">“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab”</p>
                </li>
                <li className="swiper-slide flex flex-col items-center gap-6">
                  <img className="rounded-full object-cover border-1" src="skusta-clee.png" alt="Skusta Clee" />
                  <h3 className="text-center text-lg font-bold font-roboto">Skusta Clee</h3>
                  <p className="text-center font-roboto font-semibold">“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab”</p>
                </li>
                <li className="swiper-slide flex flex-col items-center gap-6">
                  <img className="rounded-full object-cover border-1" src="skusta-clee.png" alt="Skusta Clee" />
                  <h3 className="text-center text-lg font-bold font-roboto">Skusta Clee</h3>
                  <p className="text-center font-roboto font-semibold">“Ang sarap ng chicken sandwich and yung Odeng pero mas masarap parin si Zeinab”</p>
                </li>
              </ul>
              */}
        <div className="w-full">
          <TestimonialSlider />
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="p-6 flex flex-col gap-10 bg-kae-pink 2xl:py-30 2xl:px-15 scroll-mt-19">
        <h2 className="text-kae-light text-2xl text-center font-bold 2xl:text-4xl">GALLERY</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="group w-full h-45 overflow-hidden rounded-md last:odd:col-span-full md:last:odd:col-span-2 md:rounded-lg lg:col-span-1 2xl:h-65">
            <img className="w-full h-full object-cover transition-transform duration-300 lg:scale-110 lg:hover:scale-100" src="gallery-1.jpg" alt="Kae and Jae Chicken sandwich" />
          </div>
          <div className="w-full h-45 overflow-hidden rounded-md last:odd:col-span-full md:last:odd:col-span-2 md:rounded-lg lg:col-span-2 2xl:h-65">
            <img className="w-full h-full object-cover transition-transform duration-300 lg:scale-110 lg:hover:scale-100" src="gallery-2.jpg" alt="Kae and Jae Spicy noodles with egg and spam" />
          </div>
          <div className="w-full h-45 overflow-hidden rounded-md last:odd:col-span-full md:last:odd:col-span-2 md:rounded-lg 2xl:h-65">
            <img className="w-full h-full object-cover transition-transform duration-300 lg:scale-110 lg:hover:scale-100" src="gallery-3.jpg" alt="Kae and Jae Fish cake" />
          </div>
          <div className="w-full h-45 overflow-hidden rounded-md last:odd:col-span-full md:last:odd:col-span-2 md:rounded-lg 2xl:h-65">
            <img className="w-full h-full object-cover transition-transform duration-300 lg:scale-110 lg:hover:scale-100" src="gallery-4.jpg" alt="Kae and Jae Chicken poppers with rice" />
          </div>
          <div className="w-full h-45 overflow-hidden rounded-md last:odd:col-span-full md:last:odd:col-span-2 md:rounded-lg 2xl:h-65">
            <img className="w-full h-full object-cover transition-transform duration-300 lg:scale-110 lg:hover:scale-100" src="gallery-7.jpg" alt="Kae and Jae Corndogs" />
          </div>
          <div className="w-full h-45 overflow-hidden rounded-md last:odd:col-span-full md:last:odd:col-span-2 md:rounded-lg lg:order-1 2xl:h-65">
            <img className="w-full h-full object-cover transition-transform duration-300 lg:scale-110 lg:hover:scale-100" src="gallery-6.jpg" alt="Kae and Jae Waffles with chocolate and almonds toppings" />
          </div>
          <div className="w-full h-45 overflow-hidden rounded-md last:odd:col-span-full md:last:odd:col-span-2 md:rounded-lg lg:order-0 2xl:h-65">
            <img className="w-full h-full object-cover transition-transform duration-300 lg:scale-110 lg:hover:scale-100" src="gallery-5.jpg" alt="Kae and Jae Various beverages" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-kae-light py-10 px-6 flex flex-col items-center gap-10 scroll-mt-19">
        <h2 className="text-kae-dark text-2xl text-center font-bold">CONTACT US</h2>
        <div className="flex flex-col gap-10 md:flex-row">
          <form className="flex flex-col items-center gap-2 md:order-1" action="">
            <input className="border-1 p-1 w-80 border-gray-500 rounded-sm" type="text" name="name" placeholder="Your Name" />
            <input className="border-1 p-1 w-80 border-gray-500 rounded-sm" type="text" name="email" placeholder="Your Email" />
            <textarea className="border-1 p-1 w-80 border-gray-500 rounded-sm h-50" name="message" id="message" placeholder="Your Message"></textarea>
            <button className="mr-auto bg-kae-dark text-kae-light py-2 px-4 rounded-full md:ml-auto md:mr-0">Submit</button>
          </form>
          <div className="flex flex-col gap-4 md:order-0">
            <div className="flex items-center gap-3">
              <MapPin />
              <p>Zone 3, Camp Tinio, Cabanatuan City, Philippines, 3100</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail />
              <p>kaeandjae@gmail.com</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone />
              <p>0966 632 8432</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock />
              <p>
                Monday - Saturday: 10:00 AM - 6:00 PM
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Clock />
              <p>
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
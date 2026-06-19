import TestimonialSlider from "@/components/TestimonialsSlider"
import { Clock, Mail, MapPin, Menu, Phone } from "lucide-react"
import { FaFacebook, FaFacebookMessenger } from "react-icons/fa"

export default function Home() {
  return (
    <div className="bg-kae-pink">

      {/*Hero Section*/}
      <section className="h-dvh flex flex-col box-border">
        <header className="fixed w-full">
          <nav className="flex py-2 px-4 items-center justify-between bg-kae-light">
            <div className="flex items-center gap-3">
              <a href="#"><img className="w-15 h-15" src="logo.svg" alt="cafe logo" /></a>
              <div className="flex flex-col font-pacifico">
                <a className="text-kae-dark text-lg" href="#">Kae and</a>
                <a className="text-kae-dark text-lg" href="#">Jae Cafe</a>
              </div>
            </div>
            <Menu className="h-8 w-8 sm:hidden" />
            <div className="gap-5 hidden sm:flex items-center">
              <a className="text-kae-dark font-semibold" href="">Home</a>
              <a className="text-kae-dark font-semibold" href="">About</a>
              <a className="text-kae-dark font-semibold" href="">Menu</a>
              <a className="text-kae-dark font-semibold" href="">Testimonials</a>
              <a className="text-kae-dark font-semibold" href="">Gallery</a>
              <a className="text-kae-dark font-semibold" href="">Contact</a>
            </div>
          </nav>
        </header>
        <div className="flex flex-1 flex-col md:flex-row md:justify-evenly md:items-center">
          <div className="flex justify-center md:order-1 md:pr-10">
            <img className="w-2xl h-2xl md:w-3xl md:h-3xl" src="hero-photo.svg" alt="food" />
          </div>
          <div className="flex flex-col gap-5 md:order-0 md:max-w-sm md:pl-10">
            <div className="flex flex-col items-center text-center md:items-start">
              <h2 className="text-kae-light font-libertinus-serif text-4xl">Snacks.</h2>
              <h2 className="text-kae-light font-libertinus-serif text-4xl">Sweets.</h2>
              <h2 className="text-kae-light font-libertinus-serif text-4xl">Street food.</h2>
            </div>
            <p className="text-center text-kae-light px-2 font-roboto md:text-start">Your go-to mobile spot for Korean-inspired bites, classic comfort food, and refreshing, sweet beverages. Catch us serving up your favorites daily.</p>
            <div className="flex justify-center gap-5 md:justify-start">
              <button className="bg-kae-dark text-kae-light py-3 px-5 rounded-full font-roboto">Order Now</button>
              <button className="border-1 py-3 px-5 rounded-full font-roboto">Contact Us</button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section>
        <div className="bg-kae-light p-7">
          <div className="flex flex-col items-center gap-6">
            <h2 className="text-center text-xl">ABOUT US</h2>
            <p className="text-center">What started as a love for good food turned into Camp Tinio's favorite mobile hangout. We realized that the best memories aren't made inside four walls, they happen wherever the food is hot and the drinks are sweet.</p>
            <div>
              <img className="rounded-full object-cover w-80 h-80" src="about-photo.jpg" alt="photo of customers" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section>
        <div className="flex flex-col items-center p-6 bg-kae-dark">
          <h2 className="text-kae-light text-xl font-semibold">OUR MENU</h2>
          <div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="chicken-meals.svg" alt="chicken meals" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Chicken Meals</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="waffles.svg" alt="waffles" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Waffles</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="bibimbap.svg" alt="bibimbap" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Bibimbap</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="korean-streetfoods.svg" alt="korean street foods" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Korean Street Foods</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="tofu.svg" alt="Tofu" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Tofu</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="rice-meals.svg" alt="rice meals" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Rice Meals</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="corndogs.svg" alt="corndogs" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Corndogs</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="spicy-noodles-and-ramen.svg" alt="Spicy Noodles and Ramen" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Spicy Noodles and Ramen</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="burgers-and-sandwiches.svg" alt="Burgers and Sandwiches" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Burgers and Sandwiches</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="fries-and-nachos.svg" alt="Fries and Nachos" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Fries and Nachos</p>
            </div>
            <div className="flex flex-col items-center">
              <img className="w-60 h-60" src="various-beverages.svg" alt="Various Beverages" />
              <p className="text-libertinus-serif text-kae-light text-lg font-medium">Various Beverages</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="flex flex-col items-center bg-kae-light p-6 gap-15">
        <h2 className="text-kae-dark text-2xl text-center font-bold">TESTIMONIALS</h2>
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
        <TestimonialSlider />
      </section>

      {/* Gallery Section */}
      <section className="p-6 flex flex-col gap-10 bg-kae-pink">
        <h2 className="text-kae-light text-2xl text-center font-bold">GALLERY</h2>
        <div className="grid grid-cols-1 gap-6">
          <div className="w-85 h-45 overflow-hidden rounded-md">
            <img className="w-full h-full object-cover" src="gallery-1.jpg" alt="Chicken sandwich" />
          </div>
          <div className="w-85 h-45 overflow-hidden rounded-md">
            <img className="w-full h-full object-cover" src="gallery-2.jpg" alt="Spicy noodles with egg and spam" />
          </div>
          <div className="w-85 h-45 overflow-hidden rounded-md">
            <img className="w-full h-full object-cover" src="gallery-3.jpg" alt="Fish cake" />
          </div>
          <div className="w-85 h-45 overflow-hidden rounded-md">
            <img className="w-full h-full object-cover" src="gallery-4.jpg" alt="Chicken poppers with rice" />
          </div>
          <div className="w-85 h-45 overflow-hidden rounded-md">
            <img className="w-full h-full object-cover" src="gallery-7.jpg" alt="Corndogs" />
          </div>
          <div className="w-85 h-45 overflow-hidden rounded-md">
            <img className="w-full h-full object-cover" src="gallery-6.jpg" alt="Waffles with chocolate and almonds toppings" />
          </div>
          <div className="w-85 h-45 overflow-hidden rounded-md">
            <img className="w-full h-full object-cover" src="gallery-5.jpg" alt="Various beverages" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-kae-light py-10 px-6 flex flex-col items-center gap-10 ">
        <h2 className="text-kae-dark text-2xl text-center font-bold">CONTACT US</h2>
        <form className="flex flex-col items-center gap-2" action="">
          <input className="border-1 p-1 w-80 border-gray-500 rounded-sm" type="text" name="name" placeholder="Your Name" />
          <input className="border-1 p-1 w-80 border-gray-500 rounded-sm" type="text" name="email" placeholder="Your Email" />
          <textarea className="border-1 p-1 w-80 border-gray-500 rounded-sm h-50" name="message" id="message" placeholder="Your Message"></textarea>
          <button className="mr-auto bg-kae-dark text-kae-light py-2 px-4 rounded-full">Submit</button>
        </form>
        <div className="flex flex-col gap-4">
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
      </section>

      <footer className="bg-kae-dark p-5 flex flex-col items-center gap-3">
        <h2 className="text-kae-light font-md font-inter">© 2026 Kae and Jae Cafe</h2>
        <div className="flex gap-2">
          <FaFacebook className="w-8 h-8 text-kae-light" />
          <FaFacebookMessenger className="w-8 h-8 text-kae-light" />
        </div>
      </footer>

    </div>
  )
}
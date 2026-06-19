

export default function Home() {
  return (
    <div className="bg-kae-pink">
      <header className="sticky">
        <nav className="flex p-2 items-center justify-between bg-kae-light">
          <div className="flex items-center gap-3">
            <a href="#"><img className="w-15 h-15" src="logo.svg" alt="cafe logo" /></a>
            <div className="flex flex-col font-pacifico">
              <a className="text-kae-dark text-lg" href="#">Kae and</a>
              <a className="text-kae-dark text-lg" href="#">Jae Cafe</a>
            </div>

          </div>
          <div className="gap-3 hidden sm:block">
            <a href="">Home</a>
            <a href="">About</a>
            <a href="">Menu</a>
            <a href="">Testimonials</a>
            <a href="">Gallery</a>
            <a href="">Contact</a>
          </div>
        </nav>
      </header>

      {/*Hero Section*/}
      <section className="h-dvh">
        <div>
          <img src="hero-photo.svg" alt="food" />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-kae-light font-libertinus-serif text-4xl">Snacks.</h2>
            <h2 className="text-kae-light font-libertinus-serif text-4xl">Sweets.</h2>
            <h2 className="text-kae-light font-libertinus-serif text-4xl">Street food.</h2>
          </div>
          <p className="text-center text-kae-light px-2 font-roboto">Your go-to mobile spot for Korean-inspired bites, classic comfort food, and refreshing, sweet beverages. Catch us serving up your favorites daily.</p>
          <div className="flex justify-center gap-5">
            <button className="bg-kae-dark text-kae-light py-3 px-5 rounded-full font-roboto">Order Now</button>
            <button className="border-1 py-3 px-5 rounded-full font-roboto">Contact Us</button>
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
          <h2 className="text-kae-light text-xl">OUR MENU</h2>
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
    </div>
  )
}
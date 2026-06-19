

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
            <h2 className="text-center">ABOUT US</h2>
            <p className="text-center">What started as a love for good food turned into Camp Tinio's favorite mobile hangout. We realized that the best memories aren't made inside four walls, they happen wherever the food is hot and the drinks are sweet.</p>
            <div>
              <img className="rounded-full object-cover w-80 h-80" src="about-photo.jpg" alt="photo of customers" />
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section>

      </section>
    </div>
  )
}
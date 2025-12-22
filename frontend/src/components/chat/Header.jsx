const Header = () => {
  return (
    <header className="relative flex items-center bg-foreground/1 justify-between px-8 py-3  z-10">
      {/* Subtle overlay */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay bg-[url('/api/placeholder/100/100')]"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>

      {/* Logo / Title */}
      <div className="flex items-center gap-4  relative">
        <h1
                  className="font-goldman text-2xl font-semibold"
                >
                  <div className="flex">
                    <img src="../images/logo.png" alt="" className="size-7" />
                  </div>
        </h1>
        <span className="font-heading font-bold text-xl tracking-tight opacity-80">
          ARAM AI
        </span>
      </div>
    </header>
  )
}

export default Header

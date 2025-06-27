function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-8 bg-primary">
      <div className="flex h-128 w-128 flex-col gap-8">
        <div className="flex h-40 w-128 items-center justify-center">
          <img
            src="/logo.png"
            alt="GrowMind Logo"
            className="h-full object-contain"
          />
          <h1 className="mr-10 font-patua text-6xl text-tertiary">growMind</h1>
        </div>
        <div className="h-80 w-128 rounded-md border-gray-300 bg-white shadow-inner-strong"></div>
      </div>
      <div className="h-128 w-100  rounded-md border-gray-300 bg-white shadow-inner-strong"></div>
    </div>
  );
}

export default Home;

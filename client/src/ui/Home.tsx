function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center gap-8 bg-primary">
      <div className="flex h-128 w-128 flex-col gap-8">
        <div className="h-40 w-128"></div>
        <div className="h-80 w-128 rounded-md border-gray-300 bg-white shadow-inner-strong"></div>
      </div>
      <div className="h-128 w-100  rounded-md border-gray-300 bg-white shadow-inner-strong"></div>
    </div>
  );
}

export default Home;

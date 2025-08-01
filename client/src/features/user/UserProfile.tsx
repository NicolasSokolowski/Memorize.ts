function UserProfile() {
  return (
    <div className="h-full bg-red-500">
      <div className="flex h-80 justify-center bg-blue-500">
        <div className="mt-5 flex size-80 items-center justify-center rounded-full bg-yellow-500 shadow-xl">
          <img className="size-64 rounded-full bg-green-500 shadow-inner-strong" />
        </div>
      </div>
      <div className="mx-20 mt-5 h-32 bg-orange-500">
        <div className="h-16 bg-violet-500">
          <div className="ml-52 h-full w-112 bg-white"></div>
        </div>
        <div className="h-16 bg-cyan-500">
          <div className="ml-52 h-full w-112 bg-black"></div>
        </div>
      </div>
      <div className="mx-20 mt-5 flex h-2/5 justify-center gap-32 bg-gray-500">
        <div className="m-5 flex w-112 flex-col gap-4 bg-fuchsia-500 ">
          <button className="h-16 w-full rounded-md bg-emerald-500 shadow-md">
            Button 1
          </button>
          <button className="h-16 w-full rounded-md bg-emerald-500 shadow-md">
            Button 2
          </button>
          <button className="h-16 w-full rounded-md bg-emerald-500 shadow-md">
            Button 3
          </button>
          <button className="h-16 w-full rounded-md bg-emerald-500 shadow-md">
            Button 4
          </button>
          <button className="h-16 w-full rounded-md bg-emerald-500 shadow-md">
            Button 5
          </button>
        </div>
        <div className="m-5 w-1/4 rounded-lg bg-lime-300 shadow-lg"></div>
      </div>
    </div>
  );
}

export default UserProfile;

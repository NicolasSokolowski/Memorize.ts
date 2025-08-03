function UserProfile() {
  return (
    <div className="h-full">
      <div className="flex h-96 items-center justify-center">
        <div className="flex size-80 items-center justify-center rounded-full bg-tertiary shadow-xl">
          <img className="size-64 rounded-full bg-white shadow-inner-strong" />
        </div>
      </div>
      <div className="mx-20 mt-5 h-32">
        <div className="h-16">
          <div className="ml-52 h-full w-112"></div>
        </div>
        <div className="h-16">
          <div className="ml-52 h-full w-112"></div>
        </div>
      </div>
      <div className="mx-20 mt-5 flex h-2/5 justify-center gap-32">
        <div className="m-5 flex w-112 flex-col gap-4">
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 1
          </button>
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 2
          </button>
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 3
          </button>
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 4
          </button>
          <button className="h-16 w-full rounded-md bg-secondary shadow-md">
            Button 5
          </button>
        </div>
        <div className="m-5 w-1/4 rounded-lg bg-tertiary shadow-lg"></div>
      </div>
    </div>
  );
}

export default UserProfile;

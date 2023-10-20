import MaxWidthWrapper from "./components/MaxWidthWrapper";

export default function Home() {
  return (
    <MaxWidthWrapper className="mb-12 mt-28 sm:mt-40 flex flex-col justify-center items-center text-center">
      <div className="flex items-center justify-center mx-auto mb-4 space-x-2 overflow-hidden rounded-full border border-gray-200 px-7 py-2 shadow-sm backdrop-blur transition-all hover:border-gray-300 bg-white hover:bg-white/50">
        <p className="font-semibold text-gray-700 text-sm">
          Doc-sun-ai now is public!
        </p>
      </div>
    </MaxWidthWrapper>
  );
}

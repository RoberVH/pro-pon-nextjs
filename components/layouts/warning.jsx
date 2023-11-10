// ****************************** Inner components
export const Warning = ({ title }) => (
  <div
    className="container bg-white mt-[5em] p-4  mx-auto shadow-xl rounded-xl"
  >
    <h1 className="text-red-600 text-center text-single-warnings">
      {title}
    </h1>
  </div>
);

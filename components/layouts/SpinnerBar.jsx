

const SpinnerBar = ({ msg }) => (
  <div className="mt-4 flex justify-center items-center">
    <div className="w-[50%] h-4 bg-gradient-to-r from-orange-500 to-black rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl rounded-br-2xl">
      <div className="relative h-4">
        <div className="absolute h-4 inset-0 bg-gradient-to-r from-orange-400 via-orange-600 to-orange-400 rounded-tl-2xl 
              rounded-tr-2xl rounded-bl-2xl rounded-br-2xl animate-dot"> 
        </div>
      </div>
    </div>
  </div>
);
export default SpinnerBar;

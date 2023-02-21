import React from "react";
export function NoConnectedWarning({ msj}) {
  return <div className="container bg-white mt-[5em] p-4  mx-auto shadow-xl rounded-xl">
        <h1 className="text-xl text-stone-600 text-center">
          {msj}
          </h1>
      </div>;
}
export default NoConnectedWarning
  
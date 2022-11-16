import { DownloadIcon } from '@heroicons/react/outline'

const DonwloadFileForm = ({ files, title, nofiles }) => (
  <div
    className="w-4/4 h-[15em] border-2 border-coal-200 mx-4 font-khula overflow-y-auto overflow-x-auto
               leading-8 shadow-md"
  >
    <div className="flex">
      <DownloadIcon className="mt-1 h-8 w-8 text-orange-300 mb-2" />
      <p className="mt-2 pl-2">{title}</p>
    </div>
    {files.length ? (
      <div className="border border-2 border-orange-500  m-2 py-1">
        {files.map((file, indx) => (
          <a
            key={indx}
            className=" text-blue-600 ml-3 flex"
            href={"http:www.banamex.com"}
            target="_blank"
            rel="noreferrer"
          >
            <p className="pl-2 truncate">📄 &nbsp;{file}</p>
          </a>
        ))}
      </div>
    ) : (
      <div className="p-2 center-text">
        <p className="text-center"> - {nofiles} -</p>
      </div>
    )}
  </div>
);
export default DonwloadFileForm
import { DownloadIcon } from '@heroicons/react/outline'

export const DonwloadFileForm = ({ files, t }) => (
  <div
    className="my-4 w-2/6 mx-8 max-h-60 font-khula  overflow-y-auto overflow-x-auto
   h-1/6  bg-white leading-8 shadow-md"
  >
    <div className="flex">
      <DownloadIcon className="mt-1 h-8 w-8 text-orange-300 mb-2" />
      <p className="mt-2 pl-2">{t('dowloadrequestfiles')}Documentos de Base</p>
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
        <p className="text-center"> {t("nofiles")} NO FILES </p>
      </div>
    )}
  </div>
);

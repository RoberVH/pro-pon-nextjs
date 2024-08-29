 const SequenceMarquee = ({phaseNumber, phase, phaseText}) => {
    const badgesStyles={
        active: "bg-blue-600 inline-flex items-center justify-center px-2 py-1 mr-2" + 
                "text-xs font-bold leading-none text-white  rounded-full",
        inactive: "bg-gray-400 inline-flex items-center justify-center px-2 py-1 mr-2" + 
        "text-xs font-bold leading-none text-white  rounded-full"
    }
    return (                        
        <div className="flex flex-col items-center">
        <div className={phase>=phaseNumber ? `${badgesStyles.active}`:`${badgesStyles.inactive}` }>
            <span className={badgesStyles }>
                {phaseNumber}
            </span>
        </div>
        <span>
            <p className="mt-2
            ">{phaseText}</p>
        </span>
    </div>)
    };

    export default SequenceMarquee
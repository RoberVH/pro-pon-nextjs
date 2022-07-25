import React, { useState, useEffect, useContext } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { proponContext } from '../utils/pro-poncontext'
import { useAccount } from "wagmi";
import SequenceMarquee from "../components/layouts/sequenceMarquee";
import ConnectWallet from "../components/connectWallet";
import CompanyDataForm from "../components/forms/companyDataForm";
import SignUpcompanyDataForm from "../components/forms/signUpcompanyDataForm";


/**
 * Signup - Page that allows to connect and Sign Up a Company
 *          It consist of two steps, the steps are tracked by state var phase
 *          Phase:
 *               1 - Connecting wallet
 *               2 - Registering essential Company Data on Polygon contract
 *               3 - Registering | modify extended Company Data on Backend DB - 
 */
function Signup() {
  const [phase, setPhase] = useState(1);
  const [isWaiting, setIsWaiting] = useState(false)
  const phasetextsstyle = "mt-2 -ml-2";
  const separator = "-".repeat(75);
  const { locale } = useRouter();
  const { t } = useTranslation("signup");
  const { address } = useAccount();
  
  const {  companyId } = useContext(proponContext);

/**
 * SignUpStep
 *    Component to present screen according to phase of signup stepper
*/
  const SignUpStep = ({ phase }) => {
    switch (phase) {
      case 1:
        return <ConnectWallet setPhase={setPhase} />;
      case 2:
        return (
          <div className="flex justify-center">
            <SignUpcompanyDataForm setPhase={setPhase} />
          </div>
        );
      case 3:
        return (
          <div className="flex justify-center">
          <CompanyDataForm setPhase={setPhase}/>
          </div>
          );
      default:
        return <div>Phase invalida</div>;
    }
  };

  /* check here what phase is this user on
     1 no wallet connected present connection button
     2 wallet connected present company sign up
     3 company signup present capture data/ modify data screen */
  useEffect(() => {
    if (address) setPhase(2)    // let's got to registering essential data company
    if (companyId) setPhase(3)  // let's got to add/modify all data company
  }, [address, companyId]);

  const Sequence= [
    [1, t('phase1title')],
    [2, t('phase2title')],
    [3, t('phase3title')],
  ]
  return (
    <div className="h-screen flex flex-col items-center">
      <div
        id="sequencecontainer"
        className="w-3/4 h-[75%] m-8 border-2 border-solid 
            bg-white border-slate-200 shadow-lg rounded-xl"
      >
        <div className="mt-8 flex flex-row justify-center">
          {Sequence.map((step,indx) =>
            <div key={indx} className="flex">
              <SequenceMarquee
                phaseNumber={step[0]}
                phase={phase}
                phaseText={step[1]}
              />
              { (indx!=2) &&
                <p className="text-stone-300 font-bold mx-8"> {separator} </p>
              }
            </div>
            )}
        </div>
        <div className="mt-8">
          <SignUpStep phase={phase} />
        </div>
      </div>
    </div>
  );
}
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ["signup", "menus"])),
    },
  };
}

export default Signup;

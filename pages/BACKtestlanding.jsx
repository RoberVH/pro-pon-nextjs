import React, { useState } from "react";
import Spinner from '../components/layouts/Spinner'
const TestLanding = () => {
const [loading, setLoading] = useState(false);

const handleGetAccount = () => {
setLoading(true);
};

const handleLearnMore = () => {
setLoading(true);
};

return (
<div className="container mx-auto px-4 md:px-0">
    <header className="py-4">
        <h1 className="text-xl font-semibold text-orange-500">RFP Manager</h1>
        <p className="text-sm text-gray-500">A web3-based RFP management application</p>
    </header>
    {loading ? (
        <Spinner />
        ) 
    : (
        <div className="row">
            <div className="col-md-4">
                <div className="border border-gray-300 mb-4">
                    <div className="p-4">
                    <h2 className=" text-xl font-semibold">Features</h2>
                    <ul className="list-disc">
                    <li>Track RFPs from start to finish</li>
                    <li>Collaborate with stakeholders</li>
                    <li>Get real-time insights into RFP performance</li>
                    </ul>
                </div>
            </div>
        </div>
        <div className="col-md-8">
            <div className="flex justify-content-between">
            <button className="bg-orange-500 text-white hover:bg-orange-600 mt-4 py-2 px-4 rounded-md" onClick={handleGetAccount}>
                Get an Account
            </button>
            <button className="bg-gray-500 text-white hover:bg-gray-600 mt-4 py-2 px-4 rounded-md" onClick={handleLearnMore}>
                Learn More
            </button>
        </div>
        </div>
        </div>
       )
}
</div>
    );
};

export default TestLanding;
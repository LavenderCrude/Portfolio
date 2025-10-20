import React from 'react';

const ExperienceCard = ({ icon, role, company, duration, description }) => {
  return (
    <div className="flex justify-between items-start bg-[#1a1a1a] border border-gray-700 p-6 rounded-xl hover:shadow-[0_0_30px_rgba(0,255,255,0.2)] transition-all">
      <div className="flex items-start gap-4">
        {icon}
        <div>
          <h3 className="text-lg font-semibold">
            {role} at <span className="text-gray-300">{company}</span>
          </h3>
          <p className="text-gray-400 mt-2 text-sm">{description}</p>
        </div>
      </div>
      <span className="text-gray-400 text-sm whitespace-nowrap ml-4">
        {duration}
      </span>
    </div>
  );
};

export default ExperienceCard;
